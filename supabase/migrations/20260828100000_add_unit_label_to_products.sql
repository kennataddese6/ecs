-- Add unit_label column to public.products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS unit_label TEXT DEFAULT '1 Item';
