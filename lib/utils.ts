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
  { key: 'SKINCARE', label: 'SKINCARE' },
  { key: 'BODY', label: 'BODY' },
  { key: 'FRAGRANCE', label: 'FRAGRANCE' },
  { key: 'LIP', label: 'LIP' },
  { key: 'HAIR', label: 'HAIR' },
  { key: 'ACCESSORIES', label: 'ACCESSORIES' },
] as const;

export const DELIVERY_FEE = 5000; // UGX 5,000

// Auto-generate a product code from category + timestamp
export function generateProductCode(category: string): string {
  const prefixes: Record<string, string> = {
    SKINCARE: 'SK', BODY: 'BD', FRAGRANCE: 'FR',
    LIP: 'LP', HAIR: 'HR', ACCESSORIES: 'AC',
  };
  const prefix = prefixes[category] || 'PR';
  const num = Date.now().toString().slice(-3);
  return `${prefix}-${num}`;
}
