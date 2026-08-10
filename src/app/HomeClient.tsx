"use client";

import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { MapPin, Calendar, Users, Star, Wifi, Coffee, Car, Shield, ChevronRight } from "lucide-react";
import { motion, Variants } from "framer-motion";

export default function HomeClient({ testimonials, featuredRooms }: { testimonials: any[], featuredRooms: any[] }) {
  
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 md:pt-32 md:pb-48 overflow-hidden bg-gray-900">
        <motion.div 
          className="absolute inset-0 z-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <Image
            src="https://images.unsplash.com/photo-1542314831-c53cd4b85d0b?q=80&w=2070&auto=format&fit=crop"
            alt="Krishna Palace Hotel Background"
            fill
            className="object-cover opacity-60 mix-blend-overlay"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/40 via-transparent to-gray-900/80"></div>
        </motion.div>
        
        <div className="relative z-10 container px-4 md:px-6">
          <div className="max-w-4xl mx-auto space-y-8 mt-12">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="text-center space-y-4"
            >
              <motion.div variants={fadeInUp} className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-semibold tracking-wider uppercase mb-2">
                A Premium Stay Experience
              </motion.div>
              <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-lg leading-tight">
                Welcome to Krishna Palace
                <span className="block text-2xl md:text-4xl mt-2 text-primary drop-shadow-md font-bold">Dehuroad, Pune</span>
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto drop-shadow-md">
                Experience unparalleled comfort and luxury in the heart of Pune. Your perfect getaway begins right here.
              </motion.p>
            </motion.div>
            
            {/* Search Bar Widget (Glassmorphism) */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="bg-white/95 backdrop-blur-xl rounded-2xl p-3 md:p-4 flex flex-col md:flex-row items-center gap-3 shadow-2xl mt-12 border border-white/40 max-w-5xl mx-auto"
            >
              <div className="flex-1 flex items-center bg-gray-50 border border-gray-200 rounded-xl w-full md:w-auto px-4 py-3 hover:bg-white transition-colors cursor-default">
                <MapPin className="text-primary w-5 h-5 mr-3 shrink-0" />
                <div className="flex flex-col w-full">
                  <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Location</span>
                  <input 
                    type="text" 
                    className="w-full outline-none text-gray-900 font-bold bg-transparent cursor-default"
                    value="Krishna Palace, Dehuroad"
                    readOnly
                  />
                </div>
              </div>
              
              <div className="flex-1 flex items-center bg-gray-50 border border-gray-200 rounded-xl w-full md:w-auto px-4 py-3 cursor-pointer hover:bg-white hover:border-primary/50 transition-colors">
                <Calendar className="text-primary w-5 h-5 mr-3 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Check In - Check Out</span>
                  <span className="text-gray-900 font-bold truncate">Select Dates</span>
                </div>
              </div>
              
              <div className="flex-1 flex items-center bg-gray-50 border border-gray-200 rounded-xl w-full md:w-auto px-4 py-3 cursor-pointer hover:bg-white hover:border-primary/50 transition-colors">
                <Users className="text-primary w-5 h-5 mr-3 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Rooms & Guests</span>
                  <span className="text-gray-900 font-bold truncate">1 Room, 2 Guests</span>
                </div>
              </div>

              <Link 
                href="/rooms"
                className="w-full md:w-auto px-8 py-4 bg-primary hover:bg-primary/90 text-white font-bold text-lg rounded-xl shrink-0 transition-all flex items-center justify-center shadow-lg hover:shadow-primary/30"
              >
                Search Rooms
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us / Amenities */}
      <section className="py-20 bg-white relative z-20 -mt-10 rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        <div className="container px-4 md:px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
              Premium Amenities for a Perfect Stay
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-600 text-lg">
              We go above and beyond to ensure your comfort, providing world-class facilities and impeccable service round the clock.
            </motion.p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { icon: <Wifi className="w-8 h-8" />, title: "High-Speed Wi-Fi", desc: "Stay connected always" },
              { icon: <Coffee className="w-8 h-8" />, title: "Free Breakfast", desc: "Start your day right" },
              { icon: <Car className="w-8 h-8" />, title: "Free Parking", desc: "Secure & spacious" },
              { icon: <Shield className="w-8 h-8" />, title: "24/7 Security", desc: "Safe and secure stay" }
            ].map((amenity, idx) => (
              <motion.div key={idx} variants={fadeInUp} className="flex flex-col items-center text-center group cursor-default">
                <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-sm border border-gray-100">
                  {amenity.icon}
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">{amenity.title}</h3>
                <p className="text-gray-500 text-sm">{amenity.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="py-24 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="max-w-2xl"
            >
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">Our Luxurious Rooms</h2>
              <p className="text-gray-600 text-lg">Designed for maximum comfort, blending modern aesthetics with ultimate relaxation.</p>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <Link href="/rooms" className="inline-flex items-center text-primary font-bold hover:text-primary/80 transition-colors">
                View All Rooms <ChevronRight className="w-5 h-5 ml-1" />
              </Link>
            </motion.div>
          </div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {featuredRooms.map((room) => (
              <motion.div key={room.id} variants={fadeInUp} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col">
                <div className="h-64 bg-gray-200 relative overflow-hidden">
                   <Image 
                    src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=800" 
                    alt={room.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                   />
                   <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold text-gray-900 shadow-sm">
                     Up to {room.capacity} Guests
                   </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="font-extrabold text-2xl mb-2 text-gray-900">{room.name}</h3>
                  <p className="text-gray-500 text-sm mb-6 line-clamp-2 flex-grow">{room.description}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-6 font-medium">
                    <span className="flex items-center gap-1"><Wifi className="w-3.5 h-3.5"/> Free Wi-Fi</span>
                    <span className="flex items-center gap-1"><Coffee className="w-3.5 h-3.5"/> Breakfast</span>
                  </div>

                  <div className="flex justify-between items-end border-t border-gray-100 pt-4 mt-auto">
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Starting from</p>
                      <span className="font-extrabold text-2xl text-gray-900">${room.basePrice.toString()}</span>
                      <span className="text-gray-500 text-sm">/night</span>
                    </div>
                    <Link 
                      href="/rooms" 
                      className="bg-gray-900 hover:bg-primary text-white font-bold py-2.5 px-6 rounded-lg transition-colors text-sm shadow-sm"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          {featuredRooms.length === 0 && (
            <p className="text-center text-gray-500 py-12 bg-white rounded-xl border border-gray-100 mt-8">No rooms featured currently.</p>
          )}
        </div>
      </section>

      {/* Promotional Banners Section */}
      <section className="py-20 bg-white">
        <div className="container px-4 md:px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <motion.div variants={fadeInUp}>
              <Link href="/rooms" className="group rounded-3xl overflow-hidden shadow-lg block relative hover:shadow-2xl transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1ab64f] to-[#149b42] opacity-90 group-hover:scale-105 transition-transform duration-700" />
                <div className="relative p-10 flex flex-col justify-between h-full min-h-[280px] z-10 text-white">
                  <div>
                    <div className="bg-white/20 inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-4 backdrop-blur-sm border border-white/20">Special Offer</div>
                    <h3 className="text-4xl font-extrabold tracking-tight mb-2">FLAT 50% OFF</h3>
                    <p className="text-white/90 font-medium text-lg max-w-[200px]">On your first booking with Krishna Palace.</p>
                  </div>
                  <div className="mt-8 inline-block bg-white text-[#1ab64f] px-6 py-3 rounded-xl font-bold shadow-sm w-max group-hover:bg-gray-50 transition-colors">
                    USE CODE: WELCOME50
                  </div>
                  <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
                </div>
              </Link>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Link href="/rooms" className="group rounded-3xl overflow-hidden shadow-lg block relative hover:shadow-2xl transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 opacity-95 group-hover:scale-105 transition-transform duration-700" />
                <div className="relative p-10 flex flex-col justify-between h-full min-h-[280px] z-10 text-white">
                  <div>
                    <div className="bg-white/10 inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-4 backdrop-blur-sm border border-white/10">Premium Perks</div>
                    <h3 className="text-4xl font-extrabold tracking-tight mb-2">FREE BREAKFAST</h3>
                    <p className="text-gray-300 font-medium text-lg max-w-[220px]">Valid on all premium room bookings this month.</p>
                  </div>
                  <div className="mt-8 inline-block bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-sm w-max group-hover:bg-primary/90 transition-colors">
                    BOOK PREMIUM
                  </div>
                  <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-primary/20 rounded-full blur-2xl"></div>
                </div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gray-50">
        <div className="container px-4 md:px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
              Loved by Our Guests
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-600 text-lg">
              Don't just take our word for it. Read what our recent visitors have to say about their stay.
            </motion.p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonials.map((test) => (
              <motion.div key={test.id} variants={fadeInUp} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative">
                <div className="absolute -top-4 -left-2 text-6xl text-gray-200 font-serif leading-none opacity-50">"</div>
                <div className="flex gap-1 text-[#f5a623] mb-6 relative z-10">
                  {[...Array(test.rating)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                </div>
                <p className="text-gray-700 italic mb-8 relative z-10 leading-relaxed min-h-[80px]">"{test.content}"</p>
                <div className="flex items-center gap-4 relative z-10 border-t border-gray-50 pt-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {test.authorName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{test.authorName}</p>
                    <p className="text-xs text-gray-500">Verified Guest</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          {testimonials.length === 0 && (
            <p className="text-center text-gray-500 bg-white py-12 rounded-2xl border border-gray-100 mt-8">No testimonials yet.</p>
          )}
        </div>
      </section>
      
      {/* Footer Banner */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 pattern-dots"></div>
        <div className="container px-4 md:px-6 relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="bg-gray-900 text-white rounded-3xl p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
            
            <div className="space-y-6 max-w-2xl text-center md:text-left relative z-10">
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">Become a Krishna Palace Member</h2>
              <p className="text-gray-300 text-lg md:text-xl">
                Join our premium membership program and get exclusive benefits, flat discounts, and free room upgrades.
              </p>
            </div>
            <div className="relative z-10 shrink-0">
              <Link 
                href="/login" 
                className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-white font-bold px-10 py-5 rounded-xl shadow-lg transition-transform hover:scale-105"
              >
                Join Now for Free
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
