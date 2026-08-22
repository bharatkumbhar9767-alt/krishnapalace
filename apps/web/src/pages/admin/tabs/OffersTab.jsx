import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Plus, Edit2, Tag, UploadCloud, ToggleLeft, ToggleRight, X } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import LoadingSpinner from '@/components/LoadingSpinner';

const emptyForm = {
  title: '',
  description: '',
  price: '',
  originalPrice: '',
  badge: '',
  validUntil: '',
  active: true,
};

const OffersTab = () => {
  const [offers, setOffers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchRooms = async () => {
      try {
        const res = await pb.collection('rooms').getFullList({$autoCancel: false});
        setRooms(res);
      } catch (e) {}
    };
    const fetchOffers = async () => {
    try {
      const records = await pb.collection('offers').getFullList({ sort: '-created', $autoCancel: false });
      setOffers(records);
    } catch (err) {
      toast.error('Failed to load offers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOffers(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setImageFile(null);
    setExistingImage(null);
    setFormOpen(true);
  };

  const openEdit = (offer) => {
    setEditing(offer);
    setForm({
      title: offer.title || '',
      description: offer.description || '',
      price: offer.price || '',
      originalPrice: offer.originalPrice || '',
      badge: offer.badge || '',
      validUntil: offer.validUntil ? offer.validUntil.split('T')[0] : '',
      active: offer.active !== false,
    });
    setImageFile(null);
    setExistingImage(offer.image || null);
    setFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this offer?')) return;
    try {
      await pb.collection('offers').delete(id, { $autoCancel: false });
      setOffers(prev => prev.filter(o => o.id !== id));
      toast.success('Offer deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleToggleActive = async (offer) => {
    try {
      const updated = await pb.collection('offers').update(offer.id, { active: !offer.active }, { $autoCancel: false });
      setOffers(prev => prev.map(o => o.id === updated.id ? updated : o));
      toast.success(updated.active ? 'Offer activated' : 'Offer deactivated');
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    setSaving(true);
    try {
      const data = new FormData();
      data.append('title', form.title);
      data.append('description', form.description);
      data.append('price', form.price);
      data.append('originalPrice', form.originalPrice);
      data.append('badge', form.badge);
      data.append('active', form.active);
      if (form.validUntil) data.append('validUntil', form.validUntil);
        if (form.roomId) data.append('roomId', form.roomId);
      if (imageFile) data.append('image', imageFile);

      if (editing) {
        await pb.collection('offers').update(editing.id, data, { $autoCancel: false });
        toast.success('Offer updated');
      } else {
        await pb.collection('offers').create(data, { $autoCancel: false });
        toast.success('Offer created');
      }
      setFormOpen(false);
      fetchOffers();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Unknown error';
      toast.error(`Failed: ${msg}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-secondary">Manage Offers</h2>
          <p className="text-muted-foreground text-sm">Create special deals visible on the Offers page.</p>
        </div>
        <Button onClick={openAdd} className="bg-primary hover:bg-primary/90 text-white shadow-sm">
          <Plus className="w-4 h-4 mr-2" /> Add Offer
        </Button>
      </div>

      {/* Offer Form Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-background rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold">{editing ? 'Edit Offer' : 'New Offer'}</h3>
              <button onClick={() => setFormOpen(false)} className="p-1 rounded-full hover:bg-muted">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Image */}
              <div className="space-y-2">
                <Label>Offer Image</Label>
                <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-dashed border-primary/30 bg-muted/30 flex items-center justify-center cursor-pointer group">
                  {imageFile ? (
                    <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-full h-full object-cover" />
                  ) : existingImage && editing ? (
                    <img src={pb.files.getUrl(editing, existingImage)} alt="Existing" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center text-muted-foreground">
                      <UploadCloud className="w-8 h-8 mb-1" />
                      <span className="text-sm font-medium">Upload Image</span>
                    </div>
                  )}
                  <Label htmlFor="offer-img" className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-medium cursor-pointer transition-opacity">
                    Change Image
                  </Label>
                  <Input id="offer-img" type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && setImageFile(e.target.files[0])} />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2 sm:col-span-2">
                  <Label>Title *</Label>
                  <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Weekend Couple Special" required />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Description</Label>
                  <Textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe the offer..." />
                </div>
                <div className="space-y-2">
                  <Label>Offer Price (₹)</Label>
                  <Input type="number" min="0" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="e.g. 999" />
                </div>
                <div className="space-y-2">
                  <Label>Original Price (₹) — for strikethrough</Label>
                  <Input type="number" min="0" value={form.originalPrice} onChange={e => setForm(f => ({ ...f, originalPrice: e.target.value }))} placeholder="e.g. 1499" />
                </div>
                <div className="space-y-2">
                  <Label>Badge Label</Label>
                  <Input value={form.badge} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))} placeholder="e.g. 🔥 Best Value" />
                </div>
                <div className="space-y-2">
                  <Label>Valid Until</Label>
                  <Input type="date" value={form.validUntil} onChange={e => setForm(f => ({ ...f, validUntil: e.target.value }))} />
                </div>
                <div className="sm:col-span-2 flex items-center gap-3">
                  <button type="button" onClick={() => setForm(f => ({ ...f, active: !f.active }))}>
                    {form.active
                      ? <ToggleRight className="w-8 h-8 text-primary" />
                      : <ToggleLeft className="w-8 h-8 text-muted-foreground" />}
                  </button>
                  <span className="font-medium text-sm">{form.active ? 'Active (visible on site)' : 'Inactive (hidden)'}</span>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-2 border-t">
                <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={saving} className="px-8 font-bold">
                  {saving ? 'Saving...' : editing ? 'Update Offer' : 'Create Offer'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Offers List */}
      {offers.length === 0 ? (
        <div className="text-center py-20 bg-[hsl(var(--admin-card))] rounded-xl border border-dashed text-muted-foreground">
          <Tag className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium">No offers yet. Create one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {offers.map(offer => (
            <div key={offer.id} className={`bg-[hsl(var(--admin-card))] rounded-2xl border shadow-sm overflow-hidden flex flex-col group transition-all hover:shadow-md ${!offer.active ? 'opacity-60' : ''}`}>
              <div className="relative aspect-video bg-muted overflow-hidden">
                {offer.image ? (
                  <img src={pb.files.getUrl(offer, offer.image)} alt={offer.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Tag className="w-8 h-8 opacity-20" />
                  </div>
                )}
                {offer.badge && (
                  <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-black px-2 py-0.5 rounded-full">
                    {offer.badge}
                  </div>
                )}
                <div className={`absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full ${offer.active ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground border'}`}>
                  {offer.active ? 'Active' : 'Inactive'}
                </div>
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="font-bold text-lg mb-1">{offer.title}</h3>
                <p className="text-muted-foreground text-sm mb-3 line-clamp-2 flex-grow">{offer.description || '—'}</p>
                {offer.price && (
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-xl font-black text-primary">₹{offer.price}</span>
                    {offer.originalPrice && <span className="text-sm text-muted-foreground line-through">₹{offer.originalPrice}</span>}
                  </div>
                )}
                <div className="grid grid-cols-3 gap-2 mt-auto pt-4 border-t">
                  <Button variant="secondary" size="sm" onClick={() => openEdit(offer)} className="text-xs font-semibold col-span-1">
                    <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleToggleActive(offer)} className="text-xs font-semibold col-span-1">
                    {offer.active ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(offer.id)} className="text-xs font-semibold col-span-1">
                    <Trash2 className="w-3.5 h-3.5 mr-1" /> Del
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OffersTab;
