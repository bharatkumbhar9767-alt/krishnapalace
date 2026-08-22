import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://etjmlznvwwcmyunbzqgj.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_FJf_dM8Gt1gXVZfi9yP32w_EHDfrspd";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkSupa() {
  console.log("Checking connection to Supabase...");
  
  // Check rooms
  const { data: rooms, error: roomsError } = await supabase.from('rooms').select('*').limit(1);
  if (roomsError) {
    console.error("❌ Error fetching rooms:", roomsError.message);
  } else {
    console.log(`✅ Successfully connected to 'rooms' table. Found ${rooms.length} rooms.`);
  }

  // Check bookings (to verify breakfastSelected column is active and accessible)
  const { data: bookings, error: bookingsError } = await supabase.from('bookings').select('*').limit(1);
  if (bookingsError) {
    console.error("❌ Error fetching bookings:", bookingsError.message);
  } else {
    console.log(`✅ Successfully connected to 'bookings' table. Found ${bookings.length} bookings.`);
  }

}

checkSupa();
