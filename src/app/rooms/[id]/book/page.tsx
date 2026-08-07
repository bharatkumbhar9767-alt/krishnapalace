import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import BookingForm from "./BookingForm";

async function getRoom(id: string) {
  try {
    return await prisma.room.findUnique({
      where: { id },
      include: { category: true, images: true }
    });
  } catch (e) {
    return null;
  }
}

export default async function BookRoomPage(props: { params: Promise<{ id: string }> }) {
  const session = await auth();
  
  if (!session) {
    // Note: Middleware already protects /dashboard, but to be safe, require login for booking
    redirect("/login");
  }

  const params = await props.params;
  const room = await getRoom(params.id);

  if (!room) {
    notFound();
  }

  const defaultImage = "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop";
  const mainImage = room.images && room.images.length > 0 ? room.images[0].url : defaultImage;

  return (
    <div className="container py-12 md:py-20 max-w-5xl mx-auto">
      <Link href={`/rooms/${room.id}`} className="text-sm text-muted-foreground hover:text-foreground mb-8 inline-block">
        &larr; Back to Room Details
      </Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Complete Your Booking</h1>
            <p className="text-muted-foreground">Please fill in your details below to secure your reservation.</p>
          </div>
          
          <div className="bg-background border rounded-xl p-6 shadow-sm">
            <BookingForm roomId={room.id} pricePerNight={Number(room.category.basePrice)} />
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-muted/30 border rounded-xl overflow-hidden shadow-sm">
            <div className="relative h-48 w-full">
              <Image src={mainImage} alt={room.category.name} fill className="object-cover" />
            </div>
            <div className="p-6 space-y-4">
              <h3 className="text-xl font-bold">{room.category.name} - {room.roomNumber}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>👤 Up to {room.category.capacity} Guests</span>
              </div>
              <div className="pt-4 border-t">
                <div className="flex justify-between items-end">
                  <span className="font-semibold text-lg">Price</span>
                  <div className="text-right">
                    <span className="text-2xl font-bold">${room.category.basePrice.toString()}</span>
                    <span className="text-muted-foreground text-sm block">/ night</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
