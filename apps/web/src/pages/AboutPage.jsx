
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, IndianRupee, Sparkles, Sparkle, Headphones as Headset, Users, Wifi, CarFront, Clock, Wind, Droplets, Utensils, MessageCircle, Plane, Train, Map } from 'lucide-react';

const AboutPage = () => {
  const navigate = useNavigate();
  const waNumber = "917057998449";

  const benefits = [
    { icon: MapPin, title: "Best Location", desc: "Conveniently situated in Dehu Road with easy access to major transit points and local attractions." },
    { icon: IndianRupee, title: "Affordable Pricing", desc: "Premium comfort that doesn't break the bank, featuring flexible hourly and overnight rates." },
    { icon: Sparkles, title: "Quality Service", desc: "Uncompromising standards in hospitality to ensure your stay is comfortable and hassle-free." },
    { icon: Sparkle, title: "Clean Rooms", desc: "Immaculate, sanitized, and well-maintained accommodations for your peace of mind." },
    { icon: Headset, title: "24/7 Support", desc: "Round-the-clock front desk and room service to cater to your needs at any hour. We offer full in-room dining services." },
    { icon: Utensils, title: "Restaurant Backup", desc: "We have an excellent restaurant backup to ensure you always have access to delicious meals and drinks during your stay." },
    { icon: Users, title: "Friendly Staff", desc: "A dedicated team committed to making you feel at home with warm, personalized service." }
  ];

  const amenities = [
    { icon: Wifi, title: "Free WiFi" },
    { icon: CarFront, title: "Parking" },
    { icon: Clock, title: "24/7 Check-in" },
    { icon: Wind, title: "AC Rooms" },
    { icon: Droplets, title: "Hot Water" },
    { icon: Utensils, title: "Room Service" }
  ];

  const connectivity = [
    { icon: Plane, title: "Pune International Airport", distance: "~30 km" },
    { icon: Map, title: "Pune-Mumbai Expressway", distance: "~5 km" },
    { icon: MapPin, title: "Pune-Bengaluru Highway", distance: "~2 km" },
    { icon: Train, title: "Dehu Road Railway Station", distance: "~1 km" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <main className="min-h-screen bg-background">
      <Helmet>
        <title>About Us | Hotel Krishna Palace</title>
      </Helmet>

      {/* Header Section */}
      <section className="relative py-24 md:py-32 bg-[#8B5A2B] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-20 mix-blend-overlay pointer-events-none" />
        <div className="container relative z-10 px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-block px-4 py-1.5 rounded-full bg-white/20 border border-white/30 text-white font-bold text-sm mb-6 tracking-widest uppercase backdrop-blur-md">
              📍 Dehu Road's Most Trusted Stay
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight text-balance">
              Couple Friendly Hotel <br className="hidden md:block"/> Krishna Palace
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto font-medium mb-10 text-balance">
              Redefining hospitality in Dehu Road. We provide a safe, private, and premium environment for couples and travelers alike.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg rounded-full bg-white text-[#8B5A2B] hover:bg-orange-50 shadow-lg transition-transform active:scale-95" onClick={() => navigate('/rooms')}>
                Book Your Stay
              </Button>
              <Button 
                size="lg" 
                className="w-full sm:w-auto h-14 px-8 text-lg font-bold rounded-full bg-[hsl(var(--whatsapp))] hover:bg-[hsl(var(--whatsapp))/0.9] text-white shadow-lg transition-transform active:scale-95 border-none" 
                onClick={() => window.open(`https://wa.me/${waNumber}`, '_blank')}
              >
                <MessageCircle className="w-5 h-5 mr-2" /> Chat on WhatsApp
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container max-w-4xl mx-auto px-4">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="space-y-6 text-lg text-muted-foreground leading-relaxed"
          >
            <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
              Our Story
            </motion.h2>
            <motion.p variants={itemVariants}>
              Established with a vision to provide exceptional comfort and convenience, Hotel Krishna Palace has grown to become a preferred choice for travelers in Pune and Dehu Road. We understand that whether you are traveling for business, pilgrimage, or leisure, your accommodation plays a crucial role in your overall experience.
            </motion.p>
            <motion.p variants={itemVariants}>
              Our mission is to seamlessly blend modern amenities with authentic Indian hospitality. We recognized the need for flexible accommodations in our bustling city, which is why we pioneered flexible hourly booking options alongside traditional overnight stays, ensuring our guests only pay for the time they truly need.
            </motion.p>
            <motion.p variants={itemVariants}>
              Driven by our core values of integrity, cleanliness, and guest satisfaction, every team member at Krishna Palace is dedicated to creating a welcoming sanctuary. We continually invest in upgrading our facilities and training our staff to exceed your expectations.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Connectivity & Accessibility Section */}
      <section className="py-24 bg-muted/30 border-y">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Connectivity & Accessibility</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Strategically located to keep you connected to major transit routes and destinations.
            </p>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {connectivity.map((item, idx) => (
              <motion.div 
                key={idx} 
                variants={itemVariants}
                className="bg-card p-6 rounded-2xl border shadow-sm card-hover-effect flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-5">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-base font-bold mb-2 text-foreground leading-snug">{item.title}</h3>
                <p className="text-xl font-extrabold text-primary mt-auto">{item.distance}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-background">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Us</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Experience the perfect blend of comfort, convenience, and value.
            </p>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {benefits.map((benefit, idx) => (
              <motion.div key={idx} variants={itemVariants}>
                <Card className="h-full border-border shadow-sm card-hover-effect overflow-hidden rounded-2xl">
                  <CardContent className="p-8 flex flex-col h-full">
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 shrink-0">
                      <benefit.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-foreground">{benefit.title}</h3>
                    <p className="text-muted-foreground leading-relaxed flex-grow">{benefit.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Amenities Showcase */}
      <section className="py-24 bg-muted/30 border-t">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Thoughtfully curated amenities to enhance your stay with us.
            </p>
          </div>

          <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {amenities.map((amenity, idx) => (
              <motion.div key={idx} variants={itemVariants}>
                <Card className="border shadow-sm card-hover-effect rounded-2xl h-full flex flex-col items-center justify-center p-6 text-center">
                  <amenity.icon className="w-8 h-8 text-primary mb-3" />
                  <span className="font-semibold text-foreground">{amenity.title}</span>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

    </main>
  );
};

export default AboutPage;
