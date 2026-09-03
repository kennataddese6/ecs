import { createClient } from "@/lib/supabase/server";
import { Database } from "@/lib/types/database";

export type Category = Database["public"]["Tables"]["categories"]["Row"];

export async function getCategories(): Promise<Category[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("active", true)
      .order("name", { ascending: true });

    if (!error && data) {
      return data;
    }
  } catch (e) {
    console.error("Error in getCategories:", e);
  }

  return [];
}

export async function getCategoryById(id: string): Promise<Category | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (!error && data) {
      return data;
    }
  } catch (e) {
    console.error("Error in getCategoryById:", e);
  }

  return null;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .eq("active", true)
      .maybeSingle();

    if (!error && data) {
      return data;
    }
  } catch (e) {
    console.error("Error in getCategoryBySlug:", e);
  }

  return null;
}
