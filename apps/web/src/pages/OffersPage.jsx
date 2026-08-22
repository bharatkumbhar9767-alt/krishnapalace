import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Tag, Clock, ArrowRight, MessageCircle } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';

const WA_NUMBER = "917057998449";

const OffersPage = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const result = await pb.collection('offers').getFullList({
          sort: '-created',
          $autoCancel: false,
        });
        setOffers(result.filter(o => o.active !== false));
      } catch (err) {
        console.error('Failed to fetch offers:', err);
        setOffers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <Helmet>
        <title>Special Offers | Hotel Krishna Palace</title>
        <meta name="description" content="Exclusive deals and special packages at Hotel Krishna Palace, Dehu Road." />
      </Helmet>

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/90 to-teal-800 py-20 px-4 text-white text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-1.5 text-sm font-bold mb-5 tracking-wide uppercase">
            <Tag className="w-4 h-4" /> Limited Time Deals
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Special Offers</h1>
          <p className="text-white/85 text-lg max-w-xl mx-auto font-medium">
            Handpicked deals crafted exclusively for you. Book now before they expire!
          </p>
        </motion.div>
      </section>

      {/* Offers Grid */}
      <section className="py-16 px-4">
        <div className="container max-w-6xl mx-auto">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-48 rounded-2xl" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : offers.length === 0 ? (
            <div className="text-center py-24 bg-muted/30 rounded-3xl border border-dashed">
              <Tag className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">No active offers right now</h2>
              <p className="text-muted-foreground mb-6">Check back soon for exciting deals!</p>
              <Button onClick={() => navigate('/rooms')}>Browse Rooms</Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offers.map((offer, idx) => (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className="bg-card rounded-3xl border shadow-md overflow-hidden flex flex-col group hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Image / Badge */}
                  <div className="relative aspect-[16/9] bg-gradient-to-br from-primary/20 to-teal-100 overflow-hidden">
                    {offer.image ? (
                      <img
                        src={pb.files.getUrl(offer, offer.image)}
                        alt={offer.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Tag className="w-12 h-12 text-primary/30" />
                      </div>
                    )}
                    {offer.badge && (
                      <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-black px-3 py-1 rounded-full shadow">
                        {offer.badge}
                      </div>
                    )}
                    {offer.validUntil && (
                      <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs font-medium px-2 py-1 rounded-lg backdrop-blur-sm flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Till {new Date(offer.validUntil).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h2 className="text-xl font-extrabold mb-2 text-foreground group-hover:text-primary transition-colors">{offer.title}</h2>
                    <p className="text-muted-foreground text-sm font-medium mb-4 flex-grow line-clamp-3">{offer.description}</p>

                    {offer.price && (
                      <div className="flex items-baseline gap-1 mb-4">
                        <span className="text-3xl font-black text-primary">₹{offer.price}</span>
                        {offer.originalPrice && (
                          <span className="text-muted-foreground line-through text-sm ml-1">₹{offer.originalPrice}</span>
                        )}
                      </div>
                    )}

                    <div className="flex gap-3 mt-auto">
                      <Button
                        className="flex-1 rounded-xl font-bold"
                        onClick={() => navigate('/rooms')}
                      >
                        Book Now <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-xl border-[hsl(var(--whatsapp))] text-[hsl(var(--whatsapp))] hover:bg-[hsl(var(--whatsapp))/10]"
                        onClick={() => window.open(`https://wa.me/${WA_NUMBER}?text=Hi!%20I'm%20interested%20in%20the%20${encodeURIComponent(offer.title)}%20offer.`, '_blank')}
                      >
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default OffersPage;
