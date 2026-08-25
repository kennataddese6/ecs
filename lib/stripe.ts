import Stripe from "stripe";

export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || "sk_test_placeholder_key_for_build",
  {
    apiVersion: "2026-08-25" as unknown as Stripe.LatestApiVersion,
    appInfo: {
      name: "LUMEN E-Commerce Platform",
      version: "1.0.0",
    },
  }
);
