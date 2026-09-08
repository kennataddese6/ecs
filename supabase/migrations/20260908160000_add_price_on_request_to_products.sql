-- Migration: Add price_on_request column to public.products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS price_on_request boolean NOT NULL DEFAULT false;
