"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function ContactPage() {
  return (
    <div className="container py-12 md:py-20">
      <h1 className="text-4xl font-bold tracking-tight text-center mb-12">Contact Us</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
            <p className="text-muted-foreground">
              We would love to hear from you. Whether you have a question about our rooms, pricing, need a custom package, or anything else, our team is ready to answer all your questions.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <span className="text-2xl">📍</span>
              <div>
                <h3 className="font-medium">Address</h3>
                <p className="text-muted-foreground">123 Palace Road, City Center, 12345</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <span className="text-2xl">📞</span>
              <div>
                <h3 className="font-medium">Phone</h3>
                <p className="text-muted-foreground">+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <span className="text-2xl">✉️</span>
              <div>
                <h3 className="font-medium">Email</h3>
                <p className="text-muted-foreground">info@krishnapalace.com</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-muted/30 p-8 rounded-xl border">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Doe" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="john@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="How can we help?" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" placeholder="Your message here..." className="min-h-[120px]" required />
            </div>
            <Button type="submit" className="w-full">Send Message</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
