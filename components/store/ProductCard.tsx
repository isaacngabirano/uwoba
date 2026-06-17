'use client';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  index?: number;
  onClick?: (product: Product) => void;
}

export default function ProductCard({ product, index = 0, onClick }: ProductCardProps) {
  const delay = `${(index % 12) * 0.04}s`;

  return (
    <div
      className="animate-fade-up cursor-pointer group"
      style={{ animationDelay: delay, opacity: 0 }}
      onClick={() => onClick?.(product)}
    >
      {/* Perfect square — no deviation, ever */}
      <div className="relative w-full aspect-square overflow-hidden bg-[#F7F7F7]">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-[9px] tracking-[0.15em] text-[#CFCFCF] uppercase">{product.category}</span>
          </div>
        )}

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-[var(--light)]">SOLD OUT</span>
          </div>
        )}
      </div>

      {/* Name + price — centered, always one line */}
      <div className="pt-2.5 text-center">
        <p className="font-mono text-[10px] tracking-[0.1em] uppercase text-[var(--charcoal)] truncate px-1 leading-snug font-bold">
          {product.name}
        </p>
        <p className="font-mono text-[10px] text-[var(--mid)] tracking-wider mt-0.5">
          {formatPrice(product.price)}
        </p>
      </div>
    </div>
  );
}
