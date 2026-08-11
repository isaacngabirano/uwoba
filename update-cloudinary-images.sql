-- Update all products with real Cloudinary images
UPDATE products SET image_url = 'https://res.cloudinary.com/dpl464cjn/image/upload/v1774000457/glow_cream_jm28ae.webp' WHERE code = 'SK-01';
UPDATE products SET image_url = 'https://res.cloudinary.com/dpl464cjn/image/upload/v1774000458/fade_cream_pky9lp.png' WHERE code = 'SK-02';
UPDATE products SET image_url = 'https://res.cloudinary.com/dpl464cjn/image/upload/v1774000458/fade_cream_pky9lp.png' WHERE code = 'SK-03';
UPDATE products SET image_url = 'https://res.cloudinary.com/dpl464cjn/image/upload/v1774000457/day_shield_pli9sz.webp' WHERE code = 'SK-04';
UPDATE products SET image_url = 'https://res.cloudinary.com/dpl464cjn/image/upload/v1774000458/cocoa_butter_r0mlti.png' WHERE code = 'BD-01';
UPDATE products SET image_url = 'https://res.cloudinary.com/dpl464cjn/image/upload/v1774000459/shower_gel_qhiwvk.webp' WHERE code = 'BD-02';
UPDATE products SET image_url = 'https://res.cloudinary.com/dpl464cjn/image/upload/v1774000457/body_scrub_xb6lla.webp' WHERE code = 'BD-03';
UPDATE products SET image_url = 'https://res.cloudinary.com/dpl464cjn/image/upload/v1774000457/glow_oil_evagem.webp' WHERE code = 'BD-04';
UPDATE products SET image_url = 'https://res.cloudinary.com/dpl464cjn/image/upload/v1774000459/bloom_j5bvtx.webp' WHERE code = 'FR-01';
UPDATE products SET image_url = 'https://res.cloudinary.com/dpl464cjn/image/upload/v1774000457/bloom_i3p0gk.avif' WHERE code = 'FR-02';
UPDATE products SET image_url = 'https://res.cloudinary.com/dpl464cjn/image/upload/v1774000456/citrus_mist_e0t7le.avif' WHERE code = 'FR-03';
UPDATE products SET image_url = 'https://res.cloudinary.com/dpl464cjn/image/upload/v1774000459/bloom_j5bvtx.webp' WHERE code = 'LP-01';
UPDATE products SET image_url = 'https://res.cloudinary.com/dpl464cjn/image/upload/v1774000456/honey_balm_rh0uch.avif' WHERE code = 'LP-02';
UPDATE products SET image_url = 'https://res.cloudinary.com/dpl464cjn/image/upload/v1774000458/berry_tint_uf85yd.webp' WHERE code = 'LP-03';
UPDATE products SET image_url = 'https://res.cloudinary.com/dpl464cjn/image/upload/v1774000456/castor_oil_etwkjy.jpg' WHERE code = 'HR-01';
UPDATE products SET image_url = 'https://res.cloudinary.com/dpl464cjn/image/upload/v1774000456/HATS_butter_g8ti5d.webp' WHERE code = 'HR-02';
UPDATE products SET image_url = 'https://res.cloudinary.com/dpl464cjn/image/upload/v1774000458/scalp_oil_wv9gjj.webp' WHERE code = 'HR-03';
UPDATE products SET image_url = 'https://res.cloudinary.com/dpl464cjn/image/upload/v1774000456/face_roller_lesjeg.webp' WHERE code = 'AC-01';
UPDATE products SET image_url = 'https://res.cloudinary.com/dpl464cjn/image/upload/v1774000456/lash_serum_dg0xqg.webp' WHERE code = 'AC-02';
UPDATE products SET image_url = 'https://res.cloudinary.com/dpl464cjn/image/upload/v1774000459/bloom_j5bvtx.webp' WHERE code = 'AC-03';

-- Also update the Rose CRAFT Butter name to match
UPDATE products SET name = 'Rose CRAFT Butter', image_url = 'https://res.cloudinary.com/dpl464cjn/image/upload/v1774000459/bloom_j5bvtx.webp' WHERE code = 'LP-01';

-- Verify
SELECT code, name, image_url FROM products ORDER BY code;
