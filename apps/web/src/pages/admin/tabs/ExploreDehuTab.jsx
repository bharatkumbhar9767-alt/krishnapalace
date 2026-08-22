import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import LoadingSpinner from '@/components/LoadingSpinner';

const ExploreDehuTab = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null
  });

  const MAX_IMAGES = 9;

  const fetchCards = async () => {
    try {
      // Sorting by '-created' since schema lacks displayOrder
      const records = await pb.collection('explore_dehu').getList(1, MAX_IMAGES, {
        sort: '-created',
        $autoCancel: false
      });
      setCards(records.items);
    } catch (err) {
      toast.error('Failed to load Explore Dehu cards');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleOpenModal = (card = null) => {
    if (card) {
      setEditingCard(card);
      setFormData({
        title: card.title,
        description: card.description || '',
        image: null
      });
    } else {
      if (cards.length >= MAX_IMAGES) {
        toast.error(`Maximum of ${MAX_IMAGES} images allowed.`);
        return;
      }
      setEditingCard(null);
      setFormData({ title: '', description: '', image: null });
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    try {
      await pb.collection('explore_dehu').delete(id, { $autoCancel: false });
      toast.success('Image deleted successfully');
      fetchCards();
    } catch (err) {
      toast.error('Failed to delete image');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      if (formData.image) {
        data.append('image', formData.image);
      }

      if (editingCard) {
        await pb.collection('explore_dehu').update(editingCard.id, data, { $autoCancel: false });
        toast.success('Card updated successfully');
      } else {
        await pb.collection('explore_dehu').create(data, { $autoCancel: false });
        toast.success('Card created successfully');
      }
      setIsModalOpen(false);
      fetchCards();
    } catch (error) {
      console.error('Save card error:', error, error?.response, error?.data);
      const errMsg = error?.response?.data?.message || error?.data?.message || error?.message || 'Unknown error';
      const details = error?.response?.data?.data ? JSON.stringify(error.response.data.data) : (error?.data?.data ? JSON.stringify(error.data.data) : '');
      toast.error(`Failed to save card: ${errMsg} ${details}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-secondary">Explore Dehu</h2>
          <p className="text-muted-foreground text-sm">Manage attractions shown on the homepage ({cards.length}/{MAX_IMAGES} used).</p>
        </div>
        <Button 
          onClick={() => handleOpenModal()} 
          className="bg-primary hover:bg-primary/90 text-white"
          disabled={cards.length >= MAX_IMAGES}
        >
          <Plus className="w-4 h-4 mr-2" /> Add Image
        </Button>
      </div>

      {cards.length === 0 ? (
        <div className="text-center py-20 bg-[hsl(var(--admin-card))] rounded-xl border border-dashed text-muted-foreground">
          <p className="text-lg">No images found. Add up to {MAX_IMAGES} items to display on the homepage.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, idx) => (
            <div key={card.id} className="bg-[hsl(var(--admin-card))] rounded-xl border shadow-sm overflow-hidden flex flex-col">
              <div className="aspect-video bg-muted relative overflow-hidden">
                {card.image ? (
                  <img src={pb.files.getUrl(card, card.image)} alt={card.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-muted-foreground">
                    <ImageIcon className="w-8 h-8 opacity-50" />
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                  #{idx + 1}
                </div>
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="font-bold text-lg text-foreground mb-2 line-clamp-1">{card.title}</h3>
                <p className="text-muted-foreground text-sm mb-6 line-clamp-3">{card.description}</p>
                
                <div className="mt-auto flex gap-2 pt-4 border-t border-border/50">
                  <Button variant="secondary" size="sm" onClick={() => handleOpenModal(card)} className="flex-1">
                    <Edit2 className="w-4 h-4 mr-2" /> Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(card.id)} className="flex-1">
                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingCard ? 'Edit Image' : 'Add New Image'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input 
                id="title" 
                value={formData.title} 
                onChange={(e) => setFormData({...formData, title: e.target.value})} 
                required 
                placeholder="E.g., Dehu Temple"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})} 
                rows={3}
                placeholder="Brief description about the location..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Image {editingCard && '(Leave empty to keep current)'}</Label>
              <Input 
                id="image" 
                type="file" 
                accept="image/*"
                onChange={(e) => setFormData({...formData, image: e.target.files[0]})} 
                required={!editingCard}
              />
            </div>
            <div className="pt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExploreDehuTab;