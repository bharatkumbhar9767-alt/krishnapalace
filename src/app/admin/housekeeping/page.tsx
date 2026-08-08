import prisma from "@/lib/prisma";
import HousekeepingClient from "./HousekeepingClient";

export const dynamic = "force-dynamic";

export default async function HousekeepingPage() {
  const rooms = await prisma.room.findMany({
    include: { category: true },
    orderBy: { roomNumber: 'asc' }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Housekeeping & Maintenance</h1>
        <p className="text-gray-500 mt-1">Manage room statuses for cleaning and maintenance.</p>
      </div>

      <HousekeepingClient initialRooms={rooms} />
    </div>
  );
}
