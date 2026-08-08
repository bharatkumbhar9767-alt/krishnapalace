"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function cancelBooking(bookingId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) return { error: "Booking not found" };
    if (booking.userId !== session.user.id) return { error: "Unauthorized" };
    if (booking.status !== "PENDING") return { error: "Only pending bookings can be cancelled by the user." };

    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "CANCELLED" }
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to cancel booking" };
  }
}

export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const name = formData.get("name") as string;
  if (!name || name.trim().length < 2) return { error: "Name must be at least 2 characters." };

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { name: name.trim() }
    });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { error: "Failed to update profile" };
  }
}

export async function updatePassword(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;

  if (!currentPassword || !newPassword || newPassword.length < 6) {
    return { error: "New password must be at least 6 characters long." };
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user || !user.password) return { error: "User not found or using OAuth." };

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) return { error: "Incorrect current password." };

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword }
    });

    return { success: true };
  } catch (error) {
    return { error: "Failed to update password" };
  }
}
