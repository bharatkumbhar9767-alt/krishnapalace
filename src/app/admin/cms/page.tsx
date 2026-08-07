import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import CMSClient from "./CMSClient";

export const dynamic = "force-dynamic";

export default async function AdminCMSPage() {
  const session = await auth();
  if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "MANAGER")) {
    redirect("/dashboard");
  }

  const [testimonials, faqs] = await Promise.all([
    prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.fAQ.findMany({ orderBy: { order: 'asc' } })
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Content Management System</h1>
      </div>

      <CMSClient 
        initialTestimonials={testimonials}
        initialFaqs={faqs}
      />
    </div>
  );
}
