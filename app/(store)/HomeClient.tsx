'use client';
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { DEMO_PRODUCTS } from '@/lib/demoData';
import { Product } from '@/types';
import { CATEGORIES } from '@/lib/utils';
import ProductCard from '@/components/store/ProductCard';
import ProductModal from '@/components/store/ProductModal';
import Navbar from '@/components/store/Navbar';

// Grid modes: mobile 1→2→3 cols, desktop 3→4→6 cols
const GRID_MODES = [
  { mobile: 1, desktop: 3, gap: 'gap-x-3 gap-y-6 md:gap-x-4 md:gap-y-8' },
  { mobile: 2, desktop: 4, gap: 'gap-x-2 gap-y-5 md:gap-x-3 md:gap-y-7' },
  { mobile: 3, desktop: 6, gap: 'gap-x-1 gap-y-4 md:gap-x-2 md:gap-y-6' },
];

export default function HomeClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeCategory = searchParams.get('category') || 'ALL';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [gridMode, setGridMode] = useState(1); // default: 2col mobile / 4col desktop
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => { fetchProducts(); }, [activeCategory]);

  async function fetchProducts() {
    setLoading(true);
    if (!supabase) {
      await new Promise((r) => setTimeout(r, 250));
      const filtered = activeCategory === 'ALL' ? DEMO_PRODUCTS : DEMO_PRODUCTS.filter((p) => p.category === activeCategory);
      setProducts(filtered);
      setLoading(false);
      return;
    }
    let query = supabase.from('products').select('*').eq('is_active', true).order('created_at', { ascending: false });
    if (activeCategory !== 'ALL') query = query.eq('category', activeCategory);
    const { data, error } = await query;
    if (!error && data) setProducts(data as Product[]);
    setLoading(false);
  }

  function cycleGrid() {
    setTransitioning(true);
    setTimeout(() => {
      setGridMode((m) => (m + 1) % GRID_MODES.length);
      setTransitioning(false);
    }, 150);
  }

  const mode = GRID_MODES[gridMode];
  const colClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
  }[mode.mobile] + ' ' + {
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
    6: 'md:grid-cols-6',
  }[mode.desktop];

  return (
    <>
      <Navbar onGridToggle={cycleGrid} onProductSelect={setSelectedProduct} />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />

      <div>
        {/* Demo banner */}
        {!supabase && (
          <div className="bg-[#F8F8F8] border-b border-[#EBEBEB] px-5 md:px-8 py-2">
            <p className="font-mono text-[9px] tracking-[0.15em] uppercase text-[var(--light)]">
              Demo mode — add Supabase keys to .env.local to go live
            </p>
          </div>
        )}

        {/* Mobile category bar — scrollable, hidden on desktop (desktop uses Navbar) */}
        <div className="md:hidden flex items-center gap-5 px-4 py-3 overflow-x-auto border-b border-[#F0F0F0] scrollbar-none">
          <button
            onClick={() => router.push('/')}
            className={`nav-link whitespace-nowrap flex-shrink-0 ${activeCategory === 'ALL' ? 'active' : ''}`}>
            NEW
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => router.push(`/?category=${cat.key}`)}
              className={`nav-link whitespace-nowrap flex-shrink-0 ${activeCategory === cat.key ? 'active' : ''}`}>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className={`px-3 md:px-5 pb-10 transition-opacity duration-150 ${transitioning ? 'opacity-0' : 'opacity-100'}`}>
          {loading ? (
            <div className={`grid ${colClass} ${mode.gap}`}>
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-[#F8F8F8] aspect-square" />
                  <div className="mt-2 space-y-1 text-center">
                    <div className="h-2.5 bg-[#F0F0F0] rounded w-2/3 mx-auto" />
                    <div className="h-2.5 bg-[#F0F0F0] rounded w-1/2 mx-auto" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32">
              <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--light)]">No products found</p>
            </div>
          ) : (
            <div className={`grid ${colClass} ${mode.gap} transition-all duration-300`}>
              {products.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={i}
                  onClick={setSelectedProduct}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="px-5 md:px-8 py-8 border-t border-[#EBEBEB]">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <p className="font-mono text-[12px] tracking-[0.2em] uppercase font-bold">UWOBA</p>
            <div className="flex gap-6">
              <span className="nav-link">Instagram</span>
              <span className="nav-link">WhatsApp</span>
              <span className="nav-link">TikTok</span>
            </div>
            <p className="font-mono text-[10px] text-[var(--light)] tracking-wider">© 2026 UWOBA</p>
          </div>
        </footer>
      </div>
    </>
  );
}
