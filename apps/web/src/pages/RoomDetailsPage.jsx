
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import pb from '@/lib/pocketbaseClient';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, CheckCircle2, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

const RoomDetailsPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  
  const [room, setRoom] = useState(null);
  const [pricing, setPricing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState('');

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        setLoading(true);
        const roomData = await pb.collection('rooms').getOne(roomId, { 
          expand: 'amenities', 
          $autoCancel: false 
        });
        setRoom(roomData);

        const pricingData = await pb.collection('room_pricing').getList(1, 50, { 
          filter: `roomId="${roomId}"`, 
          $autoCancel: false 
        });
        
        const durationOrder = ['1 Hour', '2 Hours', '3 Hours', '3+ Hours', '24 Hours', 'Overnight', 'Couple Offer'];
        const sortedPricing = pricingData.items.sort((a, b) => 
          durationOrder.indexOf(a.duration) - durationOrder.indexOf(b.duration)
        );
        
        // Add a virtual "Couple Offer" pricing item if not already in DB
        if (!sortedPricing.find(p => p.duration === 'Couple Offer')) {
          sortedPricing.push({ id: 'virtual-couple-offer', duration: 'Couple Offer', price: 999 });
        }
        
        setPricing(sortedPricing);
      } catch (err) {
        console.error('Error fetching room details:', err);
        setError('Room not found or unavailable.');
      } finally {
        setLoading(false);
      }
    };
    fetchRoomDetails();
  }, [roomId]);

  const handleBookNow = () => {
    if (!selectedDuration) {
      toast.error("Please select a duration first");
      return;
    }
    if (!room?.id) {
      toast.error("Room details missing. Please refresh the page.");
      return;
    }
    navigate(`/checkout/${room.id}/${encodeURIComponent(selectedDuration)}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 space-y-8">
        <Skeleton className="h-[50vh] w-full rounded-3xl" />
        <div className="grid lg:grid-cols-12 gap-10">
          <Skeleton className="lg:col-span-7 h-[400px] w-full rounded-2xl" />
          <Skeleton className="lg:col-span-5 h-[300px] w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold mb-4">{error || 'Room not found'}</h2>
        <Button onClick={() => navigate('/rooms')}>Back to Rooms</Button>
      </div>
    );
  }

  const activePricing = pricing.find(p => p.duration === selectedDuration);
  const displayPrice = activePricing ? activePricing.price : room.basePrice;
  const galleryImages = room.images || [];

  return (
    <main className="min-h-screen bg-muted/20 py-8 lg:py-12">
      <Helmet>
        <title>{`${room.name} | Hotel Krishna Palace`}</title>
      </Helmet>

      <div className="container max-w-6xl mx-auto px-4 sm:px-6">
        <Button variant="ghost" onClick={() => navigate('/rooms')} className="mb-6 text-muted-foreground hover:text-foreground -ml-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Rooms
        </Button>

        {/* 1. Hero Image at TOP */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full h-[40vh] md:h-[60vh] rounded-3xl overflow-hidden border shadow-lg mb-10 bg-muted relative">
          {room.image ? (
            <img src={pb.files.getUrl(room, room.image)} alt={room.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-16 h-16 opacity-20 text-muted-foreground"/></div>
          )}
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* LEFT: Details & Gallery */}
          <div className="lg:col-span-7 space-y-10 order-2 lg:order-1">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-foreground leading-tight tracking-tight">{room.name}</h1>
              <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground mb-6">
                <span className="flex items-center gap-1.5 bg-background px-4 py-2 rounded-full border shadow-sm">
                  <Users className="w-5 h-5 text-primary" /> Up to {room.capacity} Guests
                </span>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed text-balance">
                {room.description || 'Experience comfort and convenience in our thoughtfully designed room, perfectly suited for your stay in Dehu Road.'}
              </p>
            </div>

            {/* 2. Gallery Grid BELOW */}
            {galleryImages.length > 0 && (
              <div>
                <h3 className="text-xl font-bold mb-4 text-secondary border-b pb-2">Room Gallery</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                  {galleryImages.map((img, idx) => (
                    <div key={idx} className="aspect-square rounded-2xl overflow-hidden border shadow-sm bg-muted group">
                      <img src={pb.files.getUrl(room, img)} alt={`${room.name} Gallery ${idx+1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. All Amenities List */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-secondary border-b pb-2">Room Amenities</h3>
              {room.expand?.amenities && room.expand.amenities.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-4">
                  {room.expand.amenities.map(amenity => (
                    <div key={amenity.id} className="flex items-center text-muted-foreground font-medium">
                      <CheckCircle2 className="w-5 h-5 mr-2 text-primary shrink-0" />
                      <span>{amenity.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground italic">Standard room amenities included.</p>
              )}
            </div>
          </div>

          {/* RIGHT: Booking Sticky Card */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 order-1 lg:order-2">
            <div className="bg-card rounded-3xl p-6 md:p-8 border shadow-xl">
              <h3 className="text-2xl font-bold mb-6 border-b pb-4">Book Your Stay</h3>
              
              <div className="space-y-6 mb-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">5. Select Duration</label>
                  <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                    <SelectTrigger className="h-14 text-lg bg-background font-medium shadow-sm">
                      <SelectValue placeholder="Choose length of stay" />
                    </SelectTrigger>
                    <SelectContent>
                      {pricing.length > 0 ? (
                        pricing.map(p => (
                          <SelectItem key={p.id} value={p.duration} className="text-base py-3">
                            {p.duration} - ₹{p.price}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="Standard" className="text-base py-3">Standard Rate - ₹{room.basePrice}</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {selectedDuration && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-primary/5 p-4 rounded-xl border border-primary/20 flex justify-between items-center">
                    <span className="font-bold text-foreground">Total Price</span>
                    <span className="text-2xl font-extrabold text-primary">₹{displayPrice}</span>
                  </motion.div>
                )}
              </div>

              <div className="pt-4 border-t">
                {/* 6. 'Book Now' button enabled after selection */}
                <Button 
                  size="lg" 
                  onClick={handleBookNow}
                  disabled={!selectedDuration}
                  className="w-full h-16 text-xl font-bold shadow-xl transition-all active:scale-[0.98] rounded-xl"
                >
                  Book Now
                </Button>
                <p className="text-center text-sm text-muted-foreground font-medium mt-4">
                  Pay securely at the hotel reception upon arrival.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
};

export default RoomDetailsPage;
