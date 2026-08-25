import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getOrderById } from "@/lib/services/orders";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PriceDisplay } from "@/components/shop/price-display";
import { CheckCircle2, Package } from "lucide-react";
import { ShippingAddress } from "@/lib/types";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; order_id?: string }>;
}) {
  const params = await searchParams;
  const { session_id: sessionId, order_id: orderId } = params;

  if (!orderId) {
    redirect("/");
  }

  if (sessionId) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.payment_status === "paid") {
        const supabaseAdmin = createAdminClient();

        await supabaseAdmin
          .from("orders")
          .update({
            status: "processing",
            payment_status: "paid",
            stripe_payment_id: (session.payment_intent as string) || session.id,
          })
          .eq("id", orderId);

        const cartId = session.metadata?.cart_id;
        if (cartId) {
          await supabaseAdmin.from("cart_items").delete().eq("cart_id", cartId);
        }
      }
    } catch (e) {
      console.error("Stripe session verification error:", e);
    }
  }

  const order = await getOrderById(orderId);
  if (!order) {
    notFound();
  }

  const shippingAddr = order.shipping_address as unknown as ShippingAddress;

  return (
    <div className="max-w-3xl mx-auto py-12 space-y-8 text-center sm:text-left">
      <div className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-3xl space-y-4 shadow-sm text-center">
        <div className="h-16 w-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Order Confirmed!</h1>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Thank you for your purchase. We&apos;ve received your order and are preparing it for shipment.
        </p>
        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <Badge variant="secondary" className="text-xs py-1 px-3">
            Order #: {order.order_number}
          </Badge>
          <Badge className="bg-emerald-500 text-white text-xs py-1 px-3">
            Payment Status: {order.payment_status}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-card border border-border p-6 rounded-2xl space-y-2">
          <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Customer Info</h3>
          <p className="font-semibold text-base">{order.customer_name}</p>
          <p className="text-sm text-muted-foreground">{order.customer_email}</p>
          {order.customer_phone && <p className="text-sm text-muted-foreground">{order.customer_phone}</p>}
        </div>

        <div className="bg-card border border-border p-6 rounded-2xl space-y-2">
          <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Shipping Address</h3>
          {shippingAddr && (
            <div className="text-sm text-muted-foreground space-y-0.5">
              <p className="font-medium text-foreground">{shippingAddr.street}</p>
              <p>{shippingAddr.city}, {shippingAddr.state} {shippingAddr.postal_code}</p>
              <p>{shippingAddr.country}</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-card border border-border p-6 rounded-2xl space-y-4">
        <h3 className="font-bold text-base border-b border-border pb-3">Item Summary</h3>
        <div className="divide-y border-t border-b border-border">
          {order.order_items?.map((item) => (
            <div key={item.id} className="py-3 flex items-center justify-between text-sm">
              <div>
                <p className="font-semibold">{item.product_name_snapshot}</p>
                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
              </div>
              <PriceDisplay price={item.unit_price * item.quantity} />
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-2 font-bold text-base">
          <span>Total Paid</span>
          <PriceDisplay price={order.total} className="text-lg text-primary" />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
        <Button variant="outline" asChild>
          <Link href="/shop">Continue Shopping</Link>
        </Button>
        <Button asChild>
          <Link href={`/account/orders/${order.id}`}>
            View Order in Account <Package className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
