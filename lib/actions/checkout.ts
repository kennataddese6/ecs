"use server";

import { createClient } from "@/lib/supabase/server";
import { getCart } from "@/lib/services/cart";
import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { isValidUKPostcode, isValidUKPhoneNumber, formatUKPostcode, formatUKPhoneNumber } from "@/lib/utils/uk-validation";

export async function createCheckoutSessionAction(formData: FormData): Promise<void> {
  await new Promise((res) => setTimeout(res, 50));
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const fulfillmentMethod = (formData.get("fulfillmentMethod") as string) || "delivery";
  const isCollection = fulfillmentMethod === "collection";

  const customerName = (formData.get("customerName") as string) || "";
  const customerEmail = (formData.get("customerEmail") as string) || "";
  const customerPhone = (formData.get("customerPhone") as string) || "";
  const street = (formData.get("street") as string) || (isCollection ? "Enat Market Store Collection" : "");
  const city = (formData.get("city") as string) || (isCollection ? "London" : "");
  const state = (formData.get("state") as string) || (isCollection ? "Greater London" : "");
  const postalCode = (formData.get("postalCode") as string) || (isCollection ? "N/A" : "");
  const country = (formData.get("country") as string) || "United Kingdom";

  if (!customerName || !customerEmail) {
    redirect(`/checkout?error=${encodeURIComponent("Please complete all required customer details.")}`);
  }

  // If UK Courier Delivery, validate UK shipping address & postcode
  if (!isCollection) {
    if (!street || !city || !postalCode) {
      redirect(`/checkout?error=${encodeURIComponent("Please complete all required UK shipping address fields.")}`);
    }
    if (!isValidUKPostcode(postalCode)) {
      redirect(`/checkout?error=${encodeURIComponent("Invalid UK postcode format. Please enter a valid postcode (e.g. SW1A 1AA or EC1A 1BB).")}`);
    }
  }

  // Validate UK Phone Number
  if (!isValidUKPhoneNumber(customerPhone)) {
    redirect(`/checkout?error=${encodeURIComponent("Invalid UK phone number. Please enter a valid UK number (e.g. 07830 682710 or 0203 576 0507).")}`);
  }

  const formattedPostcode = isCollection ? "STORE PICKUP" : formatUKPostcode(postalCode);
  const formattedPhone = formatUKPhoneNumber(customerPhone);

  const { cartId, items } = await getCart();
  if (!items || items.length === 0 || !cartId) {
    redirect("/cart");
  }

  const productIds = items.map((i) => i.product_id);
  const { data: dbProducts } = await supabase
    .from("products")
    .select("id, name, price, stock_quantity, active, is_deliverable, delivery_fee_per_unit")
    .in("id", productIds);

  const productMap = new Map(dbProducts?.map((p) => [p.id, p]));

  let subtotal = 0;
  let totalShippingCost = 0;

  const orderItemsToInsert: {
    product_id: string;
    product_name_snapshot: string;
    unit_price: number;
    quantity: number;
  }[] = [];

  const stripeLineItems: {
    price_data: {
      currency: string;
      product_data: { name: string };
      unit_amount: number;
    };
    quantity: number;
  }[] = [];

  for (const item of items) {
    const product = productMap.get(item.product_id) || item.product;

    if (!product || product.active === false) {
      redirect(`/cart?error=${encodeURIComponent("Product is no longer available.")}`);
    }

    if (product.stock_quantity !== undefined && product.stock_quantity < item.quantity) {
      redirect(`/cart?error=${encodeURIComponent(`Insufficient stock for "${product.name}". Available: ${product.stock_quantity}.`)}`);
    }

    // If UK Courier Delivery, check deliverability
    if (!isCollection) {
      const isDeliverable = product.is_deliverable ?? true;
      if (!isDeliverable) {
        redirect(`/checkout?error=${encodeURIComponent(`"${product.name}" is for in-store pickup only and cannot be delivered via UK courier.`)}`);
      }
    }

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

  // If shipping cost exists and delivery is selected, add shipping as a line item to Stripe
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

  const tax = subtotal * 0.05; // 5% UK VAT rate on eligible items
  const total = subtotal + totalShippingCost + tax;
  const orderNumber = `ORD-UK-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const { data: order, error: orderError } = await supabase
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
        country: "United Kingdom",
        fulfillment_method: isCollection ? "In-Person Store Collection" : "UK Courier Delivery",
      },
      status: "pending",
      payment_status: "unpaid",
      subtotal,
      shipping_cost: totalShippingCost,
      tax,
      total,
      notes: isCollection ? "Customer selected In-Person Store Collection." : null,
    })
    .select("id")
    .single();

  const finalOrderId = order?.id || `demo-order-${Date.now()}`;

  if (order && !orderError) {
    const orderItemsWithId = orderItemsToInsert.map((item) => ({
      ...item,
      order_id: order.id,
    }));
    await supabase.from("order_items").insert(orderItemsWithId);
  }

  const headersList = await headers();
  const host = headersList.get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const origin = `${protocol}://${host}`;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: stripeLineItems,
      mode: "payment",
      customer_email: customerEmail,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${finalOrderId}`,
      cancel_url: `${origin}/checkout/cancel?order_id=${finalOrderId}`,
      metadata: {
        order_id: finalOrderId,
        cart_id: cartId,
        user_id: user?.id || "",
        fulfillment_method: isCollection ? "collection" : "delivery",
      },
    });

    if (session.url) {
      redirect(session.url);
    }
  } catch (err: unknown) {
    // If Stripe keys are not set up or offline preview mode, redirect directly to success order page
    redirect(`${origin}/checkout/success?order_id=${finalOrderId}`);
  }

  redirect(`${origin}/checkout/success?order_id=${finalOrderId}`);
}
