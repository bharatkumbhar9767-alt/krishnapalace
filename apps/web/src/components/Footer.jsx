
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, MessageCircle } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';

const Footer = () => {
  const [settings, setSettings] = useState({
    address: 'Old Mumbai Pune Highway, Opp HDFC Bank, Dehu Road, Pune - 412101',
    phone: '+91 7057998449',
    email: 'sharathsmumbai@gmail.com',
    whatsapp: '+91 7057998449'
  });

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
        // Silently fallback to defaults
      }
    };
    fetchSettings();
  }, []);

  const waNumber = "917057998449";

  return (
    <footer className="bg-secondary text-secondary-foreground border-t-4 border-primary">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand & About */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img 
                src="https://horizons-cdn.hostinger.com/240aa42d-3d2b-4adb-8d31-136b9c2cb9ba/787b07a4f337ecae59f7d54fcf31d5ca.jpg" 
                alt="Hotel Krishna Palace Logo" 
                className="h-[40px] w-auto object-contain bg-white rounded p-1"
              />
              <span className="text-2xl font-extrabold text-white tracking-tight">
                Krishna Palace
              </span>
            </div>
            <p className="text-secondary-foreground/70 text-sm leading-relaxed max-w-xs font-medium">
              Premium comfort and exceptional hospitality in Dehu Road. Your perfect sanctuary for flexible hourly or overnight stays.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <span className="font-bold text-white mb-6 text-lg block">Quick Links</span>
            <ul className="space-y-3">
              <li><Link to="/" className="text-sm font-medium text-secondary-foreground/70 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/rooms" className="text-sm font-medium text-secondary-foreground/70 hover:text-white transition-colors">Our Rooms</Link></li>
              <li><Link to="/about" className="text-sm font-medium text-secondary-foreground/70 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/gallery" className="text-sm font-medium text-secondary-foreground/70 hover:text-white transition-colors">Gallery</Link></li>
              <li><Link to="/contact" className="text-sm font-medium text-secondary-foreground/70 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-2">
            <span className="font-bold text-white mb-6 text-lg block">Contact Us</span>
            <ul className="space-y-4 grid sm:grid-cols-2 gap-x-6 gap-y-2">
              <li className="flex items-start gap-3 text-sm font-medium text-secondary-foreground/70 sm:col-span-2">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="leading-relaxed">{settings.address}</span>
              </li>
              <li className="flex items-center gap-3 text-sm font-medium text-secondary-foreground/70">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-white transition-colors">{settings.phone}</a>
              </li>
              <li className="flex items-center gap-3 text-sm font-medium text-secondary-foreground/70">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors truncate">{settings.email}</a>
              </li>
              <li className="flex items-center gap-3 text-sm font-medium text-secondary-foreground/70 sm:col-span-2 mt-2">
                <MessageCircle className="w-5 h-5 text-[hsl(var(--whatsapp))] shrink-0" />
                <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noreferrer" className="hover:text-white transition-colors font-bold text-white">WhatsApp Us</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-secondary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-secondary-foreground/50 font-medium">
            © 2026 Hotel Krishna Palace. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-secondary-foreground/50 font-medium">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
