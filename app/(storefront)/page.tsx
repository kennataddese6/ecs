import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/lib/services/products";
import { getCategories } from "@/lib/services/categories";
import { getPublishedNews } from "@/lib/services/news";
import { ProductGrid } from "@/components/shop/product-grid";
import { NewsCard } from "@/components/news/news-card";
import { CategoryNav } from "@/components/shop/category-nav";
import { NewsletterForm } from "@/components/common/newsletter-form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Truck,
  ShieldCheck,
  Headphones,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Compass,
} from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const { products: featuredProducts } = await getProducts({ featured: true, limit: 4 });
  const { products: newArrivals } = await getProducts({ limit: 4 });
  const categories = await getCategories();
  const { articles: latestNews } = await getPublishedNews({ limit: 3 });

  const categoryVisuals: Record<string, string> = {
    audio: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop",
    apparel: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800&auto=format&fit=crop",
    accessories: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop",
    home: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=800&auto=format&fit=crop",
  };

  return (
    <div className="space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-card via-card to-muted border border-border/80 p-8 sm:p-16 lg:p-20 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Enat Market Collection</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
              Quality Essentials. <br />
              <span className="gradient-text">Delivered to Your Door.</span>
            </h1>

            <p className="text-muted-foreground text-base sm:text-xl font-normal leading-relaxed max-w-xl">
              Discover curated electronics, fashion apparel, lifestyle products, and authentic goods at Enat Market.
            </p>

            <div className="pt-4 flex flex-wrap gap-4 items-center">
              <Button size="lg" className="h-13 px-8 text-base font-bold shadow-lg shadow-primary/25" asChild>
                <Link href="/shop">
                  Discover Collection <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-13 px-8 text-base font-semibold" asChild>
                <Link href="/news">
                  Read Journal <Compass className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            <div className="pt-8 border-t border-border/60 grid grid-cols-3 gap-4 text-xs font-semibold text-muted-foreground">
              <div>
                <span className="block text-lg font-bold text-foreground">100%</span>
                <span>Authentic Guarantee</span>
              </div>
              <div>
                <span className="block text-lg font-bold text-foreground">Fast UK</span>
                <span>Delivery Service</span>
              </div>
              <div>
                <span className="block text-lg font-bold text-foreground">Customer Care</span>
                <span>Dedicated Support</span>
              </div>
            </div>
          </div>

          <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-square rounded-2xl overflow-hidden shadow-2xl border border-border bg-muted group">
            <Image
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop"
              alt="Enat Market Featured Selection"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 text-white">
              <Badge className="w-fit mb-2 bg-white/20 backdrop-blur-md text-white border-none">
                Featured Spotlight
              </Badge>
              <h3 className="text-2xl font-bold">LUMEN Studio Master Wireless</h3>
              <p className="text-xs text-white/80 mt-1">Acoustic clarity redefined with active noise cancellation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PRIMARY CTA TO SHOP / BAR */}
      <section className="bg-card border border-border rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1 text-center md:text-left">
          <h3 className="text-xl font-bold tracking-tight">Looking for something specific?</h3>
          <p className="text-sm text-muted-foreground">Explore our full product catalog with instant filtering and search.</p>
        </div>
        <Button size="lg" className="font-semibold shadow-md whitespace-nowrap" asChild>
          <Link href="/shop">
            Browse All Products <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </section>

      {/* 3. FEATURED PRODUCTS */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-4">
          <div>
            <Badge variant="secondary" className="mb-2">Curated Selection</Badge>
            <h2 className="text-3xl font-extrabold tracking-tight">Featured Products</h2>
          </div>
          <Button variant="ghost" className="font-semibold" asChild>
            <Link href="/shop">View Full Catalog &rarr;</Link>
          </Button>
        </div>
        <ProductGrid products={featuredProducts} />
      </section>

      {/* 4. CATEGORIES SHOWCASE */}
      <section className="space-y-8">
        <div className="border-b border-border pb-4">
          <Badge variant="secondary" className="mb-2 font-bold uppercase tracking-wider">Taxonomy</Badge>
          <h2 className="text-3xl font-extrabold tracking-tight">Shop by Category</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.length === 0 ? (
            <CategoryNav categories={[]} />
          ) : (
            categories.map((cat) => {
              const bgImage = cat.image_url || categoryVisuals[cat.slug.toLowerCase()] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop";
              return (
                <Link
                  key={cat.id}
                  href={`/shop/${cat.slug}`}
                  className="group relative aspect-[4/5] rounded-2xl overflow-hidden border border-border shadow-md"
                >
                  <Image
                    src={bgImage}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 text-white">
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{cat.name}</h3>
                    {cat.description && (
                      <p className="text-xs text-white/80 line-clamp-2 mt-1">{cat.description}</p>
                    )}
                    <span className="text-xs font-semibold text-primary mt-3 flex items-center">
                      Explore Category <ArrowRight className="ml-1 h-3 w-3" />
                    </span>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </section>

      {/* 5. PROMOTIONAL / EDITORIAL SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-card border border-border p-8 sm:p-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center shadow-xl">
        <div className="relative aspect-square sm:aspect-video lg:aspect-square rounded-2xl overflow-hidden border border-border bg-muted">
          <Image
            src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1200&auto=format&fit=crop"
            alt="Enat Market Quality Assurance"
            fill
            className="object-cover"
          />
        </div>

        <div className="space-y-6">
          <Badge className="bg-primary text-primary-foreground">Brand Philosophy</Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Curated for Quality, Delivered for Convenience.
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed">
            Every product at Enat Market is selected to offer authentic value, premium quality, and dependable service for your household.
          </p>
          <div className="pt-2">
            <Button size="lg" variant="outline" asChild>
              <Link href="/about">Read Our Story &rarr;</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 6. BEST SELLERS / NEW ARRIVALS */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-4">
          <div>
            <Badge variant="secondary" className="mb-2 font-bold uppercase tracking-wider">New Arrivals</Badge>
            <h2 className="text-3xl font-extrabold tracking-tight">Fresh Additions to the Store</h2>
          </div>
          <Button variant="ghost" className="font-semibold" asChild>
            <Link href="/shop">Browse All &rarr;</Link>
          </Button>
        </div>
        <ProductGrid products={newArrivals} />
      </section>

      {/* 7. BRAND / VALUE PROPOSITION SECTION */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card border border-border p-6 rounded-2xl space-y-3 shadow-sm hover:border-primary/50 transition-colors">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
            <Truck className="h-5 w-5" />
          </div>
          <h4 className="font-bold text-base">Reliable Delivery</h4>
          <p className="text-xs text-muted-foreground">Fast UK courier shipping on all orders.</p>
        </div>

        <div className="bg-card border border-border p-6 rounded-2xl space-y-3 shadow-sm hover:border-primary/50 transition-colors">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h4 className="font-bold text-base">Guaranteed Quality</h4>
          <p className="text-xs text-muted-foreground">Vetted products from authentic suppliers.</p>
        </div>

        <div className="bg-card border border-border p-6 rounded-2xl space-y-3 shadow-sm hover:border-primary/50 transition-colors">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
            <Headphones className="h-5 w-5" />
          </div>
          <h4 className="font-bold text-base">Dedicated Customer Service</h4>
          <p className="text-xs text-muted-foreground">Reach us directly at shop@enatmarket.co.uk or 07830682710.</p>
        </div>

        <div className="bg-card border border-border p-6 rounded-2xl space-y-3 shadow-sm hover:border-primary/50 transition-colors">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
            <RotateCcw className="h-5 w-5" />
          </div>
          <h4 className="font-bold text-base">Easy Returns Support</h4>
          <p className="text-xs text-muted-foreground">Simple return process for eligible items.</p>
        </div>
      </section>

      {/* 8. NEWS PREVIEW */}
      {latestNews.length > 0 && (
        <section className="space-y-8">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <Badge variant="secondary" className="mb-2 font-bold uppercase tracking-wider">Editorial Journal</Badge>
              <h2 className="text-3xl font-extrabold tracking-tight">Latest Stories & Insights</h2>
            </div>
            <Button variant="ghost" className="font-semibold" asChild>
              <Link href="/news">View All News &rarr;</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestNews.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      )}

      {/* 9. NEWSLETTER / CONTACT CTA */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-card to-card border border-primary/20 p-8 sm:p-16 text-center space-y-6 shadow-xl">
        <div className="max-w-2xl mx-auto space-y-3">
          <Badge className="bg-primary text-primary-foreground">Exclusive Updates</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Subscribe to Enat Market</h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Subscribe to receive product announcements, special offers, and store updates.
          </p>
        </div>
        <NewsletterForm />
      </section>
    </div>
  );
}
