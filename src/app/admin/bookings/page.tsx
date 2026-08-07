import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import BookingClient from "./BookingClient";

export const dynamic = "force-dynamic";

async function getBookings() {
  try {
    return await prisma.booking.findMany({
      include: {
        room: {
          include: { category: true }
        },
        user: true
      },
      orderBy: { createdAt: 'desc' }
    });
  } catch (e) {
    console.error("Failed to fetch bookings:", e);
    return [];
  }
}

export default async function AdminBookingsPage() {
  const session = await auth();
  if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "MANAGER")) {
    redirect("/dashboard");
  }

  const bookings = await getBookings();

  // We serialize dates to strings for client components to avoid hydration warnings
  const serializedBookings = bookings.map(b => ({
    id: b.id,
    guestName: b.guestName,
    guestEmail: b.guestEmail,
    guestPhone: b.guestPhone,
    roomName: b.room ? `${b.room.category.name} - ${b.room.roomNumber}` : "Unknown Room",
    checkInDate: b.checkInDate.toISOString(),
    checkOutDate: b.checkOutDate.toISOString(),
    totalAmount: Number(b.totalAmount),
    status: b.status,
    createdAt: b.createdAt.toISOString()
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Booking Management</h1>
      </div>
      <BookingClient initialBookings={serializedBookings} />
    </div>
  );
}
