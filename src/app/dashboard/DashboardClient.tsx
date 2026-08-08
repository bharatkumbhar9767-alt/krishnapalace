"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cancelBooking, updateProfile, updatePassword } from "./actions";

export default function DashboardClient({ bookings, user }: { bookings: any[], user: any }) {
  const [activeTab, setActiveTab] = useState("bookings");
  const [loading, setLoading] = useState(false);

  const upcomingBookings = bookings.filter(b => ["PENDING", "CONFIRMED"].includes(b.status));
  const pastBookings = bookings.filter(b => ["CHECKED_IN", "CHECKED_OUT", "CANCELLED"].includes(b.status));

  async function handleCancel(id: string) {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    
    setLoading(true);
    const res = await cancelBooking(id);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Booking cancelled successfully.");
      // In a real app we'd refresh data or update state here. For simplicity, just reload.
      window.location.reload();
    }
    setLoading(false);
  }

  async function handleProfileSubmit(formData: FormData) {
    setLoading(true);
    const res = await updateProfile(formData);
    if (res.error) toast.error(res.error);
    else toast.success("Profile updated!");
    setLoading(false);
  }

  async function handlePasswordSubmit(formData: FormData) {
    setLoading(true);
    const res = await updatePassword(formData);
    if (res.error) toast.error(res.error);
    else {
      toast.success("Password updated!");
      (document.getElementById("passwordForm") as HTMLFormElement).reset();
    }
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Dashboard</h1>
      
      <div className="flex gap-4 border-b">
        <button 
          className={`pb-2 px-1 font-semibold ${activeTab === 'bookings' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
          onClick={() => setActiveTab('bookings')}
        >
          My Bookings
        </button>
        <button 
          className={`pb-2 px-1 font-semibold ${activeTab === 'profile' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button 
          className={`pb-2 px-1 font-semibold ${activeTab === 'security' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
          onClick={() => setActiveTab('security')}
        >
          Security
        </button>
      </div>

      {activeTab === 'bookings' && (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingBookings.length === 0 ? <p className="text-gray-500 text-sm">No upcoming bookings.</p> : (
                <div className="space-y-4">
                  {upcomingBookings.map(booking => (
                    <div key={booking.id} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <p className="font-bold text-lg">{booking.room?.category?.name} - {booking.room?.roomNumber}</p>
                        <p className="text-sm text-gray-600">Check-in: {new Date(booking.checkInDate).toLocaleDateString()} | Check-out: {new Date(booking.checkOutDate).toLocaleDateString()}</p>
                        <span className={`inline-block mt-2 text-xs px-2 py-1 rounded-full font-bold ${
                          booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>{booking.status}</span>
                      </div>
                      <div className="text-right space-y-2">
                        <p className="font-extrabold text-xl">${booking.totalAmount.toString()}</p>
                        <div className="flex gap-2">
                          <a 
                            href={`/api/invoice/${booking.id}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2 rounded text-sm font-medium transition-colors"
                          >
                            Print Invoice
                          </a>
                          {booking.status === "PENDING" && (
                            <button 
                              onClick={() => handleCancel(booking.id)}
                              className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded text-sm font-medium transition-colors"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Past Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              {pastBookings.length === 0 ? <p className="text-gray-500 text-sm">No past bookings.</p> : (
                <div className="space-y-4">
                  {pastBookings.map(booking => (
                    <div key={booking.id} className="flex justify-between items-center p-4 border rounded-lg bg-gray-50 opacity-80">
                      <div>
                        <p className="font-bold">{booking.room?.category?.name} - {booking.room?.roomNumber}</p>
                        <p className="text-sm text-gray-600">Check-in: {new Date(booking.checkInDate).toLocaleDateString()}</p>
                        <span className={`inline-block mt-1 text-xs px-2 py-1 rounded-full font-bold ${
                           booking.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                        }`}>{booking.status}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${booking.totalAmount.toString()}</p>
                        {booking.status === 'CHECKED_OUT' && (
                          <Button variant="outline" size="sm" className="mt-2" onClick={() => window.open(`/api/invoice/${booking.id}`, '_blank')}>Download Invoice</Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'profile' && (
        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
            <CardDescription>Update your personal information.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleProfileSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" defaultValue={user?.name || ''} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" defaultValue={user?.email || ''} required readOnly className="bg-gray-100" />
                <p className="text-xs text-gray-500">Email cannot be changed.</p>
              </div>
              <Button type="submit" disabled={loading}>Save Profile</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {activeTab === 'security' && (
        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Ensure your account is using a long, random password to stay secure.</CardDescription>
          </CardHeader>
          <CardContent>
            <form id="passwordForm" action={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" name="currentPassword" type="password" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" name="newPassword" type="password" required minLength={6} />
              </div>
              <Button type="submit" disabled={loading}>Update Password</Button>
            </form>
          </CardContent>
        </Card>
      )}

    </div>
  );
}
