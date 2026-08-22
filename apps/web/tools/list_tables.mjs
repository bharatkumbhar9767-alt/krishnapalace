import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://etjmlznvwwcmyunbzqgj.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_FJf_dM8Gt1gXVZfi9yP32w_EHDfrspd";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function listTables() {
  // Use the built-in PostgREST RPC or just query a known table?
  // We can't query information_schema directly from the client anon key easily because of PostgREST restrictions.
  // Instead, let's try to query the REST endpoint directly for the OpenAPI spec, which lists all tables!
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/?apikey=${SUPABASE_ANON_KEY}`);
    const data = await response.json();
    
    // The keys in data.definitions are the tables
    const tables = Object.keys(data.definitions);
    console.log("TABLES FOUND IN PUBLIC SCHEMA:");
    tables.forEach(t => console.log("- " + t));
  } catch(e) {
    console.error("Error:", e);
  }
}

listTables();
