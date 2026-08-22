
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { MapPin, Phone, Mail, Send, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    address: 'Old Mumbai Pune Highway, Opp HDFC Bank, Dehu Road, Pune - 412101',
    phone: '+91 7057998449',
    email: 'sharathsmumbai@gmail.com',
    whatsapp: '+91 7057998449'
  });

  const waNumber = "917057998449";

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const records = await pb.collection('hotel_settings').getFullList({ $autoCancel: false });
        if (records.length > 0) {
          setSettings({
            address: records[0].address || settings.address,
            phone: records[0].phone || settings.phone,
            email: records[0].email || settings.email,
            whatsapp: records[0].whatsappNumber || settings.whatsapp
          });
        }
      } catch (err) {
        console.error('Failed to fetch contact settings:', err);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await pb.collection('contacts').create({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        submittedDate: new Date().toISOString()
      }, { $autoCancel: false });
      
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error(error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  return (
    <main className="min-h-screen bg-background py-16 lg:py-24">
      <Helmet>
        <title>Contact Us | Hotel Krishna Palace</title>
      </Helmet>

      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-foreground tracking-tight">Contact Us</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're here to help. Reach out to us for reservations, inquiries, or feedback.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Map & Info Column */}
          <div className="flex flex-col gap-8">
            <Card className="border rounded-2xl p-2 shadow-sm overflow-hidden flex flex-col bg-card">
              <div className="h-[300px] md:h-[400px] w-full rounded-xl overflow-hidden bg-muted relative">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3779.6562260510123!2d73.72948897504185!3d18.679416382445293!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2b0b7a2bb1b23%3A0xa828d2bc29afce60!2sHotel%20Krishna%20Palace!5e0!3m2!1sen!2sin!4v1775922691631!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Hotel Krishna Palace Location"
                  className="w-full h-full absolute inset-0"
                ></iframe>
              </div>
              <div className="p-4 text-center bg-card mt-1">
                <h3 className="font-bold text-lg text-foreground mb-1">Hotel Krishna Palace</h3>
                <p className="font-medium text-muted-foreground mb-2 text-sm">{settings.address}</p>
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=Hotel+Krishna+Palace,+Dehu+Road,+Pune" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-primary hover:text-primary/80 font-bold inline-flex items-center gap-1 transition-colors"
                >
                  <MapPin className="w-4 h-4" /> Open in Google Maps
                </a>
              </div>
            </Card>

            <Card className="border rounded-2xl p-8 shadow-sm bg-card">
              <h2 className="text-2xl font-bold mb-6 border-b pb-4">Contact Details</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">Address</h3>
                    <p className="text-muted-foreground mt-1 leading-relaxed">{settings.address}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">Phone</h3>
                    <div className="flex flex-col gap-1 mt-1">
                      <a href={`tel:${settings.phone}`} className="text-muted-foreground hover:text-primary transition-colors">{settings.phone}</a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[hsl(var(--whatsapp))]/10 rounded-xl flex items-center justify-center shrink-0">
                    <MessageCircle className="w-6 h-6 text-[hsl(var(--whatsapp))]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">WhatsApp</h3>
                    <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-[hsl(var(--whatsapp))] transition-colors block mt-1">{settings.whatsapp}</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">Email</h3>
                    <a href={`mailto:${settings.email}`} className="text-muted-foreground mt-1 hover:text-primary transition-colors block">{settings.email}</a>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Form Column */}
          <Card className="border rounded-2xl p-8 shadow-md h-full bg-card">
            <h2 className="text-2xl font-bold mb-8">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6 flex flex-col h-[calc(100%-4rem)]">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground font-medium">Full Name *</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="Your name" className="h-12 bg-background text-foreground placeholder:text-muted-foreground" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium">Email Address *</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="you@example.com" className="h-12 bg-background text-foreground placeholder:text-muted-foreground" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-foreground font-medium">Phone Number *</Label>
                <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required placeholder="+91 XXXXX XXXXX" className="h-12 bg-background text-foreground placeholder:text-muted-foreground" />
              </div>

              <div className="space-y-2 flex-grow flex flex-col">
                <Label htmlFor="message" className="text-foreground font-medium">Message *</Label>
                <Textarea id="message" name="message" value={formData.message} onChange={handleChange} required placeholder="How can we help you?" className="min-h-[150px] flex-grow resize-none bg-background text-foreground placeholder:text-muted-foreground" />
              </div>

              <Button type="submit" size="lg" className="w-full h-14 text-lg font-bold mt-auto" disabled={loading}>
                {loading ? 'Sending...' : <><Send className="w-5 h-5 mr-2" /> Send Message</>}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default ContactPage;
