import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PhoneCall, Building2 } from 'lucide-react';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="container px-4 md:px-6 flex items-center justify-between h-16">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-extrabold text-3xl tracking-tighter text-primary">
              OYO
            </span>
            <span className="text-xl font-bold tracking-tight text-gray-900 border-l-2 border-gray-300 pl-2 ml-2 hidden sm:block">
              Krishna Palace
            </span>
          </Link>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
            <Link href="/about" className="flex items-center hover:text-primary transition-colors">
              <Building2 className="w-4 h-4 mr-2 text-primary" />
              List your property
            </Link>
            <Link href="/contact" className="flex items-center hover:text-primary transition-colors">
              <PhoneCall className="w-4 h-4 mr-2 text-primary" />
              0124-6201611
            </Link>
          </div>
          <div className="h-6 w-px bg-gray-300 hidden md:block"></div>
          <Link 
            href="/login" 
            className="text-sm font-bold text-gray-800 hover:text-primary transition-colors"
          >
            Login / Signup
          </Link>
          <Link 
            href="/rooms" 
            className={buttonVariants({ 
              className: "hidden sm:inline-flex rounded font-bold shadow-none"
            })}
          >
            Book Now
          </Link>
        </div>
      </div>
      
      {/* Secondary Nav Bar for categories (OYO style) */}
      <div className="w-full bg-gray-50 border-b border-gray-200 hidden md:block">
        <div className="container px-4 md:px-6 flex items-center gap-8 h-12 text-sm text-gray-600 font-medium overflow-x-auto">
          <Link href="/rooms" className="hover:text-primary whitespace-nowrap py-3">Bangalore</Link>
          <Link href="/rooms" className="hover:text-primary whitespace-nowrap py-3">Chennai</Link>
          <Link href="/rooms" className="hover:text-primary whitespace-nowrap py-3">Delhi</Link>
          <Link href="/rooms" className="hover:text-primary whitespace-nowrap py-3">Gurgaon</Link>
          <Link href="/rooms" className="hover:text-primary whitespace-nowrap py-3">Hyderabad</Link>
          <Link href="/rooms" className="hover:text-primary whitespace-nowrap py-3">Kolkata</Link>
          <Link href="/rooms" className="hover:text-primary whitespace-nowrap py-3">Mumbai</Link>
          <Link href="/rooms" className="hover:text-primary whitespace-nowrap py-3">Noida</Link>
          <Link href="/rooms" className="hover:text-primary whitespace-nowrap py-3">Pune</Link>
          <Link href="/rooms" className="hover:text-primary whitespace-nowrap py-3">All Cities</Link>
        </div>
      </div>
    </header>
  );
}
