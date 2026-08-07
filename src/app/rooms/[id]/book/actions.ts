"use server";

import { z } from "zod";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const bookingSchema = z.object({
  roomId: z.string(),
  checkIn: z.string().transform((str) => new Date(str)),
  checkOut: z.string().transform((str) => new Date(str)),
  guests: z.number().int().min(1),
  guestName: z.string().min(1),
  guestEmail: z.string().email(),
  guestPhone: z.string().min(1),
  specialRequests: z.string().optional(),
});

export async function createBooking(prevState: any, formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "You must be logged in to book a room." };
  }

  try {
    const rawData = {
      roomId: formData.get("roomId"),
      checkIn: formData.get("checkIn"),
      checkOut: formData.get("checkOut"),
      guests: Number(formData.get("guests")),
      guestName: formData.get("guestName"),
      guestEmail: formData.get("guestEmail"),
      guestPhone: formData.get("guestPhone"),
      specialRequests: formData.get("specialRequests") || "",
    };

    const validatedData = bookingSchema.parse(rawData);

    // Validate dates
    if (validatedData.checkIn >= validatedData.checkOut) {
      return { error: "Check-out date must be after check-in date." };
    }

    if (validatedData.checkIn < new Date(new Date().setHours(0,0,0,0))) {
      return { error: "Check-in date cannot be in the past." };
    }

    const room = await prisma.room.findUnique({
      where: { id: validatedData.roomId },
      include: { category: true }
    });

    if (!room) {
      return { error: "Room not found." };
    }

    if (validatedData.guests > room.category.capacity) {
      return { error: `This room can only accommodate up to ${room.category.capacity} guests.` };
    }

    // Check for conflicting bookings
    const conflictingBookings = await prisma.booking.findFirst({
      where: {
        roomId: validatedData.roomId,
        status: { notIn: ["CANCELLED", "CHECKED_OUT"] },
        AND: [
          { checkInDate: { lt: validatedData.checkOut } },
          { checkOutDate: { gt: validatedData.checkIn } },
        ]
      }
    });

    if (conflictingBookings) {
      return { error: "This room is already booked for the selected dates." };
    }

    // Calculate total price
    const msPerDay = 1000 * 60 * 60 * 24;
    const days = Math.ceil((validatedData.checkOut.getTime() - validatedData.checkIn.getTime()) / msPerDay);
    const totalPrice = Number(room.category.basePrice) * days;

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId: session.user.id,
        roomId: validatedData.roomId,
        checkInDate: validatedData.checkIn,
        checkOutDate: validatedData.checkOut,
        totalAmount: totalPrice,
        status: "PENDING",
        guestName: validatedData.guestName,
        guestEmail: validatedData.guestEmail,
        guestPhone: validatedData.guestPhone,
        specialRequest: validatedData.specialRequests,
        adults: validatedData.guests,
      }
    });

    revalidatePath("/dashboard/bookings");
    return { success: true, bookingId: booking.id };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: "Invalid form data. Please check your inputs." };
    }
    console.error("Booking error:", error);
    return { error: "An unexpected error occurred while processing your booking." };
  }
}
