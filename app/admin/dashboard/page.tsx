'use client';
import { useState, useEffect } from 'react';
import { formatPrice } from '@/lib/utils';

interface Analytics {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  productCount: number;
  outOfStock: number;
  lowStock: any[];
  revenueByDay: Record<string, number>;
}

export default function AdminDashboard() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const [analytics, orders] = await Promise.all([
      fetch('/api/admin/analytics').then((r) => r.json()),
      fetch('/api/orders').then((r) => r.json()),
    ]);
    setData(analytics);
    setRecentOrders(orders.slice(0, 5));
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="font-mono text-[11px] tracking-widest text-[#ADADAD] uppercase animate-pulse">Loading...</span>
      </div>
    );
  }

  const stats = [
    { label: 'TOTAL REVENUE', value: formatPrice(data?.totalRevenue || 0), sub: 'Paid orders' },
    { label: 'TOTAL ORDERS', value: data?.totalOrders || 0, sub: 'All time' },
    { label: 'PENDING', value: data?.pendingOrders || 0, sub: 'Needs attention' },
    { label: 'PRODUCTS', value: data?.productCount || 0, sub: `${data?.outOfStock || 0} out of stock` },
  ];

  const revenueEntries = Object.entries(data?.revenueByDay || {});

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="font-mono text-[13px] tracking-[0.2em] uppercase font-bold text-[#1A1A1A]">DASHBOARD</h1>
        <p className="font-mono text-[10px] text-[#ADADAD] mt-1 tracking-wider uppercase">
          {new Date().toLocaleDateString('en-UG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-4 border border-[#E8DFD0]">
            <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#ADADAD]">{stat.label}</p>
            <p className="font-mono text-xl md:text-2xl font-bold text-[#1A1A1A] mt-1">{stat.value}</p>
            <p className="font-mono text-[9px] text-[#ADADAD] mt-1 uppercase tracking-wider">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent orders */}
        <div className="lg:col-span-2 bg-white border border-[#E8DFD0]">
          <div className="px-5 py-4 border-b border-[#E8DFD0]">
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase">RECENT ORDERS</p>
          </div>
          <div>
            {recentOrders.length === 0 ? (
              <p className="font-mono text-[10px] text-[#ADADAD] uppercase tracking-wider text-center py-8">
                No orders yet
              </p>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between px-5 py-3 border-b border-[#F5F0EA] last:border-0">
                  <div>
                    <p className="font-mono text-[11px] tracking-wider">{order.order_number}</p>
                    <p className="font-mono text-[10px] text-[#ADADAD] mt-0.5">{order.customer_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-[11px]">{formatPrice(order.total)}</p>
                    <span className={`font-mono text-[9px] tracking-wider uppercase px-2 py-0.5 mt-0.5 inline-block
                      ${order.order_status === 'DELIVERED' ? 'bg-green-50 text-green-600'
                        : order.order_status === 'CANCELLED' ? 'bg-red-50 text-red-500'
                        : 'bg-amber-50 text-amber-600'}`}>
                      {order.order_status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Low stock */}
        <div className="bg-white border border-[#E8DFD0]">
          <div className="px-5 py-4 border-b border-[#E8DFD0]">
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase">LOW STOCK</p>
          </div>
          <div>
            {(data?.lowStock || []).length === 0 ? (
              <p className="font-mono text-[10px] text-[#ADADAD] uppercase tracking-wider text-center py-8">
                All stocked up
              </p>
            ) : (
              (data?.lowStock || []).map((p) => (
                <div key={p.id} className="flex items-center justify-between px-5 py-3 border-b border-[#F5F0EA] last:border-0">
                  <div>
                    <p className="font-mono text-[10px] tracking-wider">{p.code}</p>
                    <p className="font-mono text-[9px] text-[#ADADAD] mt-0.5">{p.name}</p>
                  </div>
                  <span className={`font-mono text-[10px] font-bold ${p.stock === 0 ? 'text-red-500' : 'text-amber-500'}`}>
                    {p.stock}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Revenue chart (simple bars) */}
      {revenueEntries.length > 0 && (
        <div className="mt-6 bg-white border border-[#E8DFD0] p-5">
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase mb-6">REVENUE — LAST 7 DAYS</p>
          <div className="flex items-end gap-3 h-24">
            {revenueEntries.map(([day, amount]) => {
              const max = Math.max(...revenueEntries.map(([, v]) => v));
              const height = max > 0 ? Math.max(4, (amount / max) * 100) : 4;
              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-[var(--gold)] transition-all"
                    style={{ height: `${height}%`, minHeight: '4px' }}
                    title={formatPrice(amount)}
                  />
                  <span className="font-mono text-[9px] text-[#ADADAD] uppercase">{day}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
