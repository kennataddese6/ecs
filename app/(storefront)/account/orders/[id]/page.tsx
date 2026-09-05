import { requireUser } from "@/lib/auth";
import { getOrderById } from "@/lib/services/orders";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PriceDisplay } from "@/components/shop/price-display";
import { ArrowLeft } from "lucide-react";
import { ShippingAddress } from "@/lib/types";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireUser();
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  const shippingAddr = order.shipping_address as unknown as ShippingAddress;
  const formattedDate = new Date(order.created_at).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="py-8 max-w-4xl mx-auto space-y-8">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/account/orders">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Orders
        </Link>
      </Button>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">{order.order_number}</h1>
          <p className="text-sm text-muted-foreground mt-1">Placed on {formattedDate}</p>
        </div>
        <div className="flex space-x-2">
          <Badge variant="secondary" className="capitalize text-sm py-1 px-3">
            Status: {order.status}
          </Badge>
          <Badge variant="outline" className="capitalize text-sm py-1 px-3">
            Payment: {order.payment_status}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border p-6 rounded-xl space-y-3">
          <h3 className="font-bold text-base border-b border-border pb-2">Customer Info</h3>
          <p className="text-sm font-semibold">{order.customer_name}</p>
          <p className="text-sm text-muted-foreground">{order.customer_email}</p>
          {order.customer_phone && <p className="text-sm text-muted-foreground">{order.customer_phone}</p>}
        </div>

        <div className="bg-card border border-border p-6 rounded-xl space-y-3">
          <h3 className="font-bold text-base border-b border-border pb-2">Shipping Address</h3>
          {shippingAddr && (
            <div className="text-sm text-muted-foreground space-y-1">
              <p>{shippingAddr.street}</p>
              <p>
                {shippingAddr.city}, {shippingAddr.state} {shippingAddr.postal_code}
              </p>
              <p>{shippingAddr.country}</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h3 className="font-bold text-base border-b border-border pb-3">Items Purchased</h3>
        <div className="divide-y border-t border-b border-border">
          {order.order_items?.map((item) => (
            <div key={item.id} className="py-3 flex justify-between items-center text-sm">
              <div>
                <p className="font-semibold">{item.product_name_snapshot}</p>
                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
              </div>
              <PriceDisplay price={item.unit_price * item.quantity} />
            </div>
          ))}
        </div>

        <div className="space-y-2 text-sm pt-2 max-w-xs ml-auto">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <PriceDisplay price={order.subtotal} />
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Shipping</span>
            <span>{order.shipping_cost === 0 ? "FREE" : `£${order.shipping_cost.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>VAT (Included in price)</span>
            <PriceDisplay price={0} />
          </div>
          <div className="flex justify-between font-bold text-base border-t border-border pt-2">
            <span>Total</span>
            <PriceDisplay price={order.total} className="text-lg text-primary" />
          </div>
        </div>
      </div>
    </div>
  );
}
