
import React, { useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';

export default function GalleryLightbox({ images, currentIndex, onClose, onNavigate }) {
  const isOpen = currentIndex !== null;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'ArrowLeft') onNavigate(-1);
      if (e.key === 'ArrowRight') onNavigate(1);
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onNavigate, onClose]);

  if (!isOpen || !images[currentIndex]) return null;

  const currentImg = images[currentIndex];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl w-full h-[90vh] p-0 bg-black/95 border-none shadow-2xl flex flex-col overflow-hidden [&>button]:hidden">
        
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-50 bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-full backdrop-blur-md transition-all active:scale-95"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        <button 
          onClick={(e) => { e.stopPropagation(); onNavigate(-1); }} 
          className="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-white/10 hover:bg-white/20 text-white p-3.5 rounded-full backdrop-blur-md transition-all active:scale-95"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>

        <button 
          onClick={(e) => { e.stopPropagation(); onNavigate(1); }} 
          className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-white/10 hover:bg-white/20 text-white p-3.5 rounded-full backdrop-blur-md transition-all active:scale-95"
          aria-label="Next image"
        >
          <ChevronRight className="w-8 h-8" />
        </button>

        <div className="relative flex-grow flex items-center justify-center p-4 md:p-12">
          {/* Main image container maintaining aspect ratio constraint within viewport */}
          <div className="relative max-w-full max-h-full flex items-center justify-center animate-fade-in">
             <img 
              src={pb.files.getUrl(currentImg, currentImg.image)} 
              alt={currentImg.title || 'Full size gallery image'}
              className="max-w-full max-h-[80vh] object-contain rounded-md shadow-2xl select-none"
            />
          </div>
        </div>

        {(currentImg.title || currentImg.description) && (
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6 pt-16 animate-slide-up">
            <div className="max-w-3xl mx-auto text-center">
              {currentImg.title && <h2 className="text-white font-bold text-2xl md:text-3xl mb-2">{currentImg.title}</h2>}
              {currentImg.description && <p className="text-white/80 text-sm md:text-base leading-relaxed">{currentImg.description}</p>}
            </div>
          </div>
        )}

      </DialogContent>
    </Dialog>
  );
}
