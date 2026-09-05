"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCart, clearCart } from "@/lib/services/cart";
import { createStripeCheckoutSession } from "@/lib/services/stripe";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import {
  isValidUKPostcode,
  isValidUKPhoneNumber,
  formatUKPostcode,
  formatUKPhoneNumber,
} from "@/lib/utils/uk-validation";
import { uploadImageToStorage } from "@/lib/supabase/storage";
import Stripe from "stripe";

export async function createCheckoutSessionAction(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const fulfillmentMethod = (formData.get("fulfillmentMethod") as string) || "delivery";
  const paymentMethod = (formData.get("paymentMethod") as string) || "stripe";
  const isCollection = fulfillmentMethod === "collection";
  const isBankTransfer = paymentMethod === "bank_transfer";

  const customerName = ((formData.get("customerName") as string) || "").trim();
  const customerEmail = ((formData.get("customerEmail") as string) || "").trim();
  const customerPhone = ((formData.get("customerPhone") as string) || "").trim();
  const street = ((formData.get("street") as string) || (isCollection ? "Enat Market Store Collection" : "")).trim();
  const city = ((formData.get("city") as string) || (isCollection ? "London" : "")).trim();
  const state = ((formData.get("state") as string) || (isCollection ? "Greater London" : "")).trim();
  const postalCode = ((formData.get("postalCode") as string) || (isCollection ? "N/A" : "")).trim();
  const country = "United Kingdom";

  // Upload proof of payment file if attached (for bank transfer)
  const paymentProofFile = formData.get("paymentProofFile") as File | null;
  let paymentProofUrl: string | null = null;

  if (isBankTransfer && paymentProofFile && paymentProofFile.size > 0) {
    const uploadedUrl = await uploadImageToStorage(paymentProofFile, "payment-proofs");
    if (uploadedUrl) {
      paymentProofUrl = uploadedUrl;
    }
  }

  if (!customerName || !customerEmail) {
    redirect(`/checkout?error=${encodeURIComponent("Please complete all required customer details.")}`);
  }

  // If UK Courier Delivery, validate UK shipping address & postcode
  if (!isCollection) {
    if (!street || !city || !postalCode) {
      redirect(`/checkout?error=${encodeURIComponent("Please complete all required UK shipping address fields.")}`);
    }
    if (!isValidUKPostcode(postalCode)) {
      redirect(
        `/checkout?error=${encodeURIComponent("Invalid UK postcode format. Please enter a valid postcode (e.g. SW1A 1AA or EC1A 1BB).")}`
      );
    }
  }

  // Validate UK Phone Number
  if (!isValidUKPhoneNumber(customerPhone)) {
    redirect(
      `/checkout?error=${encodeURIComponent("Invalid UK phone number. Please enter a valid UK number (e.g. 07830 682710 or 0203 576 0507).")}`
    );
  }

  const formattedPostcode = isCollection ? "STORE PICKUP" : formatUKPostcode(postalCode);
  const formattedPhone = formatUKPhoneNumber(customerPhone);

  const { cartId, items } = await getCart();
  if (!items || items.length === 0 || !cartId) {
    redirect("/cart");
  }

  // Server-side product price & inventory verification directly against database
  const productIds = items.map((i) => i.product_id);
  const { data: dbProducts, error: dbError } = await supabase
    .from("products")
    .select("id, name, price, stock_quantity, active, is_deliverable, delivery_fee_per_unit")
    .in("id", productIds);

  if (dbError || !dbProducts) {
    redirect(`/checkout?error=${encodeURIComponent("Failed to verify product information. Please try again.")}`);
  }

  const productMap = new Map(dbProducts.map((p) => [p.id, p]));

  let subtotal = 0;
  let totalShippingCost = 0;

  const orderItemsToInsert: {
    product_id: string;
    product_name_snapshot: string;
    unit_price: number;
    quantity: number;
  }[] = [];

  const stripeLineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  for (const item of items) {
    const product = productMap.get(item.product_id);

    if (!product || product.active === false) {
      redirect(`/cart?error=${encodeURIComponent("One or more products are no longer available.")}`);
    }

    if (product.stock_quantity !== undefined && product.stock_quantity < item.quantity) {
      redirect(
        `/cart?error=${encodeURIComponent(`Insufficient stock for "${product.name}". Available: ${product.stock_quantity}.`)}`
      );
    }

    // If UK Courier Delivery, check deliverability
    if (!isCollection) {
      const isDeliverable = product.is_deliverable ?? true;
      if (!isDeliverable) {
        redirect(
          `/checkout?error=${encodeURIComponent(`"${product.name}" is for in-store pickup only and cannot be delivered via UK courier.`)}`
        );
      }
    }

    // Always use verified database price, never client amount
    const verifiedPrice = Number(product.price);
    const unitDeliveryFee = isCollection ? 0 : Number(product.delivery_fee_per_unit ?? 0);

    subtotal += verifiedPrice * item.quantity;
    totalShippingCost += unitDeliveryFee * item.quantity;

    orderItemsToInsert.push({
      product_id: product.id,
      product_name_snapshot: product.name,
      unit_price: verifiedPrice,
      quantity: item.quantity,
    });

    stripeLineItems.push({
      price_data: {
        currency: "gbp",
        product_data: {
          name: product.name,
        },
        unit_amount: Math.round(verifiedPrice * 100),
      },
      quantity: item.quantity,
    });
  }

  // If shipping fee applies, add as a line item to Stripe
  if (!isCollection && totalShippingCost > 0) {
    stripeLineItems.push({
      price_data: {
        currency: "gbp",
        product_data: {
          name: "UK Courier Express Delivery",
        },
        unit_amount: Math.round(totalShippingCost * 100),
      },
      quantity: 1,
    });
  }

  // All customer-facing prices are VAT-inclusive; no additional VAT is added
  const tax = 0;
  const total = subtotal + totalShippingCost;
  const orderNumber = `ORD-UK-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const initialPaymentStatus = isBankTransfer ? "pending_verification" : "unpaid";

  // Create pending order record in Supabase using admin client to guarantee reliable server-side execution
  const supabaseAdmin = createAdminClient();

  const { data: order, error: orderError } = await supabaseAdmin
    .from("orders")
    .insert({
      order_number: orderNumber,
      user_id: user?.id || null,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: formattedPhone,
      shipping_address: {
        street,
        city,
        state,
        postal_code: formattedPostcode,
        country,
        fulfillment_method: isCollection ? "In-Person Store Collection" : "UK Courier Delivery",
      },
      status: "pending",
      payment_status: initialPaymentStatus,
      payment_method: isBankTransfer ? "bank_transfer" : "card",
      payment_proof_url: paymentProofUrl,
      subtotal,
      shipping_cost: totalShippingCost,
      tax,
      total,
      notes: isBankTransfer
        ? "Order placed via Direct Bank Transfer (Proof Uploaded)."
        : isCollection
        ? "Customer selected In-Person Store Collection."
        : "Order awaiting Stripe Checkout payment confirmation.",
    })
    .select("id")
    .single();

  if (orderError || !order) {
    console.error("Order creation database error:", orderError);
    redirect(`/checkout?error=${encodeURIComponent("Unable to save order. Please try again.")}`);
  }

  // Insert order items linked to order
  const orderItemsWithId = orderItemsToInsert.map((item) => ({
    ...item,
    order_id: order.id,
  }));
  const { error: itemsError } = await supabaseAdmin.from("order_items").insert(orderItemsWithId);

  if (itemsError) {
    console.error("Order items database error:", itemsError);
    redirect(`/checkout?error=${encodeURIComponent("Unable to record items in order. Please try again.")}`);
  }

  // Compute host origin for redirection dynamically from request headers
  const headersList = await headers();
  const rawHost = headersList.get("x-forwarded-host") || headersList.get("host");
  const host = rawHost?.split(",")[0]?.trim() || "enatmarket.co.uk";
  const rawProto = headersList.get("x-forwarded-proto");
  const protocol = rawProto?.split(",")[0]?.trim() || (host.includes("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;

  // If Bank Transfer: clear cart now and redirect to success page
  if (isBankTransfer) {
    await clearCart(cartId);
    redirect(`${origin}/checkout/success?order_id=${order.id}&payment_method=bank_transfer`);
  }

  // If Stripe Checkout: create Stripe session and redirect customer to hosted checkout
  let stripeCheckoutUrl: string | null = null;

  try {
    const session = await createStripeCheckoutSession({
      orderId: order.id,
      orderNumber,
      customerEmail,
      lineItems: stripeLineItems,
      origin,
      metadata: {
        order_id: order.id,
        order_number: orderNumber,
        cart_id: cartId,
        user_id: user?.id || "",
        fulfillment_method: isCollection ? "collection" : "delivery",
      },
    });

    // Store Stripe Checkout Session ID on the order in Supabase
    await supabaseAdmin
      .from("orders")
      .update({
        stripe_session_id: session.id,
      })
      .eq("id", order.id);

    stripeCheckoutUrl = session.url;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Stripe initialization failed";
    console.error("Stripe Checkout Session Creation Error:", message);

    // Cancel order since payment session could not be established
    await supabaseAdmin
      .from("orders")
      .update({
        status: "cancelled",
        notes: `Payment initialization error: ${message}`,
      })
      .eq("id", order.id);

    redirect(
      `/checkout?error=${encodeURIComponent("Could not initialize Stripe Checkout. Please try again or choose Bank Transfer.")}`
    );
  }

  // Redirect to Stripe-hosted Checkout (outside try/catch to respect Next.js redirect behavior)
  if (stripeCheckoutUrl) {
    redirect(stripeCheckoutUrl);
  } else {
    redirect(`/checkout?error=${encodeURIComponent("Payment checkout URL was not generated. Please try again.")}`);
  }
}
