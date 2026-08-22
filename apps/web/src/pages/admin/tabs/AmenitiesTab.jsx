
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Save, Plus } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import LoadingSpinner from '@/components/LoadingSpinner';

const AmenitiesTab = () => {
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [newIcon, setNewIcon] = useState('');

  const fetchAmenities = async () => {
    try {
      const records = await pb.collection('amenities').getFullList({ sort: 'created', $autoCancel: false });
      setAmenities(records);
    } catch (err) {
      toast.error('Failed to load amenities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAmenities();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      await pb.collection('amenities').create({ name: newName, icon: newIcon }, { $autoCancel: false });
      setNewName('');
      setNewIcon('');
      toast.success('Amenity added');
      fetchAmenities();
    } catch (err) {
      toast.error('Failed to add');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this amenity?')) return;
    try {
      await pb.collection('amenities').delete(id, { $autoCancel: false });
      setAmenities(amenities.filter(a => a.id !== id));
      toast.success('Deleted');
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-bold text-secondary mb-6">Manage Amenities</h2>

      <form onSubmit={handleAdd} className="bg-[hsl(var(--admin-card))] p-4 rounded-xl border shadow-sm flex items-end gap-4 mb-8">
        <div className="flex-grow space-y-2">
          <label className="text-sm font-medium">Amenity Name</label>
          <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Swimming Pool" required />
        </div>
        <Button type="submit" className="shrink-0"><Plus className="w-4 h-4 mr-2" /> Add</Button>
      </form>

      <div className="bg-[hsl(var(--admin-card))] border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="px-6 py-3 font-semibold text-muted-foreground uppercase">Amenity Name</th>
              <th className="px-6 py-3 font-semibold text-muted-foreground uppercase w-24 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {amenities.map(a => (
              <tr key={a.id} className="border-b last:border-0 hover:bg-muted/20">
                <td className="px-6 py-4 font-medium">{a.name}</td>
                <td className="px-6 py-4 text-right">
                  <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(a.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
            {amenities.length === 0 && (
              <tr><td colSpan="2" className="px-6 py-8 text-center text-muted-foreground">No amenities added yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AmenitiesTab;
