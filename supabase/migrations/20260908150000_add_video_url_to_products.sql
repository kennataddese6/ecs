-- Migration: Add video_url to products table and setup storage policies for product-videos
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS video_url text;

-- Ensure product-videos bucket exists and is public
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-videos',
  'product-videos',
  true,
  52428800, -- 50MB
  ARRAY['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-m4v']
)
ON CONFLICT (id) DO UPDATE SET 
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-m4v'];

-- Storage Read Policy for Product Videos (Public)
DROP POLICY IF EXISTS "Public Read Product Videos" ON storage.objects;
CREATE POLICY "Public Read Product Videos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-videos');

-- Storage Insert/Update/Delete Policy for Product Videos (Admin Only)
DROP POLICY IF EXISTS "Admin Upload Product Videos" ON storage.objects;
CREATE POLICY "Admin Upload Product Videos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-videos' AND (public.is_admin(auth.uid()) OR auth.role() = 'service_role'));

DROP POLICY IF EXISTS "Admin Update Product Videos" ON storage.objects;
CREATE POLICY "Admin Update Product Videos"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'product-videos' AND (public.is_admin(auth.uid()) OR auth.role() = 'service_role'));

DROP POLICY IF EXISTS "Admin Delete Product Videos" ON storage.objects;
CREATE POLICY "Admin Delete Product Videos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-videos' AND (public.is_admin(auth.uid()) OR auth.role() = 'service_role'));
