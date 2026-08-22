/**
 * UPDATE_PRICING.JS
 * This script updates the Room Pricing in PocketBase to match the new requirements:
 * 
 * Non-AC Rooms:
 *   - 1 Hour: ₹500
 *   - 2 Hours: ₹600
 *   - 24 Hours: ₹1,000
 * 
 * AC Rooms:
 *   - 24 Hours: ₹1,500
 * 
 * Usage: node update_pricing.js
 */

import PocketBase from 'pocketbase';

const PB_URL = 'http://localhost:8090'; // Update this if your PB is running elsewhere
const pb = new PocketBase(PB_URL);

// NOTE: You might need to authenticate if your collection rules are restricted
// await pb.admins.authWithPassword('admin@example.com', 'password');

async function updatePricing() {
  try {
    console.log('--- FETCHING ROOMS ---');
    const rooms = await pb.collection('rooms').getFullList();
    console.log(`Found ${rooms.length} rooms.`);

    for (const room of rooms) {
      const isAC = room.name.toUpperCase().includes('AC') && !room.name.toUpperCase().includes('NON-AC') && !room.name.toUpperCase().includes('NON AC');
      const isNonAC = room.name.toUpperCase().includes('NON-AC') || room.name.toUpperCase().includes('NON AC');

      console.log(`\nRoom: ${room.name} (Detected: ${isAC ? 'AC' : isNonAC ? 'Non-AC' : 'Unknown'})`);

      const targetPricing = [];
      if (isNonAC) {
        targetPricing.push({ duration: '1 Hour', price: 500 });
        targetPricing.push({ duration: '2 Hours', price: 600 });
        targetPricing.push({ duration: '24 Hours', price: 1000 });
        targetPricing.push({ duration: 'Overnight', price: 1000 });
      } else if (isAC) {
        targetPricing.push({ duration: '1 Hour', price: 800 }); // Implied or fallback
        targetPricing.push({ duration: '2 Hours', price: 1000 }); // Implied or fallback
        targetPricing.push({ duration: '24 Hours', price: 1500 });
        targetPricing.push({ duration: 'Overnight', price: 1500 });
      } else {
        console.log('Skipping unknown room type.');
        continue;
      }

      // Update room_pricing collection
      const existingPricing = await pb.collection('room_pricing').getFullList({ filter: `roomId="${room.id}"` });

      for (const target of targetPricing) {
        const existing = existingPricing.find(p => p.duration === target.duration);
        if (existing) {
          if (existing.price !== target.price) {
            await pb.collection('room_pricing').update(existing.id, { price: target.price });
            console.log(`  Updated ${target.duration}: ₹${target.price}`);
          } else {
            console.log(`  ${target.duration} already correct: ₹${target.price}`);
          }
        } else {
          await pb.collection('room_pricing').create({ roomId: room.id, duration: target.duration, price: target.price });
          console.log(`  Created ${target.duration}: ₹${target.price}`);
        }
      }

      // Also update basePrice as fallback
      const newBasePrice = isAC ? 1500 : 1000;
      if (room.basePrice !== newBasePrice) {
        await pb.collection('rooms').update(room.id, { basePrice: newBasePrice });
        console.log(`  Updated basePrice: ₹${newBasePrice}`);
      }
    }

    console.log('\n--- PRICING UPDATE COMPLETE ---');
  } catch (err) {
    console.error('Error updating pricing:', err.message);
    if (err.status === 401 || err.status === 403) {
      console.log('CONSIDER: You might need to authenticate as admin in the script.');
    }
  }
}

updatePricing();
