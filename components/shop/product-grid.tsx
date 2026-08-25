import { ProductWithImages } from "@/lib/services/products";
import { ProductCard } from "@/components/shop/product-card";
import { EmptyState } from "@/components/common/empty-state";

export function ProductGrid({ products }: { products: ProductWithImages[] }) {
  if (!products || products.length === 0) {
    return <EmptyState title="No products found" description="Check back later for new inventory." />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
