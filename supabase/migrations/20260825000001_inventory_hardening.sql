-- Migration: Inventory Hardening & Atomic Stock Functions

-- 1. Ensure non-negative stock constraint exists
ALTER TABLE public.products
  DROP CONSTRAINT IF EXISTS products_stock_quantity_check;

ALTER TABLE public.products
  ADD CONSTRAINT products_stock_quantity_check CHECK (stock_quantity >= 0);

-- 2. Atomic Stock Decrement Function
CREATE OR REPLACE FUNCTION public.decrement_stock_atomic(
  p_product_id uuid,
  p_quantity integer
)
RETURNS boolean AS $$
DECLARE
  v_current_stock integer;
BEGIN
  IF p_quantity <= 0 THEN
    RETURN true;
  END IF;

  -- Lock product row for update to prevent race conditions
  SELECT stock_quantity INTO v_current_stock
  FROM public.products
  WHERE id = p_product_id AND active = true
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Product not found or inactive';
  END IF;

  IF v_current_stock < p_quantity THEN
    RETURN false;
  END IF;

  UPDATE public.products
  SET stock_quantity = stock_quantity - p_quantity,
      updated_at = now()
  WHERE id = p_product_id;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 3. Restore Stock Function for Cancelled/Refunded Orders
CREATE OR REPLACE FUNCTION public.restore_order_stock(
  p_order_id uuid
)
RETURNS void AS $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT product_id, quantity
    FROM public.order_items
    WHERE order_id = p_order_id AND product_id IS NOT NULL
  LOOP
    UPDATE public.products
    SET stock_quantity = stock_quantity + r.quantity,
        updated_at = now()
    WHERE id = r.product_id;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
