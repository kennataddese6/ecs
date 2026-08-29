-- Storage Bucket and RLS Policies for Category Images
INSERT INTO storage.buckets (id, name, public)
VALUES ('category-images', 'category-images', true)
ON CONFLICT (id) DO NOTHING;

-- Public Read Policy for Category Images
CREATE POLICY "Public Read Category Images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'category-images');

-- Admin Upload/Update/Delete Policies for Category Images
CREATE POLICY "Admin Upload Category Images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'category-images' AND public.is_admin(auth.uid()));

CREATE POLICY "Admin Update Category Images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'category-images' AND public.is_admin(auth.uid()));

CREATE POLICY "Admin Delete Category Images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'category-images' AND public.is_admin(auth.uid()));
