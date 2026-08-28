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
  Star,
  ShoppingBag,
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
    <div className="space-y-20 pb-16">
      {/* 1. LUXURY HABESHA HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-card via-card/95 to-amber-950/10 border border-amber-500/20 p-5 sm:p-10 lg:p-14 shadow-2xl backdrop-blur-md">
        {/* Glow ambient background graphics */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-[550px] h-[550px] bg-gradient-to-bl from-amber-500/20 via-primary/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-600/15 via-amber-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#b56d29_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.04] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center relative z-10">
          {/* Hero Left Content Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/15 via-primary/10 to-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-extrabold tracking-widest uppercase shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
              </span>
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>Authentic Ethiopian Direct Imports</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-foreground">
              Ethiopian Heritage. <br />
              <span className="gradient-text font-black">Delivered To Your Door.</span>
            </h1>

            <p className="text-muted-foreground text-base sm:text-lg font-medium leading-relaxed max-w-xl">
              Experience hand-roasted Yirgacheffe coffee beans, hand-spun Habesha Kemis dresses, traditional Niter Kibe spiced butter, and artisan Mesob crafts.
            </p>

            {/* Hero Quick Category Pills */}
            <div className="flex flex-wrap gap-2 pt-1">
              <Link
                href="/shop/coffee"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-card border border-border/80 hover:border-primary/50 text-xs font-bold text-foreground transition-all shadow-2xs hover:-translate-y-0.5"
              >
                <span>☕</span>
                <span>Yirgacheffe Coffee</span>
              </Link>
              <Link
                href="/shop/apparel"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-card border border-border/80 hover:border-primary/50 text-xs font-bold text-foreground transition-all shadow-2xs hover:-translate-y-0.5"
              >
                <span>👗</span>
                <span>Habesha Kemis</span>
              </Link>
              <Link
                href="/shop/spices"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-card border border-border/80 hover:border-primary/50 text-xs font-bold text-foreground transition-all shadow-2xs hover:-translate-y-0.5"
              >
                <span>🌶️</span>
                <span>Berbere & Spices</span>
              </Link>
              <Link
                href="/shop/crafts"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-card border border-border/80 hover:border-primary/50 text-xs font-bold text-foreground transition-all shadow-2xs hover:-translate-y-0.5"
              >
                <span>🧺</span>
                <span>Mesob Crafts</span>
              </Link>
            </div>

            {/* Hero CTAs */}
            <div className="pt-2 flex flex-wrap gap-4 items-center">
              <Button size="lg" className="h-13 px-8 text-base font-extrabold shadow-xl shadow-primary/25 rounded-2xl cursor-pointer" asChild>
                <Link href="/shop">
                  Discover Storefront <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-13 px-8 text-base font-bold rounded-2xl border-border/80 bg-card/60 backdrop-blur-sm cursor-pointer" asChild>
                <Link href="/news">
                  Cultural Journal <Compass className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            {/* Hero Value Stats Strip */}
            <div className="pt-6 border-t border-border/60 grid grid-cols-3 gap-4 text-xs font-medium text-muted-foreground">
              <div className="space-y-0.5">
                <span className="block text-lg font-black text-foreground">100%</span>
                <span className="font-semibold">Direct Artisan Import</span>
              </div>
              <div className="space-y-0.5">
                <span className="block text-lg font-black text-foreground">24-48 HR</span>
                <span className="font-semibold">UK Express Tracked</span>
              </div>
              <div className="space-y-0.5">
                <span className="block text-lg font-black text-foreground">850+</span>
                <span className="font-semibold">Happy UK Families</span>
              </div>
            </div>
          </div>

          {/* Hero Right Visual Showcase Composition (Multi-Card Dress, Spices & Coffee Showcase) */}
          <div className="lg:col-span-6 relative pt-2 lg:pt-0">
            {/* Ambient Background Radial Glow behind Hero Cards */}
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 via-primary/15 to-emerald-500/10 rounded-3xl blur-2xl opacity-80 pointer-events-none" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
              {/* 1. Habesha Kemis Dress Showcase Card */}
              <div className="group relative aspect-[4/5] sm:aspect-square rounded-2xl overflow-hidden shadow-xl border border-amber-500/30 bg-card hover:border-primary/60 hover:shadow-2xl transition-all duration-500">
                <Image
                  src="/habesha-cloth.png"
                  alt="Handwoven Traditional Habesha Kemis Dress"
                  fill
                  className="object-cover group-hover:scale-108 transition-transform duration-700"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-4 text-white">
                  <div className="flex items-center space-x-1.5 mb-1">
                    <Badge className="bg-amber-500 text-black font-extrabold text-[10px] uppercase tracking-wider px-2 py-0.5">
                      👗 Traditional Dress
                    </Badge>
                  </div>
                  <h4 className="text-base font-black text-white tracking-tight line-clamp-1">Habesha Kemis</h4>
                  <p className="text-[11px] text-white/80 line-clamp-1 font-medium">Hand-spun organic Shemma cotton</p>
                  <div className="mt-2 flex items-center justify-between pt-2 border-t border-white/20">
                    <span className="text-xs font-black text-amber-400">From £89.00</span>
                    <Link href="/shop/apparel" className="text-[10px] font-bold text-white hover:text-amber-400 flex items-center transition-colors">
                      Shop Kemis &rarr;
                    </Link>
                  </div>
                </div>
              </div>

              {/* 2. Berbere Spices & Niter Kibe Showcase Card */}
              <div className="group relative aspect-[4/5] sm:aspect-square rounded-2xl overflow-hidden shadow-xl border border-amber-500/30 bg-card hover:border-primary/60 hover:shadow-2xl transition-all duration-500">
                <Image
                  src="https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?q=80&w=800&auto=format&fit=crop"
                  alt="Authentic Ethiopian Berbere Spices & Niter Kibe Butter"
                  fill
                  className="object-cover group-hover:scale-108 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-4 text-white">
                  <div className="flex items-center space-x-1.5 mb-1">
                    <Badge className="bg-emerald-500 text-white font-extrabold text-[10px] uppercase tracking-wider px-2 py-0.5">
                      🌶️ Spices & Kibe
                    </Badge>
                  </div>
                  <h4 className="text-base font-black text-white tracking-tight line-clamp-1">Berbere & Niter Kibe</h4>
                  <p className="text-[11px] text-white/80 line-clamp-1 font-medium">Sun-dried peppers & spiced clarified butter</p>
                  <div className="mt-2 flex items-center justify-between pt-2 border-t border-white/20">
                    <span className="text-xs font-black text-amber-400">From £7.99</span>
                    <Link href="/shop/spices" className="text-[10px] font-bold text-white hover:text-amber-400 flex items-center transition-colors">
                      Shop Spices &rarr;
                    </Link>
                  </div>
                </div>
              </div>

              {/* 3. Central Banner Product: Yirgacheffe Coffee Beans */}
              <div className="sm:col-span-2 group relative aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden shadow-xl border border-amber-500/40 bg-card hover:border-primary/60 transition-all duration-500">
                <Image
                  src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200&auto=format&fit=crop"
                  alt="Ethiopian Yirgacheffe Coffee Beans & Buna Ceremony"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30 flex flex-col justify-center p-5 text-white">
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge className="bg-amber-500 text-black font-extrabold text-[10px] uppercase tracking-wider px-2 py-0.5">
                      ☕ Premium Yirgacheffe
                    </Badge>
                    <Badge variant="outline" className="bg-black/40 backdrop-blur-md text-white border-white/20 text-[10px]">
                      Single Origin Grade-1
                    </Badge>
                  </div>
                  <h3 className="text-xl font-black text-white tracking-tight">Yirgacheffe Coffee Beans</h3>
                  <p className="text-xs text-white/80 max-w-sm line-clamp-1 font-medium mt-0.5">Floral jasmine, bergamot citrus & dark chocolate notes.</p>
                  <div className="mt-3 flex items-center space-x-4">
                    <span className="text-sm font-black text-amber-400">£14.99 / 500g</span>
                    <Button size="sm" className="bg-white text-black hover:bg-amber-400 font-extrabold rounded-xl text-xs h-8 px-3 cursor-pointer" asChild>
                      <Link href="/shop/coffee">View Product &rarr;</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Glass Ratings & Cart Express Shipping Badge */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-card/85 backdrop-blur-md border border-border/80 shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="h-9 w-9 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                  <Star className="h-4.5 w-4.5 fill-amber-400 text-amber-400" />
                </div>
                <div>
                  <div className="flex items-center space-x-1">
                    <span className="font-extrabold text-xs text-foreground">4.9 / 5.0 Rating</span>
                    <span className="text-[10px] text-muted-foreground">(850+ Habesha Families)</span>
                  </div>
                  <p className="text-[10px] font-semibold text-muted-foreground">Authentic Goods Delivered UK-Wide</p>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-xs font-bold text-primary">
                <ShoppingBag className="h-4 w-4" />
                <span>Fast UK Tracked Shipping</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PRIMARY CTA DISCOVERY BANNER */}
      <section className="bg-gradient-to-r from-card via-card to-amber-500/10 border border-border/80 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md backdrop-blur-sm">
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start space-x-2 text-xs font-bold text-primary uppercase tracking-wider mb-1">
            <Award className="h-4 w-4" />
            <span>Direct Ethiopian Artisans Marketplace</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight">Looking for authentic Ethiopian traditional goods in the UK?</h3>
          <p className="text-sm text-muted-foreground">Explore handwoven Habesha Kemis, freshly ground Berbere, and artisanal Jebena sets.</p>
        </div>
        <Button size="lg" className="font-extrabold shadow-lg rounded-xl whitespace-nowrap cursor-pointer" asChild>
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
  );
}
