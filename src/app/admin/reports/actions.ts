"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function getDashboardMetrics() {
  const session = await auth();
  if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "MANAGER")) {
    return { error: "Unauthorized" };
  }

  try {
    // Basic metrics
    const totalBookings = await prisma.booking.count();
    
    // Revenue from confirmed/checked-in/checked-out bookings
    const revenueBookings = await prisma.booking.findMany({
      where: {
        status: { in: ["CONFIRMED", "CHECKED_IN", "CHECKED_OUT"] }
      },
      select: { totalAmount: true }
    });
    const totalRevenue = revenueBookings.reduce((sum, b) => sum + Number(b.totalAmount), 0);

    // Occupancy logic (simplified: number of rooms currently checked in vs total rooms)
    const totalRooms = await prisma.room.count();
    const currentlyOccupied = await prisma.room.count({
      where: { status: "OCCUPIED" }
    });
    
    const occupancyRate = totalRooms > 0 ? Math.round((currentlyOccupied / totalRooms) * 100) : 0;

    // Bookings by Status
    const statusCounts = await prisma.booking.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    });

    const bookingsByStatus = statusCounts.map(item => ({
      name: item.status,
      value: item._count.status
    }));

    return {
      metrics: {
        totalRevenue,
        totalBookings,
        occupancyRate,
        totalRooms,
        currentlyOccupied
      },
      bookingsByStatus
    };
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error);
    return { error: "Failed to fetch metrics" };
  }
}
