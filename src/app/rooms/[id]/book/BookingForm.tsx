"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createBooking } from "./actions";

const bookingSchema = z.object({
  checkIn: z.string().min(1, "Check-in date is required"),
  checkOut: z.string().min(1, "Check-out date is required"),
  guests: z.coerce.number().int().min(1, "At least 1 guest is required"),
  guestName: z.string().min(2, "Name must be at least 2 characters"),
  guestEmail: z.string().email("Invalid email address"),
  guestPhone: z.string().min(10, "Valid phone number is required"),
  specialRequests: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export default function BookingForm({ roomId, pricePerNight }: { roomId: string, pricePerNight: number }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      guests: 1,
      guestName: "",
      guestEmail: "",
      guestPhone: "",
      specialRequests: "",
    }
  });

  const checkInDate = watch("checkIn");
  const checkOutDate = watch("checkOut");

  let estimatedTotal = 0;
  if (checkInDate && checkOutDate) {
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end > start) {
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      estimatedTotal = days * pricePerNight;
    }
  }

  const onSubmit = async (data: BookingFormValues) => {
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append("roomId", roomId);
    formData.append("checkIn", data.checkIn);
    formData.append("checkOut", data.checkOut);
    formData.append("guests", data.guests.toString());
    formData.append("guestName", data.guestName);
    formData.append("guestEmail", data.guestEmail);
    formData.append("guestPhone", data.guestPhone);
    if (data.specialRequests) formData.append("specialRequests", data.specialRequests);

    const result = await createBooking(null, formData);

    if (result?.error) {
      setError(result.error);
      setIsSubmitting(false);
    } else if (result?.success) {
      router.push(`/dashboard?success=true&id=${result.bookingId}`);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="checkIn">Check-in Date</Label>
          <Input id="checkIn" type="date" {...register("checkIn")} />
          {errors.checkIn && <p className="text-red-500 text-xs">{errors.checkIn.message}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="checkOut">Check-out Date</Label>
          <Input id="checkOut" type="date" {...register("checkOut")} />
          {errors.checkOut && <p className="text-red-500 text-xs">{errors.checkOut.message}</p>}
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t">
        <h3 className="font-semibold text-lg">Guest Information</h3>
        
        <div className="space-y-2">
          <Label htmlFor="guestName">Full Name</Label>
          <Input id="guestName" {...register("guestName")} />
          {errors.guestName && <p className="text-red-500 text-xs">{errors.guestName.message}</p>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="guestEmail">Email Address</Label>
            <Input id="guestEmail" type="email" {...register("guestEmail")} />
            {errors.guestEmail && <p className="text-red-500 text-xs">{errors.guestEmail.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="guestPhone">Phone Number</Label>
            <Input id="guestPhone" type="tel" {...register("guestPhone")} />
            {errors.guestPhone && <p className="text-red-500 text-xs">{errors.guestPhone.message}</p>}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="guests">Number of Guests</Label>
        <Input id="guests" type="number" min="1" {...register("guests")} />
        {errors.guests && <p className="text-red-500 text-xs">{errors.guests.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
        <Textarea 
          id="specialRequests" 
          placeholder="Any special requirements..."
          {...register("specialRequests")}
        />
      </div>

      <div className="p-4 bg-muted/50 rounded-lg border mt-6">
        <div className="flex justify-between items-center text-lg font-semibold">
          <span>Estimated Total</span>
          <span>${estimatedTotal.toFixed(2)}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Excludes taxes and fees.</p>
      </div>

      <Button type="submit" className="w-full text-lg h-12" disabled={isSubmitting}>
        {isSubmitting ? "Processing..." : "Confirm Booking"}
      </Button>
    </form>
  );
}
