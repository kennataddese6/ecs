-- Seed Demo Categories
INSERT INTO public.categories (id, name, slug, description, image_url, active)
VALUES 
  ('c1000000-0000-0000-0000-000000000001', 'Audio', 'audio', 'High-fidelity acoustic instruments and wireless headphones.', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop', true),
  ('c2000000-0000-0000-0000-000000000002', 'Apparel', 'apparel', 'Tailored garments crafted from organic and recycled fibers.', 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800&auto=format&fit=crop', true),
  ('c3000000-0000-0000-0000-000000000003', 'Accessories', 'accessories', 'Handcrafted leather goods, horology, and eyewear.', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop', true),
  ('c4000000-0000-0000-0000-000000000004', 'Home Objects', 'home', 'Minimalist architectural objects and interior accessories.', 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=800&auto=format&fit=crop', true)
ON CONFLICT (id) DO UPDATE SET active = true;

-- Seed Demo Products
INSERT INTO public.products (id, name, slug, description, price, compare_at_price, stock_quantity, sku, category_id, featured, active)
VALUES
  (
    'p1000000-0000-0000-0000-000000000001',
    'LUMEN Studio Master Headphones',
    'lumen-studio-master-headphones',
    'Precision-tuned wireless headphones featuring custom beryllium drivers, active noise cancellation, and 40-hour battery life.',
    349.00,
    399.00,
    15,
    'LMN-AUD-001',
    'c1000000-0000-0000-0000-000000000001',
    true,
    true
  ),
  (
    'p2000000-0000-0000-0000-000000000002',
    'Heritage Italian Leather Tote',
    'heritage-italian-leather-tote',
    'Hand-stitched full-grain Tuscan leather tote bag featuring solid brass hardware and an organic cotton interior lining.',
    480.00,
    550.00,
    8,
    'LMN-ACC-002',
    'c3000000-0000-0000-0000-000000000003',
    true,
    true
  ),
  (
    'p3000000-0000-0000-0000-000000000003',
    'Obsidian Minimalist Smartwatch',
    'obsidian-minimalist-smartwatch',
    'Grade-5 titanium case with sapphire crystal display, biometric health tracking, and 7-day battery stamina.',
    299.00,
    null,
    20,
    'LMN-ACC-003',
    'c3000000-0000-0000-0000-000000000003',
    true,
    true
  ),
  (
    'p4000000-0000-0000-0000-000000000004',
    'Ceramic Architectural Table Lamp',
    'ceramic-architectural-table-lamp',
    'Hand-thrown matte ceramic base topped with a natural linen shade, featuring warm dimmable LED ambiance.',
    185.00,
    220.00,
    12,
    'LMN-HOM-004',
    'c4000000-0000-0000-0000-000000000004',
    true,
    true
  )
ON CONFLICT (id) DO UPDATE SET active = true;

-- Seed Product Images
INSERT INTO public.product_images (id, product_id, image_url, alt_text, sort_order)
VALUES
  ('i1000000-0000-0000-0000-000000000001', 'p1000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop', 'LUMEN Studio Master Headphones', 0),
  ('i2000000-0000-0000-0000-000000000002', 'p2000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop', 'Heritage Italian Leather Tote', 0),
  ('i3000000-0000-0000-0000-000000000003', 'p3000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop', 'Obsidian Minimalist Smartwatch', 0),
  ('i4000000-0000-0000-0000-000000000004', 'p4000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=800&auto=format&fit=crop', 'Ceramic Architectural Table Lamp', 0)
ON CONFLICT (id) DO NOTHING;

-- Seed Demo News
INSERT INTO public.news (id, title, slug, excerpt, content, featured_image, published, published_at)
VALUES
  (
    'n1000000-0000-0000-0000-000000000001',
    'Introducing the LUMEN Autumn/Winter 2026 Collection',
    'introducing-lumen-aw26-collection',
    'Explore our latest drop combining high-grade acoustics, sustainable textiles, and minimalist industrial design.',
    '<p>We are thrilled to unveil our AW26 capsule collection, engineered for performance and sculpted with elegance. Each object embodies our commitment to modern luxury.</p>',
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop',
    true,
    now()
  ),
  (
    'n2000000-0000-0000-0000-000000000002',
    'The Art of Sustainable Craftsmanship',
    'art-of-sustainable-craftsmanship',
    'How we collaborate with local European tanneries and certified organic suppliers to eliminate waste.',
    '<p>Luxury should never come at the expense of our planet. Discover how LUMEN ensures 100% supply chain transparency and zero plastic packaging.</p>',
    'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800&auto=format&fit=crop',
    true,
    now()
  )
ON CONFLICT (id) DO UPDATE SET published = true;
