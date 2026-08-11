import { Product } from '@/types';

// All images: single product on white/near-white bg, square crop, consistent size
// NOTE: image_url set to null below — swap in real Cloudinary URLs once product photos are uploaded
export const DEMO_PRODUCTS: Product[] = [
  {
    id: 'demo-bk-01', code: 'BK-01', name: 'Green Market Basket',
    description: 'Hand-woven market basket in raffia and sisal. Sturdy handles and a wide base, perfect for shopping or storage. Made by local women artisans.',
    price: 45000, category: 'BASKETS', stock: 20,
    image_url: null,
    is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-bk-02', code: 'BK-02', name: 'Round Storage Basket',
    description: 'Tightly woven round basket with lid, ideal for storing linens or small items. Natural fibers dyed with earth tones.',
    price: 38000, category: 'BASKETS', stock: 25,
    image_url: null,
    is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-bk-03', code: 'BK-03', name: 'Decorative Bowl Basket',
    description: 'Small shallow woven bowl for fruit, keys, or décor. Intricate geometric pattern in natural and black fiber.',
    price: 22000, category: 'BASKETS', stock: 30,
    image_url: null,
    is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-bg-01', code: 'BG-01', name: 'Raffia Tote Bag',
    description: 'Spacious hand-woven raffia tote with leather-trimmed handles. Durable and lightweight, great for everyday use.',
    price: 55000, category: 'BAGS', stock: 18,
    image_url: null,
    is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-bg-02', code: 'BG-02', name: 'Sisal Shopper Bag',
    description: 'Roomy sisal shopping bag, hand-plaited with reinforced base. Foldable and machine-washable fiber.',
    price: 40000, category: 'BAGS', stock: 22,
    image_url: null,
    is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-bg-03', code: 'BG-03', name: 'Beaded Clutch',
    description: 'Compact evening clutch with hand-strung glass beads in a geometric pattern. Fabric lining, magnetic clasp.',
    price: 48000, category: 'BAGS', stock: 15,
    image_url: null,
    is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-jw-01', code: 'JW-01', name: 'Maasai Beaded Necklace',
    description: 'Multi-strand beaded necklace in traditional Maasai colours. Handmade with glass seed beads on a woven base.',
    price: 30000, category: 'JEWELRY', stock: 35,
    image_url: null,
    is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-jw-02', code: 'JW-02', name: 'Brass Cuff Bangle',
    description: 'Hand-hammered brass cuff with etched detailing. One size, adjustable fit.',
    price: 25000, category: 'JEWELRY', stock: 28,
    image_url: null,
    is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-jw-03', code: 'JW-03', name: 'Waist Beads Set',
    description: 'Set of three waist beads in mixed colours and sizes. Elastic cord for a comfortable fit.',
    price: 18000, category: 'JEWELRY', stock: 40,
    image_url: null,
    is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-sh-01', code: 'SH-01', name: 'Leather Sandals',
    description: 'Handmade genuine leather sandals with woven strap detailing. Comfortable footbed, durable sole.',
    price: 60000, category: 'SHOES', stock: 20,
    image_url: null,
    is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-sh-02', code: 'SH-02', name: 'Beaded Sandals',
    description: 'Flat sandals with hand-beaded straps in bright pattern work. Padded sole for all-day comfort.',
    price: 42000, category: 'SHOES', stock: 25,
    image_url: null,
    is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-hd-01', code: 'HD-01', name: 'Woven Wall Hanging',
    description: 'Large decorative wall basket, hand-woven in a radial pattern. A statement piece for any room.',
    price: 50000, category: 'HOME DECOR', stock: 12,
    image_url: null,
    is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-hd-02', code: 'HD-02', name: 'Table Mat Set (4)',
    description: 'Set of four woven table mats in natural fiber. Heat-resistant and easy to wipe clean.',
    price: 28000, category: 'HOME DECOR', stock: 30,
    image_url: null,
    is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-hd-03', code: 'HD-03', name: 'Woven Pot Holder Pair',
    description: 'Pair of thick woven pot holders, heat-safe and durable. Loop for easy hanging storage.',
    price: 15000, category: 'HOME DECOR', stock: 35,
    image_url: null,
    is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-tx-01', code: 'TX-01', name: 'Barkcloth Table Runner',
    description: 'Traditional Ugandan barkcloth runner, naturally dyed. Adds texture and heritage to any table setting.',
    price: 32000, category: 'TEXTILES', stock: 20,
    image_url: null,
    is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-tx-02', code: 'TX-02', name: 'Kitenge Cushion Cover',
    description: 'Vibrant kitenge fabric cushion cover with hidden zip closure. Fits standard 45x45cm inserts.',
    price: 20000, category: 'TEXTILES', stock: 25,
    image_url: null,
    is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-ac-01', code: 'AC-01', name: 'Beaded Keychain',
    description: 'Small hand-beaded keychain, a quick pop of colour for keys or bags.',
    price: 8000, category: 'ACCESSORIES', stock: 50,
    image_url: null,
    is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-ac-02', code: 'AC-02', name: 'Woven Coaster Set (6)',
    description: 'Set of six matching woven coasters in natural fiber, protects surfaces with a handmade touch.',
    price: 16000, category: 'ACCESSORIES', stock: 30,
    image_url: null,
    is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-ac-03', code: 'AC-03', name: 'Beaded Phone Case',
    description: 'Hand-beaded protective phone case with a snug fit and vibrant pattern.',
    price: 25000, category: 'ACCESSORIES', stock: 3,
    image_url: null,
    is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
];

export const DEMO_ORDERS = [
  {
    id: 'demo-ord-01', order_number: 'RBS-241201-001', // TODO: consider updating prefix to match your new order-number scheme, e.g. 'UWB'
    customer_name: 'Aisha Nakato', customer_phone: '0701234567', customer_email: 'aisha@example.com',
    delivery_address: 'Ntinda, Kampala', subtotal: 65000, delivery_fee: 5000, total: 70000,
    payment_method: 'MTN', payment_status: 'PAID', order_status: 'DELIVERED',
    marz_transaction_id: null, created_at: new Date(Date.now() - 86400000 * 2).toISOString(), updated_at: new Date().toISOString(),
    order_items: [
      { id: 'oi-1', order_id: 'demo-ord-01', product_id: 'demo-bk-01', product_name: 'Green Market Basket', product_code: 'BK-01', quantity: 1, unit_price: 45000, subtotal: 45000 },
      { id: 'oi-2', order_id: 'demo-ord-01', product_id: 'demo-ac-01', product_name: 'Beaded Keychain', product_code: 'AC-01', quantity: 2, unit_price: 8000, subtotal: 16000 },
    ],
  },
  {
    id: 'demo-ord-02', order_number: 'RBS-241202-002',
    customer_name: 'Grace Tumwine', customer_phone: '0782345678', customer_email: '',
    delivery_address: 'Bukoto, Kampala', subtotal: 55000, delivery_fee: 5000, total: 60000,
    payment_method: 'AIRTEL', payment_status: 'PAID', order_status: 'CONFIRMED',
    marz_transaction_id: null, created_at: new Date(Date.now() - 86400000).toISOString(), updated_at: new Date().toISOString(),
    order_items: [
      { id: 'oi-4', order_id: 'demo-ord-02', product_id: 'demo-bg-01', product_name: 'Raffia Tote Bag', product_code: 'BG-01', quantity: 1, unit_price: 55000, subtotal: 55000 },
    ],
  },
  {
    id: 'demo-ord-03', order_number: 'RBS-241203-003',
    customer_name: 'Sharon Atim', customer_phone: '0753456789', customer_email: 'sharon@gmail.com',
    delivery_address: 'Muyenga, Kampala', subtotal: 30000, delivery_fee: 5000, total: 35000,
    payment_method: 'MTN', payment_status: 'PENDING', order_status: 'PENDING',
    marz_transaction_id: null, created_at: new Date(Date.now() - 3600000 * 3).toISOString(), updated_at: new Date().toISOString(),
    order_items: [
      { id: 'oi-6', order_id: 'demo-ord-03', product_id: 'demo-jw-01', product_name: 'Maasai Beaded Necklace', product_code: 'JW-01', quantity: 1, unit_price: 30000, subtotal: 30000 },
    ],
  },
  {
    id: 'demo-ord-04', order_number: 'RBS-241203-004',
    customer_name: 'Prossy Nalwoga', customer_phone: '0701234567', customer_email: '',
    delivery_address: 'Nansana, Wakiso', subtotal: 60000, delivery_fee: 8000, total: 68000,
    payment_method: 'CARD', payment_status: 'PAID', order_status: 'PROCESSING',
    marz_transaction_id: 'TXN-CARD-00123', created_at: new Date(Date.now() - 1800000).toISOString(), updated_at: new Date().toISOString(),
    order_items: [
      { id: 'oi-9', order_id: 'demo-ord-04', product_id: 'demo-sh-01', product_name: 'Leather Sandals', product_code: 'SH-01', quantity: 1, unit_price: 60000, subtotal: 60000 },
    ],
  },
];