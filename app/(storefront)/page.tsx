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
  Award,
} from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const { products: featuredProducts } = await getProducts({ featured: true, limit: 4 });
  const { products: newArrivals } = await getProducts({ limit: 4 });
  const categories = await getCategories();
  const { articles: latestNews } = await getPublishedNews({ limit: 3 });

  const categoryVisuals: Record<string, string> = {
    coffee: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop",
    apparel: "/habesha-cloth.png",
    spices: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?q=80&w=800&auto=format&fit=crop",
    crafts: "https://images.unsplash.com/photo-1606744824163-985d376605aa?q=80&w=800&auto=format&fit=crop",
  };

  return (
    <div className="w-full pb-16">
      {/* 1. TRUE 100% FULL-WIDTH CENTERED HERO SECTION (WALL-TO-WALL COVERAGE, NO BOX WRAPPERS) */}
      <section className="relative w-full overflow-hidden bg-black text-white py-20 sm:py-32 lg:py-40">
        {/* Full-bleed background image across 100% of screen width */}
        <div className="absolute inset-0 z-0 overflow-hidden flex items-center justify-center">
          <Image
            src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=2400&auto=format&fit=crop"
            alt="Ethiopian Yirgacheffe Heart Latte Coffee & Roasted Beans"
            fill
            className="object-cover object-center opacity-45 rotate-90 scale-[1.7] sm:scale-[1.45] transition-transform duration-700"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-black/75 to-black/85" />
        </div>

        {/* Centered Hero Content Container */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center space-y-6">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-extrabold tracking-widest uppercase shadow-sm backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
            </span>
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>100% Authentic Ethiopian Direct Imports</span>
          </div>

          {/* Main Centered Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-white">
            Ethiopian Heritage. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 font-black">
              Delivered To Your Door.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-zinc-300 text-base sm:text-xl font-medium leading-relaxed max-w-2xl">
            Discover hand-roasted Yirgacheffe coffee beans, hand-spun Habesha Kemis dresses, traditional Niter Kibe spiced butter, and artisan Mesob crafts.
          </p>

          {/* Centered Category Filter Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <Link
              href="/shop/coffee"
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-extrabold text-white transition-all backdrop-blur-md"
            >
              <span>☕</span>
              <span>Yirgacheffe Coffee</span>
            </Link>
            <Link
              href="/shop/apparel"
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-extrabold text-white transition-all backdrop-blur-md"
            >
              <span>👗</span>
              <span>Habesha Kemis</span>
            </Link>
            <Link
              href="/shop/spices"
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-extrabold text-white transition-all backdrop-blur-md"
            >
              <span>🌶️</span>
              <span>Berbere & Spices</span>
            </Link>
            <Link
              href="/shop/crafts"
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-extrabold text-white transition-all backdrop-blur-md"
            >
              <span>🧺</span>
              <span>Mesob Crafts</span>
            </Link>
          </div>

          {/* Centered Hero Action Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" className="h-13 px-9 text-base font-extrabold bg-amber-500 hover:bg-amber-600 text-black shadow-xl rounded-2xl cursor-pointer" asChild>
              <Link href="/shop">
                Discover Storefront <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-13 px-8 text-base font-bold rounded-2xl border-white/30 text-white hover:bg-white/10 bg-black/40 backdrop-blur-md cursor-pointer" asChild>
              <Link href="/news">
                Cultural Journal <Compass className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          {/* Centered Key Guarantee Stats */}
          <div className="pt-10 border-t border-white/15 grid grid-cols-3 gap-6 text-xs font-medium text-zinc-400 w-full max-w-xl">
            <div className="space-y-0.5 text-center">
              <span className="block text-xl font-black text-amber-400">100%</span>
              <span className="font-semibold text-zinc-300">Direct Import</span>
            </div>
            <div className="space-y-0.5 text-center">
              <span className="block text-xl font-black text-amber-400">24-48 HR</span>
              <span className="font-semibold text-zinc-300">UK Express</span>
            </div>
            <div className="space-y-0.5 text-center">
              <span className="block text-xl font-black text-amber-400">850+</span>
              <span className="font-semibold text-zinc-300">UK Families</span>
            </div>
          </div>
        </div>
      </section>

      {/* REST OF HOMEPAGE CONTENT WRAPPED IN STANDARD MAX-W-7XL CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 py-6">
        {/* 2. PRIMARY CTA DISCOVERY BANNER */}
        <section className="bg-gradient-to-r from-card via-card to-amber-500/10 border border-border/80 rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md backdrop-blur-sm">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2 text-xs font-bold text-primary uppercase tracking-wider mb-1">
              <Award className="h-4 w-4" />
              <span>Direct Ethiopian Artisans Marketplace</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">Looking for authentic Ethiopian traditional goods in the UK?</h3>
            <p className="text-sm text-muted-foreground font-medium">Explore single-origin Yirgacheffe coffee beans, handwoven Habesha Kemis, Berbere spices, and Jebena sets.</p>
          </div>
          <Button size="lg" className="h-12 px-7 font-extrabold shadow-lg rounded-2xl whitespace-nowrap cursor-pointer" asChild>
            <Link href="/shop">
              Browse All Products <ChevronRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </section>

        {/* 3. FEATURED PRODUCTS SHOWCASE */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/80 pb-4">
            <div>
              <Badge variant="secondary" className="mb-2 font-bold uppercase tracking-widest text-[10px] bg-primary/10 text-primary">
                Handpicked Favorites
              </Badge>
              <h2 className="text-3xl font-black tracking-tight">Featured Products</h2>
            </div>
            <Button variant="ghost" className="font-bold text-primary hover:text-primary hover:bg-primary/10 rounded-xl" asChild>
              <Link href="/shop">View Full Catalog &rarr;</Link>
            </Button>
          </div>
          <ProductGrid products={featuredProducts} />
        </section>

        {/* 4. SHOP BY CATEGORY SHOWCASE */}
        <section className="space-y-8">
          <div className="border-b border-border/80 pb-4">
            <Badge variant="secondary" className="mb-2 font-bold uppercase tracking-widest text-[10px] bg-primary/10 text-primary">
              Curated Collections
            </Badge>
            <h2 className="text-3xl font-black tracking-tight">Shop by Category</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.length === 0 ? (
              <CategoryNav categories={[]} />
            ) : (
              categories.map((cat) => {
                const bgImage = cat.image_url || categoryVisuals[cat.slug.toLowerCase()] || "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop";
                return (
                  <Link
                    key={cat.id}
                    href={`/shop/${cat.slug}`}
                    className="group relative aspect-[4/5] rounded-3xl overflow-hidden border border-border/80 shadow-md hover:shadow-xl hover:border-primary/50 transition-all duration-300"
                  >
                    <Image
                      src={bgImage}
                      alt={cat.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col justify-end p-6 text-white">
                      <span className="text-[10px] uppercase font-extrabold tracking-widest text-amber-400 mb-1">Category</span>
                      <h3 className="text-xl font-black text-white group-hover:text-amber-400 transition-colors">{cat.name}</h3>
                      {cat.description && (
                        <p className="text-xs text-white/80 line-clamp-2 mt-1 font-medium">{cat.description}</p>
                      )}
                      <span className="text-xs font-bold text-amber-400 mt-3 flex items-center group-hover:translate-x-1 transition-transform">
                        Explore Category <ArrowRight className="ml-1 h-3.5 w-3.5" />
                      </span>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </section>

        {/* 5. CULTURAL HERITAGE EDITORIAL BANNER */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-card via-card to-amber-950/20 border border-border/80 p-8 sm:p-14 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center shadow-xl">
          <div className="relative aspect-square sm:aspect-video lg:aspect-square rounded-2xl overflow-hidden border border-border bg-muted shadow-md group">
            <Image
              src="/habesha-cloth.png"
              alt="Authentic Habesha Kemis Weaving & Shemma Artisans"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-black/60 backdrop-blur-md text-white text-xs border border-white/10">
              <span className="font-bold text-amber-400 block mb-0.5">Authentic Handwoven Shemma</span>
              <span>Made with 100% Ethiopian organic cotton by traditional weavers in Addis Ababa.</span>
            </div>
          </div>

          <div className="space-y-6">
            <Badge className="bg-primary text-primary-foreground font-bold">Our Heritage Philosophy</Badge>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Authentic Craftsmanship, Warmth & Tradition.
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed font-medium">
              Every item at Enat Market represents genuine Ethiopian heritage—from hand-spun Shemma dresses to small-batch Niter Kibe spiced butter and single-origin Yirgacheffe coffee beans.
            </p>
            <div className="pt-2">
              <Button size="lg" variant="outline" className="font-bold rounded-xl border-border/80 bg-card cursor-pointer" asChild>
                <Link href="/about">Read Our Heritage Story &rarr;</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* 6. NEW ARRIVALS CATALOG */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/80 pb-4">
            <div>
              <Badge variant="secondary" className="mb-2 font-bold uppercase tracking-widest text-[10px] bg-primary/10 text-primary">
                Fresh Additions
              </Badge>
              <h2 className="text-3xl font-black tracking-tight">New Arrivals in Store</h2>
            </div>
            <Button variant="ghost" className="font-bold text-primary hover:text-primary hover:bg-primary/10 rounded-xl" asChild>
              <Link href="/shop">Browse All Products &rarr;</Link>
            </Button>
          </div>
          <ProductGrid products={newArrivals} />
        </section>

        {/* 7. VALUE PROPOSITIONS GRID */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-card border border-border/80 p-6 rounded-2xl space-y-3 shadow-xs hover:border-primary/50 hover:shadow-md transition-all duration-300">
            <div className="h-11 w-11 rounded-xl bg-primary/15 text-primary flex items-center justify-center font-bold">
              <Truck className="h-5.5 w-5.5" />
            </div>
            <h4 className="font-bold text-base">Reliable UK Courier</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">Fast tracked shipping across the UK on all orders with 24-48 hr dispatch.</p>
          </div>

          <div className="bg-card border border-border/80 p-6 rounded-2xl space-y-3 shadow-xs hover:border-primary/50 hover:shadow-md transition-all duration-300">
            <div className="h-11 w-11 rounded-xl bg-primary/15 text-primary flex items-center justify-center font-bold">
              <ShieldCheck className="h-5.5 w-5.5" />
            </div>
            <h4 className="font-bold text-base">100% Authentic Goods</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">Handpicked traditional goods direct from Ethiopian master artisans.</p>
          </div>

          <div className="bg-card border border-border/80 p-6 rounded-2xl space-y-3 shadow-xs hover:border-primary/50 hover:shadow-md transition-all duration-300">
            <div className="h-11 w-11 rounded-xl bg-primary/15 text-primary flex items-center justify-center font-bold">
              <Headphones className="h-5.5 w-5.5" />
            </div>
            <h4 className="font-bold text-base">Dedicated Customer Care</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">Reach our friendly UK team via email shop@enatmarket.co.uk or 07830 682710.</p>
          </div>

          <div className="bg-card border border-border/80 p-6 rounded-2xl space-y-3 shadow-xs hover:border-primary/50 hover:shadow-md transition-all duration-300">
            <div className="h-11 w-11 rounded-xl bg-primary/15 text-primary flex items-center justify-center font-bold">
              <RotateCcw className="h-5.5 w-5.5" />
            </div>
            <h4 className="font-bold text-base">Easy Returns Guarantee</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">Hassle-free 14-day return policy for all eligible storefront items.</p>
          </div>
        </section>

        {/* 8. CULTURAL JOURNAL PREVIEW */}
        {latestNews.length > 0 && (
          <section className="space-y-8">
            <div className="flex items-center justify-between border-b border-border/80 pb-4">
              <div>
                <Badge variant="secondary" className="mb-2 font-bold uppercase tracking-widest text-[10px] bg-primary/10 text-primary">
                  Cultural Journal
                </Badge>
                <h2 className="text-3xl font-black tracking-tight">Latest Stories & Traditions</h2>
              </div>
              <Button variant="ghost" className="font-bold text-primary hover:text-primary hover:bg-primary/10 rounded-xl" asChild>
                <Link href="/news">View All Articles &rarr;</Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestNews.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          </section>
        )}

        {/* 9. VIP NEWSLETTER JOIN */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/15 via-card to-amber-950/20 border border-primary/30 p-8 sm:p-14 text-center space-y-6 shadow-xl">
          <div className="max-w-2xl mx-auto space-y-3">
            <Badge className="bg-primary text-primary-foreground font-bold">Join Our Family</Badge>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Stay Connected With Enat Market</h2>
            <p className="text-muted-foreground text-sm sm:text-base font-medium">
              Subscribe for fresh shipment alerts, seasonal Habesha Kemis drops, and authentic Ethiopian recipe guides.
            </p>
          </div>
          <NewsletterForm />
        </section>
      </div>
    </div>
  );
}
