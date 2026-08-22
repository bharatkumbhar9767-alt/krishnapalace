
import { useState, useCallback } from 'react';
import pb from '@/lib/pocketbaseClient';

export const useBookingId = () => {
  const [loading, setLoading] = useState(false);

  const generateBookingId = useCallback(async () => {
    setLoading(true);
    try {
      // Get the latest booking to determine next ID
      const result = await pb.collection('bookings').getList(1, 1, {
        sort: '-created',
        $autoCancel: false
      });

      let nextNumber = 1;
      
      if (result.items.length > 0) {
        const latestId = result.items[0].bookingId; // format: KP001
        if (latestId && latestId.startsWith('KP')) {
          const numPart = parseInt(latestId.substring(2), 10);
          if (!isNaN(numPart)) {
            nextNumber = numPart + 1;
          }
        }
      }

      // Format with leading zeros: KP001, KP012, etc.
      const newBookingId = `KP${nextNumber.toString().padStart(3, '0')}`;
      return newBookingId;
    } catch (error) {
      console.error('Error generating booking ID:', error);
      // Fallback fallback ID
      return `KP${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    } finally {
      setLoading(false);
    }
  }, []);

  return { generateBookingId, loading };
};
