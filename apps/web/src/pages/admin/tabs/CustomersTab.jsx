import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, Search, UserCircle } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import LoadingSpinner from '@/components/LoadingSpinner';

const CustomersTab = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCustomers = async () => {
    try {
      // Fetch all bookings to extract unique customers
      const bookings = await pb.collection('bookings').getFullList({
        sort: '-created',
        $autoCancel: false
      });
      
      const customerMap = new Map();
      
      bookings.forEach(booking => {
        if (!booking.guestPhone) return;
        
        if (customerMap.has(booking.guestPhone)) {
          const existing = customerMap.get(booking.guestPhone);
          existing.totalBookings += 1;
          existing.totalSpent += parseFloat(booking.totalPrice) || 0;
          if (new Date(booking.created) > new Date(existing.lastBookingDate)) {
            existing.lastBookingDate = booking.created;
          }
        } else {
          customerMap.set(booking.guestPhone, {
            id: booking.guestPhone, // use phone as ID
            name: booking.guestName,
            phone: booking.guestPhone,
            email: booking.guestEmail,
            totalBookings: 1,
            totalSpent: parseFloat(booking.totalPrice) || 0,
            firstBookingDate: booking.created,
            lastBookingDate: booking.created
          });
        }
      });

      setCustomers(Array.from(customerMap.values()));
    } catch (err) {
      toast.error('Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(customer => {
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = customer.name?.toLowerCase().includes(searchLower);
    const emailMatch = customer.email?.toLowerCase().includes(searchLower);
    const phoneMatch = customer.phone?.toLowerCase().includes(searchLower);
    return nameMatch || emailMatch || phoneMatch;
  });

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-secondary">Customers Directory</h2>
        
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name, email or phone..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-10 w-full"
          />
        </div>
      </div>
      
      <div className="bg-[hsl(var(--admin-card))] rounded-xl border shadow-sm overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 border-b text-muted-foreground uppercase text-xs">
            <tr>
              <th className="px-4 py-4">Customer</th>
              <th className="px-4 py-4">Contact Info</th>
              <th className="px-4 py-4">Stats</th>
              <th className="px-4 py-4">First Visit</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map(customer => (
              <tr key={customer.id} className="border-b last:border-0 hover:bg-muted/10">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <UserCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-bold text-foreground">{customer.name || 'Unnamed'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="font-medium">{customer.phone || 'No phone'}</div>
                  <div className="text-xs text-muted-foreground">{customer.email || 'No email provided'}</div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm font-bold text-primary">{customer.totalBookings} Bookings</div>
                  <div className="text-xs text-muted-foreground">Spent: ₹{customer.totalSpent}</div>
                </td>
                <td className="px-4 py-4">
                  <div className="font-medium">{new Date(customer.firstBookingDate).toLocaleDateString()}</div>
                </td>
              </tr>
            ))}
            {filteredCustomers.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-12 text-muted-foreground">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <UserCircle className="w-12 h-12 text-muted-foreground/50" />
                    <p className="font-medium text-lg">No customers found</p>
                    {searchTerm ? <p className="text-sm">Try adjusting your search criteria</p> : <p className="text-sm">Guests will appear here once they make bookings.</p>}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomersTab;
