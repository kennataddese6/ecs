-- Ensure standard store categories exist in public.categories table with valid UUIDs
INSERT INTO public.categories (id, name, slug, description, image_url, active)
VALUES
  (
    'c1000000-0000-0000-0000-000000000001',
    'Ethiopian Coffee & Buna',
    'coffee',
    'Single-origin Yirgacheffe & Sidama coffee beans, roasted beans, clay Jebena pots, and Buna accessories.',
    'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop',
    true
  ),
  (
    'c2000000-0000-0000-0000-000000000002',
    'Traditional Habesha Apparel',
    'apparel',
    'Handwoven Habesha Kemis, woven Shemma dresses, Netela scarves, and traditional embroidered garments.',
    '/habesha-cloth.png',
    true
  ),
  (
    'c3000000-0000-0000-0000-000000000003',
    'Spices & Niter Kibe',
    'spices',
    'Authentic Berbere spice blend, traditional spiced butter (Niter Kibe), Korerima, and culinary herbs.',
    'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?q=80&w=800&auto=format&fit=crop',
    true
  ),
  (
    'c4000000-0000-0000-0000-000000000004',
    'Artisan Mesob & Crafts',
    'crafts',
    'Handcrafted woven Mesob baskets, clay pottery, traditional cross artifacts, and cultural decor.',
    'https://images.unsplash.com/photo-1606744824163-985d376605aa?q=80&w=800&auto=format&fit=crop',
    true
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  active = EXCLUDED.active;
