
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutDashboard, Settings, BedDouble, Image as ImageIcon, Star, Calendar, Users, CreditCard, Map, Tag, Plus, Edit2, Trash2, ToggleLeft, ToggleRight, X, UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import LoadingSpinner from '@/components/LoadingSpinner';

import DashboardTab from './tabs/DashboardTab';
import SettingsTab from './tabs/SettingsTab';
import RoomsTab from './tabs/RoomsTab';
import GalleryTab from './tabs/GalleryTab';
import AmenitiesTab from './tabs/AmenitiesTab';
import BookingsTab from './tabs/BookingsTab';
import CustomersTab from './tabs/CustomersTab';
import PosBillingTab from './tabs/PosBillingTab';
import ExploreDehuTab from './tabs/ExploreDehuTab';

// ─── Inline Offers Tab — fields match PocketBase offers collection ─────────────
// PocketBase schema: title, description, discountPercentage, price, validFrom,
//                   validTo, active, image (File — add in PocketBase if missing)
const EMPTY_OFFER = {
  title: '',
  description: '',
  discountPercentage: '',
  price: '',
  validFrom: '',
  validTo: '',
  active: true,
};

const OffersTab = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_OFFER);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchOffers = async () => {
    try {
      const records = await pb.collection('offers').getFullList({
        sort: '-created',
        $autoCancel: false
      });
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
    setForm(EMPTY_OFFER);
    setImageFile(null);
    setFormOpen(true);
  };

  const openEdit = (offer) => {
    setEditing(offer);
    setForm({
      title: offer.title || '',
      description: offer.description || '',
      discountPercentage: offer.discountPercentage ?? '',
      price: offer.price ?? '',
      validFrom: offer.validFrom ? offer.validFrom.split(' ')[0] : '',
      validTo: offer.validTo ? offer.validTo.split(' ')[0] : '',
      active: offer.active !== false,
    });
    setImageFile(null);
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
      const updated = await pb.collection('offers').update(
        offer.id, { active: !offer.active }, { $autoCancel: false }
      );
      setOffers(prev => prev.map(o => o.id === updated.id ? updated : o));
      toast.success(updated.active ? 'Offer enabled' : 'Offer disabled');
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    setSaving(true);
    try {
      // Always use FormData so image upload works
      const data = new FormData();
      data.append('title', form.title.trim());
      data.append('description', form.description || '');
      data.append('active', form.active ? 'true' : 'false');
      if (form.discountPercentage !== '') data.append('discountPercentage', form.discountPercentage);
      if (form.price !== '') data.append('price', form.price);
      if (form.validFrom) data.append('validFrom', new Date(form.validFrom).toISOString());
      if (form.validTo) data.append('validTo', new Date(form.validTo).toISOString());
      if (imageFile) data.append('image', imageFile);

      if (editing) {
        await pb.collection('offers').update(editing.id, data, { $autoCancel: false });
        toast.success('Offer updated!');
      } else {
        await pb.collection('offers').create(data, { $autoCancel: false });
        toast.success('Offer created!');
      }
      setFormOpen(false);
      fetchOffers();
    } catch (err) {
      console.error('Offer error:', JSON.stringify(err?.response || err));
      const fieldErrs = err?.response?.data?.data;
      if (fieldErrs) {
        const msg = Object.entries(fieldErrs)
          .map(([f, v]) => `${f}: ${v?.message || JSON.stringify(v)}`)
          .join(' | ');
        toast.error(`Field error: ${msg}`);
      } else {
        toast.error(`Error: ${err?.response?.data?.message || err?.message || 'Unknown'}`);
      }
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
          <p className="text-muted-foreground text-sm">
            Create special deals shown in the Home &amp; Rooms page slider.
            <span className="ml-2 text-amber-600 font-semibold">⚠️ PocketBase needs: image (File) &amp; price (Number) fields added manually.</span>
          </p>
        </div>
        <Button onClick={openAdd} className="bg-primary hover:bg-primary/90 text-white shadow-sm">
          <Plus className="w-4 h-4 mr-2" /> Add Offer
        </Button>
      </div>

      {/* Offer Form Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-background rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold">{editing ? 'Edit Offer' : 'New Offer'}</h3>
              <button onClick={() => setFormOpen(false)} className="p-2 rounded-full hover:bg-muted">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">

              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Offer Image</Label>
                <label
                  htmlFor="offer-img-upload"
                  className="relative flex flex-col items-center justify-center aspect-video rounded-2xl border-2 border-dashed border-primary/30 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors overflow-hidden"
                >
                  {imageFile ? (
                    <img src={URL.createObjectURL(imageFile)} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                  ) : editing?.image ? (
                    <img src={pb.files.getUrl(editing, editing.image)} alt="Current" className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center text-muted-foreground py-6">
                      <UploadCloud className="w-10 h-10 mb-2" />
                      <span className="text-sm font-medium">Click to upload offer image</span>
                      <span className="text-xs mt-1">JPG, PNG, WEBP</span>
                    </div>
                  )}
                  {(imageFile || editing?.image) && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white font-bold text-sm">Change Image</span>
                    </div>
                  )}
                  <input
                    id="offer-img-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => e.target.files?.[0] && setImageFile(e.target.files[0])}
                  />
                </label>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Weekend Couple Special"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  rows={3}
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Describe what's included in this offer..."
                />
              </div>

              {/* Price + Discount */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Offer Price (₹)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                    placeholder="e.g. 999"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Discount % <span className="text-muted-foreground font-normal">(optional)</span></Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={form.discountPercentage}
                    onChange={e => setForm(f => ({ ...f, discountPercentage: e.target.value }))}
                    placeholder="e.g. 20"
                  />
                </div>
              </div>

              {/* Valid From / To */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Valid From</Label>
                  <Input
                    type="date"
                    value={form.validFrom}
                    onChange={e => setForm(f => ({ ...f, validFrom: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Valid To</Label>
                  <Input
                    type="date"
                    value={form.validTo}
                    onChange={e => setForm(f => ({ ...f, validTo: e.target.value }))}
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-3 pt-1">
                <button type="button" onClick={() => setForm(f => ({ ...f, active: !f.active }))}>
                  {form.active
                    ? <ToggleRight className="w-8 h-8 text-primary" />
                    : <ToggleLeft className="w-8 h-8 text-muted-foreground" />}
                </button>
                <span className="font-medium text-sm">
                  {form.active ? '✅ Active — visible in slider' : '⛔ Inactive — hidden from site'}
                </span>
              </div>

              <div className="flex gap-3 justify-end pt-3 border-t">
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
          <p className="text-lg font-medium">No offers yet. Click "Add Offer" to create one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {offers.map(offer => (
            <div
              key={offer.id}
              className={`bg-[hsl(var(--admin-card))] rounded-2xl border shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-all ${!offer.active ? 'opacity-60' : ''}`}
            >
              {/* Offer Image */}
              <div className="relative aspect-video bg-muted overflow-hidden">
                {offer.image ? (
                  <img
                    src={pb.files.getUrl(offer, offer.image)}
                    alt={offer.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                    <Tag className="w-10 h-10" />
                  </div>
                )}
                <span className={`absolute top-2 right-2 text-xs font-bold px-2.5 py-1 rounded-full ${offer.active ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground border'}`}>
                  {offer.active ? 'Active' : 'Off'}
                </span>
              </div>

              <div className="p-5 flex flex-col flex-grow">
                <h3 className="font-bold text-lg leading-tight mb-1">{offer.title}</h3>
                <p className="text-muted-foreground text-sm mb-3 line-clamp-2 flex-grow">{offer.description || '—'}</p>

                <div className="flex items-center gap-3 mb-3">
                  {offer.price != null && offer.price !== '' && (
                    <span className="text-2xl font-black text-primary">₹{offer.price}</span>
                  )}
                  {offer.discountPercentage != null && offer.discountPercentage !== '' && (
                    <span className="bg-primary/10 text-primary text-sm font-bold px-2 py-0.5 rounded-lg">
                      {offer.discountPercentage}% OFF
                    </span>
                  )}
                </div>

                {(offer.validFrom || offer.validTo) && (
                  <p className="text-xs text-muted-foreground mb-4 font-medium">
                    {offer.validFrom && `From ${new Date(offer.validFrom).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`}
                    {offer.validFrom && offer.validTo && ' → '}
                    {offer.validTo && new Date(offer.validTo).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                )}

                <div className="grid grid-cols-3 gap-2 mt-auto pt-4 border-t">
                  <Button variant="secondary" size="sm" onClick={() => openEdit(offer)} className="text-xs font-semibold">
                    <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleToggleActive(offer)} className="text-xs font-semibold">
                    {offer.active ? 'Disable' : 'Enable'}
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(offer.id)} className="text-xs font-semibold">
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
// ─────────────────────────────────────────────────────────────────────────────

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-[hsl(var(--admin-bg))] pb-12 animate-fade-in">
      <Helmet><title>Admin Dashboard | Hotel Krishna Palace</title></Helmet>

      <div className="bg-secondary text-secondary-foreground px-4 py-8 mb-8 shadow-md">
        <div className="container max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold flex items-center gap-3 text-white tracking-tight">
              <LayoutDashboard className="w-8 h-8 text-accent" /> Management Portal
            </h1>
            <p className="text-secondary-foreground/70 mt-1 font-medium">Manage all operations for Hotel Krishna Palace</p>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4">
        <Tabs defaultValue="dashboard" className="space-y-8 animate-slide-up">
          <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent justify-start border-b pb-4 w-full">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground bg-[hsl(var(--admin-card))] border shadow-sm font-semibold py-2.5 px-4 rounded-lg">
              <LayoutDashboard className="w-4 h-4 mr-2"/>Dashboard
            </TabsTrigger>
            <TabsTrigger value="bookings" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground bg-[hsl(var(--admin-card))] border shadow-sm font-semibold py-2.5 px-4 rounded-lg">
              <Calendar className="w-4 h-4 mr-2"/>Bookings
            </TabsTrigger>
            <TabsTrigger value="rooms" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground bg-[hsl(var(--admin-card))] border shadow-sm font-semibold py-2.5 px-4 rounded-lg">
              <BedDouble className="w-4 h-4 mr-2"/>Rooms
            </TabsTrigger>
            <TabsTrigger value="gallery" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground bg-[hsl(var(--admin-card))] border shadow-sm font-semibold py-2.5 px-4 rounded-lg">
              <ImageIcon className="w-4 h-4 mr-2"/>Gallery
            </TabsTrigger>
            <TabsTrigger value="amenities" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground bg-[hsl(var(--admin-card))] border shadow-sm font-semibold py-2.5 px-4 rounded-lg">
              <Star className="w-4 h-4 mr-2"/>Amenities
            </TabsTrigger>
            <TabsTrigger value="explore" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground bg-[hsl(var(--admin-card))] border shadow-sm font-semibold py-2.5 px-4 rounded-lg">
              <Map className="w-4 h-4 mr-2"/>Explore Dehu
            </TabsTrigger>
            <TabsTrigger value="offers" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground bg-[hsl(var(--admin-card))] border shadow-sm font-semibold py-2.5 px-4 rounded-lg">
              <Tag className="w-4 h-4 mr-2"/>Offers
            </TabsTrigger>
            <TabsTrigger value="customers" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground bg-[hsl(var(--admin-card))] border shadow-sm font-semibold py-2.5 px-4 rounded-lg">
              <Users className="w-4 h-4 mr-2"/>Customers
            </TabsTrigger>
            <TabsTrigger value="pos" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground bg-[hsl(var(--admin-card))] border shadow-sm font-semibold py-2.5 px-4 rounded-lg">
              <CreditCard className="w-4 h-4 mr-2"/>POS Billing
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground bg-[hsl(var(--admin-card))] border shadow-sm font-semibold py-2.5 px-4 rounded-lg">
              <Settings className="w-4 h-4 mr-2"/>Settings
            </TabsTrigger>
          </TabsList>

          <div className="mt-4">
            <TabsContent value="dashboard" className="m-0 focus-visible:outline-none"><DashboardTab /></TabsContent>
            <TabsContent value="bookings" className="m-0 focus-visible:outline-none"><BookingsTab /></TabsContent>
            <TabsContent value="rooms" className="m-0 focus-visible:outline-none"><RoomsTab /></TabsContent>
            <TabsContent value="gallery" className="m-0 focus-visible:outline-none"><GalleryTab /></TabsContent>
            <TabsContent value="amenities" className="m-0 focus-visible:outline-none"><AmenitiesTab /></TabsContent>
            <TabsContent value="explore" className="m-0 focus-visible:outline-none"><ExploreDehuTab /></TabsContent>
            <TabsContent value="offers" className="m-0 focus-visible:outline-none"><OffersTab /></TabsContent>
            <TabsContent value="customers" className="m-0 focus-visible:outline-none"><CustomersTab /></TabsContent>
            <TabsContent value="pos" className="m-0 focus-visible:outline-none"><PosBillingTab /></TabsContent>
            <TabsContent value="settings" className="m-0 focus-visible:outline-none"><SettingsTab /></TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
