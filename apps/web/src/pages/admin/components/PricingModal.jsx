
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';

const DURATION_OPTIONS = ['1 Hour', '2 Hours', '3 Hours', '3+ Hours', '12 Hours', '24 Hours', 'Overnight'];

const PricingModal = ({ isOpen, onClose, room }) => {
  const [loading, setLoading] = useState(false);
  const [pricingMap, setPricingMap] = useState({});

  useEffect(() => {
    if (!room || !isOpen) return;

    const fetchPricing = async () => {
      setLoading(true);
      try {
        const records = await pb.collection('room_pricing').getFullList({
          filter: `roomId="${room.id}"`,
          $autoCancel: false
        });
        
        const map = {};
        records.forEach(r => { map[r.duration] = { id: r.id, price: r.price }; });
        setPricingMap(map);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load pricing');
      } finally {
        setLoading(false);
      }
    };
    fetchPricing();
  }, [room, isOpen]);

  const handlePriceChange = (duration, value) => {
    setPricingMap(prev => ({
      ...prev,
      [duration]: { ...prev[duration], price: value }
    }));
  };

  const handleSave = async () => {
    if (!room) return;
    setLoading(true);
    try {
      const promises = DURATION_OPTIONS.map(async (duration) => {
        const data = pricingMap[duration];
        const priceVal = parseInt(data?.price);

        if (!priceVal || isNaN(priceVal)) {
          // If empty and exists, delete it
          if (data?.id) await pb.collection('room_pricing').delete(data.id, { $autoCancel: false });
          return;
        }

        if (data?.id) {
          // Update
          await pb.collection('room_pricing').update(data.id, { price: priceVal }, { $autoCancel: false });
        } else {
          // Create
          await pb.collection('room_pricing').create({
            roomId: room.id,
            duration: duration,
            price: priceVal
          }, { $autoCancel: false });
        }
      });

      await Promise.all(promises);
      toast.success('Pricing updated successfully');
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Error updating pricing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Manage Pricing - {room?.name}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <p className="text-sm text-muted-foreground mb-4">Leave price empty to disable that duration option.</p>
          {DURATION_OPTIONS.map(duration => (
            <div key={duration} className="flex items-center gap-4">
              <Label className="w-24 shrink-0">{duration}</Label>
              <div className="relative flex-grow">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                <Input 
                  type="number" 
                  className="pl-8" 
                  placeholder="Price"
                  value={pricingMap[duration]?.price || ''}
                  onChange={(e) => handlePriceChange(duration, e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={loading}>{loading ? 'Saving...' : 'Save Pricing'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PricingModal;
