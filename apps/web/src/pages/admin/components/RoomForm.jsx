import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { X, UploadCloud, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';

// 7. DURATION PRICING SECTION with Overnight
const DURATIONS = ['1 Hour', '2 Hours', '3 Hours', '3+ Hours', '24 Hours', 'Overnight'];

const RoomForm = ({ isOpen, onClose, room, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [amenitiesList, setAmenitiesList] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    capacity: 2,
    basePrice: 1000,
    description: '',
    amenities: []
  });

  const [prices, setPrices] = useState({
    '1 Hour': '', '2 Hours': '', '3 Hours': '', '3+ Hours': '', '24 Hours': '', 'Overnight': ''
  });

  // Images
  const [heroImage, setHeroImage] = useState(null); // File
  const [existingHero, setExistingHero] = useState(null); // URL/Filename
  
  const [existingGallery, setExistingGallery] = useState([]); // Filenames
  const [deletedGallery, setDeletedGallery] = useState([]); // Filenames
  const [newGalleryFiles, setNewGalleryFiles] = useState([]); // Files

  useEffect(() => {
    if (isOpen) {
      loadDependencies();
    }
  }, [isOpen, room]);

  const loadDependencies = async () => {
    try {
      const amenitiesData = await pb.collection('amenities').getFullList({ $autoCancel: false });
      setAmenitiesList(amenitiesData);

      if (room) {
        setFormData({
          name: room.name,
          capacity: room.capacity,
          basePrice: room.basePrice,
          description: room.description || '',
          amenities: room.amenities || []
        });
        setExistingHero(room.image || null);
        setExistingGallery(room.images || []);
        
        // Fetch pricing
        const pricingData = await pb.collection('room_pricing').getFullList({ filter: `roomId="${room.id}"`, $autoCancel: false });
        const loadedPrices = { '1 Hour': '', '2 Hours': '', '3 Hours': '', '3+ Hours': '', '24 Hours': '', 'Overnight': '' };
        pricingData.forEach(p => { 
          if(loadedPrices[p.duration] !== undefined) loadedPrices[p.duration] = p.price; 
        });
        setPrices(loadedPrices);
      } else {
        setFormData({ name: '', capacity: 2, basePrice: 1000, description: '', amenities: [] });
        setPrices({ '1 Hour': '', '2 Hours': '', '3 Hours': '', '3+ Hours': '', '24 Hours': '', 'Overnight': '' });
        setExistingHero(null);
        setExistingGallery([]);
      }
      setHeroImage(null);
      setNewGalleryFiles([]);
      setDeletedGallery([]);
    } catch (err) {
      toast.error('Failed to load dependencies');
    }
  };

  const handleHeroChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setHeroImage(e.target.files[0]);
    }
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    const total = existingGallery.length - deletedGallery.length + newGalleryFiles.length + files.length;
    if (total > 6) {
      toast.error('Maximum of 6 gallery images allowed.');
      return;
    }
    setNewGalleryFiles(prev => [...prev, ...files]);
  };

  const removeGalleryExisting = (filename) => {
    setExistingGallery(prev => prev.filter(f => f !== filename));
    setDeletedGallery(prev => [...prev, filename]);
  };

  const removeGalleryNew = (index) => {
    setNewGalleryFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleAmenityToggle = (id) => {
    setFormData(prev => {
      const current = [...prev.amenities];
      if (current.includes(id)) {
        return { ...prev, amenities: current.filter(a => a !== id) };
      }
      if (current.length >= 10) {
        toast.warning('Maximum of 10 amenities allowed. Remove one first.');
        return prev;
      }
      return { ...prev, amenities: [...current, id] };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!existingHero && !heroImage) {
      toast.error('Hero Image is REQUIRED.');
      return;
    }

    // Validate prices
    for (let d of DURATIONS) {
      if (!prices[d]) {
        toast.error(`Please provide a price for ${d}`);
        return;
      }
    }

    setLoading(true);
    
    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('capacity', formData.capacity);
      submitData.append('basePrice', formData.basePrice);
      submitData.append('description', formData.description);
      formData.amenities.forEach(a => submitData.append('amenities', a));

      if (heroImage) {
        submitData.append('image', heroImage);
      }
      
      newGalleryFiles.forEach(file => submitData.append('images', file));
      deletedGallery.forEach(filename => submitData.append(`images.${filename}`, ''));

      let savedRoom;
      if (room) {
        savedRoom = await pb.collection('rooms').update(room.id, submitData, { $autoCancel: false });
      } else {
        savedRoom = await pb.collection('rooms').create(submitData, { $autoCancel: false });
      }

      // Update pricing
      const existingPricing = await pb.collection('room_pricing').getFullList({ filter: `roomId="${savedRoom.id}"`, $autoCancel: false });
      
      const pricingPromises = DURATIONS.map(async (duration) => {
        const existing = existingPricing.find(p => p.duration === duration);
        const priceVal = parseInt(prices[duration]);
        if (existing) {
          if (existing.price !== priceVal) {
            return pb.collection('room_pricing').update(existing.id, { price: priceVal }, { $autoCancel: false });
          }
        } else {
          return pb.collection('room_pricing').create({ roomId: savedRoom.id, duration, price: priceVal }, { $autoCancel: false });
        }
      });

      await Promise.all(pricingPromises);
      
      toast.success(room ? 'Room updated successfully' : 'Room created successfully');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Save room error:', error, error?.response, error?.data);
      const errMsg = error?.response?.data?.message || error?.data?.message || error?.message || 'Unknown error';
      const details = error?.response?.data?.data ? JSON.stringify(error.response.data.data) : (error?.data?.data ? JSON.stringify(error.data.data) : '');
      toast.error(`Failed to save room: ${errMsg} ${details}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto p-0">
        <div className="p-6 pb-2 border-b bg-muted/30 sticky top-0 z-10 backdrop-blur-sm">
          <DialogTitle className="text-2xl font-bold">{room ? 'Edit Room Details' : 'Add New Room'}</DialogTitle>
          <DialogDescription>Configure room information, images, and duration pricing.</DialogDescription>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          
          {/* 1. General Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold border-b pb-2">1. General Info</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="name">Room Name *</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required placeholder="E.g., Deluxe Suite" className="bg-background" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Guest Capacity *</Label>
                <Input id="capacity" type="number" min="1" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 1 })} required className="bg-background" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Describe the room features..." className="bg-background" />
            </div>

            <div className="space-y-3 pt-2">
              <Label>Amenities (max 10)</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 bg-muted/20 p-4 rounded-xl border max-h-60 overflow-y-auto">
                {amenitiesList.map(a => {
                  const isSelected = formData.amenities.includes(a.id);
                  const isDisabled = !isSelected && formData.amenities.length >= 10;
                  return (
                    <div
                      key={a.id}
                      onClick={() => !isDisabled && handleAmenityToggle(a.id)}
                      className={`flex items-center gap-2 p-2 rounded-lg border transition-colors ${
                        isSelected
                          ? 'bg-primary/10 border-primary/40 cursor-pointer'
                          : isDisabled
                            ? 'border-transparent opacity-40 cursor-not-allowed'
                            : 'border-transparent hover:bg-muted/50 cursor-pointer'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        isSelected ? 'bg-primary border-primary' : 'border-muted-foreground/40'
                      }`}>
                        {isSelected && (
                          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm font-medium leading-tight">{a.name}</span>
                    </div>
                  );
                })}
              </div>
              <p className={`text-xs font-medium ${
                formData.amenities.length >= 10 ? 'text-amber-600' : 'text-muted-foreground'
              }`}>
                {formData.amenities.length} / 10 selected
                {formData.amenities.length >= 10 && ' — Limit reached'}
              </p>
            </div>
          </div>

          {/* 7. Duration Pricing Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold border-b pb-2">2. Duration Pricing (₹) *</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-primary/5 p-5 rounded-xl border border-primary/20">
              {DURATIONS.map(d => (
                <div key={d} className="space-y-1.5">
                  <Label className="text-sm font-bold text-foreground">{d} *</Label>
                  <Input 
                    type="number" 
                    min="1" 
                    required 
                    value={prices[d]} 
                    onChange={(e) => setPrices({...prices, [d]: e.target.value})} 
                    className="bg-background shadow-sm border-primary/20 text-lg font-medium h-12"
                    placeholder={`Price for ${d}`}
                  />
                </div>
              ))}
            </div>
            <div className="space-y-2 mt-4">
              <Label htmlFor="basePrice" className="text-muted-foreground">Standard Base Price (Fallback) *</Label>
              <Input id="basePrice" type="number" min="1" value={formData.basePrice} onChange={(e) => setFormData({ ...formData, basePrice: parseInt(e.target.value) || 1 })} required className="bg-background max-w-[250px]" />
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold border-b pb-2">3. Room Images</h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* 4. Hero Image (REQUIRED) */}
              <div className="space-y-2">
                <Label className="font-bold text-primary">Hero Image (Required) *</Label>
                <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-primary/40 bg-muted">
                  {heroImage ? (
                    <img src={URL.createObjectURL(heroImage)} className="w-full h-full object-cover" alt="Hero preview" />
                  ) : existingHero ? (
                    <img src={pb.files.getUrl(room, existingHero)} className="w-full h-full object-cover" alt="Hero" />
                  ) : (
                    <div className="flex flex-col items-center justify-center w-full h-full text-muted-foreground">
                      <ImageIcon className="w-8 h-8 opacity-40 mb-2" />
                      <span className="text-xs font-semibold">Upload Hero</span>
                    </div>
                  )}
                  <Label htmlFor="hero-upload" className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer text-white font-medium">
                    Change Hero
                  </Label>
                  <Input id="hero-upload" type="file" accept="image/*" className="hidden" onChange={handleHeroChange} />
                </div>
              </div>

              {/* 5. Gallery Images */}
              <div className="md:col-span-2 space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Gallery Images (Up to 6)</Label>
                  <span className="text-xs text-muted-foreground">{existingGallery.length + newGalleryFiles.length} / 6</span>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  {existingGallery.map(filename => (
                    <div key={filename} className="relative aspect-square rounded-xl overflow-hidden border bg-muted group">
                      <img src={pb.files.getUrl(room, filename)} alt="Gallery" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeGalleryExisting(filename)} className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  {newGalleryFiles.map((file, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border bg-muted group">
                      <img src={URL.createObjectURL(file)} alt="New Gallery" className="w-full h-full object-cover opacity-80" />
                      <button type="button" onClick={() => removeGalleryNew(idx)} className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  {(existingGallery.length + newGalleryFiles.length) < 6 && (
                    <Label htmlFor="gallery-upload" className="aspect-square rounded-xl border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                      <UploadCloud className="w-6 h-6 text-muted-foreground mb-2" />
                      <span className="text-xs font-medium text-muted-foreground">Upload</span>
                      <Input id="gallery-upload" type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryChange} />
                    </Label>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t flex justify-end gap-3 sticky bottom-0 bg-background/95 backdrop-blur py-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading} className="h-12 px-6">Cancel</Button>
            <Button type="submit" disabled={loading} className="h-12 px-8 font-bold shadow-md">
              {loading ? 'Saving Room...' : room ? 'Update Room' : 'Create Room'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RoomForm;