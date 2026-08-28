-- Update CHECK constraints for public.orders status and payment_status columns

-- 1. Drop existing status check constraint if exists and add updated constraint including 'completed'
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE public.orders ADD CONSTRAINT orders_status_check 
  CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'completed', 'cancelled', 'refunded'));

-- 2. Drop existing payment_status check constraint if exists and add updated constraint including 'pending_verification'
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_payment_status_check;
ALTER TABLE public.orders ADD CONSTRAINT orders_payment_status_check 
  CHECK (payment_status IN ('unpaid', 'paid', 'failed', 'refunded', 'pending_verification'));
