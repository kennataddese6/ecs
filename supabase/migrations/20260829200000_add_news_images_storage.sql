-- Storage Bucket and RLS Policies for News Article Images
INSERT INTO storage.buckets (id, name, public)
VALUES ('news-images', 'news-images', true)
ON CONFLICT (id) DO NOTHING;

-- Public Read Policy for News Images
DROP POLICY IF EXISTS "Public Read News Images" ON storage.objects;
CREATE POLICY "Public Read News Images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'news-images');

-- Admin Upload/Update/Delete Policies for News Images
DROP POLICY IF EXISTS "Admin Upload News Images" ON storage.objects;
CREATE POLICY "Admin Upload News Images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'news-images' AND public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admin Update News Images" ON storage.objects;
CREATE POLICY "Admin Update News Images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'news-images' AND public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admin Delete News Images" ON storage.objects;
CREATE POLICY "Admin Delete News Images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'news-images' AND public.is_admin(auth.uid()));
