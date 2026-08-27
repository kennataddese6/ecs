import { requireAdmin } from "@/lib/auth";
import { getAllAdminOrders } from "@/lib/services/admin";
import { DataTable, Column } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PriceDisplay } from "@/components/shop/price-display";
import { updateOrderStatusAction } from "@/lib/actions/admin-orders";
import Link from "next/link";
import { ShippingAddress } from "@/lib/types";
import { ExternalLink, FileCheck, Building2, CreditCard, CheckCircle2, Truck } from "lucide-react";

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
          <span className="text-[11px] text-muted-foreground">
            {new Date(row.created_at).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      ),
    },
    {
      header: "Customer & Fulfillment",
      cell: (row) => {
        const addr = row.shipping_address as unknown as (ShippingAddress & { fulfillment_method?: string });
        return (
          <div className="space-y-1">
            <span className="font-semibold block">{row.customer_name}</span>
            <span className="text-xs text-muted-foreground block">{row.customer_email}</span>
            {row.customer_phone && (
              <span className="text-[11px] text-primary font-medium block">📞 {row.customer_phone}</span>
            )}
            {addr && (
              <span className="text-[10px] text-muted-foreground block font-medium">
                📍 {addr.fulfillment_method || (addr.street === "Enat Market Store Collection" ? "In-Store Collection" : "UK Delivery")} ({addr.city})
              </span>
            )}
          </div>
        );
      },
    },
    {
      header: "Payment Method & Proof",
      cell: (row) => {
        const isBankTransfer = row.payment_method === "bank_transfer" || !!row.payment_proof_url;
        return (
          <div className="space-y-1">
            <div className="flex items-center space-x-1.5 text-xs font-semibold">
              {isBankTransfer ? (
                <>
                  <Building2 className="h-3.5 w-3.5 text-primary" />
                  <span>Bank Transfer (BACS)</span>
                </>
              ) : (
                <>
                  <CreditCard className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Card (Stripe)</span>
                </>
              )}
            </div>

            {row.payment_proof_url ? (
              <a
                href={row.payment_proof_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1 text-[11px] font-bold text-primary hover:underline bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20"
              >
                <FileCheck className="h-3 w-3" />
                <span>View Payment Receipt</span>
                <ExternalLink className="h-2.5 w-2.5 ml-0.5" />
              </a>
            ) : isBankTransfer ? (
              <span className="text-[10px] text-amber-500 font-semibold block">Awaiting Upload</span>
            ) : null}
          </div>
        );
      },
    },
    {
      header: "Total",
      cell: (row) => (
        <div>
          <PriceDisplay price={row.total} className="font-extrabold text-base" />
          <span className="text-[10px] text-muted-foreground block">
            Shipping: £{row.shipping_cost?.toFixed(2) || "0.00"}
          </span>
        </div>
      ),
    },
    {
      header: "Update Status & Payment",
      cell: (row) => (
        <form action={updateOrderStatusAction.bind(null, row.id)} className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-bold text-muted-foreground w-12">Order:</span>
            <select
              name="status"
              defaultValue={row.status}
              className="h-7 rounded border border-input bg-card px-2 text-xs font-medium flex-1"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-bold text-muted-foreground w-12">Pay:</span>
            <select
              name="paymentStatus"
              defaultValue={row.payment_status}
              className="h-7 rounded border border-input bg-card px-2 text-xs font-medium flex-1"
            >
              <option value="pending_verification">Pending Verification</option>
              <option value="paid">Paid (Verified)</option>
              <option value="unpaid">Unpaid</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          <Button type="submit" size="sm" className="w-full h-7 text-xs font-bold shadow-xs">
            Save Changes
          </Button>
        </form>
      ),
    },
    {
      header: "Current Badges",
      cell: (row) => (
        <div className="space-y-1">
          <Badge
            variant={
              row.payment_status === "paid"
                ? "secondary"
                : row.payment_status === "pending_verification"
                ? "outline"
                : "destructive"
            }
            className={`capitalize text-[10px] font-bold ${
              row.payment_status === "paid"
                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                : row.payment_status === "pending_verification"
                ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                : ""
            }`}
          >
            {row.payment_status === "pending_verification" ? "Verify Proof" : row.payment_status}
          </Badge>

          <Badge variant="outline" className="capitalize text-[10px] block w-fit font-medium">
            Status: {row.status}
          </Badge>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Order Management</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Verify Bank Transfer receipts, mark orders as Paid or Delivered, and manage fulfillment.
        </p>
      </div>

      {params.error && (
        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-xs font-medium border border-destructive/20">
          {params.error}
        </div>
      )}

      {params.success && (
        <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-500 text-xs font-medium border border-emerald-500/20 flex items-center space-x-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>{params.success}</span>
        </div>
      )}

      <div className="flex space-x-2 border-b border-border pb-3 overflow-x-auto text-xs font-semibold">
        {["all", "pending", "processing", "shipped", "delivered", "completed", "cancelled"].map((st) => (
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
