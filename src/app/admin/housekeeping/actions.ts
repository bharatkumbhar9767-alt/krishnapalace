"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function updateRoomStatus(roomId: string, status: string) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "SUPERADMIN" && session.user.role !== "MANAGER")) {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.room.update({
      where: { id: roomId },
      data: { status: status as any } // Casting to any to satisfy TS enum
    });
    
    revalidatePath("/admin/housekeeping");
    return { success: true };
  } catch (error) {
    return { error: "Failed to update room status" };
  }
}
