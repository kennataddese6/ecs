import { getCurrentUser } from "@/lib/auth";
import { getCart } from "@/lib/services/cart";
import { redirect } from "next/navigation";
import { UKCheckoutForm } from "@/components/checkout/uk-checkout-form";

export const dynamic = "force-dynamic";

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

  return (
    <div className="py-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">UK Checkout & Shipping</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Provide your UK delivery details to calculate itemized shipping and proceed to secure payment.
        </p>
      </div>

      <UKCheckoutForm user={user} items={items} error={params.error} />
    </div>
  );
}
