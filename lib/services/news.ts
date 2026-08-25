import { createClient } from "@/lib/supabase/server";
import { Database } from "@/lib/types/database";

export type NewsArticle = Database["public"]["Tables"]["news"]["Row"];

const DEMO_NEWS: NewsArticle[] = [
  {
    id: "news-1",
    title: "The Art of Acoustic Engineering: Inside the Studio Master",
    slug: "art-of-acoustic-engineering",
    excerpt: "Exploring how custom beryllium drivers and precision chambering deliver studio transparency.",
    content: `
      <p class="text-lg leading-relaxed mb-6">Acoustic transparency is achieved when electronic interference is eliminated entirely, allowing raw harmonic detail to shine through without coloration.</p>

      <h2 class="text-2xl font-bold mt-8 mb-4">Precision Engineering & Beryllium Drivers</h2>
      <p class="leading-relaxed mb-6">In designing the LUMEN Studio Master, our engineering team focused on weight-to-rigidity ratios in diaphragm construction. By deploying ultra-thin beryllium foil, dynamic transience response approaches instantaneous precision.</p>

      <h2 class="text-2xl font-bold mt-8 mb-4">Chamber Geometry & Noise Isolation</h2>
      <p class="leading-relaxed mb-6">Traditional acoustic enclosures trap standing waves that cloud mid-range vocals. Our proprietary resonance-damping geometry diffuses back-wave reflections before they affect driver motion.</p>
    `,
    featured_image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop",
    published: true,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "news-2",
    title: "Florentine Leathercraft: Sustainable Tanning Techniques",
    slug: "florentine-leathercraft-sustainable-tanning",
    excerpt: "A deep dive into natural vegetable tanning processes preserving leather durability and patina over time.",
    content: `
      <p class="text-lg leading-relaxed mb-6">Vegetable tanning uses natural plant tannins derived from chestnut and mimosa bark instead of harsh chromium salts, yielding full-grain leather that ages with distinct patina.</p>

      <h2 class="text-2xl font-bold mt-8 mb-4">The Florentine Heritage</h2>
      <p class="leading-relaxed mb-6">Nestled along the banks of the Arno River, Tuscan tanneries have preserved slow-steeping methods for over three centuries. Each hide spends up to forty days in organic wooden vats.</p>

      <h2 class="text-2xl font-bold mt-8 mb-4">Tactile Longevity & Environmental Stewardship</h2>
      <p class="leading-relaxed mb-6">Unlike synthetic coatings that crack after seasons of exposure, vegetable-tanned hides absorb natural oils, deepening in character and resilience over decades of daily carry.</p>
    `,
    featured_image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1200&auto=format&fit=crop",
    published: true,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

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

    if (!error && data && data.length > 0) {
      return { articles: data, total: count ?? data.length };
    }
  } catch (e) {}

  let filtered = DEMO_NEWS.filter((article) => article.published);
  if (options?.search) {
    const s = options.search.toLowerCase();
    filtered = filtered.filter(
      (a) => a.title.toLowerCase().includes(s) || (a.excerpt && a.excerpt.toLowerCase().includes(s))
    );
  }

  if (options?.limit) {
    const from = options.offset ?? 0;
    filtered = filtered.slice(from, from + options.limit);
  }

  return { articles: filtered, total: filtered.length };
}

export async function getFeaturedNewsArticle(): Promise<NewsArticle | null> {
  const { articles } = await getPublishedNews({ limit: 1 });
  return articles[0] || null;
}

export async function getNewsBySlug(slug: string): Promise<NewsArticle | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("news")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single();

    if (!error && data) {
      return data;
    }
  } catch (e) {}

  return DEMO_NEWS.find((a) => a.slug === slug || a.id === slug) || DEMO_NEWS[0];
}
