"use client";

import { Button } from "@/components/ui/button";

export default function InvoiceButton({ bookingId }: { bookingId: string }) {
  const handlePrint = () => {
    // Open the invoice page in a new window to print
    window.open(`/admin/bookings/${bookingId}/invoice`, '_blank', 'width=800,height=900');
  };

  return (
    <Button onClick={handlePrint} className="bg-primary text-primary-foreground">
      Print Invoice
    </Button>
  );
}
