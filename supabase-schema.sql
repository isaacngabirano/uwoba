-- =============================================
-- RHEA BEAUTY SHOP - SUPABASE SCHEMA
-- Run this entire file in the Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- PRODUCTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(20) NOT NULL CHECK (category IN ('SKINCARE', 'BODY', 'FRAGRANCE', 'LIP', 'HAIR', 'ACCESSORIES')),
  stock INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ORDERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(20) UNIQUE NOT NULL,
  customer_name VARCHAR(100) NOT NULL,
  customer_email VARCHAR(150),
  customer_phone VARCHAR(20) NOT NULL,
  delivery_address TEXT NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  delivery_fee DECIMAL(10, 2) NOT NULL DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(10) NOT NULL CHECK (payment_method IN ('MTN', 'AIRTEL', 'CARD')),
  payment_status VARCHAR(10) NOT NULL DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PAID', 'FAILED')),
  order_status VARCHAR(15) NOT NULL DEFAULT 'PENDING' CHECK (order_status IN ('PENDING', 'CONFIRMED', 'PROCESSING', 'DELIVERED', 'CANCELLED')),
  marz_transaction_id VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ORDER ITEMS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name VARCHAR(100) NOT NULL,
  product_code VARCHAR(20) NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- CUSTOMERS TABLE (optional, for tracking)
-- =============================================
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(150) UNIQUE,
  full_name VARCHAR(100),
  phone VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- UPDATED_AT TRIGGER
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- SEED PRODUCTS
-- =============================================
INSERT INTO products (code, name, description, price, category, stock, is_active) VALUES
('SK-01', 'Glow Cream', 'Brightening face cream with Vitamin C. Evens skin tone and adds radiance.', 25000, 'SKINCARE', 50, true),
('SK-02', 'Clear Serum', 'Lightweight serum for acne-prone skin. Unclogs pores and reduces blemishes.', 35000, 'SKINCARE', 40, true),
('SK-03', 'Fade Cream', 'Dark spot correcting cream. Visibly fades marks within 4 weeks.', 30000, 'SKINCARE', 45, true),
('SK-04', 'Day Shield', 'SPF 50 moisturising sunscreen. Protects and hydrates all day.', 28000, 'SKINCARE', 35, true),
('BD-01', 'Cocoa Butter', 'Rich body butter with cocoa and shea. Deep moisture for all skin types.', 22000, 'BODY', 60, true),
('BD-02', 'Shower Gel', 'Luxurious shower gel with rose and almond oil. Gentle cleansing lather.', 18000, 'BODY', 55, true),
('BD-03', 'Body Scrub', 'Coffee and sugar exfoliating scrub. Removes dead skin and boosts glow.', 20000, 'BODY', 40, true),
('BD-04', 'Glow Oil', 'Shimmer body oil with argan and jojoba. Leaves skin silky and luminous.', 32000, 'BODY', 30, true),
('FR-01', 'Bloom', 'Floral and fresh eau de parfum. Notes of jasmine, rose, and sandalwood.', 65000, 'FRAGRANCE', 25, true),
('FR-02', 'Velvet', 'Warm oriental fragrance. Notes of vanilla, amber, and musk.', 70000, 'FRAGRANCE', 20, true),
('FR-03', 'Citrus Mist', 'Light refreshing body mist. Notes of lemon, bergamot, and green tea.', 25000, 'FRAGRANCE', 45, true),
('LP-01', 'Rose Butter', 'Moisturising lip butter with rose extract. Softens and plumps.', 12000, 'LIP', 80, true),
('LP-02', 'Honey Balm', 'Healing lip balm with honey and beeswax. Repairs chapped lips overnight.', 10000, 'LIP', 90, true),
('LP-03', 'Berry Tint', 'Sheer tinted lip oil in berry shade. Hydrates and adds a hint of colour.', 15000, 'LIP', 70, true),
('HR-01', 'Castor Oil', '100% pure cold-pressed castor oil. Promotes hair growth and scalp health.', 18000, 'HAIR', 50, true),
('HR-02', 'Hair Butter', 'Moisturising hair butter with mango and avocado. Defines and softens.', 24000, 'HAIR', 35, true),
('HR-03', 'Scalp Oil', 'Tea tree and peppermint scalp treatment. Reduces dandruff and itching.', 20000, 'HAIR', 40, true),
('AC-01', 'Face Roller', 'Rose quartz facial roller. Reduces puffiness and improves circulation.', 35000, 'ACCESSORIES', 20, true),
('AC-02', 'Lash Serum', 'Peptide lash growth serum. Lengthens and thickens lashes in 4-6 weeks.', 45000, 'ACCESSORIES', 25, true);

-- =============================================
-- ROW LEVEL SECURITY (optional but recommended)
-- =============================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Allow public read for products
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (true);

-- Allow public to create orders
CREATE POLICY "Anyone can create orders" ON orders
  FOR INSERT WITH CHECK (true);

-- Allow public to read their own orders
CREATE POLICY "Orders viewable by all" ON orders
  FOR SELECT USING (true);

-- Allow order items insert
CREATE POLICY "Anyone can insert order items" ON order_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Order items viewable by all" ON order_items
  FOR SELECT USING (true);

-- Admin can do everything (using service role key bypasses RLS)

-- =============================================
-- STOCK DECREMENT FUNCTION
-- =============================================
CREATE OR REPLACE FUNCTION decrement_stock(p_product_id UUID, p_quantity INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE products
  SET stock = GREATEST(0, stock - p_quantity)
  WHERE id = p_product_id;
END;
$$ LANGUAGE plpgsql;
