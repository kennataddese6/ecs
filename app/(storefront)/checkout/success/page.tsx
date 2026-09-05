import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getOrderForConfirmation } from "@/lib/services/orders";
import { clearCart } from "@/lib/services/cart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PriceDisplay } from "@/components/shop/price-display";
import { CheckCircle2, Package, Building2, FileCheck, Clock } from "lucide-react";
import { ShippingAddress } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; order_id?: string; payment_method?: string }>;
}) {
  const params = await searchParams;
  const { session_id: sessionId, order_id: orderId } = params;

  if (!orderId) {
    redirect("/");
  }

  // Clear guest cart cookie on the client side upon reaching success page
  try {
    await clearCart();
  } catch (e) {
    // Non-fatal
  }

  // Retrieve order details securely (read-only; webhook is the single source of truth for payment status)
  const order = await getOrderForConfirmation(orderId, sessionId);
  if (!order) {
    notFound();
  }

  const shippingAddr = order.shipping_address as unknown as ShippingAddress;
  const isBankTransfer = order.payment_method === "bank_transfer" || !!order.payment_proof_url;
  const isPaid = order.payment_status === "paid";
  const isPendingVerification = order.payment_status === "pending_verification";

  return (
    <div className="max-w-3xl mx-auto py-12 space-y-8 text-center sm:text-left">
      <div className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-3xl space-y-4 shadow-sm text-center">
        <div className="h-16 w-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
          {isPaid ? (
            <CheckCircle2 className="h-10 w-10" />
          ) : isBankTransfer ? (
            <CheckCircle2 className="h-10 w-10" />
          ) : (
            <Clock className="h-10 w-10 animate-pulse" />
          )}
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          {isBankTransfer
            ? "Bank Transfer Order Received!"
            : isPaid
            ? "Payment Confirmed & Order Placed!"
            : "Order Received!"}
        </h1>
        <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
          {isBankTransfer
            ? "Thank you for your order! We have received your purchase and payment proof. Our admin team will verify your transfer and notify you upon dispatch."
            : isPaid
            ? "Thank you for your payment! We've received your order and are preparing it for shipment."
            : "Thank you for your order! Your Stripe payment is being verified by our system, and your order will begin processing momentarily."}
        </p>

        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <Badge variant="secondary" className="text-xs py-1 px-3">
            Order #: {order.order_number}
          </Badge>
          <Badge
            className={`text-xs py-1 px-3 text-white ${
              isPaid
                ? "bg-emerald-500"
                : isPendingVerification
                ? "bg-amber-500"
                : "bg-blue-500"
            }`}
          >
            Payment Status:{" "}
            {isPendingVerification
              ? "Pending Verification (BACS)"
              : isPaid
              ? "Paid"
              : "Verifying with Stripe..."}
          </Badge>
        </div>
      </div>

      {isBankTransfer && (
        <div className="p-6 rounded-2xl bg-card border border-primary/20 space-y-3 shadow-sm">
          <div className="flex items-center space-x-2 font-bold text-sm text-foreground">
            <Building2 className="h-4 w-4 text-primary" />
            <span>Bank Transfer Reference & Verification Status</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your transfer receipt was attached to your order. If you need to re-upload or contact customer support regarding your payment, reach us at <strong>shop@enatmarket.co.uk</strong> or call <strong>07830 682710</strong>.
          </p>
          {order.payment_proof_url && (
            <div className="pt-1">
              <a
                href={order.payment_proof_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-primary hover:underline bg-primary/10 px-3 py-1 rounded-lg border border-primary/20"
              >
                <FileCheck className="h-3.5 w-3.5" />
                <span>View Uploaded Transfer Receipt</span>
              </a>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-card border border-border p-6 rounded-2xl space-y-2">
          <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Customer Info</h3>
          <p className="font-semibold text-base">{order.customer_name}</p>
          <p className="text-sm text-muted-foreground">{order.customer_email}</p>
          {order.customer_phone && <p className="text-sm text-muted-foreground">{order.customer_phone}</p>}
        </div>

        <div className="bg-card border border-border p-6 rounded-2xl space-y-2">
          <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">
            {order.shipping_address && (order.shipping_address as Record<string, string>).fulfillment_method?.includes("Collection")
              ? "Collection Point"
              : "Shipping Address"}
          </h3>
          {shippingAddr && (
            <div className="text-sm text-muted-foreground space-y-0.5">
              <p className="font-medium text-foreground">{shippingAddr.street}</p>
              <p>
                {shippingAddr.city}, {shippingAddr.state} {shippingAddr.postal_code}
              </p>
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

        <div className="space-y-1.5 pt-2 text-xs text-muted-foreground border-b border-border pb-3">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <PriceDisplay price={order.subtotal} />
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{order.shipping_cost === 0 ? "FREE" : `£${order.shipping_cost.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between">
            <span>VAT (Included in price)</span>
            <PriceDisplay price={0} />
          </div>
        </div>

        <div className="flex justify-between items-center pt-1 font-bold text-base">
          <span>Total Amount</span>
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
