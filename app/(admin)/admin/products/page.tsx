import Link from "next/link";
import { getAllAdminProducts } from "@/lib/services/admin";
import { DataTable, Column } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PriceDisplay } from "@/components/shop/price-display";
import { Plus, Edit, Trash2, Star } from "lucide-react";
import { deleteProductAction, toggleProductFeaturedAction } from "@/lib/actions/admin-products";
import { FormError, FormSuccess } from "@/components/ui/form-message";

type ProductRow = Awaited<ReturnType<typeof getAllAdminProducts>>[number];

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const products = await getAllAdminProducts();
  const params = await searchParams;

  const columns: Column<ProductRow>[] = [
    {
      header: "Name",
      cell: (row) => (
        <div>
          <span className="font-semibold block">{row.name}</span>
          <span className="text-xs text-muted-foreground">SKU: {row.sku || "N/A"}</span>
        </div>
      ),
    },
    {
      header: "Price",
      cell: (row) => <PriceDisplay price={row.price} compareAtPrice={row.compare_at_price} />,
    },
    {
      header: "Unit / Size",
      cell: (row) => (
        <Badge variant="outline" className="text-xs font-semibold">
          {row.unit_label || "1 Item"}
        </Badge>
      ),
    },
    {
      header: "Featured Showcase",
      cell: (row) => (
        <form action={toggleProductFeaturedAction.bind(null, row.id, row.featured)}>
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            className={`h-7 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              row.featured
                ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/25"
                : "text-muted-foreground hover:bg-muted"
            }`}
            title={row.featured ? "Click to remove from Featured section" : "Click to feature on Front Page"}
          >
            <Star className={`h-3.5 w-3.5 mr-1 ${row.featured ? "fill-amber-500 text-amber-500" : ""}`} />
            {row.featured ? "Featured" : "Feature"}
          </Button>
        </form>
      ),
    },
    {
      header: "Stock",
      cell: (row) => (
        <span className={row.stock_quantity < 5 ? "text-destructive font-semibold" : "font-medium"}>
          {row.stock_quantity}
        </span>
      ),
    },
    {
      header: "Status",
      cell: (row) => (
        <Badge variant={row.active ? "secondary" : "outline"}>
          {row.active ? "Active" : "Draft"}
        </Badge>
      ),
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/admin/products/${row.id}/edit`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
          <form action={deleteProductAction.bind(null, row.id)}>
            <Button variant="ghost" size="icon" className="text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </form>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Products Catalog</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage inventory, pricing, featured home page items, and active store products.
          </p>
        </div>
        <Button size="sm" asChild>
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4 mr-2" /> Add New Product
          </Link>
        </Button>
      </div>

      <FormError message={params.error} />
      <FormSuccess message={params.success} />

      <DataTable columns={columns} data={products} emptyTitle="No products found in catalog" />
    </div>
  );
}
