'use client';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAdminStore } from '@/store/admin';
import Link from 'next/link';

const NAV_ITEMS = [
  { href: '/admin/dashboard', label: 'DASHBOARD', icon: '▦' },
  { href: '/admin/products', label: 'PRODUCTS', icon: '◈' },
  { href: '/admin/orders', label: 'ORDERS', icon: '◎' },
  { href: '/admin/users', label: 'CUSTOMERS', icon: '◉' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, logout } = useAdminStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated && pathname !== '/admin') {
      router.push('/admin');
    }
  }, [mounted, isAuthenticated, pathname]);

  // Close sidebar on route change
  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  if (!mounted) return null;
  if (!isAuthenticated || pathname === '/admin') return <>{children}</>;

  const currentPage = NAV_ITEMS.find(n => n.href === pathname)?.label || 'ADMIN';

  return (
    <div className="min-h-screen bg-[#F8F6F3]">

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-[#1A1A1A] h-12 flex items-center justify-between px-4">
        <button onClick={() => setSidebarOpen(true)}
          className="text-white/60 hover:text-white transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-white font-bold">RHEA</span>
        <Link href="/" className="font-mono text-[9px] tracking-wider text-white/40 uppercase hover:text-white/70 transition-colors">
          STORE
        </Link>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-56 bg-[#1A1A1A] flex flex-col
        transition-transform duration-300 ease-in-out
        md:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="px-6 py-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <p className="font-mono text-[12px] tracking-[0.25em] uppercase text-white font-bold">RHEA</p>
            <p className="font-mono text-[9px] tracking-wider text-white/40 mt-0.5 uppercase">Admin Panel</p>
          </div>
          <button onClick={() => setSidebarOpen(false)}
            className="md:hidden text-white/40 hover:text-white transition-colors font-mono text-xl leading-none">
            ×
          </button>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-3 py-3 font-mono text-[10px] tracking-[0.15em] uppercase transition-colors rounded
                ${pathname === item.href
                  ? 'bg-[var(--gold)] text-white'
                  : 'text-white/50 hover:text-white hover:bg-white/5'}`}>
              <span className="text-[14px] leading-none">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="px-6 py-5 border-t border-white/10 space-y-3">
          <Link href="/" className="block font-mono text-[10px] tracking-wider text-white/40 hover:text-white/70 uppercase transition-colors">
            ← STOREFRONT
          </Link>
          <button
            onClick={() => { logout(); router.push('/admin'); }}
            className="font-mono text-[10px] tracking-wider text-white/40 hover:text-red-400 uppercase transition-colors">
            LOGOUT
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="md:ml-56 min-h-screen pt-12 md:pt-0">
        {children}
      </main>
    </div>
  );
}
