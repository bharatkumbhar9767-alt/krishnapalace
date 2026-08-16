"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function ReportsClient({ data }: { data: any }) {
  const { metrics, bookingsByStatus } = data;

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-background rounded-xl border shadow-sm p-6 flex flex-col justify-center">
          <h3 className="text-sm font-medium text-muted-foreground">Total Revenue</h3>
          <p className="text-3xl font-bold mt-2">${metrics.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-background rounded-xl border shadow-sm p-6 flex flex-col justify-center">
          <h3 className="text-sm font-medium text-muted-foreground">Total Bookings</h3>
          <p className="text-3xl font-bold mt-2">{metrics.totalBookings}</p>
        </div>
        <div className="bg-background rounded-xl border shadow-sm p-6 flex flex-col justify-center">
          <h3 className="text-sm font-medium text-muted-foreground">Current Occupancy</h3>
          <p className="text-3xl font-bold mt-2">{metrics.occupancyRate}%</p>
          <p className="text-xs text-muted-foreground mt-1">({metrics.currentlyOccupied} of {metrics.totalRooms} rooms occupied)</p>
        </div>
      </div>

      {/* Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-background rounded-xl border shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-6">Bookings by Status</h3>
          <div className="h-80 w-full">
            {bookingsByStatus && bookingsByStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bookingsByStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {bookingsByStatus.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No booking data available.
              </div>
            )}
          </div>
        </div>

        <div className="bg-background rounded-xl border shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-6">Recent Activity</h3>
          <p className="text-muted-foreground text-sm">
            Detailed timeline and revenue tracking charts would go here (Requires additional time-series data aggregation).
          </p>
        </div>
      </div>
    </div>
  );
}
