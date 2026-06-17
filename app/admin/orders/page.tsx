'use client';
import { useState, useEffect } from 'react';
import { formatPrice } from '@/lib/utils';
import { Order } from '@/types';

const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'DELIVERED', 'CANCELLED'];
const PAYMENT_STATUSES = ['PENDING', 'PAID', 'FAILED'];

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-600',
  CONFIRMED: 'bg-blue-50 text-blue-600',
  PROCESSING: 'bg-purple-50 text-purple-600',
  DELIVERED: 'bg-green-50 text-green-600',
  CANCELLED: 'bg-red-50 text-red-500',
  PAID: 'bg-green-50 text-green-600',
  FAILED: 'bg-red-50 text-red-500',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => { fetchOrders(); }, []);

  async function fetchOrders() {
    setLoading(true);
    const res = await fetch('/api/orders');
    const data = await res.json();
    setOrders(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  async function updateStatus(orderId: string, field: string, value: string) {
    setUpdating(true);
    const res = await fetch(`/api/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: value }),
    });
    const updated = await res.json();
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, ...updated } : o)));
    if (selected?.id === orderId) setSelected((prev: any) => ({ ...prev, ...updated }));
    setUpdating(false);
  }

  const filtered = orders.filter((o) => {
    const matchStatus = filterStatus === 'ALL' || o.order_status === filterStatus;
    const matchSearch =
      o.order_number?.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_phone?.includes(search);
    return matchStatus && matchSearch;
  });

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-mono text-[13px] tracking-[0.2em] uppercase font-bold">ORDERS</h1>
          <p className="font-mono text-[10px] text-[#ADADAD] mt-1 uppercase tracking-wider">{orders.length} total</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="SEARCH ORDER / CUSTOMER..."
          className="bg-white border border-[#E8DFD0] px-4 py-2 font-mono text-[11px] tracking-wider outline-none focus:border-[#1A1A1A] w-64"
        />
        <div className="flex gap-2">
          {['ALL', ...ORDER_STATUSES].map((s) => (
            <button key={s}
              onClick={() => setFilterStatus(s)}
              className={`font-mono text-[9px] tracking-[0.15em] uppercase px-3 py-2 transition-colors border
                ${filterStatus === s ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' : 'bg-white text-[#6B6B6B] border-[#E8DFD0] hover:border-[#1A1A1A]'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E8DFD0] overflow-x-auto">
        <div className="grid grid-cols-[1.5fr_1.5fr_1fr_1fr_1fr_1fr] px-5 py-3 border-b border-[#E8DFD0]">
          {['ORDER', 'CUSTOMER', 'TOTAL', 'PAYMENT', 'STATUS', 'DATE'].map((h) => (
            <span key={h} className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#ADADAD]">{h}</span>
          ))}
        </div>

        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="grid grid-cols-[1.5fr_1.5fr_1fr_1fr_1fr_1fr] px-5 py-4 border-b border-[#F5F0EA] animate-pulse">
              {Array.from({ length: 6 }).map((_, j) => <div key={j} className="h-3 bg-[#F5F0EA] rounded w-3/4" />)}
            </div>
          ))
        ) : filtered.length === 0 ? (
          <p className="font-mono text-[10px] text-[#ADADAD] uppercase tracking-wider text-center py-12">No orders found</p>
        ) : (
          filtered.map((order) => (
            <div
              key={order.id}
              onClick={() => setSelected(order)}
              className="grid grid-cols-[1.5fr_1.5fr_1fr_1fr_1fr_1fr] px-5 py-4 border-b border-[#F5F0EA] last:border-0 items-center hover:bg-[#FAFAF8] transition-colors cursor-pointer"
            >
              <p className="font-mono text-[11px] tracking-wider">{order.order_number}</p>
              <div>
                <p className="font-mono text-[11px]">{order.customer_name}</p>
                <p className="font-mono text-[10px] text-[#ADADAD]">{order.customer_phone}</p>
              </div>
              <p className="font-mono text-[11px]">{formatPrice(order.total)}</p>
              <span className={`font-mono text-[9px] tracking-wider uppercase px-2 py-0.5 inline-block w-fit ${STATUS_COLORS[order.payment_status] || ''}`}>
                {order.payment_status}
              </span>
              <span className={`font-mono text-[9px] tracking-wider uppercase px-2 py-0.5 inline-block w-fit ${STATUS_COLORS[order.order_status] || ''}`}>
                {order.order_status}
              </span>
              <p className="font-mono text-[10px] text-[#ADADAD]">
                {new Date(order.created_at).toLocaleDateString('en-UG', { day: 'numeric', month: 'short' })}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Order detail panel */}
      {selected && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setSelected(null)} />
          <div className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-50 overflow-y-auto animate-slide-right shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#E8DFD0]">
              <div>
                <p className="font-mono text-[11px] tracking-[0.2em] uppercase">{selected.order_number}</p>
                <p className="font-mono text-[10px] text-[#ADADAD] mt-0.5">
                  {new Date(selected.created_at).toLocaleString('en-UG')}
                </p>
              </div>
              <button onClick={() => setSelected(null)} className="font-mono text-xl hover:text-[var(--gold)]">×</button>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer */}
              <div>
                <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#ADADAD] mb-3">CUSTOMER</p>
                <p className="font-mono text-[12px]">{selected.customer_name}</p>
                <p className="font-mono text-[11px] text-[#6B6B6B] mt-1">{selected.customer_phone}</p>
                {selected.customer_email && <p className="font-mono text-[11px] text-[#6B6B6B]">{selected.customer_email}</p>}
                <p className="font-mono text-[11px] text-[#6B6B6B] mt-2 leading-relaxed">{selected.delivery_address}</p>
              </div>

              {/* Items */}
              <div>
                <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#ADADAD] mb-3">ITEMS</p>
                <div className="space-y-3">
                  {(selected.order_items || []).map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center py-2 border-b border-[#F5F0EA]">
                      <div>
                        <p className="font-mono text-[11px]">{item.product_code}</p>
                        <p className="font-mono text-[10px] text-[#6B6B6B]">{item.product_name} × {item.quantity}</p>
                      </div>
                      <p className="font-mono text-[11px]">{formatPrice(item.subtotal)}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex justify-between">
                  <span className="font-mono text-[10px] uppercase text-[#6B6B6B]">Delivery</span>
                  <span className="font-mono text-[11px]">{formatPrice(selected.delivery_fee)}</span>
                </div>
                <div className="mt-2 flex justify-between border-t border-[#E8DFD0] pt-2">
                  <span className="font-mono text-[11px] uppercase font-bold">TOTAL</span>
                  <span className="font-mono text-[13px] font-bold">{formatPrice(selected.total)}</span>
                </div>
              </div>

              {/* Payment method */}
              <div>
                <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#ADADAD] mb-2">PAYMENT METHOD</p>
                <p className="font-mono text-[11px]">{selected.payment_method}</p>
              </div>

              {/* Update statuses */}
              <div className="space-y-4">
                <div>
                  <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#ADADAD] mb-2">ORDER STATUS</p>
                  <div className="flex flex-wrap gap-2">
                    {ORDER_STATUSES.map((s) => (
                      <button key={s}
                        onClick={() => updateStatus(selected.id, 'order_status', s)}
                        disabled={updating}
                        className={`font-mono text-[9px] tracking-wider uppercase px-3 py-1.5 border transition-colors
                          ${selected.order_status === s ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' : 'border-[#E8DFD0] text-[#6B6B6B] hover:border-[#1A1A1A]'}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#ADADAD] mb-2">PAYMENT STATUS</p>
                  <div className="flex gap-2">
                    {PAYMENT_STATUSES.map((s) => (
                      <button key={s}
                        onClick={() => updateStatus(selected.id, 'payment_status', s)}
                        disabled={updating}
                        className={`font-mono text-[9px] tracking-wider uppercase px-3 py-1.5 border transition-colors
                          ${selected.payment_status === s ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' : 'border-[#E8DFD0] text-[#6B6B6B] hover:border-[#1A1A1A]'}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
