"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function getStaff() {
  const session = await auth();
  if (!session || session.user.role !== "SUPER_ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    const staff = await prisma.user.findMany({
      where: {
        role: {
          in: ["MANAGER", "RECEPTIONIST"]
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      },
      orderBy: { createdAt: "desc" }
    });
    return { staff };
  } catch (error) {
    console.error("Error fetching staff:", error);
    return { error: "Failed to fetch staff" };
  }
}

export async function createStaff(data: any) {
  const session = await auth();
  if (!session || session.user.role !== "SUPER_ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });
    
    if (existingUser) {
      return { error: "Email already in use" };
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role
      }
    });

    revalidatePath("/admin/staff");
    return { success: true };
  } catch (error) {
    console.error("Error creating staff:", error);
    return { error: "Failed to create staff account" };
  }
}

export async function deleteStaff(id: string) {
  const session = await auth();
  if (!session || session.user.role !== "SUPER_ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.user.delete({
      where: { id }
    });

    revalidatePath("/admin/staff");
    return { success: true };
  } catch (error) {
    console.error("Error deleting staff:", error);
    return { error: "Failed to delete staff account" };
  }
}
