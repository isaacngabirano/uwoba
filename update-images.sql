-- Update all product images by matching on code
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop&crop=center&q=85' WHERE code = 'SK-01';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop&crop=center&q=85' WHERE code = 'SK-02';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&h=600&fit=crop&crop=center&q=85' WHERE code = 'SK-03';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&h=600&fit=crop&crop=center&q=85' WHERE code = 'SK-04';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1601612628452-9e99ced43524?w=600&h=600&fit=crop&crop=center&q=85' WHERE code = 'BD-01';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1585232352617-9b8e84a436cd?w=600&h=600&fit=crop&crop=center&q=85' WHERE code = 'BD-02';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&h=600&fit=crop&crop=center&q=85' WHERE code = 'BD-03';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=600&h=600&fit=crop&crop=center&q=85' WHERE code = 'BD-04';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&h=600&fit=crop&crop=center&q=85' WHERE code = 'FR-01';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&h=600&fit=crop&crop=center&q=85' WHERE code = 'FR-02';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=600&h=600&fit=crop&crop=center&q=85' WHERE code = 'FR-03';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1586495777744-4e6232bf2fd0?w=600&h=600&fit=crop&crop=center&q=85' WHERE code = 'LP-01';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=600&h=600&fit=crop&crop=center&q=85' WHERE code = 'LP-02';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1625093904854-b7270b0f5d37?w=600&h=600&fit=crop&crop=center&q=85' WHERE code = 'LP-03';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1617897903246-719242758050?w=600&h=600&fit=crop&crop=center&q=85' WHERE code = 'HR-01';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&h=600&fit=crop&crop=center&q=85' WHERE code = 'HR-02';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1631390519301-88b3f9a8e8b7?w=600&h=600&fit=crop&crop=center&q=85' WHERE code = 'HR-03';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&h=600&fit=crop&crop=center&q=85' WHERE code = 'AC-01';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1583241475880-083f84372725?w=600&h=600&fit=crop&crop=center&q=85' WHERE code = 'AC-02';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&h=600&fit=crop&crop=center&q=85' WHERE code = 'AC-03';

-- Verify — should show 19 rows with image URLs
SELECT code, name, image_url FROM products ORDER BY code;
