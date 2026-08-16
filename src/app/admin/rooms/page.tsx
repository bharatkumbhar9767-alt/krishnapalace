import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import RoomClient from "./RoomClient";

export const dynamic = "force-dynamic";

async function getRoomData() {
  try {
    const categories = await prisma.roomCategory.findMany({
      include: {
        rooms: {
          include: {
            images: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });
    return categories;
  } catch (e) {
    console.error("Failed to fetch room data:", e);
    return [];
  }
}

export default async function AdminRoomsPage() {
  const session = await auth();
  if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "MANAGER")) {
    redirect("/dashboard");
  }

  const categories = await getRoomData();

  // Serialize dates for client
  const serializedCategories = categories.map(c => ({
    ...c,
    basePrice: Number(c.basePrice),
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
    rooms: c.rooms.map(r => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
      images: r.images.map(img => ({
        ...img,
        createdAt: img.createdAt.toISOString(),
        updatedAt: img.updatedAt.toISOString(),
      }))
    }))
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Room Management</h1>
      </div>
      
      <RoomClient initialCategories={serializedCategories} />
    </div>
  );
}
