import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user.role !== "SUPERADMIN" && session.user.role !== "MANAGER")) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const bookings = await prisma.booking.findMany({
    include: {
      room: { include: { category: true } },
      user: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // Generate CSV
  const headers = ["Booking ID", "Guest Name", "Email", "Room", "Check In", "Check Out", "Status", "Amount", "Booked At"];
  const rows = bookings.map(b => [
    b.id,
    `"${b.guestName || b.user?.name || ""}"`,
    b.guestEmail || b.user?.email || "",
    `${b.room.category.name} - ${b.room.roomNumber}`,
    new Date(b.checkInDate).toISOString().split('T')[0],
    new Date(b.checkOutDate).toISOString().split('T')[0],
    b.status,
    b.totalAmount,
    new Date(b.createdAt).toISOString().split('T')[0],
  ]);

  const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");

  return new NextResponse(csvContent, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="bookings-export-${new Date().toISOString().split('T')[0]}.csv"`
    }
  });
}
