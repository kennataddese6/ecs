"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ProductSortOption } from "@/lib/services/products";

export function ShopSortControls({ total }: { total: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = (searchParams.get("sort") as ProductSortOption) || "newest";

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", e.target.value);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-border pb-4">
      <p className="text-sm text-muted-foreground font-medium">
        Showing <span className="font-bold text-foreground">{total}</span> product{total === 1 ? "" : "s"}
      </p>

      <div className="flex items-center space-x-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
          Sort By:
        </label>
        <select
          value={currentSort}
          onChange={handleSortChange}
          className="flex h-9 rounded-lg border border-input bg-card px-3 py-1 text-sm shadow-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="newest">Newest Arrivals</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A to Z</option>
        </select>
      </div>
    </div>
  );
}
