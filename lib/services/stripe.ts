import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import Stripe from "stripe";

export interface CreateCheckoutSessionParams {
  orderId: string;
  orderNumber: string;
  customerEmail: string;
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[];
  origin: string;
  metadata?: Record<string, string>;
}

/**
 * Creates a Stripe-hosted Checkout Session.
 * Prices and line items must be validated server-side prior to calling.
 */
export async function createStripeCheckoutSession({
  orderId,
  orderNumber,
  customerEmail,
  lineItems,
  origin,
  metadata = {},
}: CreateCheckoutSessionParams): Promise<Stripe.Checkout.Session> {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    customer_email: customerEmail,
    client_reference_id: orderId,
    success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
    cancel_url: `${origin}/checkout/cancel?order_id=${orderId}`,
    automatic_tax: {
      enabled: false,
    },
    metadata: {
      order_id: orderId,
      order_number: orderNumber,
      ...metadata,
    },
  });

  return session;
}

/**
 * Verifies and constructs a Stripe Webhook Event from raw request body and signature.
 */
export function verifyStripeWebhookSignature(
  rawBody: string,
  signature: string,
  webhookSecret: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
}

/**
 * Idempotently processes Stripe Checkout webhook events and updates Supabase database.
 * The webhook is the single source of truth for marking orders as paid.
 */
export async function processStripeWebhookEvent(event: Stripe.Event): Promise<{
  received: boolean;
  status?: string;
  orderId?: string;
  error?: string;
}> {
  const supabaseAdmin = createAdminClient();

  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded": {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.order_id || session.client_reference_id;
      const sessionId = session.id;

      if (!orderId && !sessionId) {
        console.error("Webhook Error: No order_id or session.id in checkout session");
        return { received: true, error: "Missing order reference" };
      }

      // 1. Locate the order
      let query = supabaseAdmin
        .from("orders")
        .select("id, payment_status, status, total")
        .limit(1);

      if (orderId) {
        query = query.eq("id", orderId);
      } else {
        query = query.eq("stripe_session_id", sessionId);
      }

      const { data: existingOrders, error: fetchError } = await query;
      const existingOrder = existingOrders?.[0];

      if (fetchError || !existingOrder) {
        console.error(`Webhook Warning: Order not found for session ${sessionId} / order ${orderId}`);
        return { received: true, error: "Order not found" };
      }

      // 2. Idempotency Check: if already paid, return early to prevent duplicate processing
      if (existingOrder.payment_status === "paid") {
        return {
          received: true,
          status: "already_processed",
          orderId: existingOrder.id,
        };
      }

      // 3. Verify session payment status
      if (session.payment_status === "paid" || session.payment_status === "no_payment_required") {
        const paymentIntentId =
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id || session.id;

        // Mark order as paid & processing
        const { error: updateError } = await supabaseAdmin
          .from("orders")
          .update({
            status: "processing",
            payment_status: "paid",
            stripe_payment_intent_id: paymentIntentId,
            stripe_session_id: session.id,
          })
          .eq("id", existingOrder.id);

        if (updateError) {
          console.error(`Webhook Error updating order ${existingOrder.id}:`, updateError);
          return { received: false, error: updateError.message };
        }

        // 4. Atomically decrement inventory stock for each purchased item
        const { data: orderItems } = await supabaseAdmin
          .from("order_items")
          .select("product_id, quantity")
          .eq("order_id", existingOrder.id);

        if (orderItems && orderItems.length > 0) {
          for (const item of orderItems) {
            if (item.product_id) {
              const { error: rpcError } = await supabaseAdmin.rpc("decrement_stock_atomic", {
                p_product_id: item.product_id,
                p_quantity: item.quantity,
              });

              if (rpcError) {
                // Fallback direct decrement if RPC fails
                const { data: prod } = await supabaseAdmin
                  .from("products")
                  .select("stock_quantity")
                  .eq("id", item.product_id)
                  .single();

                if (prod) {
                  const newStock = Math.max(0, prod.stock_quantity - item.quantity);
                  await supabaseAdmin
                    .from("products")
                    .update({ stock_quantity: newStock })
                    .eq("id", item.product_id);
                }
              }
            }
          }
        }

        // 5. Clean up cart in Supabase if cart_id was stored in metadata
        const cartId = session.metadata?.cart_id;
        if (cartId && cartId !== "cookie-cart") {
          await supabaseAdmin.from("cart_items").delete().eq("cart_id", cartId);
        }

        return {
          received: true,
          status: "order_marked_paid",
          orderId: existingOrder.id,
        };
      }

      return {
        received: true,
        status: `session_payment_status_${session.payment_status}`,
        orderId: existingOrder.id,
      };
    }

    case "checkout.session.async_payment_failed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.order_id || session.client_reference_id;
      const sessionId = session.id;

      let query = supabaseAdmin
        .from("orders")
        .select("id, payment_status")
        .limit(1);

      if (orderId) {
        query = query.eq("id", orderId);
      } else {
        query = query.eq("stripe_session_id", sessionId);
      }

      const { data: existingOrders } = await query;
      const existingOrder = existingOrders?.[0];

      if (existingOrder && existingOrder.payment_status !== "paid") {
        await supabaseAdmin
          .from("orders")
          .update({
            status: "cancelled",
            payment_status: "failed",
            stripe_session_id: session.id,
          })
          .eq("id", existingOrder.id);

        return {
          received: true,
          status: "order_marked_failed",
          orderId: existingOrder.id,
        };
      }

      return { received: true, status: "ignored" };
    }

    case "charge.refunded": {
      const charge = event.data.object as Stripe.Charge;
      const paymentIntentId =
        typeof charge.payment_intent === "string"
          ? charge.payment_intent
          : charge.payment_intent?.id;

      if (!paymentIntentId) {
        return { received: true, status: "no_payment_intent" };
      }

      const { data: existingOrders } = await supabaseAdmin
        .from("orders")
        .select("id, status, payment_status, notes")
        .eq("stripe_payment_intent_id", paymentIntentId)
        .limit(1);

      const existingOrder = existingOrders?.[0];
      if (!existingOrder) {
        return { received: true, status: "order_not_found" };
      }

      const isFullRefund = charge.refunded === true || charge.amount_refunded >= charge.amount;
      const refundedAmountFormatted = (charge.amount_refunded / 100).toFixed(2);

      if (isFullRefund) {
        // Full refund: update payment_status to 'refunded'
        // If order has not yet been dispatched (pending or processing), also update status to 'refunded'
        const shouldUpdateFulfillmentStatus =
          existingOrder.status === "pending" || existingOrder.status === "processing";

        const updatePayload: Record<string, string> = {
          payment_status: "refunded",
          notes: existingOrder.notes
            ? `${existingOrder.notes} | Full refund of £${refundedAmountFormatted} processed via Stripe.`
            : `Full refund of £${refundedAmountFormatted} processed via Stripe.`,
        };

        if (shouldUpdateFulfillmentStatus) {
          updatePayload.status = "refunded";
        }

        await supabaseAdmin
          .from("orders")
          .update(updatePayload)
          .eq("id", existingOrder.id);

        // Note: We intentionally do NOT automatically call restore_order_stock here.
        // Physical stock returns must be verified by store admins in /admin/products
        // to prevent inflating inventory for discarded/damaged goods or unreturned items.

        return {
          received: true,
          status: "order_full_refund_recorded",
          orderId: existingOrder.id,
        };
      } else {
        // Partial refund: record refund amount in notes without cancelling order or inflating stock
        const refundNote = `Partial refund of £${refundedAmountFormatted} processed via Stripe.`;
        const updatedNotes = existingOrder.notes
          ? `${existingOrder.notes} | ${refundNote}`
          : refundNote;

        await supabaseAdmin
          .from("orders")
          .update({
            notes: updatedNotes,
          })
          .eq("id", existingOrder.id);

        return {
          received: true,
          status: "order_partial_refund_recorded",
          orderId: existingOrder.id,
        };
      }
    }

    default:
      // Acknowledge other event types cleanly
      return { received: true, status: `unhandled_event_${event.type}` };
  }
}
