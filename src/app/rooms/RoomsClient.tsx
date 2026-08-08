"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { MapPin, Star, CheckCircle, Wifi, Tv, Coffee } from "lucide-react";

export default function RoomsClient({ initialRooms }: { initialRooms: any[] }) {
  const [rooms, setRooms] = useState(initialRooms);
  const [priceFilter, setPriceFilter] = useState<string[]>([]);
  
  // Real implementation of filtering could be more complex (using search params, context etc).
  // For now, doing simple client side filtering.
  
  const handlePriceToggle = (range: string) => {
    let updated = [...priceFilter];
    if (updated.includes(range)) {
      updated = updated.filter(p => p !== range);
    } else {
      updated.push(range);
    }
    setPriceFilter(updated);
    
    // Filter rooms
    if (updated.length === 0) {
      setRooms(initialRooms);
      return;
    }
    
    const filtered = initialRooms.filter(room => {
      const p = room.category.basePrice;
      if (updated.includes("$0 - $50") && p <= 50) return true;
      if (updated.includes("$50 - $100") && p > 50 && p <= 100) return true;
      if (updated.includes("$100 - $200") && p > 100 && p <= 200) return true;
      if (updated.includes("$200+") && p > 200) return true;
      return false;
    });
    setRooms(filtered);
  };

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    const sorted = [...rooms];
    if (val === "low") {
      sorted.sort((a, b) => Number(a.category.basePrice) - Number(b.category.basePrice));
    } else if (val === "high") {
      sorted.sort((a, b) => Number(b.category.basePrice) - Number(a.category.basePrice));
    }
    setRooms(sorted);
  };

  return (
    <div className="container px-4 md:px-6 py-8 flex flex-col md:flex-row gap-6">
      
      {/* Left Sidebar Filters (Desktop) */}
      <aside className="w-full md:w-1/4 shrink-0 hidden md:block space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h3 className="font-bold text-lg mb-4 text-gray-900 border-b pb-2">Filters</h3>
          
          <div className="space-y-4 pt-2">
            <h4 className="font-bold text-gray-800">Price</h4>
            <div className="space-y-2">
              {["$0 - $50", "$50 - $100", "$100 - $200", "$200+"].map(price => (
                <label key={price} className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={priceFilter.includes(price)}
                    onChange={() => handlePriceToggle(price)}
                    className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary" 
                  />
                  <span className="text-gray-700 text-sm">{price}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="space-y-4 pt-6 border-t mt-6">
            <h4 className="font-bold text-gray-800">Collections</h4>
            <div className="space-y-2">
              {["Sanitized b4 ur eyes", "OYO Welcomes Couples", "OYO Premium"].map(col => (
                <label key={col} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary" />
                  <span className="text-gray-700 text-sm">{col}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t mt-6">
            <h4 className="font-bold text-gray-800">Hotel Amenities</h4>
            <div className="space-y-2">
              {[
                { icon: <Wifi className="w-4 h-4" />, label: "Free Wifi" },
                { icon: <Coffee className="w-4 h-4" />, label: "Breakfast Included" },
                { icon: <Tv className="w-4 h-4" />, label: "TV" }
              ].map((amenity, i) => (
                <label key={i} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary" />
                  <span className="flex items-center gap-2 text-gray-700 text-sm">{amenity.icon} {amenity.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Right Content Area (Rooms List) */}
      <main className="flex-1 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">{rooms.length} OYOs in Krishna Palace</h1>
          <select 
            onChange={handleSort}
            className="border border-gray-300 bg-white rounded-md px-3 py-1.5 text-sm font-medium outline-none"
          >
            <option value="pop">Sort By: Popularity</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
            <option value="rating">Guest Ratings</option>
          </select>
        </div>

        <div className="space-y-5">
          {rooms.length === 0 ? (
            <div className="p-8 text-center text-gray-500 border rounded-lg bg-white">
              No rooms match your selected filters. Try broadening your search.
            </div>
          ) : (
            rooms.map((room) => {
              const basePrice = Number(room.category.basePrice);
              const originalPrice = Math.round(basePrice * 2.5); // Mock 60% discount for OYO style
              const discountPercentage = Math.round(((originalPrice - basePrice) / originalPrice) * 100);

              return (
                <div key={room.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col sm:flex-row hover:shadow-lg transition-shadow">
                  {/* Image Section */}
                  <div className="relative w-full sm:w-[320px] h-48 sm:h-auto shrink-0">
                    <Image
                      src={(room.images && room.images.length > 0) ? room.images[0].url : "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=800&auto=format&fit=crop"}
                      alt={room.category.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-r-md uppercase tracking-wider">
                      Oyo Premium
                    </div>
                  </div>
                  
                  {/* Details Section */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 hover:text-primary transition-colors line-clamp-1">
                            {room.category.name} - {room.roomNumber}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1 line-clamp-1">
                            <MapPin className="w-3.5 h-3.5" /> Krishna Palace, Mumbai
                          </p>
                        </div>
                        <div className="bg-[#1ab64f] text-white px-2 py-1 rounded text-sm font-bold flex items-center gap-1 shrink-0">
                          4.5 <Star className="w-3.5 h-3.5 fill-current" />
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mt-4 text-sm text-gray-700">
                        <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-[#1ab64f]" /> Sanitized</span>
                        <span className="flex items-center gap-1"><Wifi className="w-4 h-4 text-gray-400" /> Free Wifi</span>
                        <span className="flex items-center gap-1"><Coffee className="w-4 h-4 text-gray-400" /> Breakfast</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-end justify-between mt-6 gap-4 border-t border-gray-100 pt-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-2xl font-extrabold text-gray-900">${basePrice}</span>
                          <span className="text-sm text-gray-500 line-through">${originalPrice}</span>
                          <span className="text-sm font-bold text-[#f5a623]">{discountPercentage}% off</span>
                        </div>
                        <p className="text-xs text-gray-500">+ taxes & fees per night</p>
                      </div>
                      
                      <div className="flex gap-3">
                        <Link 
                          href={`/rooms/${room.id}`} 
                          className={buttonVariants({ variant: "outline", className: "border-gray-300 font-bold" })}
                        >
                          View Details
                        </Link>
                        <Link 
                          href={`/rooms/${room.id}/book`} 
                          className={buttonVariants({ className: "bg-[#1ab64f] hover:bg-[#149b42] font-bold" })}
                        >
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
  );
}
