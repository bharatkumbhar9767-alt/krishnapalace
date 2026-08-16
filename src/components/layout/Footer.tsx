import Link from 'next/link';
import { Crown, MapPin, Mail, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#17101F] text-[#FFF9F0] border-t border-[#D6B56A]/20">
      <div className="container mx-auto px-4 md:px-6 py-14 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-12">
          
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D6B56A]/15 border border-[#D6B56A]/30 text-[#D6B56A]">
                <Crown className="w-4 h-4 text-[#D6B56A]" />
              </div>
              <h3 className="font-serif text-2xl font-bold tracking-tight text-[#FFF9F0]">
                Krishna Palace
              </h3>
            </div>
            <p className="text-sm leading-7 text-[#E8DDEA] max-w-sm">
              A warm and elegant stay crafted with thoughtful hospitality, refined comfort, and memorable luxury experiences.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#D6B56A]/30 bg-[#D6B56A]/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#D6B56A]">
                Dehu Road, Pune
              </span>
            </div>
          </div>

          {/* Navigation Column 1: Explore */}
          <div>
            <h4 className="font-serif text-base font-semibold tracking-wide text-[#D6B56A] mb-4">
              Explore
            </h4>
            <ul className="space-y-3 text-sm text-[#E8DDEA]">
              <li>
                <Link href="/rooms" className="transition-colors hover:text-[#C7A5DD]">
                  Rooms & Suites
                </Link>
              </li>
              <li>
                <Link href="/amenities" className="transition-colors hover:text-[#C7A5DD]">
                  Hotel Amenities
                </Link>
              </li>
              <li>
                <Link href="/attractions" className="transition-colors hover:text-[#C7A5DD]">
                  Local Attractions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-[#C7A5DD]">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation Column 2: Resources */}
          <div>
            <h4 className="font-serif text-base font-semibold tracking-wide text-[#D6B56A] mb-4">
              Resources
            </h4>
            <ul className="space-y-3 text-sm text-[#E8DDEA]">
              <li>
                <Link href="/privacy-policy" className="transition-colors hover:text-[#C7A5DD]">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="transition-colors hover:text-[#C7A5DD]">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/faq" className="transition-colors hover:text-[#C7A5DD]">
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation Column 3: Contact */}
          <div>
            <h4 className="font-serif text-base font-semibold tracking-wide text-[#D6B56A] mb-4">
              Contact & Location
            </h4>
            <ul className="space-y-3.5 text-sm text-[#E8DDEA]">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#D6B56A] shrink-0 mt-1" />
                <span>Old Mumbai Pune Highway, Opp HDFC Bank, Dehu Road, Pune - 412101</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#D6B56A] shrink-0" />
                <a href="mailto:sharathsmumbai@gmail.com" className="hover:text-[#C7A5DD] transition-colors">
                  sharathsmumbai@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#D6B56A] shrink-0" />
                <a href="tel:+917057998449" className="hover:text-[#C7A5DD] transition-colors">
                  +91 7057998449
                </a>
              </li>
              <li className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#D6B56A] shrink-0"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" /><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" /></svg>
                <a href="https://wa.me/917057998449" target="_blank" rel="noopener noreferrer" className="hover:text-[#C7A5DD] transition-colors">
                  WhatsApp Us
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-[#D6B56A]/15 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#E8DDEA]/80">
          <p>&copy; {new Date().getFullYear()} Krishna Palace. All rights reserved.</p>
          <p className="tracking-wide">Designed for comfort & refined hospitality</p>
        </div>
      </div>
    </footer>
  );
}


