import Link from "next/link";
import Image from "next/image";
import { NewsArticle } from "@/lib/services/news";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

export function NewsCard({ article }: { article: NewsArticle }) {
  const formattedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <Card className="group overflow-hidden flex flex-col h-full hover:border-primary/50 transition-all">
      <Link href={`/news/${article.slug}`} className="relative aspect-video bg-muted overflow-hidden">
        {article.featured_image && article.featured_image.startsWith("http") ? (
          <Image
            src={article.featured_image}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm font-semibold bg-muted/60">
            {article.title}
          </div>
        )}
      </Link>

      <CardHeader className="p-5 pb-2">
        {formattedDate && (
          <div className="flex items-center text-xs text-muted-foreground mb-1">
            <Calendar className="h-3.5 w-3.5 mr-1" />
            <span>{formattedDate}</span>
          </div>
        )}
        <Link href={`/news/${article.slug}`}>
          <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
            {article.title}
          </CardTitle>
        </Link>
      </CardHeader>

      <CardContent className="p-5 pt-0 flex-1">
        {article.excerpt && (
          <p className="text-sm text-muted-foreground line-clamp-3">{article.excerpt}</p>
        )}
      </CardContent>
    </Card>
  );
}
