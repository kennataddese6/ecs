import { createClient } from "@/lib/supabase/server";
import { Database } from "@/lib/types/database";

export type Category = Database["public"]["Tables"]["categories"]["Row"];

const DEMO_CATEGORIES: Category[] = [
  {
    id: "cat-1",
    name: "Premium Audio",
    slug: "audio",
    description: "Acoustic headphones and wireless sound systems engineered for audiophiles.",
    image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop",
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "cat-2",
    name: "Luxury Apparel",
    slug: "apparel",
    description: "Tailored outerwear and minimalist garments crafted from premium textiles.",
    image_url: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800&auto=format&fit=crop",
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "cat-3",
    name: "Artisan Accessories",
    slug: "accessories",
    description: "Hand-finished Italian leather goods, precision horology, and daily carry.",
    image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop",
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "cat-4",
    name: "Home & Living",
    slug: "home",
    description: "Sculptural objects, ambient lighting, and modern interior essentials.",
    image_url: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=800&auto=format&fit=crop",
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
