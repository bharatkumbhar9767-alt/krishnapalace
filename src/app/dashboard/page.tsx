import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import Link from "next/link";

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

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const bookings = await getUserBookings(session.user.id);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Your upcoming and past reservations.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {bookings.length === 0 ? (
              <div className="text-sm text-muted-foreground">You have no bookings yet.</div>
            ) : (
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {bookings.map(booking => (
                  <div key={booking.id} className="flex justify-between items-center p-3 border rounded-lg bg-muted/20">
                    <div>
                      <p className="font-semibold text-sm">{booking.room?.category?.name ? `${booking.room.category.name} - ${booking.room.roomNumber}` : "Room"}</p>
                      <p className="text-xs text-muted-foreground">
                        {booking.checkInDate.toLocaleDateString()} - {booking.checkOutDate.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">${booking.totalAmount.toString()}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                        booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                        booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                        booking.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Link href="/rooms" className={buttonVariants()}>Book a Room</Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Profile Completion</CardTitle>
            <CardDescription>Your profile is 80% complete.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="w-full bg-secondary rounded-full h-2.5">
              <div className="bg-primary h-2.5 rounded-full w-4/5"></div>
            </div>
            <Link href="/dashboard/profile" className={buttonVariants({ variant: "outline" })}>Update Profile</Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
