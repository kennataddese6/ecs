import { createClient } from "@/lib/supabase/server";
import { Database } from "@/lib/types/database";

export type NewsArticle = Database["public"]["Tables"]["news"]["Row"];

export async function getPublishedNews(options?: {
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<{ articles: NewsArticle[]; total: number }> {
  try {
    const supabase = await createClient();

    let query = supabase
      .from("news")
      .select("*", { count: "exact" })
      .eq("published", true)
      .order("published_at", { ascending: false });

    if (options?.search) {
      query = query.or(`title.ilike.%${options.search}%,excerpt.ilike.%${options.search}%`);
    }

    if (options?.limit) {
      const from = options.offset ?? 0;
      const to = from + options.limit - 1;
      query = query.range(from, to);
    }

    const { data, error, count } = await query;

    if (!error && data) {
      return { articles: data, total: count ?? data.length };
    }
  } catch (e) {
    console.error("Error in getPublishedNews:", e);
  }

  return { articles: [], total: 0 };
}

export async function getFeaturedNewsArticle(): Promise<NewsArticle | null> {
  const { articles } = await getPublishedNews({ limit: 1 });
  return articles[0] || null;
}

export async function getNewsById(id: string): Promise<NewsArticle | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("news")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (!error && data) {
      return data;
    }
  } catch (e) {
    console.error("Error in getNewsById:", e);
  }

  return null;
}

export async function getNewsBySlug(slug: string): Promise<NewsArticle | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("news")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (!error && data) {
      return data;
    }
  } catch (e) {
    console.error("Error in getNewsBySlug:", e);
  }

  return null;
}
