"use server";

import { createClient } from "@/lib/supabase/server";
import { getCart } from "@/lib/services/cart";
import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function createCheckoutSessionAction(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const customerName = formData.get("customerName") as string;
  const customerEmail = formData.get("customerEmail") as string;
  const customerPhone = (formData.get("customerPhone") as string) || null;
  const street = formData.get("street") as string;
  const city = formData.get("city") as string;
  const state = formData.get("state") as string;
  const postalCode = formData.get("postalCode") as string;
  const country = formData.get("country") as string;

  if (!customerName || !customerEmail || !street || !city || !country) {
    redirect(`/checkout?error=${encodeURIComponent("Please complete all required shipping fields.")}`);
  }

  const { cartId, items } = await getCart();
  if (!items || items.length === 0 || !cartId) {
    redirect("/cart");
  }

  const productIds = items.map((i) => i.product_id);
  const { data: dbProducts } = await supabase
    .from("products")
    .select("id, name, price, stock_quantity, active")
    .in("id", productIds);

  const productMap = new Map(dbProducts?.map((p) => [p.id, p]));

  let subtotal = 0;
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
    const product = productMap.get(item.product_id);

    if (!product || !product.active) {
      redirect(`/cart?error=${encodeURIComponent("Product is no longer available.")}`);
    }

    if (product.stock_quantity < item.quantity) {
      redirect(`/cart?error=${encodeURIComponent(`Insufficient stock for "${product.name}". Available: ${product.stock_quantity}.`)}`);
    }

    const verifiedPrice = Number(product.price);
    subtotal += verifiedPrice * item.quantity;

    orderItemsToInsert.push({
      product_id: product.id,
      product_name_snapshot: product.name,
      unit_price: verifiedPrice,
      quantity: item.quantity,
    });

    stripeLineItems.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: product.name,
        },
        unit_amount: Math.round(verifiedPrice * 100),
      },
      quantity: item.quantity,
    });
  }

  const shippingCost = subtotal > 100 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shippingCost + tax;
  const orderNumber = `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_number: orderNumber,
      user_id: user?.id || null,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      shipping_address: { street, city, state, postal_code: postalCode, country },
      status: "pending",
      payment_status: "unpaid",
      subtotal,
      shipping_cost: shippingCost,
      tax,
      total,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    redirect(`/checkout?error=${encodeURIComponent("Failed to initialize order record.")}`);
  }

  const orderItemsWithId = orderItemsToInsert.map((item) => ({
    ...item,
    order_id: order.id,
  }));
  await supabase.from("order_items").insert(orderItemsWithId);

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
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
      cancel_url: `${origin}/checkout/cancel?order_id=${order.id}`,
      metadata: {
        order_id: order.id,
        cart_id: cartId,
        user_id: user?.id || "",
      },
    });

    if (session.url) {
      redirect(session.url);
    } else {
      redirect(`/checkout?error=${encodeURIComponent("Stripe session URL unavailable.")}`);
    }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Stripe checkout session error.";
    redirect(`/checkout?error=${encodeURIComponent(errorMessage)}`);
  }
}
