"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
type RoomStatus = "AVAILABLE" | "RESERVED" | "OCCUPIED" | "CLEANING" | "MAINTENANCE";

export async function createRoomCategory(data: { name: string; description: string; basePrice: number; capacity: number }) {
  const session = await auth();
  if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "MANAGER")) {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.roomCategory.create({
      data: {
        name: data.name,
        description: data.description,
        basePrice: data.basePrice,
        capacity: data.capacity,
      }
    });

    revalidatePath("/admin/rooms");
    return { success: true };
  } catch (error: any) {
    console.error("Error creating room category:", error);
    if (error.code === 'P2002') return { error: "A category with this name already exists." };
    return { error: "Failed to create category." };
  }
}

export async function createRoom(data: { roomNumber: string; categoryId: string; status: RoomStatus }) {
  const session = await auth();
  if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "MANAGER")) {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.room.create({
      data: {
        roomNumber: data.roomNumber,
        categoryId: data.categoryId,
        status: data.status,
      }
    });

    revalidatePath("/admin/rooms");
    return { success: true };
  } catch (error: any) {
    console.error("Error creating room:", error);
    if (error.code === 'P2002') return { error: "A room with this number already exists." };
    return { error: "Failed to create room." };
  }
}

export async function updateRoomStatus(roomId: string, status: RoomStatus) {
  const session = await auth();
  if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "MANAGER")) {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.room.update({
      where: { id: roomId },
      data: { status }
    });

    revalidatePath("/admin/rooms");
    return { success: true };
  } catch (error) {
    console.error("Error updating room status:", error);
    return { error: "Failed to update room status." };
  }
}
