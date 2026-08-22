import { supabase, files } from './supabaseClient';

const ADMIN_EMAIL = 'admin@hotelkrishnapalace.com';

// Helper to convert an image File to WebP format on the client side
async function convertFileToWebP(file, targetName) {
  if (!file.type.startsWith('image/')) {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob((blob) => {
          const webpName = `${targetName}.webp`;
          const webpFile = new File([blob], webpName, { type: 'image/webp' });
          resolve(webpFile);
        }, 'image/webp', 0.85);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// Helper to convert Pocketbase filter strings (e.g. `roomId="xyz"` or `status="Pending"`) to Supabase queries
function applyOptions(query, options) {
  if (!options) return query;

  if (options.filter) {
    const filterStr = options.filter;
    const eqMatch = filterStr.match(/^(\w+)\s*=\s*"([^"]+)"$/);
    const boolMatch = filterStr.match(/^(\w+)\s*=\s*(true|false)$/);
    
    if (eqMatch) {
      const [, field, val] = eqMatch;
      query = query.eq(field, val);
    } else if (boolMatch) {
      const [, field, val] = boolMatch;
      query = query.eq(field, val === 'true');
    } else {
      const matches = [...filterStr.matchAll(/(\w+)\s*=\s*"([^"]+)"/g)];
      for (const m of matches) {
        query = query.eq(m[1], m[2]);
      }
    }
  }

  if (options.sort) {
    let sortField = options.sort;
    let ascending = true;
    if (sortField.startsWith('-')) {
      ascending = false;
      sortField = sortField.substring(1);
    }
    
    if (sortField === 'created') sortField = 'created_at';
    if (sortField === 'updated') sortField = 'updated_at';

    query = query.order(sortField, { ascending });
  }

  return query;
}

// Convert Supabase object relationships to pocketbase "expand" structure
function formatRecord(record, collectionName, expandFields = []) {
  if (!record) return record;
  const formatted = { ...record };
  
  formatted.created = record.created_at || record.created;
  formatted.updated = record.updated_at || record.updated;
  formatted.collectionName = collectionName;

  if (expandFields.length > 0) {
    formatted.expand = {};
    for (const field of expandFields) {
      if (record[field] && typeof record[field] === 'object') {
        formatted.expand[field] = {
          ...record[field],
          created: record[field].created_at || record[field].created,
          updated: record[field].updated_at || record[field].updated
        };
        formatted[field] = record[field].id;
      }
    }
  }
  return formatted;
}

async function expandRecords(records, expand) {
  if (!records || records.length === 0 || !expand || expand.length === 0) {
    return records;
  }

  // Handle amenities JSONB list expansion
  if (expand.includes('amenities')) {
    const amenityIds = new Set();
    records.forEach(r => {
      let rAmenities = [];
      if (Array.isArray(r.amenities)) {
        rAmenities = r.amenities;
      } else if (typeof r.amenities === 'string') {
        try {
          rAmenities = JSON.parse(r.amenities);
        } catch (e) {}
      }
      if (Array.isArray(rAmenities)) {
        rAmenities.forEach(id => {
          if (id) amenityIds.add(id);
        });
      }
    });

    if (amenityIds.size > 0) {
      const { data: amenitiesData, error } = await supabase
        .from('amenities')
        .select('*')
        .in('id', Array.from(amenityIds));

      if (!error && amenitiesData) {
        records.forEach(r => {
          let rAmenities = [];
          if (Array.isArray(r.amenities)) {
            rAmenities = r.amenities;
          } else if (typeof r.amenities === 'string') {
            try {
              rAmenities = JSON.parse(r.amenities);
            } catch (e) {}
          }
          r.expand = r.expand || {};
          r.expand.amenities = amenitiesData.filter(a => rAmenities.includes(a.id));
        });
      }
    } else {
      records.forEach(r => {
        r.expand = r.expand || {};
        r.expand.amenities = [];
      });
    }
  }

  return records;
}

class CollectionEmulator {
  constructor(name) {
    this.name = name;
  }

  async getFullList(options = {}) {
    const expand = options.expand ? options.expand.split(',') : [];
    let selectFields = '*';
    if (expand.includes('roomId')) selectFields = '*, roomId(*)';

    let query = supabase.from(this.name).select(selectFields);
    query = applyOptions(query, options);

    const { data, error } = await query;
    if (error) throw error;
    
    const formattedRecords = (data || []).map(r => formatRecord(r, this.name, expand));
    return await expandRecords(formattedRecords, expand);
  }

  async getList(page = 1, perPage = 30, options = {}) {
    const expand = options.expand ? options.expand.split(',') : [];
    let selectFields = '*';
    if (expand.includes('roomId')) selectFields = '*, roomId(*)';

    let query = supabase.from(this.name).select(selectFields, { count: 'exact' });
    query = applyOptions(query, options);

    const from = (page - 1) * perPage;
    const to = from + perPage - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;
    if (error) throw error;

    const formattedRecords = (data || []).map(r => formatRecord(r, this.name, expand));
    const items = await expandRecords(formattedRecords, expand);
    return {
      page,
      perPage,
      totalItems: count || 0,
      totalPages: Math.ceil((count || 0) / perPage),
      items
    };
  }

  async getOne(id, options = {}) {
    const expand = options.expand ? options.expand.split(',') : [];
    let selectFields = '*';
    if (expand.includes('roomId')) selectFields = '*, roomId(*)';

    const { data, error } = await supabase
      .from(this.name)
      .select(selectFields)
      .eq('id', id)
      .single();

    if (error) throw error;
    const formatted = formatRecord(data, this.name, expand);
    const expanded = await expandRecords([formatted], expand);
    return expanded[0];
  }

  async create(data, options = {}) {
    let insertData = { ...data };
    if (data instanceof FormData) {
      insertData = {};
      const recordId = data.get('id') || Math.random().toString(36).substring(2, 17);
      insertData.id = recordId;
      const fileUploads = [];
      const filePathsByKey = {};
      
      const titleOrName = data.get('title') || data.get('name') || '';
      const cleanBaseName = titleOrName
        .toString()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || Math.random().toString(36).substring(2, 11);

      for (const [key, value] of data.entries()) {
        if (value instanceof File || (value && typeof value === 'object' && value.name)) {
          const file = value;
          const randomSuffix = Math.random().toString(36).substring(2, 6);
          const targetFilename = `${cleanBaseName}-${randomSuffix}`;
          
          fileUploads.push((async () => {
            const webpFile = await convertFileToWebP(file, targetFilename);
            const filePath = `${this.name}/${recordId}/${webpFile.name}`;
            
            const { error: uploadErr } = await supabase.storage
              .from('assets')
              .upload(filePath, webpFile);
            if (uploadErr) console.error('Error uploading file:', uploadErr);
            
            if (!filePathsByKey[key]) {
              filePathsByKey[key] = [];
            }
            filePathsByKey[key].push(webpFile.name);
          })());
        } else {
          if (key === 'id') continue;
          if (key === 'amenities') {
            if (!insertData[key]) {
              insertData[key] = [];
            }
            insertData[key].push(value);
          } else {
            if (insertData[key] !== undefined) {
              if (!Array.isArray(insertData[key])) {
                insertData[key] = [insertData[key]];
              }
              insertData[key].push(value);
            } else {
              insertData[key] = value;
            }
          }
        }
      }
      if (this.name === 'rooms' && insertData['amenities'] === undefined) {
        insertData['amenities'] = [];
      }
      await Promise.all(fileUploads);

      // Merge file paths
      for (const key of Object.keys(filePathsByKey)) {
        if (key === 'images' || filePathsByKey[key].length > 1) {
          insertData[key] = filePathsByKey[key];
        } else {
          insertData[key] = filePathsByKey[key][0];
        }
      }
    }

    if (!insertData.id) {
      insertData.id = Math.random().toString(36).substring(2, 17);
    }

    const { data: record, error } = await supabase
      .from(this.name)
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;
    return formatRecord(record, this.name);
  }

  async update(id, data, options = {}) {
    let updateData = { ...data };
    if (data instanceof FormData) {
      updateData = {};
      const fileUploads = [];
      const filePathsByKey = {};
      
      const titleOrName = data.get('title') || data.get('name') || '';
      const cleanBaseName = titleOrName
        .toString()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || Math.random().toString(36).substring(2, 11);

      for (const [key, value] of data.entries()) {
        if (value instanceof File || (value && typeof value === 'object' && value.name)) {
          const file = value;
          const randomSuffix = Math.random().toString(36).substring(2, 6);
          const targetFilename = `${cleanBaseName}-${randomSuffix}`;
          
          fileUploads.push((async () => {
            const webpFile = await convertFileToWebP(file, targetFilename);
            const filePath = `${this.name}/${id}/${webpFile.name}`;
            
            const { error: uploadErr } = await supabase.storage
              .from('assets')
              .upload(filePath, webpFile);
            if (uploadErr) console.error('Error uploading file:', uploadErr);
            
            if (!filePathsByKey[key]) {
              filePathsByKey[key] = [];
            }
            filePathsByKey[key].push(webpFile.name);
          })());
        } else {
          if (key === 'amenities') {
            if (!updateData[key]) {
              updateData[key] = [];
            }
            updateData[key].push(value);
          } else {
            if (updateData[key] !== undefined) {
              if (!Array.isArray(updateData[key])) {
                updateData[key] = [updateData[key]];
              }
              updateData[key].push(value);
            } else {
              updateData[key] = value;
            }
          }
        }
      }
      if (this.name === 'rooms' && updateData['amenities'] === undefined) {
        updateData['amenities'] = [];
      }
      await Promise.all(fileUploads);

      for (const key of Object.keys(filePathsByKey)) {
        if (key === 'images' || filePathsByKey[key].length > 1) {
          updateData[key] = filePathsByKey[key];
        } else {
          updateData[key] = filePathsByKey[key][0];
        }
      }
    }

    const { data: record, error } = await supabase
      .from(this.name)
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return formatRecord(record, this.name);
  }

  async delete(id, options = {}) {
    const { error } = await supabase
      .from(this.name)
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }

  async authWithPassword(email, password, options = {}) {
    if (this.name === 'admin_users' && email !== ADMIN_EMAIL) {
      throw new Error("Unauthorized: Access denied for non-admin users");
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;

    return {
      token: data.session?.access_token,
      record: {
        id: data.user?.id,
        email: data.user?.email,
        name: data.user?.user_metadata?.name || (email === ADMIN_EMAIL ? 'Administrator' : email.split('@')[0]),
        phone: data.user?.user_metadata?.phone || '',
        collectionName: this.name
      }
    };
  }
}

const pocketbaseClient = {
  collection: (name) => new CollectionEmulator(name),
  files,
  authStore: {
    model: null,
    clear: () => {
      supabase.auth.signOut();
    },
    onChange: (callback) => {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!session?.user) {
          callback(null, null);
          return;
        }
        const email = session.user.email;
        const role = email === ADMIN_EMAIL ? 'admin_users' : 'users';
        callback(session.access_token, {
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name || (email === ADMIN_EMAIL ? 'Administrator' : email.split('@')[0]),
          phone: session.user.user_metadata?.phone || '',
          collectionName: role
        });
      });
      return () => subscription.unsubscribe();
    }
  }
};

export default pocketbaseClient;
export { pocketbaseClient };
