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
  Clock,
  Droplets
} from "lucide-react";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Configuration for WhatsApp Customer Contact (Homepage only)
const WHATSAPP_NUMBER = "917057998449";
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
      include: {
        rooms: {
          include: {
            images: {
              where: { isPrimary: true },
              take: 1
            }
          }
        }
      }
    });
  } catch (e) {
    return [];
  }
}

export default async function Home() {
  // Using an Unsplash placeholder for the luxury hero image if you don't have one yet.
  const heroImageUrl = "https://images.unsplash.com/photo-1542314831-c6a4d14d8373?q=80&w=2070&auto=format&fit=crop";

  const [testimonials, featuredRooms] = await Promise.all([
    getTestimonials(),
    getFeaturedRooms(),
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      <header className="relative">
        <div className="relative h-[85vh] min-h-[600px] w-full overflow-hidden bg-gray-900">
          <Image
            src={heroImageUrl}
            alt="Krishna Palace luxury hotel and retreat"
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
          />
          
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />

          <div className="absolute inset-0 z-10 flex h-full items-center">
            <div className="container mx-auto px-4 md:px-6">
              <div className="max-w-2xl text-left space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-red-700/40 bg-red-700/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-red-100 backdrop-blur-md shadow-xs">
                  <span>⁓</span>
                  <span>WELCOME TO KRISHNA PALACE</span>
                  <span>⁓</span>
                </div>

                <h1 className="font-serif text-4xl sm:text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-white drop-shadow-sm">
                  A Luxurious Stay, <br />
                  <span className="text-gray-200 font-medium italic">Crafted for You</span>
                </h1>

                <div className="w-20 h-1 bg-gradient-to-r from-red-600 to-transparent" />

                <p className="max-w-xl text-base sm:text-lg leading-relaxed text-gray-300">
                  Discover beautifully appointed rooms, attentive service, and an elevated experience designed for comfort, calm, and memorable stays.
                </p>

                <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <Link href="/rooms" className="w-full sm:w-auto">
                    <Button className="w-full rounded-none bg-red-700 px-8 py-6 text-sm font-bold tracking-widest text-white uppercase shadow-lg transition-all duration-300 hover:bg-red-800 hover:shadow-red-900/40 active:scale-[0.98] sm:w-auto border border-red-700">
                      Reserve a Room
                    </Button>
                  </Link>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-none border border-white/40 bg-white/10 backdrop-blur-md px-7 py-5 text-sm font-semibold text-white tracking-widest uppercase transition-all duration-300 hover:border-[#25D366]/80 hover:bg-[#25D366]/20 hover:text-white active:scale-[0.98]"
                  >
                    <MessageCircle className="w-5 h-5 text-[#25D366]" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Booking Search Card Section */}
      <section className="container mx-auto px-4 md:px-6 -mt-16 relative z-20 pb-12">
        <form
          action="/rooms"
          method="get"
          className="mx-auto max-w-6xl rounded-lg bg-white p-6 lg:p-8 shadow-2xl border border-gray-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
        >
          {/* Check-in Column */}
          <div className="lg:w-[25%] flex items-center gap-4 px-2 min-w-0">
            <Calendar className="w-6 h-6 text-red-700 shrink-0" />
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                CHECK-IN
              </span>
              <Input
                id="checkin"
                name="checkin"
                type="date"
                className="h-8 border-none bg-transparent p-0 text-base font-semibold text-gray-900 focus-visible:ring-0 cursor-pointer w-full"
              />
            </div>
          </div>

          <div className="hidden lg:block w-px h-12 bg-gray-200 shrink-0" />

          {/* Check-out Column */}
          <div className="lg:w-[25%] flex items-center gap-4 px-2 min-w-0">
            <Calendar className="w-6 h-6 text-red-700 shrink-0" />
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                CHECK-OUT
              </span>
              <Input
                id="checkout"
                name="checkout"
                type="date"
                className="h-8 border-none bg-transparent p-0 text-base font-semibold text-gray-900 focus-visible:ring-0 cursor-pointer w-full"
              />
            </div>
          </div>

          <div className="hidden lg:block w-px h-12 bg-gray-200 shrink-0" />

          {/* Guests Column */}
          <div className="lg:w-[20%] flex items-center gap-4 px-2 min-w-0">
            <Users className="w-6 h-6 text-red-700 shrink-0" />
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                GUESTS
              </span>
              <select
                id="guests"
                name="guests"
                className="h-8 bg-transparent border-none p-0 text-base font-semibold text-gray-900 outline-none cursor-pointer focus:ring-0 w-full"
              >
                <option value="1">1 Guest</option>
                <option value="2">2 Guests</option>
                <option value="3">3 Guests</option>
                <option value="4">4 Guests</option>
              </select>
            </div>
          </div>

          {/* Search Button Column */}
          <div className="lg:w-[25%] shrink-0 flex justify-end">
            <Button
              type="submit"
              className="w-full rounded-none bg-red-700 px-8 py-7 text-sm font-bold tracking-widest text-white uppercase shadow-md transition-all hover:bg-gray-900 flex items-center justify-center gap-3"
            >
              <Search className="w-4 h-4" />
              <span>Check Availability</span>
            </Button>
          </div>
        </form>
      </section>

      <main className="flex-1">
        {/* Connectivity Section */}
        <section className="container mx-auto px-4 md:px-6 py-16 border-b border-gray-100">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-red-700">Location</span>
            <h2 className="mt-4 font-serif text-3xl sm:text-4xl font-bold text-gray-900">Connectivity & Accessibility</h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">Strategically located to keep you connected to major transit routes and destinations in and around Pune.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 flex-1 min-w-[200px] text-center">
              <p className="font-bold text-gray-900">Pune International Airport</p>
              <p className="text-red-700 font-semibold mt-1">~30 km</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 flex-1 min-w-[200px] text-center">
              <p className="font-bold text-gray-900">Pune-Mumbai Expressway</p>
              <p className="text-red-700 font-semibold mt-1">~5 km</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 flex-1 min-w-[200px] text-center">
              <p className="font-bold text-gray-900">Pune-Bengaluru Highway</p>
              <p className="text-red-700 font-semibold mt-1">~2 km</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 flex-1 min-w-[200px] text-center">
              <p className="font-bold text-gray-900">Dehu Road Railway Station</p>
              <p className="text-red-700 font-semibold mt-1">~1 km</p>
            </div>
          </div>
        </section>

        {/* Why Choose Krishna Palace Section */}
        <section className="container mx-auto px-4 md:px-6 pt-16 pb-24">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-red-700">Experience the perfect blend</span>
            <h2 className="mt-4 font-serif text-3xl sm:text-4xl font-bold text-gray-900">
              Why Choose Us
            </h2>
            <div className="mx-auto mt-6 h-1 w-16 bg-red-700" />
          </div>

          <div className="flex flex-wrap justify-center gap-12 lg:gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: <MapPin className="w-8 h-8 text-red-700" />,
                title: "Best Location",
                desc: "Conveniently situated in Dehu Road with easy access to major transit points and local attractions.",
              },
              {
                icon: <Star className="w-8 h-8 text-red-700" />,
                title: "Affordable Pricing",
                desc: "Premium comfort that doesn't break the bank, featuring flexible hourly and overnight rates.",
              },
              {
                icon: <Sparkles className="w-8 h-8 text-red-700" />,
                title: "Quality Service",
                desc: "Uncompromising standards in hospitality to ensure your stay is comfortable and hassle-free.",
              },
              {
                icon: <Bed className="w-8 h-8 text-red-700" />,
                title: "Clean Rooms",
                desc: "Immaculate, sanitized, and well-maintained accommodations for your peace of mind.",
              },
              {
                icon: <Headphones className="w-8 h-8 text-red-700" />,
                title: "24/7 Support",
                desc: "Round-the-clock front desk and room service to cater to your needs at any hour. We offer full in-room dining services.",
              },
              {
                icon: <Coffee className="w-8 h-8 text-red-700" />,
                title: "Restaurant Backup",
                desc: "We have an excellent restaurant backup to ensure you always have access to delicious meals and drinks during your stay.",
              },
              {
                icon: <Users className="w-8 h-8 text-red-700" />,
                title: "Friendly Staff",
                desc: "A dedicated team committed to making you feel at home with warm, personalized service.",
              },
            ].map((item) => (
               <div key={item.title} className="flex flex-col items-center text-center group w-full sm:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-2rem)] max-w-sm">
                 <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-50 border border-gray-100 shadow-sm transition-transform duration-500 group-hover:-translate-y-2 group-hover:shadow-md">
                   {item.icon}
                 </div>
                 <h3 className="font-serif text-xl font-bold text-gray-900 mb-3">
                   {item.title}
                 </h3>
                 <p className="text-sm leading-relaxed text-gray-500 max-w-xs">
                   {item.desc}
                 </p>
               </div>
            ))}
          </div>
        </section>

        {/* Amenities Section */}
        <section className="bg-gray-900 text-white py-16">
          <div className="container mx-auto px-4 md:px-6">
             <div className="text-center mb-12">
               <h2 className="font-serif text-3xl font-bold">Everything You Need</h2>
               <p className="mt-4 text-gray-400">Thoughtfully curated amenities to enhance your stay with us.</p>
             </div>
             <div className="flex flex-wrap justify-center gap-6 sm:gap-12">
               {[
                 { icon: <Wifi />, name: "Free WiFi" },
                 { icon: <Truck />, name: "Parking" },
                 { icon: <Clock className="w-6 h-6" />, name: "24/7 Check-in" },
                 { icon: <Thermometer />, name: "AC Rooms" },
                 { icon: <Droplets className="w-6 h-6" />, name: "Hot Water" },
                 { icon: <Bell />, name: "Room Service" },
               ].map((amenity) => (
                 <div key={amenity.name} className="flex flex-col items-center gap-3">
                   <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center text-red-500 border border-gray-700">
                     {amenity.icon}
                   </div>
                   <span className="text-sm font-semibold tracking-wide">{amenity.name}</span>
                 </div>
               ))}
             </div>
          </div>
        </section>

        {/* Featured Rooms Section */}
        <section className="bg-gray-50 py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl text-center mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-red-700">Accommodations</span>
              <h2 className="mt-4 text-3xl md:text-5xl font-serif font-bold text-gray-900">Crafted for Comfort</h2>
              <p className="mt-6 text-gray-500 max-w-xl mx-auto leading-relaxed">
                Explore our elegantly appointed rooms and suites, designed to provide you with the utmost comfort during your stay in Dehu Road.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featuredRooms.length > 0 ? featuredRooms.map((category) => {
                // Find a primary image or default
                let displayImage = "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop";
                for (const room of category.rooms) {
                  if (room.images && room.images.length > 0) {
                    displayImage = room.images[0].url;
                    break;
                  }
                }

                return (
                  <article key={category.id} className="group flex flex-col bg-white shadow-sm hover:shadow-xl transition-all duration-300">
                    <div className="relative h-72 overflow-hidden">
                      <Image
                        src={displayImage}
                        alt={category.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-8 flex flex-col flex-1 border border-t-0 border-gray-100">
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <h3 className="text-2xl font-serif font-bold text-gray-900">{category.name}</h3>
                      </div>
                      <p className="text-sm leading-relaxed text-gray-500 line-clamp-3 mb-6">
                        {category.description || 'An elegant room with refined decor and cozy amenities for a peaceful night.'}
                      </p>
                      
                      <div className="mt-auto flex items-end justify-between border-t border-gray-100 pt-6">
                        <div>
                          <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-1">Starting from</p>
                          <p className="text-2xl font-bold text-red-700">${category.basePrice?.toFixed(2)}<span className="text-sm text-gray-400 font-normal"> / night</span></p>
                        </div>
                        <Link href={`/rooms?category=${category.id}`} className="inline-flex items-center justify-center rounded-none bg-gray-900 px-6 py-3 text-xs font-bold tracking-widest text-white uppercase hover:bg-red-700 transition-colors">
                          View Details
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              }) : (
                <div className="bg-white border border-gray-200 p-12 text-center col-span-full shadow-sm">
                  <h3 className="text-2xl font-serif font-bold text-gray-900">Rooms Coming Soon</h3>
                  <p className="mt-4 text-gray-500">We are currently updating our room inventory.</p>
                </div>
              )}
            </div>
            
            {featuredRooms.length > 0 && (
              <div className="mt-16 text-center">
                <Link href="/rooms" className="inline-block border-b-2 border-red-700 pb-1 text-sm font-bold tracking-widest uppercase text-gray-900 hover:text-red-700 transition-colors">
                  View All Accommodations
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Special Offers Section */}
        <section className="bg-white py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl text-center mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-red-700">Exclusive Deals</span>
              <h2 className="mt-4 text-3xl md:text-4xl font-serif font-bold text-gray-900">Special Offers</h2>
              <p className="mt-4 text-gray-500 max-w-xl mx-auto leading-relaxed">
                Take advantage of our exclusive seasonal offers and packages designed to make your stay even more memorable.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 max-w-5xl mx-auto">
              <div className="group relative overflow-hidden rounded-xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800 z-0" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070&auto=format&fit=crop')] mix-blend-overlay opacity-20 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 z-0" />
                <div className="relative z-10 p-8 sm:p-10 flex flex-col h-full min-h-[320px]">
                  <div className="inline-flex self-start px-3 py-1 bg-red-700 text-white text-xs font-bold uppercase tracking-widest rounded-full mb-6">
                    Save 15%
                  </div>
                  <h3 className="text-3xl font-serif font-bold text-white mb-4">Extended Stay</h3>
                  <p className="text-gray-300 leading-relaxed max-w-sm mb-8 flex-1">
                    Stay with us for 3 nights or more and receive an exclusive 15% discount on your entire booking.
                  </p>
                  <Link href="/rooms" className="inline-flex items-center gap-2 text-white font-semibold uppercase tracking-widest text-sm hover:text-red-400 transition-colors w-fit group/link">
                    Book Now
                    <svg className="w-4 h-4 transition-transform group-hover/link:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                  </Link>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="absolute inset-0 bg-gray-50 z-0" />
                <div className="relative z-10 p-8 sm:p-10 flex flex-col h-full min-h-[320px]">
                  <div className="inline-flex self-start px-3 py-1 bg-gray-900 text-white text-xs font-bold uppercase tracking-widest rounded-full mb-6">
                    Corporate
                  </div>
                  <h3 className="text-3xl font-serif font-bold text-gray-900 mb-4">Business Travelers</h3>
                  <p className="text-gray-600 leading-relaxed max-w-sm mb-8 flex-1">
                    Special weekday rates and flexible hourly check-ins tailored for professionals on the go. Contact us directly.
                  </p>
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-gray-900 font-semibold uppercase tracking-widest text-sm hover:text-red-700 transition-colors w-fit group/link">
                    Contact Us
                    <MessageCircle className="w-4 h-4 transition-transform group-hover/link:scale-110" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl text-center mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-red-700">Guest Experiences</span>
              <h2 className="mt-4 text-3xl font-serif font-bold text-gray-900">What Our Guests Say</h2>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {testimonials.length > 0 ? testimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-gray-50 p-8 relative">
                  <div className="absolute top-8 left-8 text-6xl text-gray-200 font-serif leading-none">"</div>
                  <div className="relative z-10">
                    <div className="flex gap-1 mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < (testimonial.rating || 5) ? 'fill-red-700 text-red-700' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <p className="text-gray-600 italic leading-relaxed mb-8">"{testimonial.content}"</p>
                    <div>
                      <p className="font-bold text-gray-900 uppercase tracking-wide text-sm">{testimonial.authorName}</p>
                      <p className="text-xs text-gray-500 mt-1">Verified Guest</p>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="col-span-full text-center py-12 text-gray-500">
                  Reviews will appear here soon.
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
