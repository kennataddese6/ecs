import { createClient } from "@/lib/supabase/server";
import { Database } from "@/lib/types/database";

export type NewsArticle = Database["public"]["Tables"]["news"]["Row"];

export async function getPublishedNews(options?: {
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<{ articles: NewsArticle[]; total: number }> {
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

  if (error) {
    console.error("Error fetching news:", error);
    return { articles: [], total: 0 };
  }

  return { articles: data || [], total: count ?? 0 };
}

export async function getFeaturedNewsArticle(): Promise<NewsArticle | null> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("news")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return data;
}

export async function getNewsBySlug(slug: string): Promise<NewsArticle | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}
