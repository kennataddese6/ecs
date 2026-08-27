import Link from "next/link";
import { Category } from "@/lib/services/categories";

export function CategoryNav({
  categories,
  activeSlug,
}: {
  categories: Category[];
  activeSlug?: string;
}) {
  return (
    <div className="w-full max-w-full min-w-0 overflow-hidden py-1">
      <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none py-2 px-1 touch-pan-x min-w-0 w-full">
        <Link
          href="/shop"
          className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
            !activeSlug
              ? "bg-primary text-primary-foreground shadow"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          All Products
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/shop/${cat.slug}`}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              activeSlug === cat.slug
                ? "bg-primary text-primary-foreground shadow"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
