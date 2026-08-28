-- Seed Ethiopian Storefront Categories
INSERT INTO public.categories (id, name, slug, description, image_url, active)
VALUES 
  ('c1000000-0000-0000-0000-000000000001', 'Ethiopian Coffee & Buna', 'coffee', 'Single-origin Yirgacheffe & Sidama roasted coffee beans and Buna ceremony accessories.', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop', true),
  ('c2000000-0000-0000-0000-000000000002', 'Traditional Habesha Apparel', 'apparel', 'Hand-loomed organic cotton Habesha Kemis dresses and Netela shawls.', '/habesha-cloth.png', true),
  ('c3000000-0000-0000-0000-000000000003', 'Spices & Niter Kibe', 'spices', 'Hand-blended Ethiopian Berbere, Mitmita, Korerima, and authentic Niter Kibe clarified butter.', 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?q=80&w=800&auto=format&fit=crop', true),
  ('c4000000-0000-0000-0000-000000000004', 'Artisan Mesob & Crafts', 'crafts', 'Handwoven Mesob basketry, clay Jebena coffee pots, and Habesha cultural crafts.', 'https://images.unsplash.com/photo-1606744824163-985d376605aa?q=80&w=800&auto=format&fit=crop', true)
ON CONFLICT (id) DO UPDATE SET active = true;

-- Seed Ethiopian Products
INSERT INTO public.products (id, name, slug, description, price, compare_at_price, stock_quantity, sku, category_id, unit_label, featured, active)
VALUES
  (
    'p1000000-0000-0000-0000-000000000001',
    'Yirgacheffe Grade-1 Organic Roasted Coffee Beans',
    'yirgacheffe-grade-1-coffee-beans',
    'Authentic Ethiopian Yirgacheffe coffee beans roasted to perfection. Features floral jasmine aromas, bergamot citrus notes, and a silky smooth finish for traditional Buna preparation.',
    28.50,
    34.00,
    45,
    'ETH-COF-001',
    'c1000000-0000-0000-0000-000000000001',
    '1 kg',
    true,
    true
  ),
  (
    'p2000000-0000-0000-0000-000000000002',
    'Royal Handwoven Habesha Kemis with Gold Border',
    'royal-handwoven-habesha-kemis',
    'Exquisite Ethiopian hand-loomed sheer cotton dress (Shemma) adorned with intricate gold Tilet embroidery along the neckline, sleeves, and hem. Includes matching Netela scarf.',
    145.00,
    185.00,
    12,
    'ETH-CLO-001',
    'c2000000-0000-0000-0000-000000000002',
    '1 Dress',
    true,
    true
  ),
  (
    'p3000000-0000-0000-0000-000000000003',
    'Traditional Spiced Clarified Butter (Niter Kibe)',
    'traditional-spiced-clarified-butter-niter-kibe',
    'Handcrafted Ethiopian clarified butter simmered with black cardamom (Korerima), sacred basil (Beso Bela), fenugreek, and garlic. Rich golden aroma essential for Doro Wat.',
    19.50,
    24.00,
    30,
    'ETH-SPC-001',
    'c3000000-0000-0000-0000-000000000003',
    '500 g',
    true,
    true
  ),
  (
    'p4000000-0000-0000-0000-000000000004',
    'Sidama Specialty Grade Whole Coffee Beans',
    'sidama-specialty-whole-coffee-beans',
    'Single-origin Sidama coffee beans harvested from high-altitude smallholder farms. Rich body with lemon blossom notes and deep berry sweetness.',
    26.00,
    32.00,
    40,
    'ETH-COF-002',
    'c1000000-0000-0000-0000-000000000001',
    '1 kg',
    true,
    true
  )
ON CONFLICT (id) DO UPDATE SET active = true;

-- Seed Product Images
INSERT INTO public.product_images (id, product_id, image_url, alt_text, sort_order)
VALUES
  ('i1000000-0000-0000-0000-000000000001', 'p1000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200&auto=format&fit=crop', 'Yirgacheffe Coffee Beans & Cup', 0),
  ('i2000000-0000-0000-0000-000000000002', 'p2000000-0000-0000-0000-000000000002', '/habesha-cloth.png', 'Royal Habesha Kemis Traditional Dress', 0),
  ('i3000000-0000-0000-0000-000000000003', 'p3000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?q=80&w=1200&auto=format&fit=crop', 'Spiced Niter Kibe Butter & Berbere Spices', 0),
  ('i4000000-0000-0000-0000-000000000004', 'p4000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200&auto=format&fit=crop', 'Sidama Specialty Whole Coffee Beans', 0)
ON CONFLICT (id) DO NOTHING;

-- Seed Cultural News Articles
INSERT INTO public.news (id, title, slug, excerpt, content, featured_image, published, published_at)
VALUES
  (
    'n1000000-0000-0000-0000-000000000001',
    'The Timeless Ritual of the Ethiopian Coffee Ceremony (Buna)',
    'art-of-acoustic-engineering',
    'Discover the spiritual and social heritage behind roasting fresh green coffee beans over hot coals in a traditional Jebena.',
    '<p>The Ethiopian coffee ceremony (Buna) is far more than a beverage—it is a sacred daily gathering celebrating hospitality, community, and heritage. Fresh green Yirgacheffe beans are washed, hand-roasted over glowing coals until aromatic smoke fills the room, ground with a Mookecha, and brewed in a clay Jebena pot.</p>',
    'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop',
    true,
    now()
  ),
  (
    'n2000000-0000-0000-0000-000000000002',
    'Preserving Handwoven Habesha Textiles: The Art of Shemma Craft',
    'florentine-leathercraft-sustainable-tanning',
    'An in-depth look into traditional handloom weavers in Addis Ababa creating organic cotton Habesha Kemis with Tilet embroidery.',
    '<p>Behind every authentic Habesha Kemis dress lies generations of master weaving tradition. Artisans spin 100% organic Ethiopian cotton into delicate Shemma fabric, hand-stitching vibrant Tilet borders that carry rich cultural symbols.</p>',
    '/habesha-cloth.png',
    true,
    now()
  )
ON CONFLICT (id) DO UPDATE SET published = true;
