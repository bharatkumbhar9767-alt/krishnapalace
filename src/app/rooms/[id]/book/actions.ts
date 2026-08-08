"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function createBooking(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be logged in to book a room." };
  }

  const roomId = formData.get("roomId") as string;
  const checkInDate = formData.get("checkInDate") as string;
  const checkOutDate = formData.get("checkOutDate") as string;
  const specialRequests = formData.get("specialRequests") as string;

  if (!roomId || !checkInDate || !checkOutDate) {
    return { error: "Missing required fields." };
  }

  try {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: { category: true }
    });

    if (!room) {
      return { error: "Room not found." };
    }

    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    if (nights <= 0) {
      return { error: "Check-out date must be after check-in date." };
    }

    const totalAmount = Number(room.category.basePrice) * nights;

    // By requirement, bookings are strictly PENDING until handled manually.
    await prisma.booking.create({
      data: {
        userId: session.user.id,
        roomId: room.id,
        checkInDate: start,
        checkOutDate: end,
        totalAmount,
        status: "PENDING",
        specialRequests: specialRequests || null
      }
    });

    revalidatePath("/dashboard");
    revalidatePath("/admin/bookings");
    
    return { success: true };
  } catch (error) {
    console.error("Booking error:", error);
    return { error: "Failed to create booking. Please try again." };
  }
}
