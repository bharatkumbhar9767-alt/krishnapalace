import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import { auth } from "@/auth";
import BookingForm from "./BookingForm";
import { CheckCircle2, MessageCircle, FileText } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BookRoomPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await auth();
  
  if (!session?.user) {
    redirect(`/login?callbackUrl=/rooms/${params.id}/book`);
  }

  const room = await prisma.room.findUnique({
    where: { id: params.id },
    include: {
      category: true,
      images: true,
    },
  });

  if (!room) {
    notFound();
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container max-w-5xl mx-auto px-4 md:px-6">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Complete Your Booking</h1>
        
        {/* Timeline */}
        <div className="mb-10 p-6 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 relative">
          <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-gray-100 -translate-y-1/2 z-0" />
          
          <div className="flex flex-col items-center text-center gap-2 relative z-10 bg-white px-4">
            <div className="w-12 h-12 rounded-full bg-red-700 text-white flex items-center justify-center font-bold shadow-md shadow-red-700/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-gray-900">1. Fill Details</p>
              <p className="text-xs text-gray-500 max-w-[120px]">Enter your stay information below</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center text-center gap-2 relative z-10 bg-white px-4">
            <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-gray-900">2. Confirm</p>
              <p className="text-xs text-gray-500 max-w-[120px]">Review summary and proceed</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center text-center gap-2 relative z-10 bg-white px-4">
            <div className="w-12 h-12 rounded-full bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 flex items-center justify-center font-bold">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-gray-900">3. Connect</p>
              <p className="text-xs text-gray-500 max-w-[120px]">Chat on WhatsApp to finalize</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Form */}
          <div className="w-full lg:w-2/3">
            <BookingForm room={room} />
          </div>

          {/* Right Column: Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-8">
              <h3 className="font-bold text-lg mb-4 text-gray-900 border-b pb-2">Booking Summary</h3>
              
              <div className="relative h-40 w-full rounded-md overflow-hidden mb-4 bg-gray-100">
                <Image
                  src={(room.images && room.images.length > 0) ? room.images[0].url : "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=800"}
                  alt={room.category.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="space-y-1 mb-6">
                <h4 className="font-bold text-gray-900">{room.category.name}</h4>
                <p className="text-sm text-gray-500">Room {room.roomNumber}</p>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Price per night</span>
                  <span className="font-medium text-gray-900">${room.category.basePrice.toString()}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Taxes & Fees</span>
                  <span>Included</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
