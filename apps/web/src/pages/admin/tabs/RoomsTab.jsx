
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Edit2, Trash2, IndianRupee, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import LoadingSpinner from '@/components/LoadingSpinner';
import RoomForm from '../components/RoomForm';

const RoomsTab = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const fetchRooms = async () => {
    try {
      const records = await pb.collection('rooms').getFullList({
        sort: 'capacity',
        $autoCancel: false
      });
      setRooms(records);
    } catch (err) {
      toast.error('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this room? This action cannot be undone.')) return;
    try {
      // First delete associated pricing
      const pricing = await pb.collection('room_pricing').getFullList({ filter: `roomId="${id}"`, $autoCancel: false });
      for (const p of pricing) {
        await pb.collection('room_pricing').delete(p.id, { $autoCancel: false });
      }
      // Delete room
      await pb.collection('rooms').delete(id, { $autoCancel: false });
      toast.success('Room deleted successfully');
      fetchRooms();
    } catch (err) {
      toast.error('Failed to delete room');
    }
  };

  const openEdit = (room) => {
    setSelectedRoom(room);
    setIsFormOpen(true);
  };

  const openAdd = () => {
    setSelectedRoom(null);
    setIsFormOpen(true);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-secondary">Manage Rooms</h2>
          <p className="text-muted-foreground text-sm">Add, edit, or configure pricing for your rooms.</p>
        </div>
        <Button onClick={openAdd} className="bg-primary hover:bg-primary/90 text-white shadow-sm transition-transform active:scale-95">
          <Plus className="w-4 h-4 mr-2" /> Add New Room
        </Button>
      </div>

      {rooms.length === 0 ? (
        <div className="text-center py-20 bg-[hsl(var(--admin-card))] rounded-xl border border-dashed text-muted-foreground">
          <p className="text-lg">No rooms found. Add a room to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map(room => (
            <div key={room.id} className="bg-[hsl(var(--admin-card))] rounded-2xl border shadow-sm overflow-hidden flex flex-col group transition-all hover:shadow-md">
              <div className="aspect-video bg-muted relative overflow-hidden">
                {room.image ? (
                  <img src={pb.files.getUrl(room, room.image)} alt={room.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-muted-foreground">
                    <ImageIcon className="w-8 h-8 opacity-30" />
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-bold shadow-sm border">
                  Base: ₹{room.basePrice}
                </div>
                {room.images && room.images.length > 0 && (
                  <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-0.5 rounded text-xs font-medium backdrop-blur-sm">
                    {room.images.length} Gallery Photos
                  </div>
                )}
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-foreground">{room.name}</h3>
                </div>
                <p className="text-muted-foreground text-sm mb-6 line-clamp-2">{room.description || 'No description provided.'}</p>
                
                <div className="mt-auto grid grid-cols-2 gap-3 pt-4 border-t border-border/50">
                  <Button variant="secondary" size="sm" onClick={() => openEdit(room)} className="text-xs font-semibold">
                    <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit / Pricing
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(room.id)} className="text-xs font-semibold">
                    <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isFormOpen && (
        <RoomForm 
          isOpen={isFormOpen} 
          onClose={() => setIsFormOpen(false)} 
          room={selectedRoom} 
          onSuccess={fetchRooms} 
        />
      )}
    </div>
  );
};

export default RoomsTab;
