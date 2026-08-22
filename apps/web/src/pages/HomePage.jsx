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
const RoomOfferSlider = ({ rooms, offers }) => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  // Build combined slides: each room card, then each active offer as a special card
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
            // ── Normal Room Card ──────────────────────────────────────────
            <motion.div
              key={`room-${slide.data.id}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="bg-card rounded-3xl border shadow-md overflow-hidden"
            >
              {/* Image */}
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
              {/* Content */}
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
            // ── Special Offer Card ────────────────────────────────────────
            <motion.div
              key={`offer-${slide.data.id}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-primary/30"
            >
              {/* Gradient background + image */}
              <div className="relative aspect-video bg-gradient-to-br from-teal-950 via-teal-800 to-teal-600 overflow-hidden">
                {slide.data.image && (
                  <img
                    src={pb.files.getUrl(slide.data, slide.data.image)}
                    alt={slide.data.title}
                    className="w-full h-full object-cover opacity-40"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-teal-950 via-teal-900/60 to-transparent" />

                {/* Badge */}
                <div className="absolute top-4 left-4 bg-white text-primary text-xs font-black px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> {slide.data.badge || '🔥 Special Offer'}
                </div>

                {/* Valid Until */}
                {slide.data.validTo && (
                  <div className="absolute top-4 right-4 bg-black/60 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">
                    Till {new Date(slide.data.validTo).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </div>
                )}

                {/* Offer Title over image */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-3xl font-extrabold leading-tight mb-1 drop-shadow">{slide.data.title}</h3>
                  <p className="text-white/80 text-sm font-medium line-clamp-2">{slide.data.description}</p>
                </div>
              </div>

              {/* Offer Details */}
              <div className="bg-gradient-to-br from-teal-950 to-teal-900 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-baseline gap-3 mb-1">
                    {slide.data.price != null && slide.data.price !== '' && (
                      <span className="text-4xl font-black text-white">₹{slide.data.price}</span>
                    )}
                    {slide.data.discountPercentage != null && slide.data.discountPercentage !== '' && (
                      <span className="bg-teal-400/20 text-teal-300 text-base font-bold px-2 py-0.5 rounded-lg border border-teal-400/30">
                        {slide.data.discountPercentage}% OFF
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
                    className="rounded-xl border-[hsl(var(--whatsapp))] text-[hsl(var(--whatsapp))] bg-transparent hover:bg-[hsl(var(--whatsapp))/10]"
                    onClick={() => window.open(`https://wa.me/${WA_NUMBER}?text=Hi!%20I'm%20interested%20in%20${encodeURIComponent(slide.data.title)}.`, '_blank')}
                  >
                    <MessageCircle className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Dot indicators with type labels */}
      {slides.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-5 flex-wrap">
          {slides.map((s, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              title={s.type === 'offer' ? `Offer: ${s.data.title}` : s.data.name}
              className={`rounded-full transition-all duration-300 ${
                i === index
                  ? s.type === 'offer' ? 'w-6 h-2.5 bg-teal-500' : 'w-6 h-2.5 bg-primary'
                  : 'w-2.5 h-2.5 bg-muted-foreground/25 hover:bg-muted-foreground/50'
              }`}
            />
          ))}
        </div>
      )}

      {/* Slide type indicator */}
      <div className="text-center mt-2">
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
          slide.type === 'offer'
            ? 'bg-teal-100 text-teal-700'
            : 'bg-primary/10 text-primary'
        }`}>
          {slide.type === 'offer' ? '🏷️ Special Offer' : '🏨 Room'} {index + 1} / {slides.length}
        </span>
      </div>
    </div>
  );
};

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
            <RoomOfferSlider rooms={featuredRooms} offers={offers} />
          )}
        </div>
      </section>

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