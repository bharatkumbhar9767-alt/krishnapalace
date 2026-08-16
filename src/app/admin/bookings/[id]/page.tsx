import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import InvoiceButton from "./InvoiceButton";

export const dynamic = "force-dynamic";

export default async function BookingDetailsPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "MANAGER")) {
    redirect("/dashboard");
  }

  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: {
      room: {
        include: { category: true }
      },
      user: true
    }
  });

  if (!booking) {
    return <div>Booking not found.</div>;
  }

  const nights = Math.max(1, Math.ceil((new Date(booking.checkOutDate).getTime() - new Date(booking.checkInDate).getTime()) / (1000 * 60 * 60 * 24)));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/bookings" className={buttonVariants({ variant: "outline" })}>
            &larr; Back
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Booking Details</h1>
        </div>
        <InvoiceButton bookingId={booking.id} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-background rounded-xl border shadow-sm p-6 space-y-4">
          <h3 className="text-xl font-bold border-b pb-2">Guest Information</h3>
          <div className="grid grid-cols-2 gap-y-4 text-sm">
            <div className="text-muted-foreground">Name</div>
            <div className="font-medium text-right">{booking.guestName}</div>
            
            <div className="text-muted-foreground">Email</div>
            <div className="font-medium text-right">{booking.guestEmail}</div>
            
            <div className="text-muted-foreground">Phone</div>
            <div className="font-medium text-right">{booking.guestPhone}</div>
            
            <div className="text-muted-foreground">Adults / Children</div>
            <div className="font-medium text-right">{booking.adults} / {booking.children}</div>
            
            {booking.guestAddress && (
              <>
                <div className="text-muted-foreground">Address</div>
                <div className="font-medium text-right">{booking.guestAddress}</div>
              </>
            )}
            
            {booking.specialRequest && (
              <>
                <div className="text-muted-foreground">Special Request</div>
                <div className="font-medium text-right text-orange-600 bg-orange-50 p-2 rounded col-span-2 mt-2">{booking.specialRequest}</div>
              </>
            )}
          </div>
        </div>

        <div className="bg-background rounded-xl border shadow-sm p-6 space-y-4">
          <h3 className="text-xl font-bold border-b pb-2">Stay Details</h3>
          <div className="grid grid-cols-2 gap-y-4 text-sm">
            <div className="text-muted-foreground">Room</div>
            <div className="font-medium text-right">{booking.room?.category.name} - {booking.room?.roomNumber}</div>
            
            <div className="text-muted-foreground">Check In</div>
            <div className="font-medium text-right">{new Date(booking.checkInDate).toLocaleDateString()}</div>
            
            <div className="text-muted-foreground">Check Out</div>
            <div className="font-medium text-right">{new Date(booking.checkOutDate).toLocaleDateString()}</div>
            
            <div className="text-muted-foreground">Duration</div>
            <div className="font-medium text-right">{nights} Night(s)</div>
            
            <div className="text-muted-foreground">Status</div>
            <div className="font-medium text-right">
              <span className={`text-[10px] px-2 py-1 rounded-full uppercase tracking-wider font-semibold ${
                booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                booking.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                booking.status === 'CHECKED_IN' ? 'bg-purple-100 text-purple-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {booking.status}
              </span>
            </div>
            
            <div className="text-muted-foreground text-lg mt-4 font-bold">Total Amount</div>
            <div className="text-right text-lg mt-4 font-bold text-primary">${Number(booking.totalAmount).toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
