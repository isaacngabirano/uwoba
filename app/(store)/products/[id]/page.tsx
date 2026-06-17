'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { DEMO_PRODUCTS } from '@/lib/demoData';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/store/cart';
import { CartButton } from '@/components/store/Navbar';
import Navbar from '@/components/store/Navbar';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgIndex, setImgIndex] = useState(0);
  const [added, setAdded] = useState(false);
  const { addItem } = useCartStore();

  useEffect(() => {
    if (!supabase) {
      setProduct(DEMO_PRODUCTS.find((p) => p.id === id) || null);
      setLoading(false);
      return;
    }
    supabase.from('products').select('*').eq('id', id).single()
      .then(({ data }) => { setProduct(data as Product); setLoading(false); });
  }, [id]);

  const images = product?.image_url ? [product.image_url] : [null];

  function handleAdd() {
    if (!product) return;
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <span className="font-mono text-[11px] tracking-widest text-[var(--light)] animate-pulse">—</span>
    </div>
  );

  if (!product) return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <p className="font-mono text-[11px] tracking-widest uppercase text-[var(--light)]">Not found</p>
      <button onClick={() => router.push('/')} className="nav-link active">← Back</button>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="h-[calc(100vh-48px)] flex flex-col md:flex-row">
        <div className="flex-1 flex flex-col min-h-0 relative">
          <div className="absolute top-4 left-5 z-10">
            <button onClick={() => router.back()}
              className="font-mono text-[18px] text-[var(--charcoal)] hover:text-[var(--gold)] transition-colors">←</button>
          </div>

          <div className="flex-1 relative flex items-center justify-center min-h-0">
            <button onClick={() => setImgIndex((i) => Math.max(0, i - 1))}
              className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 font-mono text-[24px] text-[#CFCFCF] hover:text-[var(--charcoal)] transition-colors select-none leading-none">‹</button>
            <div className="w-full h-full flex items-center justify-center p-10 md:p-16">
              {images[imgIndex] ? (
                <img key={imgIndex} src={images[imgIndex]!} alt={product.name}
                  className="max-w-full max-h-full object-contain animate-fade-in"
                  style={{ maxHeight: 'calc(100vh - 180px)' }} />
              ) : (
                <div className="w-48 h-48 bg-[#F8F8F8] flex items-center justify-center">
                  <span className="font-mono text-[10px] tracking-widest text-[#CFCFCF] uppercase">{product.category}</span>
                </div>
              )}
            </div>
            <button onClick={() => setImgIndex((i) => Math.min(images.length - 1, i + 1))}
              className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 font-mono text-[24px] text-[#CFCFCF] hover:text-[var(--charcoal)] transition-colors select-none leading-none">›</button>
          </div>

          <div className="flex justify-center gap-2 py-3 flex-shrink-0">
            {images.map((_, i) => (
              <button key={i} onClick={() => setImgIndex(i)}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${i === imgIndex ? 'bg-[var(--charcoal)]' : 'bg-[#DCDCDC]'}`} />
            ))}
          </div>
        </div>

        <div className="w-full md:w-64 lg:w-72 flex-shrink-0 flex flex-col justify-center gap-5 px-6 md:px-8 pb-8 md:pb-0 border-t md:border-t-0 md:border-l border-[#F0F0F0]">
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-[var(--light)]">{product.category}</p>
          <div className="space-y-1">
            <p className="font-mono text-[13px] tracking-[0.1em] uppercase font-bold">{product.name}</p>
            <p className="font-mono text-[12px] text-[var(--mid)]">{formatPrice(product.price)}</p>
          </div>
          {product.description && (
            <p className="font-mono text-[11px] text-[var(--mid)] leading-[1.8] tracking-wide">{product.description}</p>
          )}
          {product.stock > 0 && product.stock <= 5 && (
            <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--gold)]">ONLY {product.stock} LEFT</p>
          )}
          <button onClick={handleAdd} disabled={product.stock === 0} className="btn-gold">
            {product.stock === 0 ? 'SOLD OUT' : added ? '✓ ADDED TO CART' : '+ ADD TO CART'}
          </button>
        </div>
      </div>
    </>
  );
}
