"use client";

import { useState, useEffect } from "react";
import { updateBookingStatus, getAvailableRooms, createManualBooking } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

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

  // Manual Booking State
  const [showForm, setShowForm] = useState(false);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [availableRooms, setAvailableRooms] = useState<any[]>([]);
  
  // Form Fields
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<any>(null);

  useEffect(() => {
    if (checkIn && checkOut) {
      const fetchRooms = async () => {
        const result = await getAvailableRooms(checkIn, checkOut);
        if (result.rooms) {
          setAvailableRooms(result.rooms);
          setSelectedRoom(null); // Reset selection on date change
        }
      };
      fetchRooms();
    } else {
      setAvailableRooms([]);
    }
  }, [checkIn, checkOut]);

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom) {
      alert("Please select an available room.");
      return;
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    const totalAmount = selectedRoom.category.basePrice * nights;

    const result = await createManualBooking({
      guestName,
      guestEmail,
      guestPhone,
      guestAddress: "",
      checkInDate: checkIn,
      checkOutDate: checkOut,
      roomId: selectedRoom.id,
      adults: 1,
      children: 0,
      totalAmount,
      specialRequest: "Manual Booking by Admin"
    });

    if (result.success) {
      alert("Booking created successfully!");
      window.location.reload();
    } else {
      alert(result.error);
    }
  };

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
    <div className="space-y-6">
      <div className="flex justify-end mb-4">
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Create Manual Booking"}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleCreateBooking} className="bg-background rounded-xl border shadow-sm p-6 space-y-6">
          <h3 className="text-lg font-semibold">New Manual Booking</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Guest Name *</Label>
              <Input required value={guestName} onChange={e => setGuestName(e.target.value)} placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label>Guest Phone *</Label>
              <Input required value={guestPhone} onChange={e => setGuestPhone(e.target.value)} placeholder="+1 234 567 890" />
            </div>
            <div className="space-y-2">
              <Label>Guest Email</Label>
              <Input type="email" value={guestEmail} onChange={e => setGuestEmail(e.target.value)} placeholder="Optional" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div className="space-y-2">
              <Label>Check In Date *</Label>
              <Input required type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Check Out Date *</Label>
              <Input required type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} />
            </div>
          </div>

          {checkIn && checkOut && (
            <div className="space-y-2 pt-4 border-t">
              <Label>Select Available Room *</Label>
              {availableRooms.length === 0 ? (
                <p className="text-sm text-red-500">No rooms available for these dates.</p>
              ) : (
                <select 
                  required
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={selectedRoom?.id || ""}
                  onChange={e => {
                    const room = availableRooms.find(r => r.id === e.target.value);
                    setSelectedRoom(room);
                  }}
                >
                  <option value="" disabled>Select a room...</option>
                  {availableRooms.map(room => (
                    <option key={room.id} value={room.id}>
                      {room.category.name} - Room {room.roomNumber} (${room.category.basePrice}/night)
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {selectedRoom && checkIn && checkOut && (
            <div className="bg-muted/30 p-4 rounded-lg flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Calculated Total</p>
                <p className="text-2xl font-bold">
                  ${(selectedRoom.category.basePrice * Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)))).toFixed(2)}
                </p>
              </div>
              <Button type="submit" size="lg">Confirm Booking</Button>
            </div>
          )}
        </form>
      )}

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
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/bookings/${booking.id}`}>Details</Link>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
}
