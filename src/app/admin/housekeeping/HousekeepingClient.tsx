"use client";

import { useState } from "react";
import { updateRoomStatus } from "./actions";

export default function HousekeepingClient({ initialRooms }: { initialRooms: any[] }) {
  const [rooms, setRooms] = useState(initialRooms);
  const [loading, setLoading] = useState<string | null>(null);

  const handleStatusChange = async (roomId: string, newStatus: string) => {
    setLoading(roomId);
    const res = await updateRoomStatus(roomId, newStatus);
    
    if (res.success) {
      setRooms(rooms.map(r => r.id === roomId ? { ...r, status: newStatus } : r));
    } else {
      alert(res.error);
    }
    setLoading(null);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'AVAILABLE': return 'bg-green-100 text-green-800';
      case 'OCCUPIED': return 'bg-blue-100 text-blue-800';
      case 'RESERVED': return 'bg-purple-100 text-purple-800';
      case 'CLEANING': return 'bg-yellow-100 text-yellow-800';
      case 'MAINTENANCE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="p-4 font-bold text-gray-900">Room Number</th>
            <th className="p-4 font-bold text-gray-900">Category</th>
            <th className="p-4 font-bold text-gray-900">Current Status</th>
            <th className="p-4 font-bold text-gray-900">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {rooms.map((room) => (
            <tr key={room.id} className="hover:bg-gray-50 transition-colors">
              <td className="p-4 font-medium text-gray-900">{room.roomNumber}</td>
              <td className="p-4 text-gray-600">{room.category.name}</td>
              <td className="p-4">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold tracking-wide ${getStatusColor(room.status)}`}>
                  {room.status}
                </span>
              </td>
              <td className="p-4">
                <select 
                  value={room.status}
                  onChange={(e) => handleStatusChange(room.id, e.target.value)}
                  disabled={loading === room.id}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 disabled:opacity-50"
                >
                  <option value="AVAILABLE">Mark Available</option>
                  <option value="CLEANING">Needs Cleaning</option>
                  <option value="MAINTENANCE">Under Maintenance</option>
                </select>
              </td>
            </tr>
          ))}
          {rooms.length === 0 && (
            <tr>
              <td colSpan={4} className="p-8 text-center text-gray-500">No rooms found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
