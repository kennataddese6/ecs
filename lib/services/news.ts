import { createClient } from "@/lib/supabase/server";
import { Database } from "@/lib/types/database";

export type NewsArticle = Database["public"]["Tables"]["news"]["Row"];

const DEMO_NEWS: NewsArticle[] = [
  {
    id: "news-1",
    title: "The Timeless Ritual of the Ethiopian Coffee Ceremony (Buna)",
    slug: "timeless-ritual-ethiopian-coffee-ceremony-buna",
    excerpt: "Exploring the cultural heritage, roasting secrets, and warm hospitality behind Ethiopia's sacred coffee tradition.",
    content: `
      <p class="text-lg leading-relaxed mb-6">In Ethiopian culture, Buna is far more than a morning beverage—it is a sacred daily gathering celebrating community, friendship, and hospitality.</p>

      <h2 class="text-2xl font-bold mt-8 mb-4">Roasting Green Beans to Perfection</h2>
      <p class="leading-relaxed mb-6">The ceremony begins with washing fresh green coffee beans before slow-roasting them over open embers in a flat pan (Menkeshkesha). As the beans crackle, the fragrant smoke is wafted to guests as a blessing.</p>

      <h2 class="text-2xl font-bold mt-8 mb-4">Brewing in the Clay Jebena</h2>
      <p class="leading-relaxed mb-6">Ground beans are brewed inside a traditional black clay Jebena pot. Poured from height into handleless porcelain Cini cups, the coffee is served in three rounds: Abol (first cup), Tona (second), and Baraka (the final blessing).</p>
    `,
    featured_image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200&auto=format&fit=crop",
    published: true,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "news-2",
    title: "Preserving Handwoven Habesha Textiles: The Art of Shemma Craft",
    slug: "preserving-handwoven-habesha-textiles-shemma-craft",
    excerpt: "A deep dive into traditional pit loom weaving, organic cotton spinning, and gold Tilet embroidery.",
    content: `
      <p class="text-lg leading-relaxed mb-6">For centuries, Ethiopian weavers (Shemane) have transformed pure hand-spun cotton into ethereal Habesha Kemis dresses and Netela scarves.</p>

      <h2 class="text-2xl font-bold mt-8 mb-4">Pit Looms & Organic Cotton Thread</h2>
      <p class="leading-relaxed mb-6">Operating rhythmic wooden pit looms, weavers pass shuttle bobbins across warp threads to create lightweight yet durable cotton fabrics suitable for ceremonial celebrations.</p>

      <h2 class="text-2xl font-bold mt-8 mb-4">Intricate Tilet Embroidery</h2>
      <p class="leading-relaxed mb-6">The crowning glory of every royal gown is the Tilet—woven woven borders featuring rich geometric motifs in gold, crimson, and forest green symbolizing nobility and heritage.</p>
    `,
    featured_image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1200&auto=format&fit=crop",
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
