import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, UploadCloud, Save } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import LoadingSpinner from '@/components/LoadingSpinner';

const CATEGORIES = ['Room', 'Amenity', 'Dehu Attraction', 'Other'];

const GalleryTab = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchGallery = async () => {
    try {
      const records = await pb.collection('gallery').getFullList({ sort: '-created', $autoCancel: false });
      setImages(records);
    } catch (err) {
      toast.error('Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    
    setUploading(true);
    try {
      const promises = files.map(file => {
        const fd = new FormData();
        fd.append('image', file);
        fd.append('title', file.name.split('.')[0]);
        fd.append('category', 'Other');
        return pb.collection('gallery').create(fd, { $autoCancel: false });
      });
      await Promise.all(promises);
      toast.success(`${files.length} images uploaded`);
      fetchGallery();
    } catch (err) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async (id, field, value) => {
    try {
      await pb.collection('gallery').update(id, { [field]: value }, { $autoCancel: false });
      setImages(images.map(img => img.id === id ? { ...img, [field]: value } : img));
      toast.success('Updated');
    } catch (err) {
      toast.error('Failed to update');
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Delete this image?')) return;
    try {
      await pb.collection('gallery').delete(id, { $autoCancel: false });
      setImages(images.filter(img => img.id !== id));
      toast.success('Deleted');
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-secondary">Manage Gallery</h2>
        <div className="relative">
          <Input type="file" multiple accept="image/*" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer" disabled={uploading} />
          <Button disabled={uploading} className="bg-primary text-white">
            <UploadCloud className="w-4 h-4 mr-2" /> {uploading ? 'Uploading...' : 'Upload Images'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map(img => (
          <div key={img.id} className="bg-[hsl(var(--admin-card))] border rounded-xl overflow-hidden shadow-sm flex flex-col">
            <div className="h-48 relative bg-muted">
              <img src={pb.files.getUrl(img, img.image)} className="w-full h-full object-cover" alt={img.title} />
              <button onClick={() => handleDelete(img.id)} className="absolute top-2 right-2 bg-destructive text-white p-2 rounded-full hover:bg-destructive/90 transition-colors shadow-md">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-3 flex-grow">
              <Input 
                defaultValue={img.title} 
                onBlur={(e) => e.target.value !== img.title && handleUpdate(img.id, 'title', e.target.value)}
                placeholder="Image Title/Caption"
                className="text-sm font-medium"
              />
              <select 
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                value={img.category}
                onChange={(e) => handleUpdate(img.id, 'category', e.target.value)}
              >
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>
        ))}
      </div>
      {images.length === 0 && <p className="text-center py-12 text-muted-foreground">No images found. Upload some to get started.</p>}
    </div>
  );
};

export default GalleryTab;