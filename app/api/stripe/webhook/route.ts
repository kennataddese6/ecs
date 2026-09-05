import { NextRequest, NextResponse } from "next/server";
import {
  verifyStripeWebhookSignature,
  processStripeWebhookEvent,
} from "@/lib/services/stripe";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error(
      "[Stripe Webhook] Error: STRIPE_WEBHOOK_SECRET is not configured in environment variables."
    );
    return NextResponse.json(
      { error: "Webhook secret is not configured on server" },
      { status: 500 }
    );
  }

  if (!signature) {
    console.error("[Stripe Webhook] Error: Missing stripe-signature header.");
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = verifyStripeWebhookSignature(body, signature, webhookSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    console.error(`[Stripe Webhook] Signature verification failed: ${message}`);
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${message}` },
      { status: 400 }
    );
  }

  try {
    const result = await processStripeWebhookEvent(event);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    console.error(`[Stripe Webhook] Error processing event ${event.type}:`, err);
    return NextResponse.json(
      { error: "Internal error processing webhook" },
      { status: 500 }
    );
  }
}
