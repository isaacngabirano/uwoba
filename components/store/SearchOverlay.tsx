'use client';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { DEMO_PRODUCTS } from '@/lib/demoData';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (product: Product) => void;
}

export default function SearchOverlay({ isOpen, onClose, onSelect }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [all, setAll] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load all products once on open
  useEffect(() => {
    if (!isOpen) { setQuery(''); setResults([]); return; }
    setTimeout(() => inputRef.current?.focus(), 50);

    async function load() {
      if (!supabase) { setAll(DEMO_PRODUCTS); return; }
      const { data } = await supabase.from('products').select('*').eq('is_active', true);
      if (data) setAll(data as Product[]);
    }
    load();
  }, [isOpen]);

  // Filter live as user types
  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const q = query.toLowerCase();
    setResults(
      all.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      ).slice(0, 8)
    );
  }, [query, all]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 bg-white flex flex-col animate-fade-in">
      {/* Search bar */}
      <div className="flex items-center gap-4 px-5 md:px-10 h-14 border-b border-[#F0F0F0] flex-shrink-0">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--light)" strokeWidth="1.5" strokeLinecap="round">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          ref={inputRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="SEARCH PRODUCTS..."
          className="flex-1 bg-transparent font-mono text-[12px] tracking-[0.12em] uppercase outline-none text-[var(--charcoal)] placeholder:text-[var(--light)]"
        />
        <button onClick={onClose} className="font-mono text-[20px] text-[var(--light)] hover:text-[var(--charcoal)] transition-colors leading-none">×</button>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto px-5 md:px-10">
        {!query.trim() ? (
          <div className="flex items-center justify-center h-full">
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--light)]">
              Start typing to search
            </p>
          </div>
        ) : results.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--light)]">
              No results for "{query}"
            </p>
          </div>
        ) : (
          <div className="py-4 divide-y divide-[#F5F5F5]">
            {results.map((product, i) => (
              <button
                key={product.id}
                onClick={() => { onSelect(product); onClose(); }}
                className="w-full flex items-center gap-4 py-4 hover:bg-[#FAFAFA] transition-colors text-left animate-fade-up"
                style={{ animationDelay: `${i * 0.03}s`, opacity: 0 }}
              >
                {/* Thumbnail */}
                <div className="w-12 h-12 flex-shrink-0 bg-[#F8F8F8] overflow-hidden">
                  {product.image_url
                    ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center">
                        <span className="font-mono text-[7px] text-[#CFCFCF] uppercase">{product.category}</span>
                      </div>
                  }
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-[11px] tracking-[0.1em] uppercase font-bold text-[var(--charcoal)] truncate">{product.name}</p>
                  <p className="font-mono text-[10px] text-[var(--light)] tracking-wider mt-0.5 uppercase">{product.category}</p>
                </div>
                <p className="font-mono text-[11px] text-[var(--mid)] flex-shrink-0">{formatPrice(product.price)}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
