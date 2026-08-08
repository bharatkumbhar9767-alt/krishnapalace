import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

async function getUserBookings(userId: string) {
  try {
    return await prisma.booking.findMany({
      where: { userId },
      include: { 
        room: {
          include: { category: true }
        } 
      },
      orderBy: { checkInDate: 'desc' }
    });
  } catch (e) {
    return [];
  }
}

async function getUserDetails(userId: string) {
  try {
    return await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true }
    });
  } catch (e) {
    return null;
  }
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const [bookings, user] = await Promise.all([
    getUserBookings(session.user.id),
    getUserDetails(session.user.id)
  ]);

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="container py-8 max-w-5xl">
      <DashboardClient bookings={bookings} user={user} />
    </div>
  );
}
