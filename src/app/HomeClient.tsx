"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { MapPin, Calendar, Users, Star, Wifi, Coffee, Car, Shield, ChevronRight, ChevronLeft, MessageCircle, CheckCircle2 } from "lucide-react";
import { motion, Variants } from "framer-motion";

const RoomSlider = ({ rooms, fadeInUp }: { rooms: any[], fadeInUp: Variants }) => {
  const [index, setIndex] = useState(0);
  const prev = () => setIndex(i => (i === 0 ? rooms.length - 1 : i - 1));
  const next = () => setIndex(i => (i === rooms.length - 1 ? 0 : i + 1));

  if (rooms.length === 0) return null;
  const room = rooms[index];

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {rooms.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 -translate-x-2 md:-translate-x-6 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white border shadow-xl flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all duration-200">
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <button onClick={next} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 translate-x-2 md:translate-x-6 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white border shadow-xl flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all duration-200">
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </>
      )}

      <motion.div
        key={room.id}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full pb-3 px-4 md:px-8"
      >
        <div className="group bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 flex flex-col md:flex-row">
          <div className="md:w-1/2 h-72 md:h-auto bg-gray-200 relative overflow-hidden">
             <Image 
              src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=800" 
              alt={room.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
             />
             <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-full text-sm font-bold text-gray-900 shadow-sm">
               Up to {room.capacity} Guests
             </div>
          </div>
          <div className="p-8 md:p-10 flex flex-col flex-grow md:w-1/2">
            <h3 className="font-extrabold text-3xl mb-3 text-gray-900">{room.name}</h3>
            <p className="text-gray-500 text-base mb-8 line-clamp-3 flex-grow">{room.description}</p>
            
            <div className="flex items-center gap-6 text-sm text-gray-600 mb-8 font-medium">
              <span className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg"><Wifi className="w-4 h-4 text-primary"/> Wi-Fi</span>
              <span className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg"><Coffee className="w-4 h-4 text-primary"/> Breakfast</span>
            </div>

            <div className="flex justify-between items-end border-t border-gray-100 pt-6 mt-auto">
              <div>
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-1">Starting from</p>
                <span className="font-black text-3xl text-gray-900">${room.basePrice.toString()}</span>
                <span className="text-gray-500 text-base">/night</span>
              </div>
              <Link href="/rooms" className="bg-gray-900 hover:bg-primary text-white font-bold py-3.5 px-8 rounded-xl transition-colors text-base shadow-lg hover:shadow-primary/30">
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {rooms.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {rooms.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`rounded-full transition-all duration-300 ${
                i === index ? 'w-8 h-2.5 bg-primary' : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

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

              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0 mt-2 md:mt-0">
                <Link 
                  href="/rooms"
                  className="w-full sm:w-auto px-6 py-4 bg-primary hover:bg-primary/90 text-white font-bold text-lg rounded-xl transition-all flex items-center justify-center shadow-lg hover:shadow-primary/30 whitespace-nowrap"
                >
                  Search Rooms
                </Link>
                <button 
                  onClick={() => window.open('https://wa.me/917057998449', '_blank')}
                  className="w-full sm:w-auto px-6 py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-lg rounded-xl transition-all flex items-center justify-center shadow-lg hover:shadow-[#25D366]/30 whitespace-nowrap"
                >
                  <MessageCircle className="w-5 h-5 mr-2 shrink-0" />
                  WhatsApp
                </button>
              </div>
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

          {featuredRooms.length > 0 ? (
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeInUp}
              className="mt-8"
            >
              <RoomSlider rooms={featuredRooms} fadeInUp={fadeInUp} />
            </motion.div>
          ) : (
            <p className="text-center text-gray-500 py-12 bg-white rounded-xl border border-gray-100 mt-8">No rooms featured currently.</p>
          )}
        </div>
      </section>

      {/* SPECIAL COUPLE OFFER */}
      <section className="py-24 bg-white border-y relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="container max-w-5xl mx-auto px-4 relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="bg-gray-50 rounded-[3rem] p-8 md:p-12 border border-gray-200 shadow-2xl flex flex-col md:flex-row items-center gap-10 overflow-hidden relative"
          >
            <div className="absolute top-0 left-0 bg-primary text-white font-black px-8 py-2 rounded-br-2xl text-lg uppercase tracking-tighter shadow-lg z-20">
              🔥 Best Offer
            </div>
            
            <div className="w-full md:w-1/2 space-y-6">
              <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight leading-none">
                Special <span className="text-primary italic">Couple</span> Offer
              </h2>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-primary">₹999</span>
                <span className="text-gray-500 font-bold">All-inclusive bundle</span>
              </div>
              <p className="text-lg text-gray-600 font-medium leading-relaxed">
                Enjoy a private, safe and comfortable stay. This exclusive package is designed for your perfect getaway in Dehu Road.
              </p>
              <ul className="space-y-3">
                {['Premium AC Room Stay', 'Complimentary Welcome Drinks', 'Fast Wi-Fi & Smart TV', '100% Privacy & Safety'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 font-bold text-gray-700">
                    <CheckCircle2 className="w-6 h-6 text-[#25D366] shrink-0" /> {item}
                  </li>
                ))}
              </ul>
              <Link href="/rooms" className="inline-block mt-4">
                <button className="h-16 px-10 rounded-2xl text-xl font-extrabold w-full md:w-auto bg-gray-900 text-white hover:bg-primary shadow-xl hover:-translate-y-1 transition-transform">
                  Grab This Offer Now
                </button>
              </Link>
            </div>
            
            <div className="w-full md:w-1/2 aspect-square rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white transform md:rotate-3 hover:rotate-0 transition-transform duration-500 relative">
               <Image 
                 src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                 alt="Couple Offer" 
                 fill
                 className="object-cover"
               />
            </div>
          </motion.div>
        </div>
      </section>

      {/* EXPLORE DEHU SECTION */}
      <section className="py-24 bg-gray-50">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">Explore Dehu Road</h2>
            <p className="text-gray-500 text-lg font-medium">Discover the beauty and spirituality surrounding our hotel.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { id: 1, title: 'Gatha Mandir', desc: 'A beautiful temple dedicated to Sant Tukaram Maharaj.', img: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=500&q=80' },
              { id: 2, title: 'Bhandara Dongar', desc: 'The historic hill where Sant Tukaram meditated.', img: 'https://images.unsplash.com/photo-1522206090757-56e6d19e4871?w=500&q=80' },
              { id: 3, title: 'Indrayani River', desc: 'The sacred river flowing through Dehu.', img: 'https://images.unsplash.com/photo-1582510003544-4d00b7f7415e?w=500&q=80' }
            ].map((card, idx) => (
              <motion.div 
                key={card.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="aspect-square rounded-3xl overflow-hidden group relative shadow-md cursor-pointer border border-gray-200"
              >
                <Image src={card.img} alt={card.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 md:p-8">
                  <h3 className="text-white font-extrabold text-2xl md:text-3xl mb-2 leading-tight">{card.title}</h3>
                  <p className="text-white/80 text-sm md:text-base font-medium line-clamp-2">{card.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
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
      
      {/* Ready To Book Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-green-800 text-white relative z-10">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight text-balance drop-shadow-sm">
            Ready to book your stay?
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-10 font-medium text-balance drop-shadow-sm">
            Contact us on WhatsApp for instant booking and best rates. Our team is ready to assist you 24/7.
          </p>
          <button 
            onClick={() => window.open('https://wa.me/917057998449', '_blank')}
            className="h-16 px-8 text-lg font-bold rounded-full bg-white text-primary hover:bg-gray-100 shadow-xl transition-transform hover:-translate-y-1 inline-flex items-center justify-center whitespace-nowrap"
          >
            <MessageCircle className="w-6 h-6 mr-2 shrink-0 text-[#25D366]" />
            Book on WhatsApp Now
          </button>
        </div>
      </section>
      
      {/* Footer Banner */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
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
