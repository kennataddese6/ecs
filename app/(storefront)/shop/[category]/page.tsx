import Image from "next/image";
import { notFound } from "next/navigation";
import { getCategoryBySlug, getCategories } from "@/lib/services/categories";
import { getProducts, ProductSortOption } from "@/lib/services/products";
import { ProductGrid } from "@/components/shop/product-grid";
import { CategoryNav } from "@/components/shop/category-nav";
import { Pagination } from "@/components/common/pagination";
import { ShopSortControls } from "@/components/shop/shop-sort-controls";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = await getCategoryBySlug(categorySlug);
  if (!category) return { title: "Category Not Found" };

  return {
    title: `${category.name} Collection`,
    description: category.description || `Explore ${category.name} products at Enat Market.`,
  };
}

export default async function CategoryShopPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ sort?: string; page?: string }>;
}) {
  const { category: categorySlug } = await params;
  const sParams = await searchParams;

  const category = await getCategoryBySlug(categorySlug);
  if (!category) {
    notFound();
  }

  const sort = (sParams.sort as ProductSortOption) || "newest";
  const page = parseInt(sParams.page || "1", 10);
  const limit = 12;
  const offset = (page - 1) * limit;

  const [{ products, total }, allCategories] = await Promise.all([
    getProducts({ categorySlug: category.slug, sort, limit, offset }),
    getCategories(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-8">
      {/* Category Banner with Image */}
      <div className="relative rounded-3xl overflow-hidden border border-border/80 bg-gradient-to-r from-card via-card to-amber-500/10 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md backdrop-blur-sm">
        <div className="space-y-2 flex-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-md">
            Curated Collection
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">{category.name}</h1>
          {category.description && (
            <p className="text-muted-foreground text-sm max-w-2xl font-medium leading-relaxed">
              {category.description}
            </p>
          )}
        </div>
        {category.image_url && (
          <div className="relative h-28 w-28 sm:h-36 sm:w-36 rounded-2xl overflow-hidden bg-muted border border-border shrink-0 shadow-sm">
            <Image
              src={category.image_url}
              alt={category.name}
              fill
              className="object-cover"
            />
          </div>
        )}
      </div>

      <div className="w-full min-w-0">
        <CategoryNav categories={allCategories} activeSlug={category.slug} />
      </div>

      <ShopSortControls total={total} />

      <ProductGrid products={products} />

      <Pagination currentPage={page} totalPages={totalPages} baseUrl={`/shop/${category.slug}`} />
    </div>
  );
}
