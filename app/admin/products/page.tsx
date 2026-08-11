'use client';
import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { formatPrice, CATEGORIES, generateProductCode } from '@/lib/utils';

const EMPTY_FORM = {
  code: '', name: '', description: '', price: '',
  category: 'BASKETS', stock: '', image_url: '', is_active: true,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('ALL');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => { fetchProducts(); }, []);

  async function fetchProducts() {
    setLoading(true);
    const res = await fetch('/api/products');
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  }

  function openAdd() {
    setForm({ ...EMPTY_FORM });
    setEditingId(null);
    setShowForm(true);
    setError('');
  }

  function openEdit(p: Product) {
    setForm({
      code: p.code, name: p.name, description: p.description || '',
      price: String(p.price), category: p.category,
      stock: String(p.stock), image_url: p.image_url || '', is_active: p.is_active,
    });
    setEditingId(p.id);
    setShowForm(true);
    setError('');
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.code || !form.name || !form.price) { setError('Code, name and price are required.'); return; }
    setSaving(true); setError('');

    const payload = {
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock) || 0,
    };

    const url = editingId ? `/api/products/${editingId}` : '/api/products';
    const method = editingId ? 'PUT' : 'POST';

    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const data = await res.json();

    if (!res.ok) { setError(data.error || 'Save failed'); setSaving(false); return; }

    setShowForm(false);
    fetchProducts();
    setSaving(false);
  }

  async function handleDelete(id: string) {
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    setDeleteConfirm(null);
    fetchProducts();
  }

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.code.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'ALL' || p.category === filterCat;
    return matchSearch && matchCat;
  });

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-mono text-[13px] tracking-[0.2em] uppercase font-bold">PRODUCTS</h1>
          <p className="font-mono text-[10px] text-[#ADADAD] mt-1 uppercase tracking-wider">{products.length} total</p>
        </div>
        <button onClick={openAdd} className="bg-[#1A1A1A] text-white font-mono text-[10px] tracking-[0.15em] uppercase px-5 py-2.5 hover:bg-[var(--gold)] transition-colors">
          + ADD PRODUCT
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="SEARCH..."
          className="bg-white border border-[#E8DFD0] px-4 py-2 font-mono text-[11px] tracking-wider outline-none focus:border-[#1A1A1A] w-48"
        />
        <select
          value={filterCat} onChange={(e) => setFilterCat(e.target.value)}
          className="bg-white border border-[#E8DFD0] px-4 py-2 font-mono text-[11px] tracking-wider outline-none focus:border-[#1A1A1A]"
        >
          <option value="ALL">ALL CATEGORIES</option>
          {CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E8DFD0] overflow-x-auto">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-0 border-b border-[#E8DFD0] px-5 py-3">
          {['PRODUCT', 'CATEGORY', 'PRICE', 'STOCK', 'STATUS', ''].map((h) => (
            <span key={h} className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#ADADAD]">{h}</span>
          ))}
        </div>

        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-0 px-5 py-4 border-b border-[#F5F0EA] animate-pulse">
              {Array.from({ length: 5 }).map((_, j) => <div key={j} className="h-3 bg-[#F5F0EA] rounded w-3/4" />)}
              <div />
            </div>
          ))
        ) : filtered.length === 0 ? (
          <p className="font-mono text-[10px] text-[#ADADAD] uppercase tracking-wider text-center py-12">No products found</p>
        ) : (
          filtered.map((p) => (
            <div key={p.id} className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-0 px-5 py-4 border-b border-[#F5F0EA] last:border-0 items-center hover:bg-[#FAFAF8] transition-colors">
              <div>
                <p className="font-mono text-[11px] tracking-wider">{p.code}</p>
                <p className="font-mono text-[10px] text-[#ADADAD] mt-0.5">{p.name}</p>
              </div>
              <span className="font-mono text-[10px] text-[#6B6B6B] uppercase tracking-wider">{p.category}</span>
              <span className="font-mono text-[11px]">{formatPrice(p.price)}</span>
              <span className={`font-mono text-[11px] font-bold ${p.stock === 0 ? 'text-red-500' : p.stock <= 5 ? 'text-amber-500' : 'text-green-600'}`}>
                {p.stock}
              </span>
              <span className={`font-mono text-[9px] tracking-wider uppercase px-2 py-1 inline-block w-fit
                ${p.is_active ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                {p.is_active ? 'ACTIVE' : 'HIDDEN'}
              </span>
              <div className="flex items-center gap-3">
                <button onClick={() => openEdit(p)} className="font-mono text-[10px] text-[#6B6B6B] hover:text-[#1A1A1A] uppercase tracking-wider transition-colors">
                  EDIT
                </button>
                <button onClick={() => setDeleteConfirm(p.id)} className="font-mono text-[10px] text-[#ADADAD] hover:text-red-500 uppercase tracking-wider transition-colors">
                  DEL
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setShowForm(false)} />
          <div className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-50 overflow-y-auto flex flex-col shadow-2xl animate-slide-right">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#E8DFD0]">
              <p className="font-mono text-[11px] tracking-[0.2em] uppercase">
                {editingId ? 'EDIT PRODUCT' : 'ADD PRODUCT'}
              </p>
              <button onClick={() => setShowForm(false)} className="font-mono text-xl hover:text-[var(--gold)] transition-colors">×</button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5 flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#ADADAD] block mb-2">CODE *</label>
                  <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })}
                    placeholder="SK-01" className="input-field" required />
                </div>
                <div>
                  <label className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#ADADAD] block mb-2">CATEGORY *</label>
                  <select value={form.category} onChange={(e) => { const cat = e.target.value; setForm((f) => ({ ...f, category: cat, code: editingId ? f.code : generateProductCode(cat) })); }}
                    className="input-field bg-transparent">
                    {CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#ADADAD] block mb-2">NAME *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Product name" className="input-field" required />
              </div>

              <div>
                <label className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#ADADAD] block mb-2">DESCRIPTION</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Product description" className="input-field resize-none" rows={3} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#ADADAD] block mb-2">PRICE (UGX) *</label>
                  <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="25000" className="input-field" type="number" required />
                </div>
                <div>
                  <label className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#ADADAD] block mb-2">STOCK</label>
                  <input value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    placeholder="50" className="input-field" type="number" />
                </div>
              </div>

              <div>
                <label className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#ADADAD] block mb-2">IMAGE URL</label>
                <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  placeholder="https://..." className="input-field" />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, is_active: !form.is_active })}
                  className={`w-10 h-5 rounded-full transition-colors relative ${form.is_active ? 'bg-[#1A1A1A]' : 'bg-[#D0C8BC]'}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.is_active ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
                <span className="font-mono text-[10px] tracking-wider uppercase text-[#6B6B6B]">
                  {form.is_active ? 'ACTIVE (visible in store)' : 'HIDDEN'}
                </span>
              </div>

              {error && <p className="font-mono text-[10px] tracking-wider text-red-500 uppercase">{error}</p>}

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-gold flex-1">
                  {saving ? 'SAVING...' : editingId ? 'UPDATE' : 'ADD PRODUCT'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline px-6">
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* Delete confirmation */}
      {deleteConfirm && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setDeleteConfirm(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white z-50 p-8 w-80 text-center animate-slide-up">
            <p className="font-mono text-[11px] tracking-[0.2em] uppercase mb-3">DELETE PRODUCT?</p>
            <p className="font-mono text-[10px] text-[#6B6B6B] mb-6 leading-relaxed">
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 bg-red-500 text-white font-mono text-[10px] tracking-widest uppercase py-3 hover:bg-red-600 transition-colors">
                DELETE
              </button>
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 btn-outline py-3">
                CANCEL
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
