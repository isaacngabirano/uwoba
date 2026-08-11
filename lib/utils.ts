export function formatPrice(amount: number): string {
  return `UGX ${amount.toLocaleString('en-UG')}`;
}

export function generateOrderNumber(): string {
  const prefix = 'RBS';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${timestamp}-${random}`;
}

export const CATEGORIES = [
  { key: 'BASKETS', label: 'BASKETS' },
  { key: 'BODY', label: 'BODY' },
  { key: 'SHOES', label: 'SHOES' },
  { key: 'CRAFT', label: 'CRAFT' },
  { key: 'HATS', label: 'HATS' },
  { key: 'ACCESSORIES', label: 'ACCESSORIES' },
] as const;

export const DELIVERY_FEE = 5000; // UGX 5,000

// Auto-generate a product code from category + timestamp
export function generateProductCode(category: string): string {
  const prefixes: Record<string, string> = {
    BASKETS: 'SK', BODY: 'BD', SHOES: 'FR',
    CRAFT: 'LP', HATS: 'HR', ACCESSORIES: 'AC',
  };
  const prefix = prefixes[category] || 'PR';
  const num = Date.now().toString().slice(-3);
  return `${prefix}-${num}`;
}
