"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long."),
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters long."),
});

export async function registerUser(formData: FormData) {
  const result = registerSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!result.success) {
    return { error: result.error.errors[0].message };
  }

  const { name, email, password } = result.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "User with this email already exists." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: Role.CUSTOMER,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
}
