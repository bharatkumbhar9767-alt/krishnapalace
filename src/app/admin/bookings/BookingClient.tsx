"use client";

import { useState } from "react";
import { updateBookingStatus } from "./actions";
import { Button } from "@/components/ui/button";

type BookingStatus = "PENDING" | "CONFIRMED" | "CHECKED_IN" | "CHECKED_OUT" | "CANCELLED";

interface SerializedBooking {
  id: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  roomName: string;
  checkInDate: string;
  checkOutDate: string;
  totalAmount: number;
  status: BookingStatus;
  createdAt: string;
}

export default function BookingClient({ initialBookings }: { initialBookings: SerializedBooking[] }) {
  const [bookings, setBookings] = useState(initialBookings);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleStatusChange = async (id: string, newStatus: BookingStatus) => {
    setLoadingId(id);
    const result = await updateBookingStatus(id, newStatus);
    if (result.success) {
      setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
    } else {
      alert(result.error || "Failed to update status");
    }
    setLoadingId(null);
  };

  return (
    <div className="bg-background rounded-xl border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
            <tr>
              <th className="px-6 py-4 font-medium">Guest Info</th>
              <th className="px-6 py-4 font-medium">Room</th>
              <th className="px-6 py-4 font-medium">Dates</th>
              <th className="px-6 py-4 font-medium">Amount</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                  No bookings found.
                </td>
              </tr>
            ) : bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-muted/20">
                <td className="px-6 py-4">
                  <div className="font-medium text-foreground">{booking.guestName}</div>
                  <div className="text-xs text-muted-foreground">{booking.guestEmail}</div>
                  <div className="text-xs text-muted-foreground">{booking.guestPhone}</div>
                </td>
                <td className="px-6 py-4 font-medium">{booking.roomName}</td>
                <td className="px-6 py-4">
                  <div className="whitespace-nowrap">{new Date(booking.checkInDate).toLocaleDateString()}</div>
                  <div className="whitespace-nowrap text-muted-foreground">to {new Date(booking.checkOutDate).toLocaleDateString()}</div>
                </td>
                <td className="px-6 py-4 font-medium whitespace-nowrap">
                  ${booking.totalAmount.toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] px-2 py-1 rounded-full uppercase tracking-wider font-semibold whitespace-nowrap ${
                    booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                    booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                    booking.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                    booking.status === 'CHECKED_IN' ? 'bg-purple-100 text-purple-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {booking.status === "PENDING" && (
                      <>
                        <Button 
                          size="sm" 
                          onClick={() => handleStatusChange(booking.id, "CONFIRMED")}
                          disabled={loadingId === booking.id}
                        >
                          Confirm
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleStatusChange(booking.id, "CANCELLED")}
                          disabled={loadingId === booking.id}
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                    {booking.status === "CONFIRMED" && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleStatusChange(booking.id, "CHECKED_IN")}
                        disabled={loadingId === booking.id}
                      >
                        Check In
                      </Button>
                    )}
                    {booking.status === "CHECKED_IN" && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleStatusChange(booking.id, "CHECKED_OUT")}
                        disabled={loadingId === booking.id}
                      >
                        Check Out
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
