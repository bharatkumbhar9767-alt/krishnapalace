"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createRoomCategory, createRoom, updateRoomStatus } from "./actions";

export default function RoomClient({ initialCategories }: { initialCategories: any[] }) {
  const [categories, setCategories] = useState(initialCategories);
  
  // UI State for Forms
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showRoomFormFor, setShowRoomFormFor] = useState<string | null>(null);

  // Form State
  const [newCatName, setNewCatName] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [newCatPrice, setNewCatPrice] = useState("");
  const [newCatCap, setNewCatCap] = useState("");

  const [newRoomNum, setNewRoomNum] = useState("");
  const [newRoomStatus, setNewRoomStatus] = useState("AVAILABLE");

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createRoomCategory({
      name: newCatName,
      description: newCatDesc,
      basePrice: Number(newCatPrice),
      capacity: Number(newCatCap)
    });

    if (result.success) {
      alert("Category created! Refresh the page to see changes.");
      setShowCategoryForm(false);
      setNewCatName(""); setNewCatDesc(""); setNewCatPrice(""); setNewCatCap("");
    } else {
      alert(result.error);
    }
  };

  const handleCreateRoom = async (e: React.FormEvent, categoryId: string) => {
    e.preventDefault();
    const result = await createRoom({
      roomNumber: newRoomNum,
      categoryId,
      status: newRoomStatus as any
    });

    if (result.success) {
      alert("Room created! Refresh the page to see changes.");
      setShowRoomFormFor(null);
      setNewRoomNum(""); setNewRoomStatus("AVAILABLE");
    } else {
      alert(result.error);
    }
  };

  const handleToggleRoomStatus = async (roomId: string, currentStatus: string) => {
    const newStatus = currentStatus === "AVAILABLE" ? "MAINTENANCE" : "AVAILABLE";
    const result = await updateRoomStatus(roomId, newStatus as any);
    if (result.success) {
      alert(`Room status updated to ${newStatus}. Refreshing...`);
      window.location.reload();
    } else {
      alert(result.error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <Button onClick={() => setShowCategoryForm(!showCategoryForm)}>
          {showCategoryForm ? "Cancel" : "+ Add Room Category"}
        </Button>
      </div>

      {showCategoryForm && (
        <form onSubmit={handleCreateCategory} className="p-6 border rounded-xl bg-background shadow-sm space-y-4">
          <h3 className="font-semibold text-lg">Create New Category</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category Name</Label>
              <Input required value={newCatName} onChange={e => setNewCatName(e.target.value)} placeholder="e.g. Deluxe Suite" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input required value={newCatDesc} onChange={e => setNewCatDesc(e.target.value)} placeholder="Brief description" />
            </div>
            <div className="space-y-2">
              <Label>Base Price ($)</Label>
              <Input required type="number" min="0" value={newCatPrice} onChange={e => setNewCatPrice(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Guest Capacity</Label>
              <Input required type="number" min="1" value={newCatCap} onChange={e => setNewCatCap(e.target.value)} />
            </div>
          </div>
          <Button type="submit">Create Category</Button>
        </form>
      )}

      {categories.length === 0 ? (
        <div className="text-center p-12 border rounded-xl bg-muted/20">
          <h3 className="text-lg font-medium">No Room Categories Found</h3>
          <p className="text-muted-foreground mt-2">Get started by creating your first room category.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {categories.map(category => (
            <div key={category.id} className="border rounded-xl bg-background overflow-hidden shadow-sm">
              <div className="p-6 bg-muted/30 border-b flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold">{category.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{category.description}</p>
                  <div className="flex gap-4 mt-4 text-sm font-medium">
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-md">
                      ${category.basePrice.toFixed(2)} / night
                    </span>
                    <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md">
                      Up to {category.capacity} Guests
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold text-lg">Rooms in this Category</h4>
                  <Button size="sm" onClick={() => setShowRoomFormFor(showRoomFormFor === category.id ? null : category.id)}>
                    {showRoomFormFor === category.id ? "Cancel" : "+ Add Room"}
                  </Button>
                </div>

                {showRoomFormFor === category.id && (
                  <form onSubmit={e => handleCreateRoom(e, category.id)} className="p-4 mb-4 border rounded-lg bg-muted/10 space-y-4">
                    <div className="flex gap-4 items-end">
                      <div className="space-y-2 flex-1">
                        <Label>Room Number</Label>
                        <Input required value={newRoomNum} onChange={e => setNewRoomNum(e.target.value)} placeholder="e.g. 101" />
                      </div>
                      <div className="space-y-2 flex-1">
                        <Label>Initial Status</Label>
                        <select 
                          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={newRoomStatus} 
                          onChange={e => setNewRoomStatus(e.target.value)}
                        >
                          <option value="AVAILABLE">Available</option>
                          <option value="MAINTENANCE">Maintenance</option>
                        </select>
                      </div>
                      <Button type="submit">Save Room</Button>
                    </div>
                  </form>
                )}
                
                {category.rooms.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No rooms added to this category yet.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.rooms.map((room: any) => (
                      <div key={room.id} className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                          <div className="font-medium text-lg">Room {room.roomNumber}</div>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold mt-1 inline-block ${
                            room.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' :
                            room.status === 'OCCUPIED' ? 'bg-blue-100 text-blue-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {room.status}
                          </span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handleToggleRoomStatus(room.id, room.status)}>
                          Toggle Status
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
