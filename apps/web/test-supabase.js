import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://ehfvabxeracajrpkxaor.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_r09QG-lpHqyG6n99NNdLHw_o4fUO6yH";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function test() {
  try {
    const { data: files, error } = await supabase.storage.from('assets').list('rooms');
    if (error) {
      console.error("Storage list error:", error);
      return;
    }
    console.log("Files in rooms folder:", files);
    for (const f of files) {
      const fullPath = `rooms/${f.name}`;
      console.log(`Trying to download: "${fullPath}"`);
      const { data, error: downloadErr } = await supabase.storage.from('assets').download(fullPath);
      if (downloadErr) {
        console.error(`  Download error for ${fullPath}:`, downloadErr);
      } else {
        console.log(`  Download success! Size: ${data.size}`);
      }
    }
  } catch (e) {
    console.error("Execution failed:", e);
  }
}
test();
