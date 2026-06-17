'use client';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function ConfirmationContent() {
  const params = useSearchParams();
  const orderNumber = params.get('order') || '';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 text-center gap-8 animate-fade-up">
      {/* Checkmark */}
      <div className="w-16 h-16 border border-[var(--charcoal)] flex items-center justify-center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <div className="space-y-3">
        <h1 className="font-mono text-[11px] tracking-[0.3em] uppercase">ORDER PLACED</h1>
        {orderNumber && (
          <p className="font-mono text-[13px] tracking-widest text-[var(--gold)]">{orderNumber}</p>
        )}
        <p className="font-display text-xl font-light text-[var(--mid)] max-w-xs">
          Thank you for shopping with Rhea Beauty Shop.
        </p>
      </div>

      <div className="max-w-sm space-y-2">
        <p className="font-mono text-[10px] tracking-wider text-[var(--light)] uppercase leading-loose">
          Your order has been received. We will contact you shortly to confirm delivery.
        </p>
      </div>

      <div className="flex flex-col items-center gap-4">
        <Link href="/shop">
          <button className="btn-gold" style={{ width: 'auto', padding: '14px 40px' }}>
            CONTINUE SHOPPING
          </button>
        </Link>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
      <span className="font-mono text-[11px] tracking-widest text-[var(--light)] uppercase animate-pulse">Loading...</span>
    </div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
