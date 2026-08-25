import { getCurrentUser } from "@/lib/auth";
import { getCart } from "@/lib/services/cart";
import { redirect } from "next/navigation";
import { createCheckoutSessionAction } from "@/lib/actions/checkout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PriceDisplay } from "@/components/shop/price-display";
import { CreditCard, Lock } from "lucide-react";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await getCurrentUser();
  const { items } = await getCart();
  const params = await searchParams;

  if (items.length === 0) {
    redirect("/cart");
  }

  const subtotal = items.reduce(
    (acc, item) => acc + (item.product?.price || 0) * item.quantity,
    0
  );
  const shipping = subtotal > 100 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="py-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Checkout</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Provide your shipping details to proceed to secure payment.
        </p>
      </div>

      {params.error && (
        <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20">
          {params.error}
        </div>
      )}

      <form action={createCheckoutSessionAction} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6 bg-card border border-border p-6 sm:p-8 rounded-2xl shadow-sm">
          <h2 className="text-xl font-bold border-b border-border pb-3">Shipping & Customer Information</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider">Full Name</label>
              <Input name="customerName" defaultValue={user?.user_metadata?.full_name || ""} required />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider">Email Address</label>
              <Input name="customerEmail" type="email" defaultValue={user?.email || ""} required />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider">Phone Number</label>
            <Input name="customerPhone" placeholder="+1 (555) 000-0000" defaultValue={user?.user_metadata?.phone || ""} />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider">Street Address</label>
            <Input name="street" placeholder="123 Main Street, Apt 4B" required />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider">City</label>
              <Input name="city" placeholder="New York" required />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider">State / Region</label>
              <Input name="state" placeholder="NY" required />
            </div>
            <div className="space-y-2 col-span-2 sm:col-span-1">
              <label className="text-xs font-semibold uppercase tracking-wider">Postal Code</label>
              <Input name="postalCode" placeholder="10001" required />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider">Country</label>
            <Input name="country" defaultValue="United States" required />
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-2xl space-y-6 shadow-sm sticky top-24">
          <h2 className="text-lg font-bold border-b border-border pb-3">Order Summary ({items.length} items)</h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <PriceDisplay price={subtotal} />
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax</span>
              <PriceDisplay price={tax} />
            </div>
            <div className="border-t border-border pt-3 flex justify-between font-bold text-base">
              <span>Total</span>
              <PriceDisplay price={total} className="text-lg text-primary" />
            </div>
          </div>

          <div className="space-y-2 border-t border-b border-border py-3 text-xs text-muted-foreground">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4 text-primary" />
              <span>Processed securely via Stripe Checkout</span>
            </div>
            <div className="flex items-center space-x-2">
              <Lock className="h-4 w-4 text-emerald-500" />
              <span>256-Bit SSL Encryption</span>
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full font-bold shadow-lg shadow-primary/25">
            Proceed to Payment &rarr;
          </Button>
        </div>
      </form>
    </div>
  );
}
