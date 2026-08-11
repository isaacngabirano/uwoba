export type Category = 'BASKETS' | 'BAGS' | 'JEWELRY' | 'SHOES' | 'HOME DECOR' | 'TEXTILES' | 'ACCESSORIES';

export interface Product {
  id: string;
  code: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  stock: number;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  total: number;
  payment_method: 'MTN' | 'AIRTEL' | 'CARD';
  payment_status: 'PENDING' | 'PAID' | 'FAILED';
  order_status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'DELIVERED' | 'CANCELLED';
  marz_transaction_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_code: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
  order_count?: number;
  total_spent?: number;
}

export interface AdminUser {
  username: string;
  password: string;
}