import prisma from "@/lib/prisma";
import CmsClient from "./CMSClient";

export const dynamic = "force-dynamic";

export default async function CmsPage() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">CMS & Settings</h1>
        <p className="text-gray-500 mt-1">Manage public website content like testimonials.</p>
      </div>

      <CmsClient testimonials={testimonials} />
    </div>
  );
}
