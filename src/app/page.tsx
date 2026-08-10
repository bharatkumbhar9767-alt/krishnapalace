import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { MapPin, Calendar, Users, Star } from "lucide-react";
import prisma from "@/lib/prisma";

import HomeClient from "./HomeClient";

export const dynamic = "force-dynamic";

async function getTestimonials() {
  try {
    return await prisma.testimonial.findMany({
      where: { status: "APPROVED" },
      take: 3,
      orderBy: { createdAt: "desc" }
    });
  } catch (e) {
    return [];
  }
}

async function getFeaturedRooms() {
  try {
    return await prisma.roomCategory.findMany({
      take: 3,
      orderBy: { basePrice: "desc" }
    });
  } catch (e) {
    return [];
  }
}

export default async function Home() {
  const [testimonials, featuredRooms] = await Promise.all([
    getTestimonials(),
    getFeaturedRooms()
  ]);

  return <HomeClient testimonials={testimonials} featuredRooms={featuredRooms} />;
}
