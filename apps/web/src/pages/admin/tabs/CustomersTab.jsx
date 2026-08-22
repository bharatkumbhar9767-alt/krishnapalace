import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, Trash2, Search, UserCircle } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import LoadingSpinner from '@/components/LoadingSpinner';

const CustomersTab = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCustomers = async () => {
    try {
      const records = await pb.collection('users').getFullList({
        sort: '-created',
        $autoCancel: false
      });
      setCustomers(records);
    } catch (err) {
      toast.error('Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer account permanently?')) return;
    try {
      await pb.collection('users').delete(id, { $autoCancel: false });
      toast.success('Customer deleted successfully');
      setCustomers(customers.filter(c => c.id !== id));
    } catch (err) {
      toast.error('Failed to delete customer');
    }
  };

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
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4">Joined Date</th>
              <th className="px-4 py-4 text-right">Actions</th>
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
                      <div className="text-xs text-muted-foreground">ID: {customer.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="font-medium">{customer.phone || 'No phone'}</div>
                  <div className="text-xs text-muted-foreground">{customer.email || 'No email provided'}</div>
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${customer.verified ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                    {customer.verified ? 'Verified' : 'Unverified'}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="font-medium">{new Date(customer.created).toLocaleDateString()}</div>
                </td>
                <td className="px-4 py-4 text-right space-x-2">
                  <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => window.alert('Profile view coming soon')}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 px-2 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(customer.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
            {filteredCustomers.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-12 text-muted-foreground">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <UserCircle className="w-12 h-12 text-muted-foreground/50" />
                    <p className="font-medium text-lg">No customers found</p>
                    {searchTerm && <p className="text-sm">Try adjusting your search criteria</p>}
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
