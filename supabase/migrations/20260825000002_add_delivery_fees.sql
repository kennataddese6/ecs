ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_deliverable boolean DEFAULT true;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS delivery_fee_per_unit numeric(10,2) DEFAULT 0;

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_method text DEFAULT 'bank_transfer';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_proof_url text;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('payment-proofs', 'payment-proofs', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
ON CONFLICT (id) DO UPDATE SET public = true;
