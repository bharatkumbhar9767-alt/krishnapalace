
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Save } from 'lucide-react';

const SettingsTab = () => {
  const [settingsId, setSettingsId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    hotelName: '',
    address: '',
    phone: '',
    email: '',
    whatsappNumber: '+91 7057998449',
    heroText: '',
    featuredRoomsText: '',
    amenitiesText: '',
    exploreDehText: ''
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const records = await pb.collection('hotel_settings').getFullList({ $autoCancel: false });
        if (records.length > 0) {
          const s = records[0];
          setSettingsId(s.id);
          setFormData({
            hotelName: s.hotelName || '',
            address: s.address || '',
            phone: s.phone || '',
            email: s.email || '',
            whatsappNumber: s.whatsappNumber || '+91 7057998449',
            heroText: s.heroText || '',
            featuredRoomsText: s.featuredRoomsText || '',
            amenitiesText: s.amenitiesText || '',
            exploreDehText: s.exploreDehText || ''
          });
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (settingsId) {
        await pb.collection('hotel_settings').update(settingsId, formData, { $autoCancel: false });
      } else {
        const newRecord = await pb.collection('hotel_settings').create(formData, { $autoCancel: false });
        setSettingsId(newRecord.id);
      }
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Save settings error:', error, error?.response, error?.data);
      const errMsg = error?.response?.data?.message || error?.data?.message || error?.message || 'Unknown error';
      const details = error?.response?.data?.data ? JSON.stringify(error.response.data.data) : (error?.data?.data ? JSON.stringify(error.data.data) : '');
      toast.error(`Failed to save settings: ${errMsg} ${details}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl animate-fade-in">
      <h2 className="text-2xl font-bold text-foreground mb-6">Hotel Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-8 bg-[hsl(var(--admin-card))] p-6 md:p-8 rounded-[2rem] border shadow-sm">
        
        <div className="space-y-6">
          <h3 className="text-lg font-bold border-b pb-3">General Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="hotelName" className="font-bold">Hotel Name</Label>
              <Input id="hotelName" name="hotelName" value={formData.hotelName} onChange={handleChange} required className="h-12 bg-[hsl(var(--admin-bg))]" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="font-bold">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required className="h-12 bg-[hsl(var(--admin-bg))]" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="font-bold">Phone</Label>
              <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required className="h-12 bg-[hsl(var(--admin-bg))]" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsappNumber" className="font-bold">WhatsApp Number</Label>
              <Input id="whatsappNumber" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleChange} required className="h-12 bg-[hsl(var(--admin-bg))]" />
              <p className="text-xs text-muted-foreground mt-1 font-medium">Used for auto-sending bills and website links. Recommended: +91 7057998449</p>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address" className="font-bold">Address</Label>
              <Input id="address" name="address" value={formData.address} onChange={handleChange} required className="h-12 bg-[hsl(var(--admin-bg))]" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-bold border-b pb-3">Website Content</h3>
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="heroText" className="font-bold">Hero Section Text</Label>
              <Textarea id="heroText" name="heroText" value={formData.heroText} onChange={handleChange} className="bg-[hsl(var(--admin-bg))] resize-y min-h-[100px]" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="featuredRoomsText" className="font-bold">Featured Rooms Text</Label>
              <Textarea id="featuredRoomsText" name="featuredRoomsText" value={formData.featuredRoomsText} onChange={handleChange} className="bg-[hsl(var(--admin-bg))] resize-y min-h-[100px]" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amenitiesText" className="font-bold">Amenities Section Text</Label>
              <Textarea id="amenitiesText" name="amenitiesText" value={formData.amenitiesText} onChange={handleChange} className="bg-[hsl(var(--admin-bg))] resize-y min-h-[100px]" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exploreDehText" className="font-bold">Explore Dehu Text</Label>
              <Textarea id="exploreDehText" name="exploreDehText" value={formData.exploreDehText} onChange={handleChange} className="bg-[hsl(var(--admin-bg))] resize-y min-h-[100px]" />
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button type="submit" size="lg" disabled={saving} className="w-full sm:w-auto min-w-[200px] h-14 text-lg font-bold rounded-xl shadow-md">
            {saving ? 'Saving...' : <><Save className="w-5 h-5 mr-2" /> Save Settings</>}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SettingsTab;
