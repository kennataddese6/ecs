import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ShieldCheck, HeartHandshake, Leaf } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | LUMEN Heritage & Philosophy",
  description: "Learn about LUMEN's mission, sustainable craftsmanship, and commitment to modern luxury.",
};

export default function AboutPage() {
  return (
    <div className="space-y-24 py-6">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-card via-card to-muted border border-border p-8 sm:p-16 lg:p-20 shadow-2xl text-center space-y-6">
        <div className="max-w-3xl mx-auto space-y-4">
          <Badge className="bg-primary text-primary-foreground font-bold">Our Story & Heritage</Badge>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            Crafting the Future of <br />
            <span className="gradient-text">Timeless Luxury.</span>
          </h1>
          <p className="text-muted-foreground text-lg sm:text-xl leading-relaxed">
            LUMEN was founded on a singular conviction: that modern objects should combine uncompromising technical performance with heirloom-grade craftsmanship.
          </p>
        </div>
      </section>

      {/* 2. COMPANY STORY & IMAGERY */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <Badge variant="secondary">The LUMEN Origin</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            From European Workshops to Global Collections.
          </h2>
          <div className="space-y-4 text-muted-foreground text-base leading-relaxed">
            <p>
              Established in 2024, LUMEN began as a collaborative studio uniting acoustic engineers, master tanners, and industrial designers across Europe and North America.
            </p>
            <p>
              We bypass mass manufacturing shortcuts. Every piece in our catalog—from precision wireless acoustics to hand-stitched leather totes—undergoes rigorous stress testing and hand-finishing.
            </p>
          </div>
        </div>

        <div className="relative aspect-square sm:aspect-video lg:aspect-square rounded-3xl overflow-hidden border border-border shadow-xl bg-muted">
          <Image
            src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1200&auto=format&fit=crop"
            alt="Artisan Leather Crafting Studio"
            fill
            className="object-cover"
          />
        </div>
      </section>

      {/* 3. BRAND VALUES */}
      <section className="space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <Badge variant="secondary">Core Pillars</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Guiding Principles</h2>
          <p className="text-muted-foreground text-sm">
            The foundation behind every product we design, package, and ship worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-card border border-border p-8 rounded-3xl space-y-4 shadow-sm hover:border-primary/50 transition-colors">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Uncompromising Quality</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We source top-tier raw materials—beryllium drivers, grade-5 titanium, and full-grain Tuscan hides—that age gracefully over time.
            </p>
          </div>

          <div className="bg-card border border-border p-8 rounded-3xl space-y-4 shadow-sm hover:border-primary/50 transition-colors">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Leaf className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Ethical & Sustainable</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              100% recyclable packaging, fair-wage European artisanal workshops, and zero single-use plastic across our entire supply chain.
            </p>
          </div>

          <div className="bg-card border border-border p-8 rounded-3xl space-y-4 shadow-sm hover:border-primary/50 transition-colors">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Lifetime Customer Care</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Every purchase includes a 2-year comprehensive warranty, 30-day hassle-free returns, and 24/7 dedicated concierge support.
            </p>
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/10 via-card to-card border border-primary/20 p-12 sm:p-16 text-center space-y-6 shadow-xl">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Explore the Collection</h2>
        <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
          Discover our curated selection of acoustic headphones, leather accessories, and luxury lifestyle objects.
        </p>
        <Button size="lg" className="font-bold shadow-lg shadow-primary/25" asChild>
          <Link href="/shop">
            Shop Catalog <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </section>
    </div>
  );
}
