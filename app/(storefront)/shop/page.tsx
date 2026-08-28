import { getProducts, ProductSortOption } from "@/lib/services/products";
import { getCategories } from "@/lib/services/categories";
import { ProductGrid } from "@/components/shop/product-grid";
import { CategoryNav } from "@/components/shop/category-nav";
import { Pagination } from "@/components/common/pagination";
import { SearchBar } from "@/components/common/search-bar";
import { ShopSortControls } from "@/components/shop/shop-sort-controls";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop All Products",
  description: "Browse our complete catalog of luxury lifestyle goods, modern electronics, and timeless apparel.",
};

export default async function ShopCatalogPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    sort?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const search = params.q || "";
  const sort = (params.sort as ProductSortOption) || "newest";
  const page = parseInt(params.page || "1", 10);
  const limit = 12;
  const offset = (page - 1) * limit;

  const [{ products, total }, categories] = await Promise.all([
    getProducts({ search, sort, limit, offset }),
    getCategories(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-8">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight">Shop Collection</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Explore precision-crafted goods and limited edition releases.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 w-full min-w-0">
        <div className="flex-1 min-w-0 w-full">
          <CategoryNav categories={categories} />
        </div>
        <div className="w-full sm:w-72 shrink-0">
          <SearchBar placeholder="Search catalog..." />
        </div>
      </div>

      <ShopSortControls total={total} />

      <ProductGrid products={products} />

      <Pagination currentPage={page} totalPages={totalPages} baseUrl="/shop" />
    </div>
  );
}
