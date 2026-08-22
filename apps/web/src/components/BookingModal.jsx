import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const BookingModal = ({ isOpen, onClose, selectedRoom, selectedPricing }) => {
  const navigate = useNavigate();

  const handleProceed = () => {
    const duration = selectedPricing?.duration || '1 Hour';
    navigate(`/checkout/${selectedRoom.id}/${encodeURIComponent(duration)}`);
    onClose();
  };

  if (!selectedRoom) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Proceed to Checkout</DialogTitle>
          <DialogDescription>
            You are booking <strong>{selectedRoom.name}</strong>
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6 space-y-4">
          <div className="bg-muted/50 p-4 rounded-xl border flex justify-between items-center">
            <span className="font-medium text-muted-foreground">Duration</span>
            <span className="font-bold text-foreground">{selectedPricing?.duration || '1 Hour'}</span>
          </div>
          <div className="bg-muted/50 p-4 rounded-xl border flex justify-between items-center">
            <span className="font-medium text-muted-foreground">Price</span>
            <span className="font-bold text-xl text-primary">₹{selectedPricing?.price || selectedRoom.basePrice}</span>
          </div>
          <p className="text-sm text-center text-muted-foreground mt-4">
            You will enter your guest details and confirm the booking on the next page.
          </p>
        </div>

        <div className="flex gap-3 w-full">
          <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" className="flex-1 bg-primary hover:bg-primary/90 text-white" onClick={handleProceed}>
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;