
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, IndianRupee, Clock, Users } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Badge } from '@/components/ui/badge';

const DashboardTab = () => {
  const [data, setData] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    pendingBookings: 0,
    recentBookings: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [bookingsRes, billsRes, pendingRes, recentRes, confirmedBookingsRes] = await Promise.all([
          pb.collection('bookings').getList(1, 1, { $autoCancel: false }),
          pb.collection('bills').getFullList({ $autoCancel: false }),
          pb.collection('bookings').getList(1, 1, { filter: 'status="Pending"', $autoCancel: false }),
          pb.collection('bookings').getList(1, 5, { sort: '-created', expand: 'roomId', $autoCancel: false }),
          pb.collection('bookings').getFullList({ filter: 'status="Confirmed"', $autoCancel: false })
        ]);

        // Calculate revenue from both POS bills and confirmed room bookings
        const billsRevenue = billsRes.reduce((sum, bill) => sum + Number(bill.total || 0), 0);
        const bookingsRevenue = confirmedBookingsRes.reduce((sum, booking) => sum + Number(booking.totalPrice || 0), 0);
        
        const totalRevenue = billsRevenue + bookingsRevenue;

        setData({
          totalBookings: bookingsRes.totalItems,
          totalRevenue: totalRevenue,
          pendingBookings: pendingRes.totalItems,
          recentBookings: recentRes.items
        });
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <LoadingSpinner className="min-h-[400px]" />;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-secondary">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-primary shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase">Total Bookings</CardTitle>
            <Calendar className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent><div className="text-3xl font-extrabold">{data.totalBookings}</div></CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-accent shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase">Total Revenue</CardTitle>
            <IndianRupee className="w-5 h-5 text-accent" />
          </CardHeader>
          <CardContent><div className="text-3xl font-extrabold">₹{data.totalRevenue.toLocaleString()}</div></CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase">Pending Requests</CardTitle>
            <Clock className="w-5 h-5 text-orange-500" />
          </CardHeader>
          <CardContent><div className="text-3xl font-extrabold">{data.pendingBookings}</div></CardContent>
        </Card>

        <Card className="border-l-4 border-l-secondary shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase">Recent Activity</CardTitle>
            <Users className="w-5 h-5 text-secondary" />
          </CardHeader>
          <CardContent><div className="text-3xl font-extrabold">{data.recentBookings.length} New</div></CardContent>
        </Card>
      </div>

      <div className="bg-[hsl(var(--admin-card))] rounded-xl border p-6 shadow-sm">
        <h3 className="text-lg font-bold mb-4">Recent Bookings</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Guest</th>
                <th className="px-4 py-3">Room</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.recentBookings.map(b => (
                <tr key={b.id} className="border-b last:border-0 hover:bg-muted/20">
                  <td className="px-4 py-3 font-medium">{b.bookingId}</td>
                  <td className="px-4 py-3">{b.guestName}</td>
                  <td className="px-4 py-3">{b.expand?.roomId?.name}</td>
                  <td className="px-4 py-3">{new Date(b.checkInDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <Badge variant={b.status === 'Confirmed' ? 'default' : b.status === 'Pending' ? 'secondary' : 'outline'} className={b.status === 'Confirmed' ? 'bg-primary' : ''}>
                      {b.status}
                    </Badge>
                  </td>
                </tr>
              ))}
              {data.recentBookings.length === 0 && (
                <tr><td colSpan="5" className="px-4 py-8 text-center text-muted-foreground">No recent bookings</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;
