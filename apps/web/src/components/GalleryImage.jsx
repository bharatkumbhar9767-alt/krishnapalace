
import React, { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import pb from '@/lib/pocketbaseClient';

export default function GalleryImage({ img, onClick }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div 
      className="relative aspect-square overflow-hidden rounded-xl cursor-pointer group border shadow-sm card-shadow bg-muted" 
      onClick={onClick}
    >
      {!loaded && <Skeleton className="absolute inset-0 w-full h-full rounded-xl" />}
      <img 
        src={pb.files.getUrl(img, img.image)} 
        alt={img.title || 'Gallery image'} 
        onLoad={() => setLoaded(true)} 
        className={`w-full h-full object-cover zoomHover ${loaded ? 'opacity-100' : 'opacity-0'}`} 
      />
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4">
        {img.category && (
          <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full mb-3 shadow-md transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            {img.category}
          </span>
        )}
        {img.title && (
          <h3 className="text-white text-center font-bold text-xl drop-shadow-md transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
            {img.title}
          </h3>
        )}
      </div>
    </div>
  );
}
