import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const session = await auth();
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const booking = await prisma.booking.findUnique({
    where: { id: id },
    include: {
      user: true,
      room: {
        include: { category: true }
      }
    }
  });

  if (!booking) {
    return new NextResponse("Booking not found", { status: 404 });
  }

  // Ensure user can only print their own invoice unless they are an admin
  if (booking.userId !== session.user.id && session.user.role !== "SUPERADMIN" && session.user.role !== "MANAGER") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice - ${booking.id}</title>
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #333; line-height: 1.6; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #ee2e24; padding-bottom: 20px; mb-40px; }
        .logo-text { color: #ee2e24; font-size: 28px; font-weight: bold; }
        .invoice-title { font-size: 24px; color: #666; }
        .details { display: flex; justify-content: space-between; margin-top: 40px; margin-bottom: 40px; }
        .box { border: 1px solid #ddd; padding: 20px; border-radius: 8px; width: 45%; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: #f9f9f9; }
        .total { font-size: 20px; font-weight: bold; text-align: right; margin-top: 20px; }
        .footer { text-align: center; color: #888; margin-top: 50px; font-size: 12px; border-top: 1px solid #ddd; padding-top: 20px; }
        @media print {
          body { -webkit-print-color-adjust: exact; padding: 0; }
        }
      </style>
    </head>
    <body onload="window.print()">
      <div class="header">
        <div class="logo-text">Krishna Palace</div>
        <div class="invoice-title">INVOICE</div>
      </div>
      
      <div class="details">
        <div class="box">
          <h3>Billed To:</h3>
          <p><strong>Name:</strong> ${booking.user.name}</p>
          <p><strong>Email:</strong> ${booking.user.email}</p>
        </div>
        <div class="box">
          <h3>Invoice Details:</h3>
          <p><strong>Invoice #:</strong> ${booking.id.substring(0, 8).toUpperCase()}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          <p><strong>Status:</strong> ${booking.status}</p>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Check In</th>
            <th>Check Out</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Room ${booking.room.roomNumber} - ${booking.room.category.name}</td>
            <td>${new Date(booking.checkInDate).toLocaleDateString()}</td>
            <td>${new Date(booking.checkOutDate).toLocaleDateString()}</td>
            <td>$${booking.totalAmount}</td>
          </tr>
        </tbody>
      </table>

      <div class="total">
        Total Amount: $${booking.totalAmount}
      </div>

      <div class="footer">
        Thank you for choosing Krishna Palace. For any inquiries, please contact support@krishnapalace.com.
      </div>
    </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' }
  });
}
