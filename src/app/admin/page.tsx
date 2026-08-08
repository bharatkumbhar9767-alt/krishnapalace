import prisma from "@/lib/prisma";
import AdminDashboardClient from "./AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [totalBookings, totalUsers, totalRooms, pendingBookings] = await Promise.all([
    prisma.booking.count(),
    prisma.user.count(),
    prisma.room.count(),
    prisma.booking.count({ where: { status: "PENDING" } })
  ]);

  // Calculate total revenue from confirmed/completed bookings
  const bookingsForRevenue = await prisma.booking.findMany({
    where: {
      status: {
        in: ["CONFIRMED", "CHECKED_IN", "CHECKED_OUT"]
      }
    },
    select: {
      totalAmount: true,
      checkInDate: true
    }
  });

  const totalRevenue = bookingsForRevenue.reduce((acc, curr) => acc + Number(curr.totalAmount), 0);

  // Group revenue by month for chart
  const revenueData = Array(12).fill(0);
  bookingsForRevenue.forEach(b => {
    const month = new Date(b.checkInDate).getMonth();
    revenueData[month] += Number(b.totalAmount);
  });

  const chartData = [
    { name: "Jan", revenue: revenueData[0] },
    { name: "Feb", revenue: revenueData[1] },
    { name: "Mar", revenue: revenueData[2] },
    { name: "Apr", revenue: revenueData[3] },
    { name: "May", revenue: revenueData[4] },
    { name: "Jun", revenue: revenueData[5] },
    { name: "Jul", revenue: revenueData[6] },
    { name: "Aug", revenue: revenueData[7] },
    { name: "Sep", revenue: revenueData[8] },
    { name: "Oct", revenue: revenueData[9] },
    { name: "Nov", revenue: revenueData[10] },
    { name: "Dec", revenue: revenueData[11] },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">Welcome back. Here is what's happening at Krishna Palace.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500 mb-1">Total Revenue</p>
          <h3 className="text-3xl font-bold text-gray-900">${totalRevenue}</h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500 mb-1">Total Bookings</p>
          <h3 className="text-3xl font-bold text-gray-900">{totalBookings}</h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500 mb-1">Pending Bookings</p>
          <h3 className="text-3xl font-bold text-orange-600">{pendingBookings}</h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500 mb-1">Total Users</p>
          <h3 className="text-3xl font-bold text-gray-900">{totalUsers}</h3>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-[400px]">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Revenue Analytics</h2>
        <AdminDashboardClient chartData={chartData} />
      </div>
    </div>
  );
}
