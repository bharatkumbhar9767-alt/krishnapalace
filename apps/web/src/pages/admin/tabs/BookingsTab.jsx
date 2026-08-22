
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Trash2, X, User, Phone, Calendar, Clock, BedDouble, IndianRupee, Hash } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import LoadingSpinner from '@/components/LoadingSpinner';

const STATUS_OPTIONS = ['Pending', 'Confirmed', 'Checked-in', 'Completed', 'Cancelled'];

const BookingsTab = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const fetchBookings = async () => {
    try {
      const records = await pb.collection('bookings').getFullList({
        sort: '-created',
        expand: 'roomId',
        $autoCancel: false
      });
      setBookings(records);
    } catch (err) {
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await pb.collection('bookings').update(id, { status }, { $autoCancel: false });
      toast.success(`Status updated to ${status}`);
      setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
      if (selectedBooking?.id === id) setSelectedBooking(prev => ({ ...prev, status }));
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this booking permanently?')) return;
    try {
      await pb.collection('bookings').delete(id, { $autoCancel: false });
      toast.success('Booking deleted');
      setBookings(bookings.filter(b => b.id !== id));
      if (selectedBooking?.id === id) setSelectedBooking(null);
    } catch (err) {
      toast.error('Failed to delete booking');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Confirmed': return 'bg-primary text-primary-foreground';
      case 'Checked-in': return 'bg-blue-500 text-white';
      case 'Completed': return 'bg-green-600 text-white';
      case 'Cancelled': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-secondary">Manage Bookings</h2>

      <div className="bg-[hsl(var(--admin-card))] rounded-xl border shadow-sm overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 border-b text-muted-foreground uppercase text-xs">
            <tr>
              <th className="px-4 py-4">Booking ID</th>
              <th className="px-4 py-4">Guest</th>
              <th className="px-4 py-4">Room</th>
              <th className="px-4 py-4">Check-in</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id} className="border-b last:border-0 hover:bg-muted/10">
                <td className="px-4 py-4 font-bold">{b.bookingId}</td>
                <td className="px-4 py-4">
                  <div className="font-medium text-foreground">{b.guestName}</div>
                  <div className="text-xs text-muted-foreground">{b.guestPhone}</div>
                </td>
                <td className="px-4 py-4">{b.expand?.roomId?.name}</td>
                <td className="px-4 py-4">
                  <div>{new Date(b.checkInDate).toLocaleDateString()}</div>
                  <div className="text-xs text-muted-foreground">{b.duration}</div>
                </td>
                <td className="px-4 py-4">
                  <select
                    value={b.status}
                    onChange={(e) => updateStatus(b.id, e.target.value)}
                    className={`h-8 rounded px-2 text-xs font-bold border-0 cursor-pointer ${getStatusColor(b.status)}`}
                  >
                    {STATUS_OPTIONS.map(opt => <option key={opt} value={opt} className="bg-background text-foreground">{opt}</option>)}
                  </select>
                </td>
                <td className="px-4 py-4 text-right space-x-2">
                  <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => setSelectedBooking(b)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 px-2 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(b.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
            {bookings.length === 0 && <tr><td colSpan="6" className="text-center py-10 text-muted-foreground">No bookings found</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-background rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h3 className="text-xl font-extrabold">Booking Details</h3>
                <p className="text-sm text-muted-foreground font-medium">Full reservation & guest information</p>
              </div>
              <button onClick={() => setSelectedBooking(null)} className="p-2 rounded-full hover:bg-muted transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status + Booking ID */}
              <div className="flex items-center justify-between bg-muted/40 rounded-2xl p-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Booking Reference</p>
                  <p className="text-2xl font-black text-primary">{selectedBooking.bookingId}</p>
                </div>
                <select
                  value={selectedBooking.status}
                  onChange={(e) => updateStatus(selectedBooking.id, e.target.value)}
                  className={`h-9 rounded-lg px-3 text-sm font-bold border-0 cursor-pointer ${getStatusColor(selectedBooking.status)}`}
                >
                  {STATUS_OPTIONS.map(opt => <option key={opt} value={opt} className="bg-background text-foreground">{opt}</option>)}
                </select>
              </div>

              {/* Guest Info */}
              <div className="space-y-3">
                <h4 className="font-bold text-foreground flex items-center gap-2"><User className="w-4 h-4 text-primary" /> Guest Information</h4>
                <div className="bg-muted/30 rounded-2xl p-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-wide mb-1">Full Name</p>
                    <p className="font-bold text-foreground">{selectedBooking.guestName || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-wide mb-1">Phone</p>
                    <p className="font-bold text-foreground flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-primary" /> {selectedBooking.guestPhone || '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-wide mb-1">No. of Guests</p>
                    <p className="font-bold text-foreground">{selectedBooking.numberOfGuests || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-wide mb-1">Govt. ID / Aadhaar</p>
                    <p className="font-bold text-foreground">{selectedBooking.guestId || selectedBooking.aadhaarNumber || selectedBooking.idNumber || '—'}</p>
                  </div>
                </div>
              </div>

              {/* Reservation Info */}
              <div className="space-y-3">
                <h4 className="font-bold text-foreground flex items-center gap-2"><BedDouble className="w-4 h-4 text-primary" /> Reservation Info</h4>
                <div className="bg-muted/30 rounded-2xl p-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-wide mb-1">Room</p>
                    <p className="font-bold text-foreground">{selectedBooking.expand?.roomId?.name || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-wide mb-1">Duration</p>
                    <p className="font-bold text-foreground">{selectedBooking.duration || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-wide mb-1">Check-in Date</p>
                    <p className="font-bold text-foreground">{selectedBooking.checkInDate ? new Date(selectedBooking.checkInDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-wide mb-1">Check-in Time</p>
                    <p className="font-bold text-foreground">{selectedBooking.checkInDate ? new Date(selectedBooking.checkInDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}</p>
                  </div>
                  <div className="col-span-2 flex items-center justify-between bg-primary/5 border border-primary/20 rounded-xl p-3">
                    <span className="font-bold text-foreground">Total Amount</span>
                    <span className="text-2xl font-black text-primary flex items-center">₹{selectedBooking.totalPrice}</span>
                  </div>
                </div>
              </div>

              {/* Special Requests */}
              {selectedBooking.specialRequests && (
                <div className="space-y-2">
                  <h4 className="font-bold text-foreground">Special Requests</h4>
                  <p className="bg-muted/30 rounded-xl p-3 text-sm text-muted-foreground">{selectedBooking.specialRequests}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="destructive"
                  className="flex-1 font-bold rounded-xl"
                  onClick={() => handleDelete(selectedBooking.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Delete Booking
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 font-bold rounded-xl"
                  onClick={() => setSelectedBooking(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsTab;
