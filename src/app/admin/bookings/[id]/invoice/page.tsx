import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AutoPrint from "./AutoPrint";

export const dynamic = "force-dynamic";

export default async function InvoicePage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "MANAGER")) {
    redirect("/dashboard");
  }

  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: {
      room: {
        include: { category: true }
      }
    }
  });

  if (!booking) {
    return <div>Booking not found.</div>;
  }

  const nights = Math.max(1, Math.ceil((new Date(booking.checkOutDate).getTime() - new Date(booking.checkInDate).getTime()) / (1000 * 60 * 60 * 24)));
  const subtotal = booking.room ? booking.room.category.basePrice * nights : 0;
  // Assume basic tax calculation for the invoice (e.g., 18% GST)
  // For this generic template, we'll just show the totalAmount as the final price, assuming taxes are inclusive,
  // or we can just say "Inclusive of all taxes".
  
  const formattedCheckIn = new Date(booking.checkInDate).toLocaleDateString();
  const formattedCheckOut = new Date(booking.checkOutDate).toLocaleDateString();
  const formattedDate = new Date().toLocaleDateString();

  return (
    <div className="bg-white text-black min-h-screen p-8 max-w-4xl mx-auto font-sans">
      <AutoPrint />
      
      {/* Header */}
      <div className="flex justify-between items-start border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">KRISHNA PALACE</h1>
          <p className="text-sm text-gray-500 mt-1">Dehu Road, Pune, Maharashtra</p>
          <p className="text-sm text-gray-500">Phone: +91 XXXXX XXXXX</p>
          <p className="text-sm text-gray-500">GSTIN: 27AABCU9603R1ZM (Placeholder)</p>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold text-gray-800">INVOICE</h2>
          <p className="text-sm font-medium mt-2">Invoice #: INV-{booking.id.slice(-6).toUpperCase()}</p>
          <p className="text-sm text-gray-500">Date: {formattedDate}</p>
          <p className="text-sm text-gray-500">Status: {booking.status}</p>
        </div>
      </div>

      {/* Guest Info */}
      <div className="mt-8 flex justify-between">
        <div>
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-2">Bill To:</h3>
          <p className="font-medium text-lg">{booking.guestName}</p>
          {booking.guestPhone && <p className="text-gray-600">{booking.guestPhone}</p>}
          {booking.guestEmail && <p className="text-gray-600">{booking.guestEmail}</p>}
          {booking.guestAddress && <p className="text-gray-600 mt-1">{booking.guestAddress}</p>}
        </div>
        <div className="text-right">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-2">Stay Details:</h3>
          <p className="text-gray-600">Check-in: <span className="font-medium">{formattedCheckIn}</span></p>
          <p className="text-gray-600">Check-out: <span className="font-medium">{formattedCheckOut}</span></p>
          <p className="text-gray-600">Duration: <span className="font-medium">{nights} Night(s)</span></p>
          <p className="text-gray-600">Guests: <span className="font-medium">{booking.adults} Adults, {booking.children} Children</span></p>
        </div>
      </div>

      {/* Table */}
      <div className="mt-10">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="py-3 px-2 font-bold text-gray-800">Description</th>
              <th className="py-3 px-2 font-bold text-gray-800 text-right">Nights</th>
              <th className="py-3 px-2 font-bold text-gray-800 text-right">Rate</th>
              <th className="py-3 px-2 font-bold text-gray-800 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="py-4 px-2">
                <p className="font-medium">Room Charge</p>
                <p className="text-sm text-gray-500">{booking.room?.category.name} - Room {booking.room?.roomNumber}</p>
              </td>
              <td className="py-4 px-2 text-right">{nights}</td>
              <td className="py-4 px-2 text-right">${Number(booking.room?.category.basePrice || 0).toFixed(2)}</td>
              <td className="py-4 px-2 text-right">${subtotal.toFixed(2)}</td>
            </tr>
            {booking.totalAmount > subtotal && (
              <tr className="border-b border-gray-200">
                <td className="py-4 px-2">
                  <p className="font-medium">Additional Charges / Taxes</p>
                </td>
                <td className="py-4 px-2 text-right">-</td>
                <td className="py-4 px-2 text-right">-</td>
                <td className="py-4 px-2 text-right">${(Number(booking.totalAmount) - subtotal).toFixed(2)}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="mt-6 flex justify-end">
        <div className="w-1/2 max-w-sm">
          <div className="flex justify-between py-2 text-lg font-bold border-t-2 border-gray-800">
            <span>Total Amount</span>
            <span>${Number(booking.totalAmount).toFixed(2)}</span>
          </div>
          <p className="text-xs text-gray-500 text-right mt-1">* Inclusive of all applicable taxes</p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-20 pt-8 border-t text-center text-sm text-gray-500">
        <p>Thank you for choosing Krishna Palace!</p>
        <p>If you have any questions about this invoice, please contact us.</p>
      </div>
    </div>
  );
}
