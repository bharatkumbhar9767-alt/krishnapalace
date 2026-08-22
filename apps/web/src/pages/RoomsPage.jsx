import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { ChevronLeft, ChevronRight, Tag, ArrowRight, MessageCircle, Sparkles, Image as ImageIcon } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const WA_NUMBER = "917057998449";

// Shared offer card — same as used in HomePage

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
            Browse our premium rooms and suites. Use the arrows to explore. Use the arrows to explore.
          </p>
        </motion.div>

        {rooms.length === 0 && offers.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-2xl border">
            <h3 className="text-xl font-bold mb-2">No rooms available</h3>
            <p className="text-muted-foreground">Please check back later.</p>
          </div>
        ) : (
          <RoomSlider rooms={rooms} />
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
