"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBooking } from "./actions";
import { toast } from "sonner";

export default function BookingForm({ room }: { room: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const calculateTotal = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights * Number(room.category.basePrice) : 0;
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const res = await createBooking(formData);

    if (res?.error) {
      toast.error(res.error);
      setError(res.error);
      setLoading(false);
    } else {
      toast.success("Booking confirmed! Redirecting to WhatsApp...");
      const guestName = formData.get("guestName") as string;
      const message = encodeURIComponent(`Hello Krishna Palace! I would like to confirm my booking for the ${room.category.name} (Room ${room.roomNumber}) from ${checkIn} to ${checkOut}. My name is ${guestName}.`);
      const whatsappNumber = "917057998449"; // Used the actual hotel owner's WhatsApp number
      setTimeout(() => {
        window.location.href = `https://wa.me/${whatsappNumber}?text=${message}`;
      }, 1500);
    }
  }

  const total = calculateTotal();

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border space-y-6">
      <input type="hidden" name="roomId" value={room.id} />
      
      {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Check-in Date</label>
          <input 
            type="date" 
            name="checkInDate" 
            required 
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Check-out Date</label>
          <input 
            type="date" 
            name="checkOutDate" 
            required 
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Adults</label>
          <select name="adults" className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary">
            {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Children</label>
          <select name="children" className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary">
            {[0, 1, 2].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Special Requests</label>
        <textarea 
          name="specialRequests" 
          rows={3} 
          className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary"
          placeholder="Any special requests? (Optional)"
        ></textarea>
      </div>

      <div className="space-y-4 pt-4 border-t">
        <h3 className="font-medium text-gray-900">Guest Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" name="guestName" required className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input type="email" name="guestEmail" required className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Phone Number</label>
          <input type="tel" name="guestPhone" required className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-4 text-lg font-bold">
          <span>Total Amount</span>
          <span>${total}</span>
        </div>
        <button 
          type="submit" 
          disabled={loading || total <= 0}
          className="w-full bg-[#25D366] hover:bg-[#1DA851] text-white font-bold py-3 px-4 rounded transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? "Processing..." : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" /><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" /></svg>
              Confirm Booking & Chat on WhatsApp
            </>
          )}
        </button>
        <p className="text-xs text-center text-gray-500 mt-3">You will be redirected to WhatsApp to complete your booking with the owner.</p>
      </div>
    </form>
  );
}
