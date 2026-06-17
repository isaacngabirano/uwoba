'use client';
import { useState, useEffect } from 'react';
import { formatPrice } from '@/lib/utils';

export default function AdminUsersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { fetchCustomers(); }, []);

  async function fetchCustomers() {
    setLoading(true);
    const res = await fetch('/api/admin/customers');
    const data = await res.json();
    setCustomers(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  const filtered = customers.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  const totalCustomers = customers.length;
  const totalRevenue = customers.reduce((s, c) => s + (c.total_spent || 0), 0);
  const repeatCustomers = customers.filter((c) => c.order_count > 1).length;

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="font-mono text-[13px] tracking-[0.2em] uppercase font-bold">CUSTOMERS</h1>
        <p className="font-mono text-[10px] text-[#ADADAD] mt-1 uppercase tracking-wider">{totalCustomers} unique customers</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'TOTAL CUSTOMERS', value: totalCustomers },
          { label: 'REPEAT BUYERS', value: repeatCustomers },
          { label: 'TOTAL REVENUE', value: formatPrice(totalRevenue) },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-[#E8DFD0] p-5">
            <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#ADADAD]">{s.label}</p>
            <p className="font-mono text-2xl font-bold text-[#1A1A1A] mt-2">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="mb-5">
        <input
          value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="SEARCH BY NAME, PHONE OR EMAIL..."
          className="bg-white border border-[#E8DFD0] px-4 py-2 font-mono text-[11px] tracking-wider outline-none focus:border-[#1A1A1A] w-72"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E8DFD0] overflow-x-auto">
        <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr] px-5 py-3 border-b border-[#E8DFD0]">
          {['CUSTOMER', 'PHONE / EMAIL', 'ORDERS', 'TOTAL SPENT', 'LAST ORDER'].map((h) => (
            <span key={h} className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#ADADAD]">{h}</span>
          ))}
        </div>

        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr] px-5 py-4 border-b border-[#F5F0EA] animate-pulse">
              {Array.from({ length: 5 }).map((_, j) => <div key={j} className="h-3 bg-[#F5F0EA] rounded w-3/4" />)}
            </div>
          ))
        ) : filtered.length === 0 ? (
          <p className="font-mono text-[10px] text-[#ADADAD] uppercase tracking-wider text-center py-12">No customers yet</p>
        ) : (
          filtered.map((c, i) => (
            <div key={i} className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr] px-5 py-4 border-b border-[#F5F0EA] last:border-0 items-center hover:bg-[#FAFAF8] transition-colors">
              <div>
                <p className="font-mono text-[11px]">{c.name}</p>
                {c.order_count > 1 && (
                  <span className="font-mono text-[8px] tracking-wider uppercase bg-[var(--gold)]/10 text-[var(--gold-dark)] px-1.5 py-0.5 mt-0.5 inline-block">
                    REPEAT
                  </span>
                )}
              </div>
              <div>
                <p className="font-mono text-[11px]">{c.phone}</p>
                {c.email && <p className="font-mono text-[10px] text-[#ADADAD] mt-0.5">{c.email}</p>}
              </div>
              <p className="font-mono text-[11px] font-bold">{c.order_count}</p>
              <p className="font-mono text-[11px]">{formatPrice(c.total_spent)}</p>
              <p className="font-mono text-[10px] text-[#ADADAD]">
                {new Date(c.last_order).toLocaleDateString('en-UG', { day: 'numeric', month: 'short', year: '2-digit' })}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
