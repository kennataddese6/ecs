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
    name: "Yirgacheffe Grade-1 Organic Roasted Coffee Beans (1kg)",
    slug: "yirgacheffe-grade-1-coffee-beans",
    description: "Authentic Ethiopian Yirgacheffe coffee beans roasted to perfection. Features floral jasmine aromas, bergamot citrus notes, and a silky smooth finish for traditional Buna preparation.",
    price: 28.50,
    compare_at_price: 34.00,
    stock_quantity: 45,
    sku: "ETH-COF-001",
    category_id: "cat-1",
    featured: true,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    categories: { id: "cat-1", name: "Ethiopian Coffee & Buna", slug: "coffee", description: null, image_url: null, active: true, created_at: "", updated_at: "" },
    product_images: [{ id: "img-1", product_id: "prod-1", image_url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop", alt_text: "Yirgacheffe Coffee Beans", sort_order: 0, created_at: "" }],
  },
  {
    id: "prod-2",
    name: "Royal Handwoven Habesha Kemis with Gold Border",
    slug: "royal-handwoven-habesha-kemis",
    description: "Exquisite Ethiopian hand-loomed sheer cotton dress (Shemma) adorned with intricate gold Tilet embroidery along the neckline, sleeves, and hem. Includes matching Netela scarf.",
    price: 145.00,
    compare_at_price: 185.00,
    stock_quantity: 12,
    sku: "ETH-CLO-001",
    category_id: "cat-2",
    featured: true,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    categories: { id: "cat-2", name: "Traditional Habesha Apparel", slug: "apparel", description: null, image_url: null, active: true, created_at: "", updated_at: "" },
    product_images: [{ id: "img-2", product_id: "prod-2", image_url: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop", alt_text: "Habesha Kemis Traditional Dress", sort_order: 0, created_at: "" }],
  },
  {
    id: "prod-3",
    name: "Traditional Spiced Clarified Butter (Niter Kibe - 500g)",
    slug: "traditional-spiced-clarified-butter-niter-kibe",
    description: "Handcrafted Ethiopian clarified butter simmered with black cardamom (Korerima), sacred basil (Beso Bela), fenugreek, and garlic. Rich golden aroma essential for Doro Wat.",
    price: 19.50,
    compare_at_price: 24.00,
    stock_quantity: 30,
    sku: "ETH-SPC-001",
    category_id: "cat-3",
    featured: true,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    categories: { id: "cat-3", name: "Spices & Niter Kibe", slug: "spices", description: null, image_url: null, active: true, created_at: "", updated_at: "" },
    product_images: [{ id: "img-3", product_id: "prod-3", image_url: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?q=80&w=800&auto=format&fit=crop", alt_text: "Authentic Niter Kibe Butter", sort_order: 0, created_at: "" }],
  },
  {
    id: "prod-4",
    name: "Handcrafted Clay Jebena Coffee Pot & Cini Cup Set",
    slug: "handcrafted-clay-jebena-coffee-set",
    description: "Authentic black clay Jebena pot hand-poured by Ethiopian artisans. Complete set includes 6 hand-decorated ceramic Cini cups, wooden saucer base, and frankincense burner.",
    price: 48.00,
    compare_at_price: 62.00,
    stock_quantity: 18,
    sku: "ETH-CER-001",
    category_id: "cat-1",
    featured: true,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    categories: { id: "cat-1", name: "Ethiopian Coffee & Buna", slug: "coffee", description: null, image_url: null, active: true, created_at: "", updated_at: "" },
    product_images: [{ id: "img-4", product_id: "prod-4", image_url: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=800&auto=format&fit=crop", alt_text: "Jebena Coffee Pot Set", sort_order: 0, created_at: "" }],
  },
  {
    id: "prod-5",
    name: "Traditional Handwoven Straw Mesob Dining Basket",
    slug: "traditional-handwoven-straw-mesob",
    description: "Iconic Ethiopian Mesob serving basket intricately handwoven from dried palm straw with natural vibrant geometric dye patterns. Centerpiece for traditional Injera banquets.",
    price: 68.00,
    compare_at_price: 88.00,
    stock_quantity: 8,
    sku: "ETH-ART-001",
    category_id: "cat-4",
    featured: true,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    categories: { id: "cat-4", name: "Artisan Mesob & Crafts", slug: "crafts", description: null, image_url: null, active: true, created_at: "", updated_at: "" },
    product_images: [{ id: "img-5", product_id: "prod-5", image_url: "https://images.unsplash.com/photo-1606744824163-985d376605aa?q=80&w=800&auto=format&fit=crop", alt_text: "Handwoven Mesob Basket", sort_order: 0, created_at: "" }],
  },
  {
    id: "prod-6",
    name: "Sun-Dried Organic Ethiopian Berbere Spice (250g)",
    slug: "sun-dried-organic-ethiopian-berbere",
    description: "Authentic fiery red pepper spice blend ground with korerima, garlic, ginger, rue, and sacred herbs. Deep smoky aroma essential for authentic wats and marinades.",
    price: 12.50,
    compare_at_price: 16.00,
    stock_quantity: 60,
    sku: "ETH-SPC-002",
    category_id: "cat-3",
    featured: true,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    categories: { id: "cat-3", name: "Spices & Niter Kibe", slug: "spices", description: null, image_url: null, active: true, created_at: "", updated_at: "" },
    product_images: [{ id: "img-6", product_id: "prod-6", image_url: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800&auto=format&fit=crop", alt_text: "Organic Berbere Spice", sort_order: 0, created_at: "" }],
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
