import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    if (webhookSecret && signature) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      event = JSON.parse(body) as Stripe.Event;
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Webhook Error";
    console.error(`Stripe Webhook Signature Verification Failed: ${message}`);
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.order_id;
    const cartId = session.metadata?.cart_id;

    if (orderId) {
      const supabaseAdmin = createAdminClient();

      const { data: existingOrder } = await supabaseAdmin
        .from("orders")
        .select("payment_status")
        .eq("id", orderId)
        .single();

      if (existingOrder?.payment_status === "paid") {
        return NextResponse.json({ received: true, note: "Order already processed" });
      }

      await supabaseAdmin
        .from("orders")
        .update({
          status: "processing",
          payment_status: "paid",
          stripe_payment_id: (session.payment_intent as string) || session.id,
        })
        .eq("id", orderId);

      const { data: orderItems } = await supabaseAdmin
        .from("order_items")
        .select("product_id, quantity")
        .eq("order_id", orderId);

      if (orderItems && orderItems.length > 0) {
        for (const item of orderItems) {
          if (item.product_id) {
            const { error: rpcError } = await supabaseAdmin.rpc("decrement_stock_atomic", {
              p_product_id: item.product_id,
              p_quantity: item.quantity,
            });

            if (rpcError) {
              const { data: prod } = await supabaseAdmin
                .from("products")
                .select("stock_quantity")
                .eq("id", item.product_id)
                .single();

              if (prod) {
                const updatedStock = Math.max(0, prod.stock_quantity - item.quantity);
                await supabaseAdmin
                  .from("products")
                  .update({ stock_quantity: updatedStock })
                  .eq("id", item.product_id);
              }
            }
          }
        }
      }

      if (cartId) {
        await supabaseAdmin.from("cart_items").delete().eq("cart_id", cartId);
      }
    }
  }

  return NextResponse.json({ received: true });
}
