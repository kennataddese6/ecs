"use client";

import * as React from "react";
import { CartItemWithProduct } from "@/lib/types";
import { createCheckoutSessionAction } from "@/lib/actions/checkout";
import { isValidUKPostcode, isValidUKPhoneNumber, formatUKPostcode } from "@/lib/utils/uk-validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PriceDisplay } from "@/components/shop/price-display";
import {
  Truck,
  AlertTriangle,
  CheckCircle2,
  CreditCard,
  Lock,
  ShieldCheck,
  MapPin,
  Store,
  ShoppingBag,
  Building2,
  Upload,
  FileCheck,
  X,
} from "lucide-react";

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
  const [fulfillmentMethod, setFulfillmentMethod] = React.useState<"delivery" | "collection">("delivery");
  const [paymentMethod, setPaymentMethod] = React.useState<"bank_transfer" | "stripe">("bank_transfer");
  const [postcode, setPostcode] = React.useState<string>("");
  const [phone, setPhone] = React.useState<string>(user?.user_metadata?.phone || "");
  const [proofPreview, setProofPreview] = React.useState<string>("");
  const [proofFileName, setProofFileName] = React.useState<string>("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const proofFileInputRef = React.useRef<HTMLInputElement>(null);

  const isDelivery = fulfillmentMethod === "delivery";
  const isPostcodeValid = !isDelivery || postcode.trim() === "" || isValidUKPostcode(postcode);
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

  const calculatedShippingCost = shippingBreakdown.reduce((acc, curr) => acc + curr.totalItemDeliveryCost, 0);
  const effectiveShippingCost = isDelivery ? calculatedShippingCost : 0;

  const nonDeliverableItems = shippingBreakdown.filter((item) => !item.isDeliverable);
  const hasNonDeliverable = isDelivery && nonDeliverableItems.length > 0;

  const tax = subtotal * 0.05; // 5% UK VAT rate on eligible items
  const total = subtotal + effectiveShippingCost + tax;

  const handlePostcodeBlur = () => {
    if (postcode && isValidUKPostcode(postcode)) {
      setPostcode(formatUKPostcode(postcode));
    }
  };

  const handleProofFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProofFileName(file.name);
      if (file.type.startsWith("image/")) {
        setProofPreview(URL.createObjectURL(file));
      } else {
        setProofPreview("");
      }
    }
  };

  const clearProofFile = () => {
    setProofPreview("");
    setProofFileName("");
    if (proofFileInputRef.current) {
      proofFileInputRef.current.value = "";
    }
  };

  return (
    <form
      action={createCheckoutSessionAction}
      onSubmit={() => setIsSubmitting(true)}
      className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
    >
      <input type="hidden" name="fulfillmentMethod" value={fulfillmentMethod} />
      <input type="hidden" name="paymentMethod" value={paymentMethod} />

      <div className="lg:col-span-2 space-y-6 bg-card border border-border p-6 sm:p-8 rounded-3xl shadow-sm">
        {/* 1. FULFILLMENT METHOD TOGGLE */}
        <div className="space-y-3 border-b border-border pb-6">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Select Fulfillment Method</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => setFulfillmentMethod("delivery")}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center space-x-3 ${
                isDelivery
                  ? "border-primary bg-primary/10 shadow-sm"
                  : "border-border bg-card hover:border-primary/50"
              }`}
            >
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold ${
                isDelivery ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                <Truck className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm text-foreground">UK Courier Shipping</h4>
                <p className="text-xs text-muted-foreground">
                  {calculatedShippingCost === 0 ? "Free Shipping" : `+£${calculatedShippingCost.toFixed(2)} delivery`}
                </p>
              </div>
              {isDelivery && <CheckCircle2 className="h-5 w-5 text-primary" />}
            </div>

            <div
              onClick={() => setFulfillmentMethod("collection")}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center space-x-3 ${
                !isDelivery
                  ? "border-primary bg-primary/10 shadow-sm"
                  : "border-border bg-card hover:border-primary/50"
              }`}
            >
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold ${
                !isDelivery ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                <Store className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm text-foreground">In-Person Collection</h4>
                <p className="text-xs text-emerald-500 font-semibold">FREE (£0.00)</p>
              </div>
              {!isDelivery && <CheckCircle2 className="h-5 w-5 text-primary" />}
            </div>
          </div>
        </div>

        {!isDelivery ? (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 space-y-2">
            <div className="flex items-center space-x-2 font-bold text-sm">
              <ShoppingBag className="h-4 w-4" />
              <span>In-Store Collection Selected (No Shipping Fee Added)</span>
            </div>
            <p className="text-xs leading-relaxed text-foreground/90">
              Collect your items directly at <strong>Enat Market Store</strong>. Please bring your order confirmation email and photo ID upon arrival.
            </p>
            <div className="text-[11px] text-muted-foreground pt-1 border-t border-emerald-500/20">
              Store Hotline: <strong>07830 682710</strong> / <strong>0203 576 0507</strong> | Email: <strong>shop@enatmarket.co.uk</strong>
            </div>
          </div>
        ) : null}

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
            <p className="text-[11px] text-muted-foreground pt-1">
              Tip: Switch your checkout fulfillment option to <strong>In-Person Collection</strong> above to order these items for pickup without shipping!
            </p>
          </div>
        )}

        {/* 2. CONTACT DETAILS */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold border-b border-border pb-2">Contact Details</h3>
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
            <p className="text-[10px] text-muted-foreground">Required for SMS pickup or delivery notifications.</p>
          </div>
        </div>

        {/* 3. ADDRESS DETAILS */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-bold border-b border-border pb-2 flex items-center justify-between">
            <span>{isDelivery ? "UK Shipping Address" : "Billing Address (Pickup)"}</span>
            {!isDelivery && <span className="text-xs font-normal text-muted-foreground">In-Store Pickup selected</span>}
          </h3>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider">Street Address {isDelivery ? "*" : "(Optional)"}</label>
            <Input
              name="street"
              placeholder={isDelivery ? "123 High Street, Flat 4B" : "Store Collection / Pickup"}
              defaultValue={!isDelivery ? "Enat Market Store Pickup" : ""}
              required={isDelivery}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider">City / Town {isDelivery ? "*" : ""}</label>
              <Input
                name="city"
                placeholder="London, Manchester, Birmingham..."
                defaultValue={!isDelivery ? "London" : ""}
                required={isDelivery}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider">County / Region</label>
              <Input name="state" placeholder="Greater London..." defaultValue={!isDelivery ? "Greater London" : ""} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider">UK Postcode {isDelivery ? "*" : ""}</label>
                {isDelivery && postcode.trim() !== "" && (
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
                placeholder={isDelivery ? "e.g. SW1A 1AA or CR2 6XH" : "Pickup (Optional)"}
                className={isDelivery && !isPostcodeValid && postcode.trim() !== "" ? "border-destructive focus-visible:ring-destructive uppercase" : "uppercase"}
                required={isDelivery}
              />
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

        {/* 4. PAYMENT METHOD & PROOF OF TRANSFER UPLOAD */}
        <div className="space-y-4 pt-4 border-t border-border">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Select Payment Method</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => setPaymentMethod("bank_transfer")}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center space-x-3 ${
                paymentMethod === "bank_transfer"
                  ? "border-primary bg-primary/10 shadow-sm"
                  : "border-border bg-card hover:border-primary/50"
              }`}
            >
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold ${
                paymentMethod === "bank_transfer" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                <Building2 className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm text-foreground">Direct Bank Transfer</h4>
                <p className="text-xs text-primary font-medium">UK BACS + Proof Upload</p>
              </div>
              {paymentMethod === "bank_transfer" && <CheckCircle2 className="h-5 w-5 text-primary" />}
            </div>

            <div
              onClick={() => setPaymentMethod("stripe")}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center space-x-3 ${
                paymentMethod === "stripe"
                  ? "border-primary bg-primary/10 shadow-sm"
                  : "border-border bg-card hover:border-primary/50"
              }`}
            >
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold ${
                paymentMethod === "stripe" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                <CreditCard className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm text-foreground">Credit / Debit Card</h4>
                <p className="text-xs text-muted-foreground">Stripe Checkout</p>
              </div>
              {paymentMethod === "stripe" && <CheckCircle2 className="h-5 w-5 text-primary" />}
            </div>
          </div>

          {paymentMethod === "bank_transfer" && (
            <div className="p-5 rounded-2xl bg-card border border-primary/30 space-y-4 shadow-sm animate-in fade-in duration-200">
              <div className="space-y-1">
                <h4 className="font-bold text-sm flex items-center space-x-2 text-foreground">
                  <Building2 className="h-4 w-4 text-primary" />
                  <span>Enat Market Official UK Bank Account Details</span>
                </h4>
                <p className="text-xs text-muted-foreground">
                  Please transfer the total amount <strong>£{total.toFixed(2)}</strong> to our Barclays UK bank account:
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-muted/60 p-4 rounded-xl text-xs font-medium">
                <div>
                  <span className="block text-[10px] text-muted-foreground uppercase font-semibold">Bank Name</span>
                  <span className="font-bold text-foreground">Barclays Bank UK</span>
                </div>
                <div>
                  <span className="block text-[10px] text-muted-foreground uppercase font-semibold">Account Name</span>
                  <span className="font-bold text-foreground">Enat Market Ltd</span>
                </div>
                <div>
                  <span className="block text-[10px] text-muted-foreground uppercase font-semibold">Sort Code</span>
                  <span className="font-bold text-foreground">20-00-00</span>
                </div>
                <div>
                  <span className="block text-[10px] text-muted-foreground uppercase font-semibold">Account No.</span>
                  <span className="font-bold text-foreground">87654321</span>
                </div>
              </div>

              {/* Upload Proof of Transfer File Input */}
              <div className="space-y-2 pt-1">
                <label className="text-xs font-semibold flex items-center justify-between">
                  <span className="flex items-center space-x-1.5">
                    <Upload className="h-3.5 w-3.5 text-primary" />
                    <span>Upload Proof of Bank Transfer / Screenshot (Required)</span>
                  </span>
                  {proofFileName && (
                    <span className="text-[10px] text-emerald-500 font-bold flex items-center space-x-1">
                      <FileCheck className="h-3 w-3" />
                      <span>Receipt Attached</span>
                    </span>
                  )}
                </label>

                {proofFileName ? (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-muted border border-border">
                    <div className="flex items-center space-x-3 overflow-hidden">
                      {proofPreview ? (
                        <div className="h-10 w-10 rounded-lg overflow-hidden bg-background border border-border flex-shrink-0 relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={proofPreview} alt="Receipt preview" className="h-full w-full object-cover" />
                        </div>
                      ) : (
                        <FileCheck className="h-6 w-6 text-primary flex-shrink-0" />
                      )}
                      <div className="overflow-hidden text-xs">
                        <p className="font-semibold text-foreground truncate">{proofFileName}</p>
                        <p className="text-[10px] text-emerald-500">Ready for admin verification</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={clearProofFile}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div
                    onClick={() => proofFileInputRef.current?.click()}
                    className="border-2 border-dashed border-border hover:border-primary/60 bg-muted/30 hover:bg-muted/60 transition-colors rounded-xl p-4 text-center cursor-pointer space-y-1 group"
                  >
                    <Upload className="h-5 w-5 text-primary mx-auto group-hover:scale-110 transition-transform" />
                    <p className="text-xs font-semibold text-foreground">Click to upload transfer screenshot / receipt PDF</p>
                    <p className="text-[10px] text-muted-foreground">PNG, JPG, WEBP, or PDF up to 10MB</p>
                    <input
                      ref={proofFileInputRef}
                      type="file"
                      name="paymentProofFile"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={handleProofFileChange}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Summary & Dynamic Price Adjustment */}
      <div className="bg-card border border-border p-6 rounded-3xl space-y-6 shadow-sm sticky top-24">
        <h2 className="text-lg font-bold border-b border-border pb-3 flex items-center justify-between">
          <span>Order Summary</span>
          <span className="text-xs font-normal text-muted-foreground">({items.length} items)</span>
        </h2>

        {/* Dynamic Itemized Delivery Fee Calculation */}
        <div className="space-y-2 border-b border-border pb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center space-x-1.5">
            {isDelivery ? <Truck className="h-3.5 w-3.5 text-primary" /> : <Store className="h-3.5 w-3.5 text-primary" />}
            <span>{isDelivery ? "Itemized UK Courier Delivery" : "Collection Pricing"}</span>
          </h3>
          <div className="space-y-1.5 text-xs">
            {shippingBreakdown.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-muted-foreground">
                <span className="truncate max-w-[170px]" title={item.name}>
                  {item.quantity}x {item.name}
                </span>
                <span className="font-semibold text-foreground">
                  {!isDelivery ? (
                    <span className="text-emerald-500 font-bold">Store Pickup £0.00</span>
                  ) : !item.isDeliverable ? (
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
            <span className="text-muted-foreground">Fulfillment</span>
            <span className="font-bold text-foreground">
              {isDelivery ? (
                effectiveShippingCost === 0 ? "FREE Shipping" : `£${effectiveShippingCost.toFixed(2)}`
              ) : (
                <span className="text-emerald-500 font-extrabold">In-Person Pickup (FREE)</span>
              )}
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
            <Building2 className="h-4 w-4 text-primary" />
            <span>Bank Transfer & Stripe Payment Accepted</span>
          </div>
          <div className="flex items-center space-x-2">
            <Lock className="h-4 w-4 text-emerald-500" />
            <span>256-Bit SSL Encrypted Checkout</span>
          </div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span>{isDelivery ? "Tracked UK Courier Delivery" : "Store Collection Guarantee"}</span>
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={hasNonDeliverable || !isPostcodeValid || !isPhoneValid || isSubmitting}
          className="w-full font-bold shadow-lg shadow-primary/25 h-12 text-base"
        >
          {isSubmitting
            ? "Processing Order..."
            : paymentMethod === "bank_transfer"
            ? `Submit Bank Transfer Order (£${total.toFixed(2)}) \u2192`
            : `Pay £${total.toFixed(2)} via Card \u2192`}
        </Button>
      </div>
    </form>
  );
}
