"use client";

import { useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X, Crown, ArrowRight } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#17101F]/95 shadow-md border-b border-[#D6B56A]/20 transition-colors backdrop-blur-md">
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between h-20">
        
        {/* Left Branding */}
        <Link href="/" className="flex items-center gap-3.5 group" aria-label="Krishna Palace Home">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-full border border-[#D6B56A]/60 bg-gradient-to-br from-[#D6B56A]/20 to-[#D6B56A]/5 text-[#D6B56A] shadow-xs transition-transform duration-300 group-hover:scale-105">
            <Crown className="w-5 h-5 text-[#D6B56A]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold uppercase tracking-[0.38em] text-[#D6B56A] leading-none mb-1">
              Krishna
            </span>
            <span className="font-serif text-2xl font-bold tracking-tight text-[#D6B56A] leading-none group-hover:text-[#C7A5DD] transition-colors">
              Palace
            </span>
          </div>
        </Link>

        {/* Center Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-9 text-sm font-medium text-[#FFF9F0]">
          <Link
            href="/rooms"
            className="relative py-1 transition-colors hover:text-[#C7A5DD] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-[#A875C9] after:transition-all hover:after:w-full"
          >
            Rooms
          </Link>
          <Link
            href="/amenities"
            className="relative py-1 transition-colors hover:text-[#C7A5DD] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-[#A875C9] after:transition-all hover:after:w-full"
          >
            Amenities
          </Link>
          <Link
            href="/attractions"
            className="relative py-1 transition-colors hover:text-[#C7A5DD] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-[#A875C9] after:transition-all hover:after:w-full"
          >
            Attractions
          </Link>
          <Link
            href="/contact"
            className="relative py-1 transition-colors hover:text-[#C7A5DD] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-[#A875C9] after:transition-all hover:after:w-full"
          >
            Contact
          </Link>
        </nav>

        {/* Right Action CTAs (Desktop) */}
        <div className="hidden md:flex items-center gap-5">
          <Link
            href="/login"
            className="text-sm font-semibold text-[#FFF9F0] transition-colors hover:text-[#C7A5DD] px-3 py-2"
          >
            Login / Signup
          </Link>
          <Link
            href="/rooms"
            className={cn(
              buttonVariants({ size: "default" }),
              "rounded-full bg-[#A875C9] px-6 py-2.5 text-sm font-semibold text-[#FFF9F0] shadow-md shadow-[#A875C9]/25 hover:bg-[#945EB7] hover:shadow-lg hover:shadow-[#A875C9]/35 active:scale-[0.98] transition-all flex items-center gap-2"
            )}
          >
            <span>Book Now</span>
            <ArrowRight className="w-4 h-4 text-[#FFF9F0]/90" />
          </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="flex md:hidden items-center gap-3">
          <Link
            href="/rooms"
            className="rounded-full bg-[#A875C9] px-4 py-2 text-xs font-semibold text-[#FFF9F0] shadow-sm hover:bg-[#945EB7]"
          >
            Book Now
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl border border-[#D6B56A]/30 text-[#FFF9F0] hover:bg-[#25182E] transition-colors focus:outline-none focus:ring-2 focus:ring-[#D6B56A]"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#D6B56A]/25 bg-[#17101F] px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-3 pt-2">
            <Link
              href="/rooms"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-base font-medium text-[#FFF9F0] hover:text-[#C7A5DD] hover:bg-[#25182E] rounded-lg transition-colors"
            >
              Rooms
            </Link>
            <Link
              href="/amenities"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-base font-medium text-[#FFF9F0] hover:text-[#C7A5DD] hover:bg-[#25182E] rounded-lg transition-colors"
            >
              Amenities
            </Link>
            <Link
              href="/attractions"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-base font-medium text-[#FFF9F0] hover:text-[#C7A5DD] hover:bg-[#25182E] rounded-lg transition-colors"
            >
              Attractions
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-base font-medium text-[#FFF9F0] hover:text-[#C7A5DD] hover:bg-[#25182E] rounded-lg transition-colors"
            >
              Contact
            </Link>
          </nav>

          <div className="pt-4 border-t border-[#D6B56A]/20 flex flex-col gap-3">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-sm font-semibold text-[#FFF9F0] border border-[#D6B56A]/40 rounded-full hover:bg-[#25182E]"
            >
              Login / Signup
            </Link>
            <Link
              href="/rooms"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-sm font-semibold text-[#FFF9F0] bg-[#A875C9] rounded-full shadow-sm hover:bg-[#945EB7]"
            >
              Reserve Your Stay
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}


