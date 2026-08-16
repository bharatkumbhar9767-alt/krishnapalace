"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";

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

export async function uploadRoomImage(formData: FormData) {
  const session = await auth();
  if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "MANAGER")) {
    return { error: "Unauthorized" };
  }

  const file = formData.get("file") as File;
  const roomId = formData.get("roomId") as string;
  const isPrimary = formData.get("isPrimary") === "true";

  if (!file || !roomId) {
    return { error: "File and Room ID are required." };
  }

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${roomId}-${uuidv4()}.${fileExt}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('room-images')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      console.error("Supabase storage error:", uploadError);
      return { error: `Storage upload failed: ${uploadError.message}` };
    }

    // Get public URL
    const { data: publicUrlData } = supabase
      .storage
      .from('room-images')
      .getPublicUrl(fileName);

    const imageUrl = publicUrlData.publicUrl;

    // Save to Prisma
    await prisma.roomImage.create({
      data: {
        roomId,
        url: imageUrl,
        isPrimary,
      }
    });

    revalidatePath("/admin/rooms");
    return { success: true, url: imageUrl };
  } catch (error: any) {
    console.error("Error uploading room image:", error);
    return { error: "Failed to upload and save image." };
  }
}
