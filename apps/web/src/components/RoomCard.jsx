import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, CheckCircle2, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import pb from '@/lib/pocketbaseClient';

const RoomCard = ({ room }) => {
  const navigate = useNavigate();
  
  // Get the first image from the images array, or fallback to the old single image field
  const imageUrl = room.images && room.images.length > 0 
    ? pb.files.getUrl(room, room.images[0]) 
    : room.image 
      ? pb.files.getUrl(room, room.image) 
      : null;

  return (
    <div className="bg-card rounded-2xl overflow-hidden border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group flex flex-col h-full">
      {/* Image Section */}
      <div 
        className="aspect-video relative bg-muted overflow-hidden cursor-pointer"
        onClick={() => navigate(`/room/${room.id}`)}
      >
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={room.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-muted/50">
            No Image Available
          </div>
        )}
        <div className="absolute top-4 right-4 bg-background/95 backdrop-blur-md px-3 py-1.5 rounded-full text-sm font-bold shadow-sm text-primary">
          ₹{room.basePrice}/hr
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-2xl font-bold text-foreground leading-tight">{room.name}</h3>
        </div>
        
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {room.description || 'Experience comfort and convenience in our thoughtfully designed room.'}
        </p>

        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-6 bg-muted/50 w-fit px-3 py-1.5 rounded-lg">
          <Users className="w-4 h-4 text-primary" /> 
          <span>Up to {room.capacity} Guests</span>
        </div>

        {/* Amenities Preview */}
        {room.expand?.amenities && room.expand.amenities.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mb-6">
            {room.expand.amenities.slice(0, 4).map(amenity => (
              <div key={amenity.id} className="flex items-center text-xs text-muted-foreground font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-primary shrink-0" />
                <span className="truncate">{amenity.name}</span>
              </div>
            ))}
          </div>
        )}

        {/* Price & Action */}
        <div className="mt-auto pt-4 border-t flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground font-medium block">Starting from</span>
            <span className="text-xl font-extrabold text-foreground flex items-center">
              <IndianRupee className="w-5 h-5 mr-0.5" />{room.basePrice}
            </span>
          </div>
          <Button 
            onClick={() => navigate(`/room/${room.id}`)}
            className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white shadow-md transition-all active:scale-[0.98] rounded-xl px-6"
          >
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
