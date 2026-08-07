"use client";

import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { MapPin, Calendar, Users, Search } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Hero Section with Search Bar */}
      <section className="relative pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1542314831-c53cd4b85d0b?q=80&w=2070&auto=format&fit=crop"
            alt="Hotel Background"
            fill
            className="object-cover opacity-40 mix-blend-overlay"
            priority
          />
        </div>
        
        <div className="relative z-10 container px-4 md:px-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl md:text-5xl font-bold text-white text-center tracking-tight">
              Over 157,000 hotels and homes across 35 countries
            </h1>
            
            {/* Massive Search Bar Widget */}
            <div className="bg-white rounded-lg p-2 md:p-3 flex flex-col md:flex-row items-center gap-2 shadow-2xl mt-8 border-4 border-gray-200/20">
              
              <div className="flex-1 flex items-center bg-white border border-gray-300 rounded md:border-none md:rounded-none w-full md:w-auto px-4 py-3 md:py-2">
                <MapPin className="text-gray-400 w-5 h-5 mr-3 shrink-0" />
                <input 
                  type="text" 
                  placeholder="Search by city, hotel, or neighborhood" 
                  className="w-full outline-none text-gray-800 text-base md:text-lg font-medium placeholder:font-normal placeholder:text-gray-400"
                  defaultValue="Krishna Palace, Mumbai"
                />
              </div>
              
              <div className="w-full md:w-px h-px md:h-12 bg-gray-300 shrink-0"></div>
              
              <div className="flex-1 flex items-center bg-white border border-gray-300 rounded md:border-none md:rounded-none w-full md:w-auto px-4 py-3 md:py-2 cursor-pointer hover:bg-gray-50 transition-colors">
                <Calendar className="text-gray-400 w-5 h-5 mr-3 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Check In - Check Out</span>
                  <span className="text-gray-800 font-bold text-sm md:text-base">Thu, 18 Jan - Fri, 19 Jan</span>
                </div>
              </div>
              
              <div className="w-full md:w-px h-px md:h-12 bg-gray-300 shrink-0"></div>
              
              <div className="flex-1 flex items-center bg-white border border-gray-300 rounded md:border-none md:rounded-none w-full md:w-auto px-4 py-3 md:py-2 cursor-pointer hover:bg-gray-50 transition-colors">
                <Users className="text-gray-400 w-5 h-5 mr-3 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Rooms & Guests</span>
                  <span className="text-gray-800 font-bold text-sm md:text-base">1 Room, 2 Guests</span>
                </div>
              </div>

              <Link 
                href="/rooms"
                className="w-full md:w-auto px-8 py-4 md:py-4 bg-[#1ab64f] hover:bg-[#149b42] text-white font-bold text-lg rounded shrink-0 transition-colors flex items-center justify-center shadow-lg"
              >
                Search
              </Link>
            </div>
            
            <div className="flex items-center justify-center gap-4 text-white text-sm font-medium mt-4">
              <span className="flex items-center"><span className="text-[#1ab64f] text-lg mr-2">✓</span> Lowest Price Guarantee</span>
              <span className="flex items-center"><span className="text-[#1ab64f] text-lg mr-2">✓</span> Flexible Bookings</span>
            </div>
          </div>
        </div>
      </section>

      {/* Promotional Banners Section */}
      <section className="container px-4 md:px-6 py-12 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/rooms" className="group rounded-xl overflow-hidden shadow-md block relative hover:shadow-xl transition-all">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-500 group-hover:scale-105 transition-transform duration-500" />
            <div className="relative p-8 flex items-center justify-between z-10 text-white">
              <div className="space-y-2">
                <h3 className="text-3xl font-extrabold tracking-tight">FLAT 50% OFF</h3>
                <p className="text-red-100 font-medium">On your first booking</p>
                <div className="mt-4 inline-block bg-white text-red-600 px-4 py-1.5 rounded text-sm font-bold shadow-sm">USE CODE: WELCOME50</div>
              </div>
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-5xl">
                🎁
              </div>
            </div>
          </Link>
          <Link href="/rooms" className="group rounded-xl overflow-hidden shadow-md block relative hover:shadow-xl transition-all">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-500 group-hover:scale-105 transition-transform duration-500" />
            <div className="relative p-8 flex items-center justify-between z-10 text-white">
              <div className="space-y-2">
                <h3 className="text-3xl font-extrabold tracking-tight">FREE BREAKFAST</h3>
                <p className="text-blue-100 font-medium">Valid on all premium rooms</p>
                <div className="mt-4 inline-block bg-white text-blue-700 px-4 py-1.5 rounded text-sm font-bold shadow-sm">BOOK PREMIUM</div>
              </div>
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-5xl">
                ☕
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Popular Collections / Destinations */}
      <section className="py-12 bg-white border-y border-gray-200">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Popular Destinations</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { name: "Mumbai", count: "140+ Hotels", img: "https://images.unsplash.com/photo-1522206090757-56e6d19e4871?w=500&q=80" },
              { name: "Delhi", count: "210+ Hotels", img: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=500&q=80" },
              { name: "Bangalore", count: "180+ Hotels", img: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=500&q=80" },
              { name: "Goa", count: "85+ Hotels", img: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=500&q=80" },
              { name: "Chennai", count: "120+ Hotels", img: "https://images.unsplash.com/photo-1582510003544-4d00b7f7415e?w=500&q=80" },
              { name: "Hyderabad", count: "150+ Hotels", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&q=80" },
              { name: "Pune", count: "90+ Hotels", img: "https://images.unsplash.com/photo-1582269438706-e7d69b32cbac?w=500&q=80" },
              { name: "Kolkata", count: "110+ Hotels", img: "https://images.unsplash.com/photo-1558431382-27e303142255?w=500&q=80" }
            ].map((city, i) => (
              <Link href="/rooms" key={i} className="group relative h-40 md:h-48 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all">
                <Image
                  src={city.img}
                  alt={city.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 z-10">
                  <h3 className="text-white font-bold text-lg md:text-xl">{city.name}</h3>
                  <p className="text-gray-200 text-xs md:text-sm font-medium">{city.count}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer Banner */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="bg-primary text-white rounded-xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
            <div className="space-y-4 max-w-2xl text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Become an OYO Wizard</h2>
              <p className="text-primary-foreground/90 text-lg">
                Join our premium membership program and get exclusive benefits, flat discounts, and free room upgrades.
              </p>
            </div>
            <Link 
              href="/login" 
              className={buttonVariants({ 
                size: "lg", 
                variant: "outline",
                className: "bg-white text-primary border-transparent hover:bg-gray-100 hover:text-primary font-bold px-8 shadow-md" 
              })}
            >
              Join Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
