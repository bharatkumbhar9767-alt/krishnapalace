import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Terms and Conditions | Krishna Palace",
};

export default async function TermsPage() {
  const page = await prisma.pageContent.findUnique({
    where: { slug: "terms" }
  });

  if (!page) {
    // Return a default if not found in DB
    return (
      <div className="container py-12 md:py-24 max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8">Terms and Conditions</h1>
        <div className="prose prose-gray max-w-none">
          <p>Welcome to Krishna Palace. By booking a room with us, you agree to comply with and be bound by the following terms and conditions.</p>
          <h2>1. Booking and Cancellation</h2>
          <p>All bookings are considered pending until confirmed by our staff. You may cancel your booking without penalty up to 48 hours before check-in.</p>
          <h2>2. Check-in and Check-out</h2>
          <p>Check-in time is 2:00 PM and check-out time is 11:00 AM. Early check-in or late check-out is subject to availability and may incur additional charges.</p>
          <h2>3. Guest Conduct</h2>
          <p>Guests are expected to conduct themselves in a respectable manner and will not cause any nuisance or annoyance within the hotel premise.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12 md:py-24 max-w-4xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-8">{page.title}</h1>
      <div 
        className="prose prose-gray max-w-none"
        dangerouslySetInnerHTML={{ __html: page.content }} 
      />
    </div>
  );
}
