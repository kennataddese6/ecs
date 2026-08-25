import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ShieldCheck, HeartHandshake, Leaf } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Enat Market Story & Philosophy",
  description: "Learn about Enat Market's mission, quality products, and commitment to authentic customer service.",
};

export default function AboutPage() {
  return (
    <div className="space-y-24 py-6">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-card via-card to-muted border border-border p-8 sm:p-16 lg:p-20 shadow-2xl text-center space-y-6">
        <div className="max-w-3xl mx-auto space-y-4">
          <Badge className="bg-primary text-primary-foreground font-bold">Our Story & Values</Badge>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            Quality Essentials for <br />
            <span className="gradient-text">Every Household.</span>
          </h1>
          <p className="text-muted-foreground text-lg sm:text-xl leading-relaxed">
            Enat Market was built to deliver premium curated products, everyday essentials, and authentic quality directly to your doorstep.
          </p>
        </div>
      </section>

      {/* 2. COMPANY STORY & IMAGERY */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <Badge variant="secondary">The Enat Market Vision</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Bringing Authentic Excellence to Your Home.
          </h2>
          <div className="space-y-4 text-muted-foreground text-base leading-relaxed">
            <p>
              Enat Market represents care, warmth, and quality. We carefully curate products across electronics, apparel, lifestyle items, and daily goods.
            </p>
            <p>
              We prioritize authenticity, reliable delivery, and customer satisfaction above all else. Every item in our store is inspected to guarantee high standards.
            </p>
          </div>
        </div>

        <div className="relative aspect-square sm:aspect-video lg:aspect-square rounded-3xl overflow-hidden border border-border shadow-xl bg-muted">
          <Image
            src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1200&auto=format&fit=crop"
            alt="Enat Market Curated Storefront"
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
            The foundation behind every product we list, package, and deliver to our valued clients.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-card border border-border p-8 rounded-3xl space-y-4 shadow-sm hover:border-primary/50 transition-colors">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Uncompromising Quality</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We source top-tier products directly from vetted suppliers to ensure genuine quality and long-lasting value.
            </p>
          </div>

          <div className="bg-card border border-border p-8 rounded-3xl space-y-4 shadow-sm hover:border-primary/50 transition-colors">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Leaf className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Ethical & Responsible</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Responsible sourcing, eco-friendly packaging considerations, and dedicated attention to community needs.
            </p>
          </div>

          <div className="bg-card border border-border p-8 rounded-3xl space-y-4 shadow-sm hover:border-primary/50 transition-colors">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Dedicated Customer Care</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Fast courier dispatch, responsive support via email & phone hotline, and hassle-free return support.
            </p>
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/10 via-card to-card border border-primary/20 p-12 sm:p-16 text-center space-y-6 shadow-xl">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Explore the Enat Market Catalog</h2>
        <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
          Browse our curated selection of quality electronics, apparel, artisan accessories, and lifestyle goods.
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
