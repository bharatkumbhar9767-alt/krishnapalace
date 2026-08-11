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
                Dehuroad, Nashik
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
                <span>Dehuroad, Nashik, Maharashtra</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#D6B56A] shrink-0" />
                <a href="mailto:hello@krishnapalace.com" className="hover:text-[#C7A5DD] transition-colors">
                  hello@krishnapalace.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#D6B56A] shrink-0" />
                <a href="tel:+911234567890" className="hover:text-[#C7A5DD] transition-colors">
                  +91 12345 67890
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


