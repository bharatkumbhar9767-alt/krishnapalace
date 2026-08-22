import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Wifi, CarFront, Clock, Wind, Droplets, Utensils, MessageCircle, ChevronLeft, ChevronRight, Tag, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import pb from '@/lib/pocketbaseClient';
import { Skeleton } from '@/components/ui/skeleton';
import ReadyToBookSection from '@/components/ReadyToBookSection';

const WA_NUMBER = "917057998449";

const amenities = [
  { icon: Wifi, title: "Free WiFi", desc: "High-speed internet access." },
  { icon: CarFront, title: "Parking", desc: "Secure parking space." },
  { icon: Clock, title: "24/7 Check-in", desc: "Round-the-clock reception." },
  { icon: Wind, title: "AC Rooms", desc: "Climate-controlled comfort." },
  { icon: Droplets, title: "Hot Water", desc: "24/7 hot water supply." },
  { icon: Utensils, title: "Room Service", desc: "In-room dining available." }
];

// ─── Combined Room + Offer Card ────────────────────────────────────────────
const RoomSlider = ({ rooms }) => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  const slides = rooms.map(r => ({ type: 'room', data: r }));
  const prev = () => setIndex(i => (i === 0 ? slides.length - 1 : i - 1));
  const next = () => setIndex(i => (i === slides.length - 1 ? 0 : i + 1));

  if (slides.length === 0) return null;
  const slide = slides[index];

  return (
    <div className="relative w-full">
      {/* Navigation Buttons */}
      <div className="absolute inset-y-0 -left-4 md:-left-12 flex items-center z-10 pointer-events-none">
        <button onClick={prev} className="pointer-events-auto bg-white/80 hover:bg-white text-primary p-3 rounded-full shadow-lg backdrop-blur-sm transition-all hover:scale-110 active:scale-95 border border-primary/10">
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>
      <div className="absolute inset-y-0 -right-4 md:-right-12 flex items-center z-10 pointer-events-none">
        <button onClick={next} className="pointer-events-auto bg-white/80 hover:bg-white text-primary p-3 rounded-full shadow-lg backdrop-blur-sm transition-all hover:scale-110 active:scale-95 border border-primary/10">
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <div className="overflow-hidden rounded-3xl pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.data.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="relative rounded-3xl overflow-hidden shadow-2xl bg-white border border-border/50 flex flex-col md:flex-row group"
          >
            {/* Image */}
            <div className="w-full md:w-3/5 h-64 md:h-[450px] relative overflow-hidden bg-muted">
              {slide.data.image ? (
                <img
                  src={pb.files.getUrl(slide.data, slide.data.image)}
                  alt={slide.data.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground"><ImageIcon className="w-12 h-12 opacity-20"/></div>
              )}
              
              <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold shadow-sm flex items-center">
                <Users className="w-4 h-4 mr-2 text-primary" /> Max {slide.data.capacity} Guests
              </div>
            </div>

            {/* Content */}
            <div className="w-full md:w-2/5 p-8 md:p-10 flex flex-col justify-between">
              <div>
                <h3 className="text-3xl font-extrabold mb-3 leading-tight text-foreground">{slide.data.name}</h3>
                <p className="text-muted-foreground line-clamp-3 mb-6 text-base">{slide.data.description}</p>
                
                {slide.data.expand?.amenities && (
                  <div className="flex flex-wrap gap-2 mb-8">
                    {slide.data.expand.amenities.slice(0, 4).map(am => (
                      <span key={am.id} className="text-xs font-semibold bg-primary/10 text-primary px-3 py-1.5 rounded-full flex items-center">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> {am.name}
                      </span>
                    ))}
                    {slide.data.expand.amenities.length > 4 && (
                      <span className="text-xs font-semibold bg-muted text-muted-foreground px-3 py-1.5 rounded-full flex items-center">
                        +{slide.data.expand.amenities.length - 4} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-5 mt-auto">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">Starting from</p>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-black text-primary tracking-tight">₹{slide.data.basePrice}</span>
                    <span className="text-muted-foreground ml-2 font-medium">/ hour</span>
                  </div>
                </div>

                <Button 
                  className="w-full h-14 text-lg bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 text-white rounded-xl font-bold shadow-lg shadow-primary/25"
                  onClick={() => navigate(`/room/${slide.data.id}`)}
                >
                  Book Now <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Dots Indicator */}
      {slides.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {slides.map((s, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`rounded-full transition-all duration-300 ${
                i === index ? 'w-8 h-2.5 bg-primary' : 'w-2.5 h-2.5 bg-muted-foreground/25 hover:bg-muted-foreground/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const HomePage = () => {
  const navigate = useNavigate();
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [exploreCards, setExploreCards] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingExplore, setLoadingExplore] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const result = await pb.collection('rooms').getList(1, 3, {
          expand: 'amenities', sort: 'capacity', $autoCancel: false
        });
        setFeaturedRooms(result.items);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      } finally {
        setLoadingRooms(false);
      }
    };

    const fetchExplore = async () => {
      try {
        const result = await pb.collection('explore_dehu').getList(1, 9, {
          sort: '-created', $autoCancel: false
        });
        setExploreCards(result.items);
      } catch (error) {
        console.error('Error fetching explore:', error);
      } finally {
        setLoadingExplore(false);
      }
    };

    const fetchOffers = async () => {
      try {
        const result = await pb.collection('offers').getFullList({
          sort: '-created', $autoCancel: false,
        });
        setOffers(result.filter(o => o.active !== false));
      } catch {
        setOffers([]);
      }
    };

    fetchRooms();
    fetchExplore();
    fetchOffers();
  }, []);

  return (
    <main className="flex flex-col min-h-screen">
      <Helmet>
        <title>Couple Friendly Hotel in Dehu Road | Hotel Krishna Palace</title>
        <meta name="description" content="Hotel Krishna Palace - The most preferred Couple Friendly Hotel in Dehu Road. Safe, secure, and luxury stays with flexible hourly rates." />
      </Helmet>

      {/* HERO */}
      <section className="relative min-h-[85dvh] flex items-center justify-center bg-gradient-to-br from-teal-950 via-teal-900 to-teal-800 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-30 mix-blend-overlay pointer-events-none" />
        <div className="container relative z-10 max-w-4xl mx-auto px-4 text-center mt-12 md:mt-0">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-block px-4 py-1.5 rounded-full bg-teal-400/20 border border-teal-400/30 text-teal-300 font-bold text-sm mb-6 tracking-widest uppercase">
              ✨ Best Couple Friendly Hotel in Dehu Road
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight text-balance tracking-tight">
              Welcome to <span className="text-teal-300">Hotel Krishna Palace</span>
            </h1>
            <p className="text-lg md:text-xl text-white mb-10 max-w-2xl mx-auto font-medium text-balance opacity-95">
              Experience Comfort, Privacy &amp; Luxury. The perfect space for your stay with flexible hourly packages.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="w-full sm:w-auto h-16 px-10 text-xl font-bold rounded-full bg-white text-teal-900 hover:bg-teal-50 shadow-2xl transition-transform active:scale-[0.98]" onClick={() => navigate('/rooms')}>
                Book Your Stay
              </Button>
              <Button size="lg" className="w-full sm:w-auto h-16 px-10 text-xl font-bold rounded-full bg-[hsl(var(--whatsapp))] hover:bg-[hsl(var(--whatsapp))/0.9] text-white shadow-2xl transition-transform active:scale-[0.98] border-none" onClick={() => window.open(`https://wa.me/${WA_NUMBER}`, '_blank')}>
                <MessageCircle className="w-6 h-6 mr-3" /> Chat on WhatsApp
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURED ROOMS + OFFERS COMBINED */}
      <section className="py-24 bg-background">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">Select Your Stay</h2>
            <p className="text-muted-foreground text-lg font-medium">Browse rooms & exclusive offers — all in one place.</p>
          </div>
          {loadingRooms ? (
            <div className="space-y-4">
              <Skeleton className="h-64 w-full rounded-3xl" />
              <Skeleton className="h-8 w-2/3 mx-auto" />
            </div>
          ) : (
            <RoomSlider rooms={featuredRooms} />
          )}
        </div>
      </section>

      {/* EXCLUSIVE OFFERS */}
        {offers.length > 0 && (
          <section className="py-24 bg-gradient-to-br from-teal-950 via-teal-900 to-teal-800 text-white overflow-hidden relative">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
            <div className="container max-w-7xl mx-auto px-4 relative z-10">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight flex items-center justify-center"><Sparkles className="w-8 h-8 mr-3 text-teal-300" /> Exclusive Offers</h2>
                <p className="text-teal-100/80 text-lg font-medium">Special packages and limited time deals curated just for you.</p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {offers.map(offer => (
                  <div key={offer.id} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col group hover:-translate-y-2 transition-transform duration-300">
                    <div className="relative aspect-video overflow-hidden">
                      {offer.image ? (
                        <img src={pb.files.getUrl(offer, offer.image)} alt={offer.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full bg-teal-950/50"><Tag className="w-10 h-10 text-white/30" /></div>
                      )}
                      
                      {offer.badge && (
                        <div className="absolute top-4 left-4 bg-teal-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg">
                          {offer.badge}
                        </div>
                      )}
                    </div>
                    
                    <div className="p-8 flex flex-col flex-grow">
                      <h3 className="text-2xl font-bold mb-3">{offer.title}</h3>
                      <p className="text-teal-100/70 text-sm mb-6 flex-grow">{offer.description}</p>
                      
                      <div className="flex items-end justify-between mt-auto pt-6 border-t border-white/10">
                        <div>
                          {offer.originalPrice && <span className="text-teal-100/50 line-through text-sm block mb-1">₹{offer.originalPrice}</span>}
                          {offer.price && <span className="text-3xl font-black text-teal-300">₹{offer.price}</span>}
                        </div>
                        <Button 
                          className="bg-white text-teal-900 hover:bg-teal-50 font-bold rounded-xl px-6"
                          onClick={() => {
                            if (offer.roomId) {
                              navigate(`/checkout/${offer.roomId}/${offer.id}?type=offer`);
                            } else {
                              navigate('/rooms');
                            }
                          }}
                        >
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* AMENITIES */}
      <section className="py-24 bg-muted/30">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">Our Amenities</h2>
            <p className="text-muted-foreground text-lg font-medium">Everything you need for a perfect stay.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            {amenities.map((item, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.05 }}
                className="bg-card p-6 md:p-8 rounded-[2rem] border shadow-sm card-hover-effect flex flex-col items-center text-center">
                <div className="bg-primary w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-lg">
                  <item.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground font-medium">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* EXPLORE DEHU */}
      <section className="py-24 bg-background">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">Explore Dehu</h2>
            <p className="text-muted-foreground text-lg font-medium">Discover the beauty surrounding our hotel.</p>
          </div>
          {loadingExplore ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="aspect-square rounded-3xl" />)}
            </div>
          ) : exploreCards.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {exploreCards.map((card) => (
                <motion.div key={card.id} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                  className="aspect-square rounded-3xl overflow-hidden group relative shadow-md card-hover-effect cursor-pointer">
                  {card.image ? <img src={pb.files.getUrl(card, card.image)} alt={card.title} className="w-full h-full object-cover zoomHover" />
                    : <div className="w-full h-full bg-muted flex items-center justify-center">No Image</div>}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 md:p-8">
                    <h3 className="text-white font-extrabold text-xl md:text-3xl mb-1 leading-tight">{card.title}</h3>
                    <p className="text-white/80 text-sm md:text-base font-medium line-clamp-3">{card.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : <p className="text-center text-muted-foreground font-medium">No attractions added yet.</p>}
        </div>
      </section>

      <ReadyToBookSection />
    </main>
  );
};

export default HomePage;