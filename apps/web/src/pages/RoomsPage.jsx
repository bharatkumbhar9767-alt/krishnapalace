import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { ChevronLeft, ChevronRight, Tag, ArrowRight, MessageCircle, Sparkles } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const WA_NUMBER = "917057998449";

// Shared offer card — same as used in HomePage
const OfferCard = ({ offer }) => {
  const navigate = useNavigate();
  const imageUrl = offer.image ? pb.files.getUrl(offer, offer.image) : null;

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-primary/30">
      {/* Dark image hero */}
      <div className="relative aspect-video bg-gradient-to-br from-teal-950 via-teal-800 to-teal-600 overflow-hidden">
        {imageUrl && (
          <img src={imageUrl} alt={offer.title} className="w-full h-full object-cover opacity-40" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-teal-950 via-teal-900/60 to-transparent" />

        <div className="absolute top-4 left-4 bg-white text-primary text-xs font-black px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> Special Offer
        </div>

        {offer.validTo && (
          <div className="absolute top-4 right-4 bg-black/60 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">
            Till {new Date(offer.validTo).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-white text-3xl font-extrabold leading-tight mb-1 drop-shadow">{offer.title}</h3>
          <p className="text-white/80 text-sm font-medium line-clamp-2">{offer.description}</p>
        </div>
      </div>

      {/* Price & CTA */}
      <div className="bg-gradient-to-br from-teal-950 to-teal-900 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-baseline gap-3 mb-1">
            {offer.price != null && offer.price !== '' && (
              <span className="text-4xl font-black text-white">₹{offer.price}</span>
            )}
            {offer.discountPercentage != null && offer.discountPercentage !== '' && (
              <span className="bg-teal-400/20 text-teal-300 text-base font-bold px-2 py-0.5 rounded-lg border border-teal-400/30">
                {offer.discountPercentage}% OFF
              </span>
            )}
          </div>
          <p className="text-teal-300 text-sm font-semibold">Special promotional offer</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button
            className="flex-1 sm:flex-none bg-white text-teal-900 hover:bg-teal-50 font-extrabold rounded-xl px-6 shadow-xl"
            onClick={() => navigate('/rooms')}
          >
            Book Now <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-xl border-[hsl(var(--whatsapp))] text-[hsl(var(--whatsapp))] bg-transparent hover:bg-[hsl(var(--whatsapp))/10] shrink-0"
            onClick={() => window.open(`https://wa.me/${WA_NUMBER}?text=Hi!%20I'm%20interested%20in%20the%20${encodeURIComponent(offer.title)}%20offer.`, '_blank')}
          >
            <MessageCircle className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// Combined Rooms + Offers slider
const RoomOfferSlider = ({ rooms, offers }) => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  const roomSlides = rooms.map(r => ({ type: 'room', data: r }));
  const offerSlides = offers.map(o => ({ type: 'offer', data: o }));
  const slides = [...roomSlides, ...offerSlides];

  const prev = () => setIndex(i => (i === 0 ? slides.length - 1 : i - 1));
  const next = () => setIndex(i => (i === slides.length - 1 ? 0 : i + 1));

  if (slides.length === 0) return null;
  const slide = slides[index];

  return (
    <div className="relative w-full">
      {slides.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 -translate-x-4 md:-translate-x-6 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white border shadow-xl flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all duration-200">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={next} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 translate-x-4 md:translate-x-6 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white border shadow-xl flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all duration-200">
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      <div className="w-full px-4 md:px-8">
        <AnimatePresence mode="wait">
          {slide.type === 'room' ? (
            <motion.div
              key={`room-${slide.data.id}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="bg-card rounded-3xl border shadow-md overflow-hidden"
            >
              <div
                className="aspect-video relative bg-muted overflow-hidden cursor-pointer group"
                onClick={() => navigate(`/room/${slide.data.id}`)}
              >
                {(slide.data.images?.length > 0 || slide.data.image) ? (
                  <img
                    src={pb.files.getUrl(slide.data, slide.data.images?.[0] || slide.data.image)}
                    alt={slide.data.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted/50">No Image</div>
                )}
                <div className="absolute top-4 right-4 bg-background/95 backdrop-blur-md px-3 py-1.5 rounded-full text-sm font-bold shadow text-primary">
                  ₹{slide.data.basePrice}/hr
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <span className="text-white font-bold text-lg">View Details →</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-extrabold text-foreground mb-2">{slide.data.name}</h3>
                <p className="text-muted-foreground text-sm mb-5 line-clamp-2">
                  {slide.data.description || 'Experience comfort and convenience in our thoughtfully designed room.'}
                </p>
                {slide.data.expand?.amenities?.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mb-5">
                    {slide.data.expand.amenities.slice(0, 4).map(a => (
                      <div key={a.id} className="flex items-center text-xs text-muted-foreground font-medium">
                        <span className="w-2 h-2 rounded-full bg-primary mr-2 shrink-0" />
                        {a.name}
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <span className="text-xs text-muted-foreground">Starting from</span>
                    <div className="text-2xl font-extrabold text-foreground">₹{slide.data.basePrice}</div>
                  </div>
                  <Button
                    onClick={() => navigate(`/room/${slide.data.id}`)}
                    className="bg-gradient-to-r from-primary to-teal-600 hover:opacity-90 text-white rounded-xl px-6 font-bold shadow"
                  >
                    Book Now <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={`offer-${slide.data.id}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <OfferCard offer={slide.data} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Dots */}
      {slides.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-5 flex-wrap">
          {slides.map((s, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`rounded-full transition-all duration-300 ${
                i === index
                  ? s.type === 'offer' ? 'w-6 h-2.5 bg-teal-500' : 'w-6 h-2.5 bg-primary'
                  : 'w-2.5 h-2.5 bg-muted-foreground/25 hover:bg-muted-foreground/50'
              }`}
            />
          ))}
        </div>
      )}

      <div className="text-center mt-2">
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
          slide.type === 'offer' ? 'bg-teal-100 text-teal-700' : 'bg-primary/10 text-primary'
        }`}>
          {slide.type === 'offer' ? '🏷️ Special Offer' : '🏨 Room'} {index + 1} / {slides.length}
        </span>
      </div>
    </div>
  );
};

const RoomsContent = () => {
  const [rooms, setRooms] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const roomsResult = await pb.collection('rooms').getFullList({
          sort: 'capacity',
          expand: 'amenities',
          $autoCancel: false
        });
        setRooms(roomsResult);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchOffers = async () => {
      try {
        const result = await pb.collection('offers').getFullList({
          sort: '-created', $autoCancel: false
        });
        setOffers(result.filter(o => o.active !== false));
      } catch {
        setOffers([]);
      }
    };

    fetchData();
    fetchOffers();
  }, []);

  if (loading) return <LoadingSpinner size="lg" className="min-h-[60vh]" />;

  return (
    <main className="min-h-screen bg-background py-16 lg:py-24">
      <Helmet>
        <title>Our Rooms | Hotel Krishna Palace</title>
      </Helmet>

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-foreground">Select Your Stay</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse our rooms and exclusive offers — all in one place. Use the arrows to explore.
          </p>
        </motion.div>

        {rooms.length === 0 && offers.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-2xl border">
            <h3 className="text-xl font-bold mb-2">No rooms available</h3>
            <p className="text-muted-foreground">Please check back later.</p>
          </div>
        ) : (
          <RoomOfferSlider rooms={rooms} offers={offers} />
        )}
      </div>
    </main>
  );
};

const RoomsPage = () => (
  <ErrorBoundary>
    <RoomsContent />
  </ErrorBoundary>
);

export default RoomsPage;
