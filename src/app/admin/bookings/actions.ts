"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function updateBookingStatus(bookingId: string, status: "PENDING" | "CONFIRMED" | "CHECKED_IN" | "CHECKED_OUT" | "CANCELLED") {
  const session = await auth();
  
  if (!session || session.user.role !== "SUPER_ADMIN" && session.user.role !== "MANAGER") {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status }
    });

    revalidatePath("/admin/bookings");
    return { success: true };
  } catch (error) {
    console.error("Error updating booking status:", error);
    return { error: "Failed to update booking status" };
  }
}

export async function getAvailableRooms(checkIn: string, checkOut: string) {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  
  if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
    return { error: "Invalid dates provided" };
  }

  try {
    const availableRooms = await prisma.room.findMany({
      where: {
        status: "AVAILABLE",
        bookings: {
          none: {
            status: { in: ["PENDING", "CONFIRMED", "CHECKED_IN"] },
            OR: [
              {
                checkInDate: { lt: checkOutDate },
                checkOutDate: { gt: checkInDate }
              }
            ]
          }
        }
      },
      include: {
        category: true
      },
      orderBy: { roomNumber: 'asc' }
    });
    
    return { rooms: availableRooms };
  } catch (error) {
    console.error("Error fetching available rooms:", error);
    return { error: "Failed to fetch availability" };
  }
}

export async function createManualBooking(data: any) {
  const session = await auth();
  
  if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "MANAGER")) {
    return { error: "Unauthorized" };
  }
  
  try {
    const booking = await prisma.booking.create({
      data: {
        guestName: data.guestName,
        guestEmail: data.guestEmail || "walkin@example.com",
        guestPhone: data.guestPhone,
        guestAddress: data.guestAddress,
        checkInDate: new Date(data.checkInDate),
        checkOutDate: new Date(data.checkOutDate),
        roomId: data.roomId,
        adults: Number(data.adults),
        children: Number(data.children),
        totalAmount: Number(data.totalAmount),
        specialRequest: data.specialRequest,
        status: "CONFIRMED"
      }
    });

    revalidatePath("/admin/bookings");
    return { success: true, bookingId: booking.id };
  } catch (error) {
    console.error("Error creating manual booking:", error);
    return { error: "Failed to create booking" };
  }
}

