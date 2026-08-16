"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createRoomCategory, createRoom, updateRoomStatus, uploadRoomImage } from "./actions";
import Image from "next/image";
import { toast } from "sonner";
import { Loader2, Plus, ImagePlus } from "lucide-react";

export default function RoomClient({ initialCategories }: { initialCategories: any[] }) {
  const [categories, setCategories] = useState(initialCategories);
  
  // UI State for Forms
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showRoomFormFor, setShowRoomFormFor] = useState<string | null>(null);
  const [uploadingImageFor, setUploadingImageFor] = useState<string | null>(null);

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
      toast.success("Category created successfully!");
      setShowCategoryForm(false);
      setNewCatName(""); setNewCatDesc(""); setNewCatPrice(""); setNewCatCap("");
      setTimeout(() => window.location.reload(), 1500);
    } else {
      toast.error(result.error);
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
      toast.success("Room created successfully!");
      setShowRoomFormFor(null);
      setNewRoomNum(""); setNewRoomStatus("AVAILABLE");
      setTimeout(() => window.location.reload(), 1500);
    } else {
      toast.error(result.error);
    }
  };

  const handleToggleRoomStatus = async (roomId: string, currentStatus: string) => {
    const newStatus = currentStatus === "AVAILABLE" ? "MAINTENANCE" : "AVAILABLE";
    const result = await updateRoomStatus(roomId, newStatus as any);
    if (result.success) {
      toast.success(`Room status updated to ${newStatus}`);
      setTimeout(() => window.location.reload(), 1000);
    } else {
      toast.error(result.error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, roomId: string) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploadingImageFor(roomId);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("roomId", roomId);
    formData.append("isPrimary", "false");

    const result = await uploadRoomImage(formData);
    
    if (result.success) {
      toast.success("Image uploaded successfully!");
      setTimeout(() => window.location.reload(), 1000);
    } else {
      toast.error(result.error);
    }
    setUploadingImageFor(null);
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
                      <div key={room.id} className="flex flex-col gap-4 p-4 border rounded-lg">
                        <div className="flex justify-between items-center">
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
                        
                        {/* Image Gallery */}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {room.images?.map((img: any) => (
                            <div key={img.id} className="relative w-16 h-16 rounded-md overflow-hidden border">
                              <Image src={img.url} alt={`Room ${room.roomNumber}`} fill className="object-cover" />
                            </div>
                          ))}
                          
                          <label className="w-16 h-16 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 hover:border-red-400 transition-all group">
                            {uploadingImageFor === room.id ? (
                              <Loader2 className="w-6 h-6 text-red-600 animate-spin" />
                            ) : (
                              <>
                                <ImagePlus className="w-6 h-6 text-gray-400 group-hover:text-red-500 transition-colors" />
                              </>
                            )}
                            <input 
                              type="file" 
                              className="hidden" 
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, room.id)}
                              disabled={uploadingImageFor === room.id}
                            />
                          </label>
                        </div>
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
