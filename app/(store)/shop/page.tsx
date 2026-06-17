import { Suspense } from 'react';
import ShopClient from './ShopClient';

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center">
      <span className="font-mono text-[11px] tracking-widest text-[var(--light)] uppercase animate-pulse">Loading...</span>
    </div>}>
      <ShopClient />
    </Suspense>
  );
}
