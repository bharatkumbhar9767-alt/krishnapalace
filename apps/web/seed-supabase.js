import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://ehfvabxeracajrpkxaor.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_r09QG-lpHqyG6n99NNdLHw_o4fUO6yH";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const defaultAmenities = [
  { id: 'geqpx56nineq7ov', name: 'AC', description: '', icon: '', displayOrder: 0 },
  { id: 'v2ndahgx2ywbftm', name: 'TV', description: '', icon: '', displayOrder: 0 },
  { id: '0rv3osl44czb7qy', name: 'HYGIENIC WASHROOM', description: '', icon: '', displayOrder: 0 },
  { id: 'w7tbdg1a1p1nbvr', name: 'WiFi', description: '', icon: '', displayOrder: 0 },
  { id: 'sc2ldi4mkral08v', name: '24 Hours Cold/Hot Water ', description: '', icon: '', displayOrder: 0 },
  { id: '368qgz782ki8hdl', name: 'Laundry Services', description: '', icon: '', displayOrder: 0 },
  { id: 'k15vssaont8gf7p', name: 'Car Rental ', description: '', icon: '', displayOrder: 0 },
  { id: 'dbwbzswsvy4juby', name: 'Parking', description: '', icon: '', displayOrder: 0 },
  { id: '6vu9livbljlvhzn', name: 'Lift', description: '', icon: '', displayOrder: 0 },
  { id: '5175pzsxum73vtq', name: 'Room Service', description: '', icon: '', displayOrder: 0 },
  { id: 'mufvhv53zzam91r', name: 'Restaurant ', description: '', icon: '', displayOrder: 0 }
];

async function seed() {
  console.log("Seeding default amenities directly into Supabase...");
  
  const { data, error } = await supabase
    .from('amenities')
    .upsert(defaultAmenities, { onConflict: 'id' });
    
  if (error) {
    console.error("Error seeding amenities:", error);
  } else {
    console.log("Successfully seeded default amenities into Supabase!");
    
    // Verify by reading
    const { data: records } = await supabase.from('amenities').select('*');
    console.log("Current amenities in database:", records);
  }
}
seed();
