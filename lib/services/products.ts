import { createClient } from "@/lib/supabase/server";
import { Database } from "@/lib/types/database";

export type Product = Database["public"]["Tables"]["products"]["Row"];
export type ProductImage = Database["public"]["Tables"]["product_images"]["Row"];

export interface ProductWithImages extends Product {
  product_images?: ProductImage[];
  categories?: Database["public"]["Tables"]["categories"]["Row"] | null;
}

export type ProductSortOption = "newest" | "price-asc" | "price-desc" | "name-asc";

const DEMO_PRODUCTS: ProductWithImages[] = [
  {
    id: "prod-1",
    name: "LUMEN Studio Master Wireless Headphones",
    slug: "lumen-studio-master-wireless-headphones",
    description: "Features active noise cancellation, beryllium acoustic drivers, and 38-hour battery playback.",
    price: 349.00,
    compare_at_price: 420.00,
    stock_quantity: 15,
    sku: "AUD-001",
    category_id: "cat-1",
    featured: true,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    categories: { id: "cat-1", name: "Premium Audio", slug: "audio", description: null, image_url: null, active: true, created_at: "", updated_at: "" },
    product_images: [{ id: "img-1", product_id: "prod-1", image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop", alt_text: null, sort_order: 0, created_at: "" }],
  },
  {
    id: "prod-2",
    name: "Tuscan Grain Leather Tote",
    slug: "tuscan-grain-leather-tote",
    description: "Handcrafted in Florence using vegetable-tanned full-grain leather with solid brass hardware.",
    price: 280.00,
    compare_at_price: 320.00,
    stock_quantity: 8,
    sku: "ACC-001",
    category_id: "cat-3",
    featured: true,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    categories: { id: "cat-3", name: "Artisan Accessories", slug: "accessories", description: null, image_url: null, active: true, created_at: "", updated_at: "" },
    product_images: [{ id: "img-2", product_id: "prod-2", image_url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop", alt_text: null, sort_order: 0, created_at: "" }],
  },
  {
    id: "prod-3",
    name: "Chronos Titanium Automatic Watch",
    slug: "chronos-titanium-automatic-watch",
    description: "Grade-5 titanium casing with Swiss automatic movement and sapphire crystal glass.",
    price: 890.00,
    compare_at_price: 990.00,
    stock_quantity: 4,
    sku: "ACC-002",
    category_id: "cat-3",
    featured: true,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    categories: { id: "cat-3", name: "Artisan Accessories", slug: "accessories", description: null, image_url: null, active: true, created_at: "", updated_at: "" },
    product_images: [{ id: "img-3", product_id: "prod-3", image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop", alt_text: null, sort_order: 0, created_at: "" }],
  },
  {
    id: "prod-4",
    name: "Minimalist Wool Cashmere Overcoat",
    slug: "minimalist-wool-cashmere-overcoat",
    description: "Tailored fit overcoat spun from double-faced Italian wool cashmere blend.",
    price: 450.00,
    compare_at_price: 550.00,
    stock_quantity: 12,
    sku: "APP-001",
    category_id: "cat-2",
    featured: true,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    categories: { id: "cat-2", name: "Luxury Apparel", slug: "apparel", description: null, image_url: null, active: true, created_at: "", updated_at: "" },
    product_images: [{ id: "img-4", product_id: "prod-4", image_url: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800&auto=format&fit=crop", alt_text: null, sort_order: 0, created_at: "" }],
  },
];

function getDemoProducts(options?: {
  categoryId?: string;
  categorySlug?: string;
  featured?: boolean;
  search?: string;
  sort?: ProductSortOption;
  limit?: number;
  offset?: number;
}): { products: ProductWithImages[]; total: number } {
  let filtered = [...DEMO_PRODUCTS];
  if (options?.featured !== undefined) {
    filtered = filtered.filter((p) => p.featured === options.featured);
  }
  if (options?.search) {
    filtered = filtered.filter((p) => p.name.toLowerCase().includes(options.search!.toLowerCase()));
  }
  if (options?.categorySlug) {
    filtered = filtered.filter((p) => p.categories?.slug === options.categorySlug);
  }
  if (options?.limit) {
    const from = options.offset ?? 0;
    filtered = filtered.slice(from, from + options.limit);
  }
  return { products: filtered, total: filtered.length };
}

export async function getProducts(options?: {
  categoryId?: string;
  categorySlug?: string;
  featured?: boolean;
  search?: string;
  sort?: ProductSortOption;
  limit?: number;
  offset?: number;
}): Promise<{ products: ProductWithImages[]; total: number }> {
  try {
    const supabase = await createClient();

    let query = supabase
      .from("products")
      .select("*, product_images(*), categories(*)", { count: "exact" })
      .eq("active", true);

    if (options?.categoryId) {
      query = query.eq("category_id", options.categoryId);
    }

    if (options?.categorySlug) {
      const { data: catData } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", options.categorySlug)
        .single();

      if (catData) {
        query = query.eq("category_id", catData.id);
      }
    }

    if (options?.featured !== undefined) {
      query = query.eq("featured", options.featured);
    }

    if (options?.search) {
      query = query.ilike("name", `%${options.search}%`);
    }

    if (options?.limit) {
      const from = options.offset ?? 0;
      const to = from + options.limit - 1;
      query = query.range(from, to);
    }

    const { data, error, count } = await query;

    if (!error && data && data.length > 0) {
      return { products: data as ProductWithImages[], total: count ?? data.length };
    }
  } catch (e) {}

  return getDemoProducts(options);
}

export async function getProductBySlug(slug: string): Promise<ProductWithImages | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("products")
      .select("*, product_images(*), categories(*)")
      .eq("slug", slug)
      .eq("active", true)
      .single();

    if (!error && data) {
      return data as ProductWithImages;
    }
  } catch (e) {}

  return DEMO_PRODUCTS.find((p) => p.slug === slug) || DEMO_PRODUCTS[0];
}

export async function getProductById(id: string): Promise<ProductWithImages | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("products")
      .select("*, product_images(*), categories(*)")
      .eq("id", id)
      .single();

    if (!error && data) {
      return data as ProductWithImages;
    }
  } catch (e) {}

  return DEMO_PRODUCTS.find((p) => p.id === id || p.slug === id) || DEMO_PRODUCTS[0];
}

export async function getRelatedProducts(
  productId: string,
  categoryId?: string | null,
  limit = 4
): Promise<ProductWithImages[]> {
  try {
    const supabase = await createClient();

    let query = supabase
      .from("products")
      .select("*, product_images(*), categories(*)")
      .eq("active", true)
      .neq("id", productId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }

    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      return data as ProductWithImages[];
    }
  } catch (e) {}

  return DEMO_PRODUCTS.filter((p) => p.id !== productId).slice(0, limit);
}
