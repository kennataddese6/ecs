-- Migration: Add stripe_session_id to orders table and create indexes for Stripe lookups

ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS stripe_session_id text;

CREATE INDEX IF NOT EXISTS idx_orders_stripe_session_id 
ON public.orders(stripe_session_id);

CREATE INDEX IF NOT EXISTS idx_orders_stripe_payment_intent_id 
ON public.orders(stripe_payment_intent_id);
