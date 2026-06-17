'use client';
import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/store/cart';
import { CartButton } from './Navbar';
import CartDrawer from './CartDrawer';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const [imgIndex, setImgIndex] = useState(0);
  const [added, setAdded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [bump, setBump] = useState(false);
  const [prev, setPrev] = useState(0);
  const { addItem, toggleCart, totalItems } = useCartStore();

  useEffect(() => { setMounted(true); }, []);
  const count = mounted ? totalItems() : 0;

  useEffect(() => {
    if (!mounted) return;
    if (count > prev) { setBump(true); setTimeout(() => setBump(false), 350); }
    setPrev(count);
  }, [count]);

  useEffect(() => {
    setImgIndex(0);
    setAdded(false);
    document.body.style.overflow = product ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [product]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!product) return;
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [product]);

  if (!product) return null;
  const images = product.image_url ? [product.image_url] : [null];

  function handleAdd() {
    addItem(product!);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    // z-50 for modal, CartDrawer inside it renders at z-[60] so it floats above
    <div className="fixed inset-0 z-50 bg-white flex flex-col animate-zoom-in">

      {/* Cart drawer lives INSIDE the modal so it's above the modal overlay */}
      <CartDrawer />

      {/* Top bar */}
      <div className="flex items-center justify-between px-5 md:px-8 h-12 flex-shrink-0 border-b border-[#F0F0F0]">
        <button onClick={onClose}
          className="font-mono text-[18px] text-[var(--charcoal)] hover:text-[var(--gold)] transition-colors leading-none">
          ←
        </button>
        <CartButton count={count} bump={bump} onClick={toggleCart} />
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0">

        {/* Image */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 relative flex items-center justify-center min-h-0">
            <button onClick={() => setImgIndex((i) => Math.max(0, i - 1))}
              className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-10 font-mono text-[24px] text-[#CFCFCF] hover:text-[var(--charcoal)] transition-colors select-none leading-none">
              ‹
            </button>
            <div className="w-full h-full flex items-center justify-center p-8 md:p-14">
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
              className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-10 font-mono text-[24px] text-[#CFCFCF] hover:text-[var(--charcoal)] transition-colors select-none leading-none">
              ›
            </button>
          </div>
          <div className="flex justify-center gap-2 py-3 flex-shrink-0">
            {images.map((_, i) => (
              <button key={i} onClick={() => setImgIndex(i)}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${i === imgIndex ? 'bg-[var(--charcoal)]' : 'bg-[#DCDCDC]'}`} />
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="w-full md:w-64 lg:w-72 flex-shrink-0 flex flex-col justify-center gap-5 px-6 md:px-8 pb-8 md:pb-0 border-t md:border-t-0 md:border-l border-[#F0F0F0]">
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-[var(--light)]">{product.category}</p>
          <div className="space-y-1">
            <p className="font-mono text-[13px] tracking-[0.1em] uppercase font-bold leading-snug">{product.name}</p>
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
    </div>
  );
}
