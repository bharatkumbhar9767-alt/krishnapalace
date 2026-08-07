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
