
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowLeft, CheckCircle2, IndianRupee, Clock, Users, Loader2, Utensils, Sparkles, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';

const CheckoutPage = () => {
  const { roomId, hours } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [room, setRoom] = useState(null);
  const [basePrice, setBasePrice] = useState(0);
  const [withBreakfast, setWithBreakfast] = useState(false);
  const [displayDuration, setDisplayDuration] = useState(decodeURIComponent(hours || '1 Hour'));
  const [offerDetails, setOfferDetails] = useState(null);
  
  const BREAKFAST_FEE = 200;
  const COUPLE_OFFER_PRICE = 999;

  const decodedHours = decodeURIComponent(hours || '1 Hour');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: new Date().toISOString().split('T')[0],
    time: '12:00',
    guests: 1
  });

  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        name: currentUser.name || prev.name,
        phone: currentUser.phone || prev.phone
      }));
    }
  }, [currentUser]);

  const location = useLocation();

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchRoomAndPricing = async () => {
      // Prevent fetching or erroring if the component is just exiting via AnimatePresence 
      if (!location.pathname.startsWith('/checkout')) return;

      if (!roomId || roomId === 'undefined' || roomId === 'null') {
        toast.error("Invalid booking link (missing room ID). Returning to rooms.");
        navigate('/rooms');
        return;
      }

      try {
        const roomData = await pb.collection('rooms').getOne(roomId, {
          $autoCancel: false
        });
        setRoom(roomData);

        const pricingData = await pb.collection('room_pricing').getFullList({ filter: `roomId="${roomId}"`, $autoCancel: false });
        
        if ((displayDuration === 'Couple Offer' || offerDetails)) {
          setBasePrice(COUPLE_OFFER_PRICE);
        } else {
          const matchingPrice = pricingData.find(p => p.duration === decodedHours);
          setBasePrice(matchingPrice ? matchingPrice.price : roomData.basePrice);
        }

      } catch (err) {
        console.error('Error fetching room:', err, err?.response, err?.data);
        const errMsg = err?.response?.data?.message || err?.data?.message || err?.message || 'Unknown error';
        toast.error(`Failed to load room details: ${errMsg}`);
        navigate('/rooms');
      } finally {
        setLoading(false);
      }
    };
    fetchRoomAndPricing();
  }, [roomId, decodedHours, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateBookingId = () => {
    const timestamp = Date.now().toString().slice(-6);
    return `KP${timestamp}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.date || !formData.time) {
      toast.error('Please fill all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const newBookingId = generateBookingId();
      const combinedDateTime = `${formData.date} ${formData.time}:00.000Z`;

      const bookingRecord = await pb.collection('bookings').create({
        bookingId: newBookingId,
        roomId: room.id,
        guestName: formData.name,
        guestPhone: formData.phone,
        checkInDate: combinedDateTime,
        duration: displayDuration,
        numberOfGuests: parseInt(formData.guests, 10),
        status: 'Pending',
        totalPrice: basePrice + (withBreakfast ? BREAKFAST_FEE : 0),
        breakfastSelected: withBreakfast
      }, { $autoCancel: false });

      toast.success('Booking requested successfully!');
      navigate(`/booking-confirmation/${bookingRecord.id}`, { state: { booking: bookingRecord, room } });

    } catch (err) {
      console.error('Booking submission error:', err, err?.response, err?.data);
      const errMsg = err?.response?.data?.message || err?.data?.message || err?.message || 'Unknown error';
      toast.error(`Failed to create booking: ${errMsg}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-10 w-32 mb-8" />
        <div className="grid lg:grid-cols-12 gap-8">
          <Skeleton className="lg:col-span-5 h-96 rounded-2xl" />
          <Skeleton className="lg:col-span-7 h-96 rounded-2xl" />
        </div>
      </div>
    );
  }
  if (!room) return null;

  return (
    <main className="min-h-screen bg-muted/20 py-12 lg:py-20">
      <Helmet>
        <title>Secure Checkout | Hotel Krishna Palace</title>
      </Helmet>

      <div className="container max-w-6xl mx-auto px-4 sm:px-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-8 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT: Room Summary */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="lg:col-span-5 space-y-6 lg:sticky lg:top-28"
          >
            <div className="bg-card rounded-3xl overflow-hidden border shadow-md">
              <div className="h-64 relative bg-muted">
                {room.image ? (
                  <img src={pb.files.getUrl(room, room.image)} alt={room.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-muted-foreground">No Image</div>
                )}
                <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold shadow-sm flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-primary" /> {displayDuration}
                </div>
              </div>
              
              <div className="p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-2">{room.name}</h2>
                <div className="flex items-center justify-between text-muted-foreground text-sm mb-6">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1.5" /> Max {room.capacity} Guests
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    className="bg-[hsl(var(--whatsapp))] hover:bg-[hsl(var(--whatsapp))/0.85] text-white rounded-full text-xs font-bold shadow px-3 h-8 gap-1.5"
                    onClick={() => window.open(`https://wa.me/917057998449?text=Hi!%20I'd%20like%20to%20book%20${encodeURIComponent(room.name)}%20for%20${encodeURIComponent(decodedHours)}.`, '_blank')}
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                  </Button>
                </div>
                
                <div className="space-y-3 text-sm border-t pt-6">
                  <div className="flex justify-between text-muted-foreground">
                    <span className="font-medium">Selected Duration</span>
                    <span className="font-bold text-foreground">{displayDuration}</span>
                  </div>
                  
                  {withBreakfast && (
                    <div className="flex justify-between text-muted-foreground animate-in fade-in slide-in-from-top-1">
                      <span className="font-medium flex items-center"><Utensils className="w-3.5 h-3.5 mr-1" /> Breakfast Add-on</span>
                      <span className="font-bold text-foreground">₹{BREAKFAST_FEE}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-4 border-t">
                    <span className="font-bold text-foreground text-lg">Total Price</span>
                    <span className="font-extrabold text-3xl text-primary flex items-center tracking-tight">
                      <IndianRupee className="w-5 h-5 mr-0.5" />{basePrice + (withBreakfast ? BREAKFAST_FEE : 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="lg:col-span-7"
          >
            <form onSubmit={handleSubmit} className="bg-card rounded-3xl border shadow-md p-6 md:p-10">
              <h2 className="text-2xl font-bold mb-8 text-foreground border-b pb-4">Guest Details</h2>
              
              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="name" className="text-foreground font-medium">Full Name *</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required placeholder="e.g. John Doe" className="h-12 bg-background text-foreground" />
                </div>
                
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="phone" className="text-foreground font-medium">Phone Number *</Label>
                  <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} required placeholder="10-digit number" className="h-12 bg-background text-foreground" />
                </div>

                <div className="grid grid-cols-2 gap-4 sm:gap-6 sm:col-span-2">
                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-foreground font-medium">Check-in Date *</Label>
                    <Input id="date" name="date" type="date" value={formData.date} onChange={handleInputChange} min={new Date().toISOString().split('T')[0]} required className="h-12 bg-background text-foreground" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time" className="text-foreground font-medium">Expected Time *</Label>
                    <Input id="time" name="time" type="time" value={formData.time} onChange={handleInputChange} required className="h-12 bg-background text-foreground" />
                  </div>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="guests" className="text-foreground font-medium">Number of Guests *</Label>
                  <Input id="guests" name="guests" type="number" min="1" max={room.capacity} value={formData.guests} onChange={handleInputChange} required className="h-12 bg-background text-foreground" />
                  <p className="text-xs text-muted-foreground mt-1">Maximum allowed for this room is {room.capacity}.</p>
                </div>

                <div className="sm:col-span-2 pt-4">
                  <div className="flex items-start space-x-3 p-5 rounded-2xl border-2 border-primary/10 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer group" onClick={() => setWithBreakfast(!withBreakfast)}>
                    <div
                      className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        withBreakfast ? 'bg-primary border-primary' : 'border-primary/50 bg-transparent'
                      }`}
                    >
                      {withBreakfast && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="breakfast" className="text-lg font-bold text-foreground cursor-pointer group-hover:text-primary transition-colors">
                        Add Breakfast Inclusion (+ ₹{BREAKFAST_FEE})
                      </Label>
                      <p className="text-sm text-muted-foreground font-medium">
                        Hot and fresh breakfast served to your room or at the restaurant.
                      </p>
                    </div>
                  </div>
                </div>

                {(displayDuration === 'Couple Offer' || offerDetails) && (
                   <div className="sm:col-span-2 p-5 rounded-2xl border-2 border-orange-500/20 bg-orange-500/5">
                      <h4 className="text-orange-600 font-bold flex items-center mb-1">
                        <Sparkles className="w-4 h-4 mr-2" /> Special Couple Bundle Active
                      </h4>
                      <p className="text-sm text-orange-700/80 font-medium italic">
                        Includes: {room.name} Stay + 1 Starter + 1 Cold Drink
                      </p>
                   </div>
                )}
              </div>

              <Button type="submit" size="lg" className="w-full h-14 text-lg font-bold transition-all active:scale-[0.98]" disabled={submitting}>
                {submitting ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : <CheckCircle2 className="w-5 h-5 mr-2" />}
                Confirm Booking
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </main>
  );
};

export default CheckoutPage;
