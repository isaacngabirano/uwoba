export function formatPrice(amount: number): string {
  return `UGX ${amount.toLocaleString('en-UG')}`;
}

export function generateOrderNumber(): string {
  const prefix = 'RBS'; // TODO: consider changing to a UWOBA-specific prefix, e.g. 'UWB'
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${timestamp}-${random}`;
}

export const CATEGORIES = [
  { key: 'BASKETS', label: 'BASKETS' },
  { key: 'BAGS', label: 'BAGS' },
  { key: 'JEWELRY', label: 'JEWELRY' },
  { key: 'SHOES', label: 'SHOES' },
  { key: 'HOME DECOR', label: 'HOME DECOR' },
  { key: 'TEXTILES', label: 'TEXTILES' },
  { key: 'ACCESSORIES', label: 'ACCESSORIES' },
] as const;

export const DELIVERY_FEE = 5000; // UGX 5,000

// Auto-generate a product code from category + timestamp
export function generateProductCode(category: string): string {
  const prefixes: Record<string, string> = {
    BASKETS: 'BK', BAGS: 'BG', JEWELRY: 'JW',
    SHOES: 'SH', 'HOME DECOR': 'HD', TEXTILES: 'TX', ACCESSORIES: 'AC',
  };
  const prefix = prefixes[category] || 'PR';
  const num = Date.now().toString().slice(-3);
  return `${prefix}-${num}`;
}