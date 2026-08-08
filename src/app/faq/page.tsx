import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "FAQ | Krishna Palace",
  description: "Frequently Asked Questions about staying at Krishna Palace.",
};

async function getFAQs() {
  try {
    return await prisma.fAQ.findMany({
      orderBy: { order: 'asc' }
    });
  } catch (e) {
    console.error("Error fetching FAQs:", e);
    return [];
  }
}

export default async function FAQPage() {
  const faqs = await getFAQs();

  return (
    <div className="container py-12 md:py-24">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4">Frequently Asked Questions</h1>
        <p className="text-lg text-gray-600">Find answers to the most common questions about booking, amenities, and policies.</p>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        {faqs.length === 0 ? (
          <div className="text-center p-8 bg-gray-50 rounded-lg text-gray-500">
            No FAQs available at the moment. Please check back later.
          </div>
        ) : (
          faqs.map((faq) => (
            <div key={faq.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.question}</h3>
              <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
            </div>
          ))
        )}
      </div>
      
      <div className="mt-16 text-center">
        <p className="text-gray-600 mb-4">Still have questions?</p>
        <a href="/contact" className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
          Contact Us
        </a>
      </div>
    </div>
  );
}
