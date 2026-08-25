import { requireAdmin } from "@/lib/auth";
import { getAllAdminOrders } from "@/lib/services/admin";
import { DataTable, Column } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PriceDisplay } from "@/components/shop/price-display";
import { updateOrderStatusAction } from "@/lib/actions/admin-orders";
import Link from "next/link";
import { ShippingAddress } from "@/lib/types";

type OrderRow = Awaited<ReturnType<typeof getAllAdminOrders>>[number];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; error?: string; success?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const currentStatus = params.status || "all";

  const orders = await getAllAdminOrders(currentStatus);

  const columns: Column<OrderRow>[] = [
    {
      header: "Order #",
      cell: (row) => (
        <div>
          <span className="font-bold block">{row.order_number}</span>
          <span className="text-xs text-muted-foreground">
            {new Date(row.created_at).toLocaleDateString()}
          </span>
        </div>
      ),
    },
    {
      header: "Customer & Shipping",
      cell: (row) => {
        const addr = row.shipping_address as unknown as ShippingAddress;
        return (
          <div>
            <span className="font-semibold block">{row.customer_name}</span>
            <span className="text-xs text-muted-foreground block">{row.customer_email}</span>
            {addr && (
              <span className="text-[10px] text-muted-foreground block">
                {addr.city}, {addr.country}
              </span>
            )}
          </div>
        );
      },
    },
    {
      header: "Items",
      cell: (row) => (
        <span className="text-xs font-semibold">{row.order_items?.length || 0} item(s)</span>
      ),
    },
    {
      header: "Total",
      cell: (row) => <PriceDisplay price={row.total} className="font-bold" />,
    },
    {
      header: "Fulfillment Status",
      cell: (row) => (
        <form action={updateOrderStatusAction.bind(null, row.id)} className="flex items-center space-x-2">
          <select
            name="status"
            defaultValue={row.status}
            className="h-8 rounded border border-input bg-card px-2 text-xs font-medium"
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <Button type="submit" size="sm" variant="outline" className="h-8 text-xs px-2">
            Save
          </Button>
        </form>
      ),
    },
    {
      header: "Payment",
      cell: (row) => (
        <Badge variant={row.payment_status === "paid" ? "secondary" : "outline"} className="capitalize">
          {row.payment_status}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Order Management</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Monitor customer purchases, shipping statuses, and fulfillment tracking.
        </p>
      </div>

      {params.error && (
        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-xs font-medium border border-destructive/20">
          {params.error}
        </div>
      )}

      {params.success && (
        <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-500 text-xs font-medium border border-emerald-500/20">
          {params.success}
        </div>
      )}

      <div className="flex space-x-2 border-b border-border pb-3 overflow-x-auto text-xs font-semibold">
        {["all", "pending", "processing", "shipped", "completed", "cancelled"].map((st) => (
          <Link
            key={st}
            href={`/admin/orders${st === "all" ? "" : `?status=${st}`}`}
            className={`px-3 py-1.5 rounded-lg capitalize transition-colors whitespace-nowrap ${
              currentStatus === st
                ? "bg-primary text-primary-foreground font-bold shadow-sm"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {st}
          </Link>
        ))}
      </div>

      <DataTable columns={columns} data={orders} emptyTitle="No customer orders matching status filter" />
    </div>
  );
}
