
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogOut, UserCircle, Calendar, Clock, IndianRupee, ArrowRight, Save, Phone } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

const CustomerProfilePage = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingUser, setSavingUser] = useState(false);

  const [editUser, setEditUser] = useState({ name: '', phone: '' });

  useEffect(() => {
    if (currentUser) {
      setEditUser({ name: currentUser.name, phone: currentUser.phone });
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!currentUser?.phone) return;
      try {
        const records = await pb.collection('bookings').getFullList({
          filter: `guestPhone="${currentUser.phone}"`,
          expand: 'roomId',
          sort: '-created',
          $autoCancel: false
        });
        setBookings(records);
      } catch (err) {
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [currentUser]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!editUser.name.trim()) return toast.error('Name is required');
    if (editUser.phone.length < 10) return toast.error('Please enter a valid 10-digit mobile number');
    
    setSavingUser(true);
    try {
      const formattedPhone = editUser.phone.replace(/\D/g, '').slice(0, 10);
      
      // Update just the name and phone
      await pb.collection('users').update(currentUser.id, { 
        name: editUser.name,
        phone: formattedPhone
      }, { $autoCancel: false });
      
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error('Failed to update profile. Phone number might already exist.');
    } finally {
      setSavingUser(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return 'bg-emerald-500/10 text-emerald-600 border-emerald-200';
      case 'Pending': return 'bg-amber-500/10 text-amber-600 border-amber-200';
      case 'Completed': return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'Cancelled': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const pendingBookings = bookings.filter(b => b.status === 'Pending');
  const upcomingBookings = bookings.filter(b => b.status === 'Confirmed');

  const BookingCard = ({ booking }) => (
    <Card className="mb-4 overflow-hidden border shadow-sm hover:shadow-md transition-shadow rounded-3xl">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row border-b md:border-b-0 md:border-r border-border">
          <div className="p-6 md:w-1/3 bg-muted/30 flex flex-col justify-center border-r">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Booking ID</span>
            <span className="text-xl font-extrabold text-foreground mb-3">{booking.bookingId}</span>
            <div className={`inline-flex w-fit px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(booking.status)}`}>
              {booking.status}
            </div>
          </div>
          <div className="p-6 md:w-2/3 grid sm:grid-cols-2 gap-6">
            <div>
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider block mb-1">Room</span>
              <span className="font-extrabold text-lg text-foreground">{booking.expand?.roomId?.name || 'Standard Room'}</span>
            </div>
            <div>
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider block mb-1">Check-in</span>
              <span className="font-bold flex items-center text-foreground"><Calendar className="w-4 h-4 mr-2 text-primary" /> {new Date(booking.checkInDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
            </div>
            <div>
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider block mb-1">Duration</span>
              <span className="font-bold flex items-center text-foreground"><Clock className="w-4 h-4 mr-2 text-primary" /> {booking.duration}</span>
            </div>
            <div>
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider block mb-1">Total Amount</span>
              <span className="font-extrabold text-xl text-primary flex items-center"><IndianRupee className="w-4 h-4 mr-0.5" /> {booking.totalPrice}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const EmptyState = ({ message }) => (
    <div className="py-16 text-center border-2 border-dashed rounded-3xl bg-background">
      <p className="text-muted-foreground font-medium text-lg mb-6">{message}</p>
      <Button size="lg" className="rounded-xl font-bold shadow-md" onClick={() => navigate('/rooms')}>Browse Rooms</Button>
    </div>
  );

  if (loading) {
    return (
      <div className="container max-w-5xl mx-auto px-4 py-12 space-y-8">
        <Skeleton className="h-32 w-full rounded-3xl" />
        <Skeleton className="h-64 w-full rounded-3xl" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-muted/20 py-12">
      <Helmet>
        <title>My Profile | Hotel Krishna Palace</title>
      </Helmet>

      <div className="container max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 bg-card p-6 md:p-8 rounded-[2rem] border shadow-sm">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground shrink-0 shadow-lg">
              <UserCircle className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-foreground tracking-tight mb-1">Hello, {currentUser?.name?.split(' ')[0]}</h1>
              <p className="text-muted-foreground font-medium">Manage your account and view bookings.</p>
            </div>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <Button onClick={() => navigate('/rooms')} className="flex-1 md:flex-none font-bold rounded-xl shadow-md h-12 px-6">
              Book Room <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" onClick={handleLogout} className="flex-1 md:flex-none rounded-xl text-destructive hover:text-destructive border-destructive/20 hover:bg-destructive/5 h-12 px-6 font-bold">
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>

        {/* Profile Edit */}
        <Card className="rounded-[2rem] border shadow-sm mb-10 overflow-hidden">
          <CardContent className="p-6 md:p-8 bg-background">
            <h2 className="text-xl font-bold mb-6 border-b pb-4 text-foreground flex items-center"><UserCircle className="w-5 h-5 mr-2 text-primary"/> Personal Information</h2>
            <form onSubmit={handleUpdateProfile} className="grid md:grid-cols-2 gap-6 items-end">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-muted-foreground font-bold uppercase tracking-wider text-xs">Full Name</Label>
                <Input id="name" value={editUser.name} onChange={(e) => setEditUser({...editUser, name: e.target.value})} className="h-14 text-lg font-medium bg-muted/30" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-muted-foreground font-bold uppercase tracking-wider text-xs">Mobile Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input 
                    id="phone" 
                    type="tel"
                    value={editUser.phone} 
                    onChange={(e) => setEditUser({...editUser, phone: e.target.value})}
                    className="pl-11 h-14 text-lg font-medium bg-muted/30" 
                  />
                </div>
              </div>
              <div className="md:col-span-2 pt-4 border-t border-border/50 flex justify-end">
                <Button type="submit" disabled={savingUser || (editUser.name === currentUser?.name && editUser.phone === currentUser?.phone)} className="h-14 px-8 font-bold rounded-xl shadow-md text-base">
                  {savingUser ? 'Saving...' : <><Save className="w-5 h-5 mr-2" /> Save Changes</>}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Bookings */}
        <div className="bg-card rounded-[2rem] border shadow-sm p-6 md:p-8">
          <h2 className="text-xl font-bold mb-6 text-foreground border-b pb-4 flex items-center"><Calendar className="w-5 h-5 mr-2 text-primary" /> Booking History</h2>
          
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full justify-start overflow-x-auto bg-muted/50 p-1.5 mb-8 rounded-2xl h-auto border">
              <TabsTrigger value="all" className="py-3 px-6 rounded-xl text-base font-bold">All Bookings</TabsTrigger>
              <TabsTrigger value="upcoming" className="py-3 px-6 rounded-xl text-base font-bold">Upcoming</TabsTrigger>
              <TabsTrigger value="pending" className="py-3 px-6 rounded-xl text-base font-bold">Pending</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              {bookings.length > 0 ? (
                bookings.map(b => <BookingCard key={b.id} booking={b} />)
              ) : (
                <EmptyState message="You haven't made any bookings yet." />
              )}
            </TabsContent>

            <TabsContent value="upcoming" className="mt-0">
              {upcomingBookings.length > 0 ? (
                upcomingBookings.map(b => <BookingCard key={b.id} booking={b} />)
              ) : (
                <EmptyState message="No confirmed upcoming bookings." />
              )}
            </TabsContent>
            
            <TabsContent value="pending" className="mt-0">
              {pendingBookings.length > 0 ? (
                pendingBookings.map(b => <BookingCard key={b.id} booking={b} />)
              ) : (
                <EmptyState message="No pending bookings awaiting confirmation." />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
};

export default CustomerProfilePage;
