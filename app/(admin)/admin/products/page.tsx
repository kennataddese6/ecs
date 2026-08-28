import Link from "next/link";
import { getAllAdminProducts } from "@/lib/services/admin";
import { DataTable, Column } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PriceDisplay } from "@/components/shop/price-display";
import { Plus, Edit, Trash2 } from "lucide-react";
import { deleteProductAction } from "@/lib/actions/admin-products";

type ProductRow = Awaited<ReturnType<typeof getAllAdminProducts>>[number];

export default async function AdminProductsPage() {
  const products = await getAllAdminProducts();

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
            Manage inventory, pricing, and active store products.
          </p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4 mr-2" /> Add Product
          </Link>
        </Button>
      </div>

      <DataTable columns={columns} data={products} emptyTitle="No products created yet" />
    </div>
  );
}
