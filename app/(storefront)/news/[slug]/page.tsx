import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getNewsBySlug } from "@/lib/services/news";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar } from "lucide-react";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);

  if (!article || !article.published) {
    return { title: "Article Not Found" };
  }

  const imageUrl = article.featured_image || "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop";

  return {
    title: article.title,
    description: article.excerpt || `Read ${article.title} on Enat Market Journal.`,
    openGraph: {
      title: `${article.title} | Enat Market Journal`,
      description: article.excerpt || `Read ${article.title} on Enat Market Journal.`,
      images: [{ url: imageUrl, alt: article.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${article.title} | Enat Market Journal`,
      description: article.excerpt || `Read ${article.title} on Enat Market Journal.`,
      images: [imageUrl],
    },
  };
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);

  if (!article || !article.published) {
    notFound();
  }

  const formattedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString("en-GB", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const mainImageUrl = article.featured_image || "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    image: [mainImageUrl],
    datePublished: article.published_at || article.created_at,
    dateModified: article.updated_at,
    description: article.excerpt,
    author: {
      "@type": "Organization",
      name: "Enat Market Editorial Team",
    },
  };

  return (
    <article className="max-w-3xl mx-auto space-y-8 py-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Button variant="ghost" size="sm" asChild>
        <Link href="/news">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Journal
        </Link>
      </Button>

      <header className="space-y-4">
        <div className="flex items-center space-x-3 text-sm text-muted-foreground font-semibold">
          <Badge variant="secondary" className="bg-primary/10 text-primary border border-primary/20">Enat Market Editorial</Badge>
          {formattedDate && (
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1.5" />
              <span>{formattedDate}</span>
            </div>
          )}
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
          {article.title}
        </h1>

        {article.excerpt && (
          <p className="text-xl text-muted-foreground leading-relaxed font-normal">
            {article.excerpt}
          </p>
        )}
      </header>

      {article.featured_image && (
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-muted border border-border shadow-md">
          <Image
            src={article.featured_image}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="prose prose-slate dark:prose-invert max-w-none text-base leading-relaxed border-t border-border pt-8">
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
      </div>
    </article>
  );
}
