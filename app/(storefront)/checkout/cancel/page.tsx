import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { Button } from "@/components/ui/button";
import { ShoppingBag, RefreshCw } from "lucide-react";

export default async function CheckoutCancelPage({
  searchParams,
}: {
  searchParams: Promise<{ order_id?: string }>;
}) {
  const { order_id: orderId } = await searchParams;

  if (orderId) {
    const supabaseAdmin = createAdminClient();
    await supabaseAdmin
      .from("orders")
      .update({ status: "cancelled" })
      .eq("id", orderId)
      .eq("payment_status", "unpaid");
  }

  return (
    <div className="max-w-md mx-auto py-16 text-center space-y-6">
      <div className="h-16 w-16 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto">
        <RefreshCw className="h-8 w-8" />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight">Payment Cancelled</h1>
        <p className="text-muted-foreground text-sm">
          Your payment session was cancelled. No charges were made to your card, and your cart items remain saved.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        <Button variant="outline" asChild>
          <Link href="/cart">
            <ShoppingBag className="h-4 w-4 mr-2" /> Return to Cart
          </Link>
        </Button>
        <Button asChild>
          <Link href="/checkout">Retry Checkout</Link>
        </Button>
      </div>
    </div>
  );
}
