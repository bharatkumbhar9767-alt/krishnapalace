import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://etjmlznvwwcmyunbzqgj.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_FJf_dM8Gt1gXVZfi9yP32w_EHDfrspd";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper to emulate pb.files.getUrl
export const files = {
  getUrl: (record, filename) => {
    if (!filename) return '';
    if (filename.startsWith('http://') || filename.startsWith('https://')) {
      return filename;
    }
    
    // If filename is already a full path (e.g. contains subdirectories), return it directly
    if (filename.includes('/')) {
      return `${SUPABASE_URL}/storage/v1/object/public/assets/${filename}`;
    }
    
    // Attempt to determine the folder structure matching pocketbase's:
    // /api/files/collectionIdOrName/recordId/filename
    const folder = record?.collectionName || record?.collectionId;
    if (folder && record?.id) {
      return `${SUPABASE_URL}/storage/v1/object/public/assets/${folder}/${record.id}/${filename}`;
    }
    
    return `${SUPABASE_URL}/storage/v1/object/public/assets/${filename}`;
  }
};

export default supabase;
