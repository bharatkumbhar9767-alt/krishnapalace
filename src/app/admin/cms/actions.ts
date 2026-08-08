"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function approveTestimonial(id: string) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "SUPERADMIN" && session.user.role !== "MANAGER")) {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.testimonial.update({
      where: { id },
      data: { status: "APPROVED" }
    });
    revalidatePath("/admin/cms");
    revalidatePath("/");
    return { success: true };
  } catch (e) {
    return { error: "Failed to approve testimonial" };
  }
}

export async function deleteTestimonial(id: string) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "SUPERADMIN" && session.user.role !== "MANAGER")) {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.testimonial.delete({ where: { id } });
    revalidatePath("/admin/cms");
    revalidatePath("/");
    return { success: true };
  } catch (e) {
    return { error: "Failed to delete testimonial" };
  }
}
