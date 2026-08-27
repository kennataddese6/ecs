"use client";

import * as React from "react";
import { CartItemWithProduct } from "@/lib/types";
import { createCheckoutSessionAction } from "@/lib/actions/checkout";
import { isValidUKPostcode, isValidUKPhoneNumber, formatUKPostcode } from "@/lib/utils/uk-validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PriceDisplay } from "@/components/shop/price-display";
import { Truck, AlertTriangle, CheckCircle2, CreditCard, Lock, ShieldCheck, MapPin } from "lucide-react";

interface UKCheckoutFormProps {
  user: {
    email?: string;
    user_metadata?: {
      full_name?: string;
      phone?: string;
    };
  } | null;
  items: CartItemWithProduct[];
  error?: string;
}

export function UKCheckoutForm({ user, items, error }: UKCheckoutFormProps) {
  const [postcode, setPostcode] = React.useState<string>("");
  const [phone, setPhone] = React.useState<string>(user?.user_metadata?.phone || "");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const isPostcodeValid = postcode.trim() === "" || isValidUKPostcode(postcode);
  const isPhoneValid = phone.trim() === "" || isValidUKPhoneNumber(phone);

  // Dynamic calculations
  const subtotal = items.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0);

  const shippingBreakdown = items.map((item) => {
    const isDeliverable = item.product?.is_deliverable ?? true;
    const feePerUnit = item.product?.delivery_fee_per_unit ?? 0;
    const totalItemDeliveryCost = isDeliverable ? feePerUnit * item.quantity : 0;
    return {
      id: item.id,
      name: item.product?.name || "Product",
      quantity: item.quantity,
      isDeliverable,
      feePerUnit,
      totalItemDeliveryCost,
    };
  });

  const totalShippingCost = shippingBreakdown.reduce((acc, curr) => acc + curr.totalItemDeliveryCost, 0);
  const nonDeliverableItems = shippingBreakdown.filter((item) => !item.isDeliverable);
  const hasNonDeliverable = nonDeliverableItems.length > 0;

  const tax = subtotal * 0.05; // 5% UK VAT rate on eligible items
  const total = subtotal + totalShippingCost + tax;

  const handlePostcodeBlur = () => {
    if (postcode && isValidUKPostcode(postcode)) {
      setPostcode(formatUKPostcode(postcode));
    }
  };

  return (
    <form
      action={createCheckoutSessionAction}
      onSubmit={() => setIsSubmitting(true)}
      className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
    >
      <div className="lg:col-span-2 space-y-6 bg-card border border-border p-6 sm:p-8 rounded-3xl shadow-sm">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight">UK Shipping & Contact Details</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Delivery is currently restricted to United Kingdom addresses.</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold flex items-center space-x-1">
            <span>🇬🇧 United Kingdom Only</span>
          </span>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20 flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {hasNonDeliverable && (
          <div className="p-4 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-medium border border-amber-500/20 space-y-2">
            <div className="flex items-center space-x-2 font-bold text-sm">
              <AlertTriangle className="h-4 w-4" />
              <span>Non-Deliverable Items in Cart</span>
            </div>
            <p>The following items are marked for in-store pickup only and cannot be shipped via UK courier:</p>
            <ul className="list-disc pl-5 space-y-1">
              {nonDeliverableItems.map((item) => (
                <li key={item.id} className="font-semibold">{item.name}</li>
              ))}
            </ul>
            <p className="text-[11px] text-muted-foreground pt-1">Please remove non-deliverable items from your cart before completing checkout.</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider">Full Name *</label>
            <Input name="customerName" defaultValue={user?.user_metadata?.full_name || ""} placeholder="John Doe" required />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider">Email Address *</label>
            <Input name="customerEmail" type="email" defaultValue={user?.email || ""} placeholder="john@example.com" required />
          </div>
        </div>

        {/* UK Phone Number Input with live validation */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider">UK Phone Number *</label>
            {phone.trim() !== "" && (
              <span className={`text-[11px] font-semibold flex items-center space-x-1 ${isPhoneValid ? "text-emerald-500" : "text-destructive"}`}>
                {isPhoneValid ? (
                  <>
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Valid UK Number</span>
                  </>
                ) : (
                  <span>Invalid UK Format</span>
                )}
              </span>
            )}
          </div>
          <Input
            name="customerPhone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="07830 682710 or 0203 576 0507"
            className={!isPhoneValid && phone.trim() !== "" ? "border-destructive focus-visible:ring-destructive" : ""}
            required
          />
          <p className="text-[10px] text-muted-foreground">Required for UK courier delivery notifications & SMS tracking updates.</p>
        </div>

        {/* UK Address Fields */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider">Street Address *</label>
          <Input name="street" placeholder="123 High Street, Flat 4B" required />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider">City / Town *</label>
            <Input name="city" placeholder="London, Manchester, Birmingham..." required />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider">County / Region</label>
            <Input name="state" placeholder="Greater London, West Midlands..." />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* UK Postcode Input with live validation */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider">UK Postcode *</label>
              {postcode.trim() !== "" && (
                <span className={`text-[11px] font-semibold flex items-center space-x-1 ${isPostcodeValid ? "text-emerald-500" : "text-destructive"}`}>
                  {isPostcodeValid ? (
                    <>
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Valid UK Postcode</span>
                    </>
                  ) : (
                    <span>Invalid Postcode</span>
                  )}
                </span>
              )}
            </div>
            <Input
              name="postalCode"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
              onBlur={handlePostcodeBlur}
              placeholder="e.g. SW1A 1AA or CR2 6XH"
              className={!isPostcodeValid && postcode.trim() !== "" ? "border-destructive focus-visible:ring-destructive uppercase" : "uppercase"}
              required
            />
            <p className="text-[10px] text-muted-foreground">Valid UK postcode format required (e.g., SW1A 1AA).</p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider">Country</label>
            <div className="relative">
              <Input name="country" value="United Kingdom" readOnly className="bg-muted font-medium pr-10" />
              <MapPin className="absolute right-3 top-2.5 h-4 w-4 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Order Summary & Dynamic Delivery Calculation */}
      <div className="bg-card border border-border p-6 rounded-3xl space-y-6 shadow-sm sticky top-24">
        <h2 className="text-lg font-bold border-b border-border pb-3 flex items-center justify-between">
          <span>Order Summary</span>
          <span className="text-xs font-normal text-muted-foreground">({items.length} items)</span>
        </h2>

        {/* Dynamic Itemized Delivery Fee Calculation */}
        <div className="space-y-2 border-b border-border pb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center space-x-1.5">
            <Truck className="h-3.5 w-3.5 text-primary" />
            <span>Itemized UK Courier Delivery</span>
          </h3>
          <div className="space-y-1.5 text-xs">
            {shippingBreakdown.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-muted-foreground">
                <span className="truncate max-w-[170px]" title={item.name}>
                  {item.quantity}x {item.name}
                </span>
                <span className="font-semibold text-foreground">
                  {!item.isDeliverable ? (
                    <span className="text-destructive font-bold">Pickup Only</span>
                  ) : item.feePerUnit === 0 ? (
                    <span className="text-emerald-500 font-bold">FREE Delivery</span>
                  ) : (
                    `£${item.totalItemDeliveryCost.toFixed(2)} (£${item.feePerUnit.toFixed(2)}/unit)`
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Items Subtotal</span>
            <PriceDisplay price={subtotal} />
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">UK Shipping (Courier)</span>
            <span className="font-bold text-foreground">
              {totalShippingCost === 0 ? "FREE" : `£${totalShippingCost.toFixed(2)}`}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Estimated Tax (VAT 5%)</span>
            <PriceDisplay price={tax} />
          </div>
          <div className="border-t border-border pt-3 flex justify-between font-extrabold text-base">
            <span>Total Amount</span>
            <PriceDisplay price={total} className="text-xl text-primary" />
          </div>
        </div>

        <div className="space-y-2 border-t border-b border-border py-3 text-xs text-muted-foreground">
          <div className="flex items-center space-x-2">
            <CreditCard className="h-4 w-4 text-primary" />
            <span>Secured via Stripe UK Payment Gateway</span>
          </div>
          <div className="flex items-center space-x-2">
            <Lock className="h-4 w-4 text-emerald-500" />
            <span>256-Bit SSL Encrypted Checkout</span>
          </div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span>Tracked UK Royal Mail / DPD Courier</span>
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={hasNonDeliverable || !isPostcodeValid || !isPhoneValid || isSubmitting}
          className="w-full font-bold shadow-lg shadow-primary/25 h-12 text-base"
        >
          {isSubmitting ? "Processing Checkout..." : "Proceed to Secure Payment \u2192"}
        </Button>
      </div>
    </form>
  );
}
