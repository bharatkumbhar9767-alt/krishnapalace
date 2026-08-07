"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function updateTestimonialStatus(id: string, status: "APPROVED" | "REJECTED" | "PENDING") {
  const session = await auth();
  if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "MANAGER")) {
    return { error: "Unauthorized" };
  }
  
  try {
    await prisma.testimonial.update({
      where: { id },
      data: { status }
    });
    revalidatePath("/admin/cms");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to update testimonial status" };
  }
}

export async function deleteTestimonial(id: string) {
  const session = await auth();
  if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "MANAGER")) {
    return { error: "Unauthorized" };
  }
  
  try {
    await prisma.testimonial.delete({ where: { id } });
    revalidatePath("/admin/cms");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to delete testimonial" };
  }
}

export async function createFAQ(data: { question: string, answer: string, order: number }) {
  const session = await auth();
  if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "MANAGER")) {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.fAQ.create({
      data: {
        question: data.question,
        answer: data.answer,
        order: data.order
      }
    });
    revalidatePath("/admin/cms");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to create FAQ" };
  }
}

export async function deleteFAQ(id: string) {
  const session = await auth();
  if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "MANAGER")) {
    return { error: "Unauthorized" };
  }
  
  try {
    await prisma.fAQ.delete({ where: { id } });
    revalidatePath("/admin/cms");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to delete FAQ" };
  }
}
