
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ReadyToBookSection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-primary to-blue-800 text-white">
      <div className="container max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight text-balance">
          Ready to book your stay?
        </h2>
        <p className="text-lg md:text-xl text-white/90 mb-10 font-medium text-balance">
          Contact us on WhatsApp for instant booking and best rates. Our team is ready to assist you 24/7.
        </p>
        <Button 
          size="lg" 
          className="h-16 px-8 text-lg font-bold rounded-full bg-white text-primary hover:bg-gray-100 shadow-xl transition-transform active:scale-95"
          onClick={() => window.open('https://wa.me/919168663151', '_blank')}
        >
          <MessageCircle className="w-6 h-6 mr-2 text-[#25D366]" />
          Book on WhatsApp Now
        </Button>
      </div>
    </section>
  );
};

export default ReadyToBookSection;
