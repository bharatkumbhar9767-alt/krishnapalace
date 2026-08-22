
import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import pb from '@/lib/pocketbaseClient';
import { Button } from '@/components/ui/button';
import { CheckCircle, Calendar, Clock, IndianRupee, MessageCircle, Home, Users, List } from 'lucide-react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

const BookingConfirmationPage = () => {
  const { bookingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(location.state?.booking || null);
  const [room, setRoom] = useState(location.state?.room || null);
  const [loading, setLoading] = useState(!booking);
  
  const waNumber = "917057998449";

  useEffect(() => {
    if (!booking) {
      const fetchBooking = async () => {
        if (!bookingId || bookingId === 'undefined') return;
        try {
          const record = await pb.collection('bookings').getOne(bookingId, { expand: 'roomId', $autoCancel: false });
          setBooking(record);
          if (record.expand?.roomId) setRoom(record.expand.roomId);
        } catch (err) {
          console.error(err);
          navigate('/');
        } finally {
          setLoading(false);
        }
      };
      fetchBooking();
    }
  }, [bookingId, booking, navigate]);

  const handleWhatsApp = () => {
    const message = `Hello, I have booked a room at Hotel Krishna Palace.
Booking ID: ${booking.bookingId}
Room: ${room?.name || 'Standard Room'}
Date: ${new Date(booking.checkInDate).toLocaleDateString()}
Time: ${new Date(booking.checkInDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
Duration: ${booking.duration}
Total: ₹${booking.totalPrice}

Please confirm my booking.`;

    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <Skeleton className="h-[600px] w-full max-w-2xl rounded-3xl" />
      </div>
    );
  }
  if (!booking) return null;

  return (
    <main className="min-h-screen bg-muted/20 flex items-center justify-center py-12 px-4">
      <Helmet>
        <title>Booking Confirmed | Hotel Krishna Palace</title>
      </Helmet>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="max-w-2xl w-full bg-card rounded-[2.5rem] border shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-primary p-8 md:p-10 text-center border-b">
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-5 shadow-xl"
          >
            <CheckCircle className="w-10 h-10 text-primary" />
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight">Booking Requested!</h1>
          <p className="text-primary-foreground/90 text-base font-medium mb-6">Your request has been received. Confirm via WhatsApp to secure your room.</p>
          
          {/* Booking Reference — prominent */}
          <div className="inline-flex flex-col items-center bg-white/15 p-4 rounded-2xl backdrop-blur-sm border border-white/25 mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-foreground/80 mb-1">Booking Reference</span>
            <div className="text-3xl font-black text-white tracking-widest drop-shadow-sm">
              {booking.bookingId}
            </div>
          </div>

          {/* WhatsApp CTA — RIGHT at the top, most prominent */}
          <Button 
            size="lg" 
            className="w-full h-14 text-lg font-bold bg-[hsl(var(--whatsapp))] hover:bg-[hsl(var(--whatsapp))/0.9] text-white shadow-xl shadow-black/20 transition-transform active:scale-[0.98] rounded-2xl border-none"
            onClick={handleWhatsApp}
          >
            <MessageCircle className="w-6 h-6 mr-2" />
            Confirm via WhatsApp
          </Button>
        </div>

        {/* Reservation Details */}
        <div className="p-8 md:p-10">
          <div className="flex justify-between items-center mb-6 pb-4 border-b">
            <h2 className="font-bold text-xl text-foreground">Reservation Details</h2>
            <span className="bg-amber-500/10 text-amber-600 border border-amber-200 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide">
              {booking.status}
            </span>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-y-7 gap-x-8 mb-8">
            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5"><Calendar className="w-4 h-4 text-primary"/>Check-in Date</span>
              <p className="font-extrabold text-xl text-foreground">{new Date(booking.checkInDate).toLocaleDateString()}</p>
            </div>
            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5"><Clock className="w-4 h-4 text-primary"/>Expected Time</span>
              <p className="font-extrabold text-xl text-foreground">{new Date(booking.checkInDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
            </div>
            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5"><Home className="w-4 h-4 text-primary"/>Room Type</span>
              <p className="font-extrabold text-xl text-foreground leading-snug">{room?.name || 'Selected Room'} <span className="text-primary text-sm font-bold ml-1 bg-primary/10 px-2 py-0.5 rounded-md align-middle">{booking.duration}</span></p>
            </div>
            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5"><Users className="w-4 h-4 text-primary"/>Guest Details</span>
              <p className="font-extrabold text-xl text-foreground leading-snug">{booking.guestName}</p>
              <p className="text-muted-foreground font-medium text-sm">{booking.guestPhone} • {booking.numberOfGuests} Guests</p>
            </div>
          </div>

          <div className="bg-muted/50 rounded-2xl p-5 mb-8 border border-border/50 flex justify-between items-center">
            <span className="font-bold text-xl text-foreground">Total Amount</span>
            <span className="font-black text-4xl text-primary flex items-center tracking-tight drop-shadow-sm">
              <IndianRupee className="w-7 h-7 mr-1" />{booking.totalPrice}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" variant="outline" className="flex-1 h-13 text-base font-bold border-2 transition-transform active:scale-[0.98] rounded-xl" onClick={() => navigate('/profile')}>
              <List className="w-5 h-5 mr-2" /> My Bookings
            </Button>
            <Button size="lg" variant="outline" className="flex-1 h-13 text-base font-bold border-2 transition-transform active:scale-[0.98] rounded-xl bg-muted/30" onClick={() => navigate('/rooms')}>
              <Home className="w-5 h-5 mr-2" /> Book Another
            </Button>
          </div>
        </div>
      </motion.div>
    </main>
  );
};

export default BookingConfirmationPage;
