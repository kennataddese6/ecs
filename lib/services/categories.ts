import { createClient } from "@/lib/supabase/server";
import { Database } from "@/lib/types/database";

export type Category = Database["public"]["Tables"]["categories"]["Row"];

const DEMO_CATEGORIES: Category[] = [
  {
    id: "cat-1",
    name: "Ethiopian Coffee & Buna",
    slug: "coffee",
    description: "Single-origin Yirgacheffe coffee beans, green beans, Jebena pots, and coffee ceremony accessories.",
    image_url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop",
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "cat-2",
    name: "Traditional Habesha Apparel",
    slug: "apparel",
    description: "Handwoven Habesha Kemis, woven Shemma dresses, Netela scarves, and traditional embroidered garments.",
    image_url: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop",
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "cat-3",
    name: "Spices & Niter Kibe",
    slug: "spices",
    description: "Authentic Berbere spice blend, traditional spiced butter (Niter Kibe), Korerima, and culinary herbs.",
    image_url: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800&auto=format&fit=crop",
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "cat-4",
    name: "Artisan Mesob & Crafts",
    slug: "crafts",
    description: "Handcrafted woven Mesob baskets, clay pottery, traditional cross artifacts, and cultural decor.",
    image_url: "https://images.unsplash.com/photo-1606744824163-985d376605aa?q=80&w=800&auto=format&fit=crop",
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export async function getCategories(): Promise<Category[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("active", true)
      .order("name", { ascending: true });

    if (!error && data && data.length > 0) {
      return data;
    }
  } catch (e) {}

  return DEMO_CATEGORIES;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .eq("active", true)
      .single();

    if (!error && data) {
      return data;
    }
  } catch (e) {}

  return DEMO_CATEGORIES.find((c) => c.slug === slug) || DEMO_CATEGORIES[0];
}
