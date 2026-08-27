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
    description: category.description || `Explore ${category.name} products at LUMEN.`,
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
    <div className="space-y-8 py-4">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight">{category.name}</h1>
        {category.description && (
          <p className="text-muted-foreground text-sm mt-1 max-w-2xl">{category.description}</p>
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
