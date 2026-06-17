'use client';
import CartDrawer from '@/components/store/CartDrawer';

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CartDrawer />
      <main>{children}</main>
    </>
  );
}
