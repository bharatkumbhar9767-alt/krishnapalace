export const dynamic = "force-dynamic";

import { MapPin } from "lucide-react";
import prisma from "@/lib/prisma";
import RoomsClient from "./RoomsClient";

async function getRooms() {
  try {
    return await prisma.room.findMany({
      include: {
        category: true,
        images: true
      }
    });
  } catch (e) {
    console.error("Error fetching rooms:", e);
    return [];
  }
}

export default async function RoomsPage() {
  const rooms = await getRooms();

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Search Header Banner */}
      <div className="bg-gray-900 py-4 text-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-sm font-medium">
            <span className="text-gray-400">Showing results for:</span>
            <span className="bg-gray-800 px-3 py-1.5 rounded-full flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" /> Krishna Palace, Mumbai
            </span>
            <span className="bg-gray-800 px-3 py-1.5 rounded-full">18 Jan - 19 Jan</span>
            <span className="bg-gray-800 px-3 py-1.5 rounded-full">1 Room, 2 Guests</span>
          </div>
        </div>
      </div>

      <RoomsClient initialRooms={rooms} />
    </div>
  );
}
