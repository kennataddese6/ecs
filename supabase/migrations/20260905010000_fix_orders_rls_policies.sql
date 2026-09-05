-- Fix orders and order_items RLS policies for guest checkout and order creation

-- 1. Update orders insert policy
DROP POLICY IF EXISTS "Users create order" ON public.orders;
CREATE POLICY "Users create order"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL OR public.is_admin(auth.uid()));

-- 2. Allow order_items insert for orders
DROP POLICY IF EXISTS "Allow order items insert" ON public.order_items;
CREATE POLICY "Allow order items insert"
  ON public.order_items FOR INSERT
  WITH CHECK (true);

-- 3. Ensure order items can be viewed by order owner, guest or admin
DROP POLICY IF EXISTS "Users view own order items" ON public.order_items;
CREATE POLICY "Users view own order items"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE id = order_items.order_id AND (user_id = auth.uid() OR user_id IS NULL OR public.is_admin(auth.uid()))
    )
  );
