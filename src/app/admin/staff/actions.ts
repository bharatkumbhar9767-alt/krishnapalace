"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function updateStaffRole(userId: string, newRole: string) {
  const session = await auth();
  // Only SUPERADMIN can change roles
  if (!session?.user || session.user.role !== "SUPERADMIN") {
    return { error: "Only Super Admins can update roles." };
  }

  // Prevent changing your own role
  if (session.user.id === userId) {
    return { error: "You cannot change your own role." };
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole as any }
    });
    
    revalidatePath("/admin/staff");
    return { success: true };
  } catch (error) {
    return { error: "Failed to update role" };
  }
}
