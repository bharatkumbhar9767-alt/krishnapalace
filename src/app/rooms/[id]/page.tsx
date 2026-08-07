import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { buttonVariants } from "@/components/ui/button";

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

export default async function RoomDetailsPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const room = await getRoom(params.id);

  if (!room) {
    notFound();
  }

  const defaultImage = "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop";
  const mainImage = room.images && room.images.length > 0 ? room.images[0].url : defaultImage;

  return (
    <div className="container py-12 md:py-20">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Images Section */}
        <div className="lg:w-2/3 space-y-4">
          <div className="relative h-[400px] md:h-[600px] rounded-xl overflow-hidden border">
            <Image
              src={mainImage}
              alt={room.category.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          {room.images && room.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {room.images.slice(1, 5).map((img, idx) => (
                <div key={idx} className="relative h-24 md:h-32 rounded-lg overflow-hidden border">
                  <Image src={img.url} alt={`${room.category.name} ${idx + 2}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="lg:w-1/3 space-y-8">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-4xl font-bold">{room.category.name} - {room.roomNumber}</h1>
            </div>
            <div className="flex items-center gap-4 text-muted-foreground mt-4">
              <span className="flex items-center gap-1">👤 Up to {room.category.capacity} Guests</span>
              {room.category && <span className="px-2 py-1 bg-secondary rounded-md text-xs">{room.category.name}</span>}
            </div>
          </div>

          <div className="p-6 bg-muted/30 rounded-xl border space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">${room.category.basePrice.toString()}</span>
              <span className="text-muted-foreground">/ night</span>
            </div>
            <p className="text-sm text-muted-foreground pb-4 border-b">
              Price excludes taxes and fees. Free cancellation up to 48 hours before check-in.
            </p>
            <Link 
              href={`/rooms/${room.id}/book`} 
              className={buttonVariants({ className: "w-full text-lg h-12" })}
            >
              Book This Room
            </Link>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Description</h3>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {room.category.description}
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Amenities</h3>
            <div className="grid grid-cols-2 gap-y-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="text-primary">✓</span> Free Wi-Fi
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="text-primary">✓</span> Air Conditioning
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="text-primary">✓</span> Room Service
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="text-primary">✓</span> Daily Housekeeping
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="text-primary">✓</span> Flat-screen TV
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="text-primary">✓</span> Safe
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
