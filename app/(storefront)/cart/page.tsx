import Link from "next/link";
import { getCart } from "@/lib/services/cart";
import { CartItem } from "@/components/shop/cart-item";
import { PriceDisplay } from "@/components/shop/price-display";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default async function CartPage() {
  const { items } = await getCart();

  const subtotal = items.reduce(
    (acc, item) => acc + (item.product?.price || 0) * item.quantity,
    0
  );
  const shipping = subtotal > 100 ? 0 : subtotal > 0 ? 15 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="py-12">
        <EmptyState
          title="Your shopping cart is empty"
          description="Looks like you haven't added anything to your cart yet."
          actionText="Browse Shop"
          actionHref="/shop"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 py-6">
      <h1 className="text-3xl font-extrabold tracking-tight">Shopping Cart ({items.length})</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        <div className="lg:col-span-2 divide-y border-t border-b border-border">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        <div className="bg-card border border-border p-6 rounded-xl space-y-6 shadow-sm sticky top-24">
          <h2 className="text-lg font-bold border-b border-border pb-3">Order Summary</h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <PriceDisplay price={subtotal} />
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estimated Shipping</span>
              <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estimated Tax (8%)</span>
              <PriceDisplay price={tax} />
            </div>
            <div className="border-t border-border pt-3 flex justify-between font-bold text-base">
              <span>Total</span>
              <PriceDisplay price={total} className="text-lg" />
            </div>
          </div>

          <Button size="lg" className="w-full font-semibold" asChild>
            <Link href="/checkout">
              Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
