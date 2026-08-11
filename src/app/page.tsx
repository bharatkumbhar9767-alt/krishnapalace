import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MapPin,
  Calendar,
  Users,
  Star,
  Wifi,
  Thermometer,
  Tv,
  Coffee,
  Truck,
  Bell,
  MessageCircle,
  Bed,
  Sparkles,
  Headphones,
  Search,
} from "lucide-react";
import prisma from "@/lib/prisma";
import { getPublicStorageUrl } from "@/lib/supabase";

import HomeClient from "./HomeClient";

export const dynamic = "force-dynamic";

// Configuration for WhatsApp Customer Contact (Homepage only)
const WHATSAPP_NUMBER = "REPLACE_WITH_ACTUAL_NUMBER"; // Replace with actual international format number without + or hyphens, e.g. "911234567890"
const WHATSAPP_DEFAULT_MESSAGE = "Hello Krishna Palace, I would like to know more about room availability and booking.";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_DEFAULT_MESSAGE)}`;

async function getTestimonials() {
  try {
    return await prisma.testimonial.findMany({
      where: { status: "APPROVED" },
      take: 6,
      orderBy: { createdAt: "desc" },
    });
  } catch (e) {
    return [];
  }
}

async function getFeaturedRooms() {
  try {
    return await prisma.roomCategory.findMany({
      take: 6,
      orderBy: { basePrice: "desc" },
    });
  } catch (e) {
    return [];
  }
}

export default async function Home() {
  const heroImageUrl = getPublicStorageUrl("hero/krishna-palace-hero-v2.png");

  const [testimonials, featuredRooms] = await Promise.all([
    getTestimonials(),
    getFeaturedRooms(),
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-[#FFF9F0] text-[#211827]">
      <header className="relative">
        <div className="relative h-[82vh] min-h-[580px] w-full overflow-hidden bg-[#17101F]">
          {/* Supabase Hero Image */}
          <Image
            src={heroImageUrl}
            alt="Krishna Palace luxury hotel and retreat"
            fill
            sizes="(max-width: 768px) 100vw, 100vw"
            className="object-cover object-center"
            priority
          />
          
          {/* Directional Dark Plum Overlay (Darker on left for crisp text contrast, clear on right for hotel building) */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#17101F]/90 via-[#17101F]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#17101F]/70 via-transparent to-transparent" />

          {/* Hero Left-Aligned Content Container */}
          <div className="absolute inset-0 z-10 flex h-full items-center">
            <div className="container mx-auto px-4 md:px-6">
              <div className="max-w-2xl text-left space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#D6B56A]/40 bg-[#D6B56A]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-[#D6B56A] backdrop-blur-md shadow-xs">
                  <span>⁓</span>
                  <span>WELCOME TO KRISHNA PALACE</span>
                  <span>⁓</span>
                </div>

                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.15] tracking-tight text-[#FFF9F0]">
                  A Luxurious Stay, <br />
                  Crafted for You
                </h1>

                <div className="w-16 h-0.5 bg-gradient-to-r from-[#D6B56A] to-transparent" />

                <p className="max-w-xl text-sm sm:text-base leading-relaxed text-[#FFF9F0]/85">
                  Discover beautifully appointed rooms, attentive service, and an elevated experience designed for comfort, calm, and memorable stays.
                </p>

                {/* Hero Action CTAs */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <Link href="/rooms" className="w-full sm:w-auto">
                    <Button className="w-full rounded-full bg-[#A875C9] px-8 py-3.5 text-sm font-semibold text-[#FFF9F0] shadow-lg shadow-[#A875C9]/30 transition-all duration-300 hover:bg-[#945EB7] hover:shadow-xl hover:shadow-[#A875C9]/40 active:scale-[0.98] sm:w-auto">
                      Reserve a Room
                    </Button>
                  </Link>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-full border border-white/40 bg-white/10 backdrop-blur-md px-7 py-3 text-sm font-semibold text-[#FFF9F0] transition-all duration-300 hover:border-[#25D366]/80 hover:bg-[#25D366]/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#D6B56A] active:scale-[0.98]"
                    aria-label="Chat with Krishna Palace on WhatsApp regarding room availability and booking"
                  >
                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>

                {/* Supporting Text */}
                <p className="pt-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#D6B56A]">
                  PRIME LOCATION • REFINED HOSPITALITY • THOUGHTFUL COMFORT
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Booking Search Card Section (Positioned cleanly below the hero with 35-50px breathing space) */}
      <section className="container mx-auto px-4 md:px-6 pt-10 sm:pt-12 pb-4">
        <form
          action="/rooms"
          method="get"
          className="mx-auto max-w-6xl rounded-[1.75rem] bg-[#FFF9F0] p-4 sm:p-5 lg:p-6 shadow-2xl shadow-[#17101F]/15 border border-[#D6B56A]/30 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-3"
        >
          {/* Location Column (~26%) */}
          <div className="lg:w-[26%] flex items-center gap-3.5 px-2 min-w-0">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#A875C9]/15 text-[#A875C9]">
              <MapPin className="w-5 h-5 text-[#A875C9]" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#665A6B]">
                LOCATION
              </span>
              <Input
                id="location"
                name="location"
                defaultValue="Krishna Palace, Dehuroad"
                aria-label="Location"
                className="h-7 border-none bg-transparent p-0 text-sm font-semibold text-[#211827] focus-visible:ring-0 placeholder:text-[#665A6B] truncate w-full"
              />
            </div>
          </div>

          {/* Divider 1 */}
          <div className="hidden lg:block w-px h-10 bg-[#E8DDEA] shrink-0" />

          {/* Check-in Column (~18%) */}
          <div className="lg:w-[18%] flex items-center gap-3 px-2 min-w-0">
            <Calendar className="w-5 h-5 text-[#A875C9] shrink-0" />
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#665A6B]">
                CHECK-IN
              </span>
              <Input
                id="checkin"
                name="checkin"
                type="date"
                className="h-7 border-none bg-transparent p-0 text-sm font-semibold text-[#211827] focus-visible:ring-0 cursor-pointer w-full"
              />
            </div>
          </div>

          {/* Divider 2 */}
          <div className="hidden lg:block w-px h-10 bg-[#E8DDEA] shrink-0" />

          {/* Check-out Column (~18%) */}
          <div className="lg:w-[18%] flex items-center gap-3 px-2 min-w-0">
            <Calendar className="w-5 h-5 text-[#A875C9] shrink-0" />
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#665A6B]">
                CHECK-OUT
              </span>
              <Input
                id="checkout"
                name="checkout"
                type="date"
                className="h-7 border-none bg-transparent p-0 text-sm font-semibold text-[#211827] focus-visible:ring-0 cursor-pointer w-full"
              />
            </div>
          </div>

          {/* Divider 3 */}
          <div className="hidden lg:block w-px h-10 bg-[#E8DDEA] shrink-0" />

          {/* Guests Column (~15%) */}
          <div className="lg:w-[15%] flex items-center gap-3 px-2 min-w-0">
            <Users className="w-5 h-5 text-[#A875C9] shrink-0" />
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#665A6B]">
                GUESTS
              </span>
              <select
                id="guests"
                name="guests"
                className="h-7 bg-transparent border-none p-0 text-sm font-semibold text-[#211827] outline-none cursor-pointer focus:ring-0 w-full"
              >
                <option value="1">1 Guest</option>
                <option value="2">2 Guests</option>
                <option value="3">3 Guests</option>
                <option value="4">4 Guests</option>
              </select>
            </div>
          </div>

          {/* Search Button Column (~21%) */}
          <div className="lg:w-[21%] shrink-0 flex justify-end">
            <Button
              type="submit"
              className="w-full lg:w-auto rounded-2xl bg-[#A875C9] px-6 py-3.5 text-sm font-semibold text-[#FFF9F0] shadow-md shadow-[#A875C9]/25 transition-all hover:bg-[#945EB7] flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Search className="w-4 h-4 text-[#FFF9F0]" />
              <span>Search Rooms</span>
            </Button>
          </div>
        </form>
      </section>

      <main className="flex-1">
        {/* Centered "Find Your Perfect Stay" Card Section */}
        <section className="container mx-auto px-4 md:px-6 pt-6 pb-8">
          <div className="max-w-3xl mx-auto rounded-[2rem] bg-white border border-[#E8DDEA] p-8 sm:p-10 text-center shadow-md shadow-[#17101F]/5 transition hover:shadow-lg">
            <span className="text-xs uppercase tracking-[0.24em] text-[#A875C9] font-semibold">
              Find Your Perfect Stay
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-serif font-semibold text-[#211827] leading-snug">
              Comfortable spaces designed to make every stay relaxing, convenient and memorable.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#6B5D73] max-w-xl mx-auto">
              Explore our rooms and choose the one that suits your visit.
            </p>
            <div className="mt-6 flex justify-center">
              <Link
                href="/rooms"
                className="inline-flex items-center justify-center rounded-full bg-[#A875C9] px-7 py-3 text-sm font-semibold text-[#FFF9F0] shadow-sm hover:bg-[#945EB7] transition-all"
              >
                Explore All Rooms
              </Link>
            </div>
          </div>
        </section>

        {/* Why Choose Krishna Palace Section (Matching Reference Image) */}
        <section className="container mx-auto px-4 md:px-6 pt-8 pb-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center gap-3">
              <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#D6B56A]" />
              <h2 className="font-serif text-xl sm:text-2xl font-bold uppercase tracking-[0.18em] text-[#17101F]">
                WHY CHOOSE KRISHNA PALACE
              </h2>
              <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#D6B56A]" />
            </div>
            <div className="mt-2 text-[#D6B56A] text-xs">⁓ ❖ ⁓</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 divide-y sm:divide-y-0 lg:divide-x divide-[#E8DDEA]">
            {[
              {
                icon: <Bed className="w-6 h-6 text-[#A875C9]" />,
                title: "Comfortable Rooms",
                desc: "Spacious, elegant rooms designed for restful and relaxing stays.",
              },
              {
                icon: <Sparkles className="w-6 h-6 text-[#A875C9]" />,
                title: "Clean & Hygienic",
                desc: "Impeccable housekeeping and attention to every detail for your comfort.",
              },
              {
                icon: <MapPin className="w-6 h-6 text-[#A875C9]" />,
                title: "Prime Location",
                desc: "Convenient access to local dining, shopping, and transport.",
              },
              {
                icon: <Headphones className="w-6 h-6 text-[#A875C9]" />,
                title: "Guest Support",
                desc: "Warm, helpful service throughout your stay.",
              },
            ].map((item, idx) => (
              <div
                key={item.title}
                className={`flex flex-col items-start pt-6 sm:pt-0 ${
                  idx !== 0 ? "lg:pl-8" : ""
                }`}
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#A875C9]/15 text-[#A875C9]">
                  {item.icon}
                </div>
                <h3 className="font-serif text-lg font-bold text-[#211827] mb-2">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-[#665A6B]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Rooms Section */}
        <section className="container mx-auto px-4 md:px-6 py-12">
          <div className="max-w-3xl text-center mx-auto">
            <p className="text-sm uppercase tracking-[0.24em] text-[#A875C9] font-semibold">Featured Accommodation</p>
            <h2 className="mt-4 text-3xl md:text-4xl font-serif font-semibold text-[#211827]">Rooms & Suites Crafted for Comfort</h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {featuredRooms.length > 0 ? featuredRooms.map((room) => (
              <article key={room.id} className="group overflow-hidden rounded-[2rem] bg-white border border-[#E8DDEA] shadow-sm transition hover:shadow-xl">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src="/hero-hotel.svg"
                    alt={room.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-xl font-semibold text-[#211827]">{room.name}</h3>
                    <span className="rounded-full bg-[#D6B56A]/15 border border-[#D6B56A]/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#D6B56A]">Featured</span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-[#6B5D73] line-clamp-3">{room.description || 'An elegant room with refined decor and cozy amenities for a peaceful night.'}</p>
                  <div className="mt-5 flex flex-wrap gap-2 text-sm text-[#211827]">
                    <span className="rounded-full bg-[#F8F0E5] px-3 py-2">{room.capacity} Guests</span>
                    <span className="rounded-full bg-[#F8F0E5] px-3 py-2">Premium Comfort</span>
                  </div>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="text-xs uppercase tracking-[0.2em] text-[#A875C9]">From</div>
                      <div className="text-2xl font-bold text-[#A875C9]">₹{room.basePrice?.toFixed(0)}</div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Link href="/rooms" className="inline-flex items-center justify-center rounded-full border border-[#211827] px-4 py-2 text-sm font-semibold text-[#211827] transition hover:bg-[#211827] hover:text-[#FFF9F0]">View Details</Link>
                      <Link href="/rooms" className="inline-flex items-center justify-center rounded-full bg-[#A875C9] px-4 py-2 text-sm font-semibold text-[#FFF9F0] transition hover:bg-[#945EB7]">Book Now</Link>
                    </div>
                  </div>
                </div>
              </article>
            )) : (
              <div className="rounded-[2rem] bg-white border border-[#E8DDEA] p-10 text-center shadow-sm col-span-3">
                <h3 className="text-2xl font-semibold text-[#211827]">Explore Our Accommodations</h3>
                <p className="mt-4 text-sm text-[#6B5D73]">Browse our available rooms and select the perfect space for your visit.</p>
                <div className="mt-6">
                  <Link href="/rooms" className="inline-flex items-center justify-center rounded-full bg-[#A875C9] px-6 py-3 text-sm font-semibold text-[#FFF9F0] hover:bg-[#945EB7]">
                    Explore All Rooms
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="bg-[#F8F0E5] py-12">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl text-center mx-auto">
              <p className="text-sm uppercase tracking-[0.24em] text-[#A875C9] font-semibold">Hotel Amenities</p>
              <h2 className="mt-4 text-3xl font-serif font-semibold text-[#211827]">Everything You Need for a Comfortable Stay</h2>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: <Wifi className="w-6 h-6 text-[#A875C9]" />, title: 'Complimentary Wi-Fi' },
                { icon: <Thermometer className="w-6 h-6 text-[#A875C9]" />, title: 'Air Conditioning' },
                { icon: <Tv className="w-6 h-6 text-[#A875C9]" />, title: 'Television' },
                { icon: <Coffee className="w-6 h-6 text-[#A875C9]" />, title: 'Breakfast' },
                { icon: <Truck className="w-6 h-6 text-[#A875C9]" />, title: 'Parking' },
                { icon: <Bell className="w-6 h-6 text-[#A875C9]" />, title: 'Room Service' },
              ].map((item) => (
                <div key={item.title} className="rounded-[2rem] border border-[#E8DDEA] bg-[#FFF9F0] p-6 shadow-sm transition hover:shadow-md">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-[#F8F0E5] text-[#A875C9]">{item.icon}</div>
                  <h3 className="text-lg font-semibold text-[#211827]">{item.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="container mx-auto px-4 md:px-6 py-12 grid gap-10 lg:grid-cols-2 items-center">
          <div className="relative h-96 overflow-hidden rounded-[2rem] bg-[#F8F0E5] shadow-lg">
            <Image
              src="/hero-hotel.svg"
              alt="Elegant Krishna Palace room"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#17101F]/20 via-transparent to-[#FFF9F0]/20" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-[#A875C9] font-semibold">About Krishna Palace</p>
            <h2 className="mt-4 text-4xl font-serif font-semibold text-[#211827]">Your Comfort Is Our Priority</h2>
            <div className="mt-4 h-1.5 w-24 rounded-full bg-[#D6B56A]" />
            <p className="mt-6 text-base leading-8 text-[#6B5D73]">Krishna Palace blends refined hospitality with modern warmth. Enjoy thoughtfully appointed rooms, impeccable cleanliness, and attentive service in a calm, welcoming atmosphere.</p>
            <ul className="mt-6 space-y-3 text-[#6B5D73]">
              <li className="flex items-start gap-3"><span className="mt-2 inline-block h-2.5 w-2.5 rounded-full bg-[#D6B56A]" />Comfortable accommodation designed for restful stays.</li>
              <li className="flex items-start gap-3"><span className="mt-2 inline-block h-2.5 w-2.5 rounded-full bg-[#D6B56A]" />Impeccable cleanliness paired with thoughtful amenities.</li>
              <li className="flex items-start gap-3"><span className="mt-2 inline-block h-2.5 w-2.5 rounded-full bg-[#D6B56A]" />Convenient access to local dining, shopping, and transport.</li>
            </ul>
            <div className="mt-8">
              <Link href="/rooms" className="inline-flex items-center justify-center rounded-full bg-[#A875C9] px-7 py-3 text-sm font-semibold text-[#FFF9F0] shadow-sm shadow-[#A875C9]/20 hover:bg-[#945EB7]">Discover Our Rooms</Link>
            </div>
          </div>
        </section>

        <section className="bg-[#25182E] py-16 text-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl text-center mx-auto">
              <p className="text-sm uppercase tracking-[0.24em] text-[#D6B56A] font-semibold">Experience</p>
              <h2 className="mt-4 text-3xl font-serif font-semibold text-[#FFF9F0]">Explore Nearby Attractions and Local Highlights</h2>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {[
                { title: 'Nearby Attractions', description: 'Charming local sights and cultural experiences within easy reach.' },
                { title: 'Dining', description: 'Warm restaurants and cafes for relaxed meals and memorable evenings.' },
                { title: 'Shopping', description: 'Curated markets and boutiques close to the hotel.' },
                { title: 'Transportation', description: 'Convenient links to local transport and city connections.' },
              ].map((item) => (
                <div key={item.title} className="group relative overflow-hidden rounded-[2rem] bg-[#17101F] border border-[#D6B56A]/20 text-white shadow-lg transition hover:shadow-xl">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(214,181,106,0.2),transparent_45%),linear-gradient(180deg,rgba(0,0,0,0.1),rgba(0,0,0,0.5))]" />
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src="/hero-hotel.svg"
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="relative p-6 sm:p-8">
                    <span className="inline-flex rounded-full bg-[#D6B56A]/15 border border-[#D6B56A]/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#D6B56A]">{item.title}</span>
                    <h3 className="mt-4 text-2xl font-serif font-semibold text-[#FFF9F0]">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[#E8DDEA]/90">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#F8F0E5] py-12">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl text-center mx-auto">
              <p className="text-sm uppercase tracking-[0.24em] text-[#A875C9] font-semibold">Guest Reviews</p>
              <h2 className="mt-4 text-3xl font-serif font-semibold text-[#211827]">What our guests appreciate most</h2>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {testimonials.length > 0 ? testimonials.map((testimonial) => (
                <article key={testimonial.id} className="rounded-[2rem] bg-white border border-[#E8DDEA] p-6 shadow-sm transition hover:shadow-md">
                  <div className="flex items-center gap-2 text-[#D6B56A]">
                    {[...Array(Math.min(5, Math.max(1, testimonial.rating || 5)))].map((_, index) => (
                      <Star key={index} className="w-4 h-4 fill-[#D6B56A]" />
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-7 text-[#211827]">“{testimonial.content}”</p>
                  <div className="mt-6 text-sm font-semibold text-[#211827]">{testimonial.authorName}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.16em] text-[#D6B56A]">Verified Guest</div>
                </article>
              )) : (
                <div className="col-span-full flex justify-center">
                  <div className="w-full max-w-xl rounded-[2rem] bg-white border border-[#E8DDEA] p-8 sm:p-10 text-center shadow-sm">
                    <h3 className="text-2xl font-semibold text-[#211827]">Your Experience Matters</h3>
                    <p className="mt-4 text-sm leading-7 text-[#6B5D73]">Be among the first guests to share your stay at Krishna Palace.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="py-12 bg-[#17101F] text-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="rounded-[2rem] bg-[#25182E] border border-[#D6B56A]/20 p-10 shadow-lg flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-[#D6B56A] font-semibold">Ready to book?</p>
                <h2 className="mt-3 text-3xl font-serif font-semibold text-[#FFF9F0]">Ready for a Comfortable Stay?</h2>
                <p className="mt-4 max-w-2xl text-sm text-[#E8DDEA]/90">Explore our rooms and find the right stay for your visit.</p>
              </div>
              <div className="flex items-center gap-4">
                <Link href="/rooms" className="inline-flex items-center justify-center rounded-full bg-[#A875C9] px-8 py-3 text-sm font-semibold text-[#FFF9F0] transition hover:bg-[#945EB7]">Book Your Stay</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
