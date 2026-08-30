import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase env vars");
  process.exit(1);
}

const supabase = createSupabaseClient(supabaseUrl, supabaseKey);

async function checkCategoriesDB() {
  console.log("1. Inspecting categories table in Supabase DB...");
  const { data: cats, error } = await supabase.from("categories").select("*");

  console.log("Total categories in DB:", cats?.length || 0);
  console.log("Categories List:", cats);

  console.log("2. Checking storage buckets...");
  const { data: buckets } = await supabase.storage.listBuckets();
  console.log("Buckets:", buckets?.map(b => b.name));
}

checkCategoriesDB();
