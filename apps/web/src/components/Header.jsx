
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, User, ShieldAlert, MessageCircle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext.jsx';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isCustomer, currentUser, logout } = useAuth();
  
  const waNumber = "917057998449";

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Rooms', path: '/rooms' },
    { name: 'Offers', path: '/#offers' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-md text-foreground shadow-sm transition-all duration-300">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <img 
            src="https://horizons-cdn.hostinger.com/240aa42d-3d2b-4adb-8d31-136b9c2cb9ba/787b07a4f337ecae59f7d54fcf31d5ca.jpg" 
            alt="Hotel Krishna Palace Logo" 
            className="h-[50px] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <div className="flex flex-col hidden sm:flex">
            <span className="font-bold text-xl tracking-tight leading-none text-foreground transition-colors group-hover:text-primary">
              Hotel Krishna Palace
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-bold tracking-wide transition-all duration-200 hover:text-primary hover:-translate-y-0.5 ${
                isActive(link.path) ? 'text-primary border-b-2 border-primary pb-1' : 'text-muted-foreground'
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          <div className="flex items-center gap-4 border-l pl-6 ml-2">
            <Button 
              variant="ghost" 
              className="text-[hsl(var(--whatsapp))] hover:text-[hsl(var(--whatsapp))/80] hover:bg-[hsl(var(--whatsapp))/10] rounded-full font-bold"
              onClick={() => window.open(`https://wa.me/${waNumber}`, '_blank')}
            >
              <MessageCircle className="w-5 h-5 mr-1" /> WhatsApp
            </Button>

            <Button 
              variant="ghost" 
              className="text-sm font-bold text-muted-foreground hover:text-primary hover:bg-primary/10 flex items-center gap-2 rounded-full"
              onClick={() => navigate('/admin')}
            >
              <ShieldAlert className="w-4 h-4" /> Admin
            </Button>
            
            {isCustomer ? (
              <Link to="/profile">
                <Button variant="outline" className="gap-2 rounded-full font-bold shadow-sm">
                  <User className="w-4 h-4" />
                  {currentUser?.name?.split(' ')[0] || 'Profile'}
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button className="rounded-full bg-primary hover:bg-primary/90 text-white font-bold shadow-md px-6">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-[hsl(var(--whatsapp))]"
            onClick={() => window.open(`https://wa.me/${waNumber}`, '_blank')}
          >
            <MessageCircle className="w-6 h-6" />
          </Button>
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Toggle menu">
                <Menu className="w-7 h-7" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetTitle className="text-left mb-6 font-bold text-2xl">Menu</SheetTitle>
              <div className="flex flex-col space-y-4 mt-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-lg font-bold p-3 rounded-xl transition-colors ${
                      isActive(link.path) ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="pt-6 mt-4 border-t flex flex-col gap-4">
                  <Button 
                    className="w-full rounded-xl flex justify-start pl-4 font-bold h-12" 
                    variant="outline"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate('/admin');
                    }}
                  >
                    <ShieldAlert className="w-5 h-5 mr-3" /> Admin Panel
                  </Button>
                  
                  {isCustomer ? (
                    <>
                      <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button className="w-full rounded-xl flex justify-start pl-4 font-bold h-12 bg-primary text-white hover:bg-primary/90">
                          <User className="w-5 h-5 mr-3" /> Profile
                        </Button>
                      </Link>
                      <Button className="w-full rounded-xl flex justify-start pl-4 text-destructive font-bold h-12" variant="ghost" onClick={() => { setIsMobileMenuOpen(false); logout(); }}>
                        <LogOut className="w-5 h-5 mr-3" /> Logout
                      </Button>
                    </>
                  ) : (
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full rounded-xl bg-primary text-white font-bold h-14 text-lg shadow-md">Login / Signup</Button>
                    </Link>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
