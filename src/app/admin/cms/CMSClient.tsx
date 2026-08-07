"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateTestimonialStatus, deleteTestimonial, createFAQ, deleteFAQ } from "./actions";

export default function CMSClient({ initialTestimonials, initialFaqs }: { initialTestimonials: any[], initialFaqs: any[] }) {
  const [activeTab, setActiveTab] = useState<"testimonials" | "faqs">("testimonials");

  // FAQ Form State
  const [showFaqForm, setShowFaqForm] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [order, setOrder] = useState("0");

  const handleTestimonialAction = async (id: string, action: "APPROVED" | "REJECTED" | "DELETE") => {
    if (action === "DELETE") {
      await deleteTestimonial(id);
    } else {
      await updateTestimonialStatus(id, action as any);
    }
    window.location.reload();
  };

  const handleCreateFAQ = async (e: React.FormEvent) => {
    e.preventDefault();
    await createFAQ({ question, answer, order: parseInt(order) });
    window.location.reload();
  };

  const handleDeleteFAQ = async (id: string) => {
    await deleteFAQ(id);
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <div className="flex border-b">
        <button 
          className={`px-4 py-2 font-medium ${activeTab === "testimonials" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}
          onClick={() => setActiveTab("testimonials")}
        >
          Testimonials
        </button>
        <button 
          className={`px-4 py-2 font-medium ${activeTab === "faqs" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}
          onClick={() => setActiveTab("faqs")}
        >
          FAQs
        </button>
      </div>

      {activeTab === "testimonials" && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Testimonial Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {initialTestimonials.map(t => (
              <div key={t.id} className="p-4 border rounded-xl bg-background shadow-sm space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold">{t.authorName}</h4>
                    <div className="text-yellow-500 text-xs">{"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}</div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    t.status === "APPROVED" ? "bg-green-100 text-green-700" :
                    t.status === "REJECTED" ? "bg-red-100 text-red-700" :
                    "bg-yellow-100 text-yellow-700"
                  }`}>{t.status}</span>
                </div>
                <p className="text-sm text-muted-foreground italic">"{t.content}"</p>
                
                <div className="pt-3 border-t flex gap-2">
                  {t.status !== "APPROVED" && (
                    <Button size="sm" onClick={() => handleTestimonialAction(t.id, "APPROVED")}>Approve</Button>
                  )}
                  {t.status !== "REJECTED" && (
                    <Button size="sm" variant="outline" onClick={() => handleTestimonialAction(t.id, "REJECTED")}>Reject</Button>
                  )}
                  <Button size="sm" variant="destructive" onClick={() => handleTestimonialAction(t.id, "DELETE")}>Delete</Button>
                </div>
              </div>
            ))}
            {initialTestimonials.length === 0 && (
              <div className="col-span-full p-8 text-center text-muted-foreground">No testimonials found.</div>
            )}
          </div>
        </div>
      )}

      {activeTab === "faqs" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
            <Button onClick={() => setShowFaqForm(!showFaqForm)}>{showFaqForm ? "Cancel" : "+ Add FAQ"}</Button>
          </div>

          {showFaqForm && (
            <form onSubmit={handleCreateFAQ} className="p-6 border rounded-xl bg-background shadow-sm space-y-4">
              <div className="space-y-2">
                <Label>Question</Label>
                <Input required value={question} onChange={e => setQuestion(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Answer</Label>
                <Textarea required value={answer} onChange={e => setAnswer(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Display Order (0 is first)</Label>
                <Input type="number" required value={order} onChange={e => setOrder(e.target.value)} />
              </div>
              <Button type="submit">Save FAQ</Button>
            </form>
          )}

          <div className="space-y-3">
            {initialFaqs.map(faq => (
              <div key={faq.id} className="p-4 border rounded-xl bg-background shadow-sm flex justify-between items-center">
                <div>
                  <h4 className="font-bold">Q: {faq.question}</h4>
                  <p className="text-sm text-muted-foreground mt-1">A: {faq.answer}</p>
                  <div className="text-xs text-muted-foreground mt-2">Order: {faq.order}</div>
                </div>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteFAQ(faq.id)}>Delete</Button>
              </div>
            ))}
            {initialFaqs.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">No FAQs found.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
