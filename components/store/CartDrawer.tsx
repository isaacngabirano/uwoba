'use client';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cart';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice, totalItems } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  // Skeleton while hydrating
  if (!mounted) return (
    <>
      <div className="fixed inset-0 bg-black/35 z-[59]" onClick={closeCart} />
      <div className="fixed top-0 right-0 h-full w-full max-w-[380px] bg-white z-[60] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EBEBEB]">
          <div className="h-3 w-16 bg-[#F0F0F0] animate-pulse rounded" />
          <div className="h-6 w-6 bg-[#F0F0F0] animate-pulse rounded" />
        </div>
        <div className="flex-1 px-6 py-5 space-y-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="w-16 h-16 bg-[#F0F0F0] flex-shrink-0" />
              <div className="flex-1 space-y-2 pt-1">
                <div className="h-3 bg-[#F0F0F0] rounded w-3/4" />
                <div className="h-3 bg-[#F0F0F0] rounded w-1/2" />
                <div className="h-3 bg-[#F0F0F0] rounded w-1/3 mt-3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const subtotal = totalPrice();
  const count = totalItems();

  return (
    <>
      <div className="fixed inset-0 bg-black/35 z-[59] animate-fade-in" onClick={closeCart} />
      <div className="fixed top-0 right-0 h-full w-full max-w-[380px] bg-white z-[60] animate-slide-right flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EBEBEB] flex-shrink-0">
          <span className="font-mono text-[12px] tracking-[0.15em] uppercase">
            CART {count > 0 ? count : ''}
          </span>
          <button onClick={closeCart}
            className="font-mono text-xl hover:text-[var(--gold)] transition-colors leading-none">×</button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center gap-3">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D0D0D0" strokeWidth="1">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              <p className="font-mono text-[10px] tracking-widest text-[var(--light)] uppercase">Cart is empty</p>
            </div>
          ) : (
            <div className="space-y-5">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4 animate-fade-up">
                  <div className="w-16 h-16 bg-[#F8F8F8] border border-[#F0F0F0] flex-shrink-0 overflow-hidden">
                    {item.product.image_url
                      ? <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center">
                          <span className="font-mono text-[8px] text-[#CFCFCF]">{item.product.category}</span>
                        </div>}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="font-mono text-[11px] tracking-[0.08em] uppercase font-bold leading-tight pr-2">{item.product.name}</p>
                      <button onClick={() => removeItem(item.product.id)}
                        className="font-mono text-lg text-[#D0D0D0] hover:text-[var(--charcoal)] transition-colors leading-none flex-shrink-0">×</button>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-3">
                        <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="font-mono text-base text-[var(--light)] hover:text-[var(--charcoal)] w-4 text-center transition-colors">−</button>
                        <span className="font-mono text-[11px]">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="font-mono text-base text-[var(--light)] hover:text-[var(--charcoal)] w-4 text-center transition-colors">+</button>
                      </div>
                      <p className="font-mono text-[11px] text-[var(--mid)]">{formatPrice(item.product.price * item.quantity)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-[#EBEBEB] space-y-3 flex-shrink-0">
            <div className="flex justify-between">
              <span className="font-mono text-[11px] tracking-widest uppercase text-[var(--light)]">Subtotal</span>
              <span className="font-mono text-[12px]">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-mono text-[11px] tracking-widest uppercase text-[var(--light)]">Delivery</span>
              <span className="font-mono text-[10px] text-[var(--light)]">At checkout</span>
            </div>
            <Link href="/checkout" onClick={closeCart}>
              <button className="btn-gold mt-1">CHECKOUT</button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
