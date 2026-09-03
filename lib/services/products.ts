import { createClient } from "@/lib/supabase/server";
import { Database } from "@/lib/types/database";

export type Product = Database["public"]["Tables"]["products"]["Row"];
export type ProductImage = Database["public"]["Tables"]["product_images"]["Row"];

export interface ProductWithImages extends Product {
  product_images?: ProductImage[];
  categories?: Database["public"]["Tables"]["categories"]["Row"] | null;
}

export type ProductSortOption = "newest" | "price-asc" | "price-desc" | "name-asc";

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
        .maybeSingle();

      if (catData) {
        query = query.eq("category_id", catData.id);
      } else {
        return { products: [], total: 0 };
      }
    }

    if (options?.featured !== undefined) {
      query = query.eq("featured", options.featured);
    }

    if (options?.search) {
      query = query.ilike("name", `%${options.search}%`);
    }

    // Apply Sorting
    if (options?.sort === "price-asc") {
      query = query.order("price", { ascending: true });
    } else if (options?.sort === "price-desc") {
      query = query.order("price", { ascending: false });
    } else if (options?.sort === "name-asc") {
      query = query.order("name", { ascending: true });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    if (options?.limit) {
      const from = options.offset ?? 0;
      const to = from + options.limit - 1;
      query = query.range(from, to);
    }

    const { data, error, count } = await query;

    if (!error && data) {
      return { products: data as ProductWithImages[], total: count ?? data.length };
    }
  } catch (e) {
    console.error("Error in getProducts:", e);
  }

  return { products: [], total: 0 };
}

export async function getProductBySlug(slug: string): Promise<ProductWithImages | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("products")
      .select("*, product_images(*), categories(*)")
      .eq("slug", slug)
      .eq("active", true)
      .maybeSingle();

    if (!error && data) {
      return data as ProductWithImages;
    }
  } catch (e) {
    console.error("Error in getProductBySlug:", e);
  }

  return null;
}

export async function getProductById(id: string): Promise<ProductWithImages | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("products")
      .select("*, product_images(*), categories(*)")
      .eq("id", id)
      .maybeSingle();

    if (!error && data) {
      return data as ProductWithImages;
    }
  } catch (e) {
    console.error("Error in getProductById:", e);
  }

  return null;
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
    if (!error && data) {
      return data as ProductWithImages[];
    }
  } catch (e) {
    console.error("Error in getRelatedProducts:", e);
  }

  return [];
}
