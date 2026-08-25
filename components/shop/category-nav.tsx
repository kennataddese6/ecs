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
    <div className="flex space-x-2 overflow-x-auto pb-4 my-4 scrollbar-none">
      <Link
        href="/shop"
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
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
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
            activeSlug === cat.slug
              ? "bg-primary text-primary-foreground shadow"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          {cat.name}
        </Link>
      ))}
    </div>
  );
}
