import Link from "next/link";
import Image from "next/image";
import { getPublishedNews, getFeaturedNewsArticle } from "@/lib/services/news";
import { NewsCard } from "@/components/news/news-card";
import { Pagination } from "@/components/common/pagination";
import { EmptyState } from "@/components/common/empty-state";
import { SearchBar } from "@/components/common/search-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "LUMEN Journal | Stories & Announcements",
  description: "Explore the latest design stories, product releases, and editorial essays from LUMEN.",
};

export default async function NewsListingPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const sParams = await searchParams;
  const search = sParams.q || "";
  const page = parseInt(sParams.page || "1", 10);
  const limit = 9;
  const offset = (page - 1) * limit;

  const [{ articles, total }, featuredArticle] = await Promise.all([
    getPublishedNews({ search, limit, offset }),
    getFeaturedNewsArticle(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 py-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-6">
        <div>
          <Badge variant="secondary" className="mb-2">Enat Market Journal</Badge>
          <h1 className="text-4xl font-extrabold tracking-tight">Editorial & Stories</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Perspectives on industrial design, acoustic engineering, and modern craft.
          </p>
        </div>
        <div className="w-full md:w-80">
          <SearchBar placeholder="Search articles..." />
        </div>
      </div>

      {!search && featuredArticle && (
        <section className="relative overflow-hidden rounded-3xl bg-card border border-border grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-6 sm:p-10 shadow-lg group">
          <div className="relative aspect-video lg:aspect-square rounded-2xl overflow-hidden bg-muted">
            <Image
              src={featuredArticle.featured_image || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop"}
              alt={featuredArticle.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              priority
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-xs text-muted-foreground font-semibold">
              <Badge className="bg-primary text-primary-foreground font-bold">Featured Story</Badge>
              {featuredArticle.published_at && (
                <span className="flex items-center">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  {new Date(featuredArticle.published_at).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight group-hover:text-primary transition-colors">
              {featuredArticle.title}
            </h2>

            {featuredArticle.excerpt && (
              <p className="text-muted-foreground text-base leading-relaxed line-clamp-3">
                {featuredArticle.excerpt}
              </p>
            )}

            <div className="pt-2">
              <Button size="lg" className="font-semibold shadow-md" asChild>
                <Link href={`/news/${featuredArticle.slug}`}>
                  Read Full Article <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {articles.length === 0 ? (
        <EmptyState title="No articles found" description="Try searching for another topic or clear filters." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      )}

      <Pagination currentPage={page} totalPages={totalPages} baseUrl="/news" />
    </div>
  );
}
