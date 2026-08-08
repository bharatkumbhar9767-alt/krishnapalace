import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Privacy Policy | Krishna Palace",
};

export default async function PrivacyPolicyPage() {
  const page = await prisma.pageContent.findUnique({
    where: { slug: "privacy-policy" }
  });

  if (!page) {
    // Return a default if not found in DB
    return (
      <div className="container py-12 md:py-24 max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8">Privacy Policy</h1>
        <div className="prose prose-gray max-w-none">
          <p>We are committed to protecting your privacy. We collect personal information solely for the purpose of processing your bookings and improving your experience.</p>
          <h2>Information We Collect</h2>
          <p>We collect your name, email, phone number, and address when you make a booking.</p>
          <h2>How We Use Your Information</h2>
          <p>Your information is used strictly for reservation management, communicating with you about your stay, and internal analytics.</p>
          <h2>Data Security</h2>
          <p>We implement a variety of security measures to maintain the safety of your personal information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12 md:py-24 max-w-4xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-8">{page.title}</h1>
      {/* 
        For a production app, we should use a proper HTML sanitizer here if allowing HTML in the DB.
        Assuming trusted admin input for this demo.
      */}
      <div 
        className="prose prose-gray max-w-none"
        dangerouslySetInnerHTML={{ __html: page.content }} 
      />
    </div>
  );
}
