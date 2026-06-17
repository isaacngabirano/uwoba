'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCartStore } from '@/store/cart';
import { CATEGORIES } from '@/lib/utils';
import { Product } from '@/types';

const BLACK_LOGO = 'https://res.cloudinary.com/dpl464cjn/image/upload/v1781282487/black-removebg-preview_qcc5wf.png';

interface NavbarProps {
  onGridToggle?: () => void;
  onProductSelect?: (product: Product) => void;
}

function NavbarInner({ onGridToggle, onProductSelect }: NavbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category') || 'ALL';
  const { totalItems, toggleCart } = useCartStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [bump, setBump] = useState(false);
  const [prev, setPrev] = useState(0);

  useEffect(() => { setMounted(true); }, []);
  const count = mounted ? totalItems() : 0;

  useEffect(() => {
    if (!mounted) return;
    if (count > prev) { setBump(true); setTimeout(() => setBump(false), 350); }
    setPrev(count);
  }, [count]);

  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [menuOpen]);

  // Lazy import SearchOverlay to avoid SSR issues
  const [SearchOverlay, setSearchOverlay] = useState<any>(null);
  useEffect(() => {
    import('./SearchOverlay').then(m => setSearchOverlay(() => m.default));
  }, []);

  return (
    <>
      {searchOpen && SearchOverlay && (
        <SearchOverlay
          isOpen={searchOpen}
          onClose={() => setSearchOpen(false)}
          onSelect={(p: Product) => { onProductSelect?.(p); setSearchOpen(false); }}
        />
      )}

      <nav className="fixed top-0 left-0 right-0 z-30 bg-white border-b border-[#F0F0F0]">
        <div className="flex items-center justify-between px-5 md:px-8 h-12">

          {/* + grid/menu toggle */}
          <button
            onClick={(e) => { e.stopPropagation(); onGridToggle ? onGridToggle() : setMenuOpen(!menuOpen); }}
            className="font-mono text-[22px] font-light leading-none text-[var(--charcoal)] hover:text-[var(--gold)] transition-colors w-8 h-8 flex items-center justify-center"
          >+</button>

          {/* Center: logo + desktop categories */}
          <div className="flex items-center gap-1 md:gap-4">
            <button onClick={() => router.push('/shop')} className="mr-2 md:mr-4 flex items-center h-8">
              <img src={BLACK_LOGO} alt="Rhea Beauty" className="h-8 w-auto object-contain" />
            </button>
            <button onClick={() => router.push('/shop')}
              className={`nav-link hidden md:block ${activeCategory === 'ALL' ? 'active' : ''}`}>
              NEW
            </button>
            {CATEGORIES.map((cat) => (
              <button key={cat.key}
                onClick={() => { router.push(`/shop?category=${cat.key}`); setMenuOpen(false); }}
                className={`nav-link hidden md:block ${activeCategory === cat.key ? 'active' : ''}`}>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Right: search + cart */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchOpen(true)}
              className="text-[var(--charcoal)] hover:text-[var(--gold)] transition-colors w-8 h-8 flex items-center justify-center"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </button>
            <CartButton count={count} bump={bump} onClick={toggleCart} />
          </div>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="fixed top-12 left-0 right-0 z-20 bg-white border-b border-[#EBEBEB] animate-fade-in"
          onClick={(e) => e.stopPropagation()}>
          <div className="px-5 py-5 flex flex-col gap-4">
            <button onClick={() => { router.push('/shop'); setMenuOpen(false); }}
              className={`nav-link text-left ${activeCategory === 'ALL' ? 'active' : ''}`}>NEW</button>
            {CATEGORIES.map((cat) => (
              <button key={cat.key}
                onClick={() => { router.push(`/shop?category=${cat.key}`); setMenuOpen(false); }}
                className={`nav-link text-left ${activeCategory === cat.key ? 'active' : ''}`}>
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="h-12" />
    </>
  );
}

export default function Navbar(props: NavbarProps) {
  return (
    <Suspense fallback={<div className="h-12 fixed top-0 left-0 right-0 z-30 bg-white border-b border-[#F0F0F0]" />}>
      <NavbarInner {...props} />
    </Suspense>
  );
}

export function CartButton({ count, bump, onClick }: { count: number; bump?: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="relative flex items-center justify-center w-8 h-8 text-[var(--charcoal)] hover:text-[var(--gold)] transition-colors">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"/>
        <circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
      {count > 0 && (
        <span
          className="absolute -top-1 -right-1 min-w-[16px] h-4 rounded-full bg-green-500 text-white flex items-center justify-center font-mono text-[9px] font-bold px-0.5"
          style={{ transform: bump ? 'scale(1.3)' : 'scale(1)', transition: 'transform 0.2s cubic-bezier(0.34,1.56,0.64,1)' }}
        >
          {count}
        </span>
      )}
    </button>
  );
}
