'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminStore } from '@/store/admin';

export default function AdminLoginPage() {
  const { isAuthenticated, login } = useAdminStore();
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) router.push('/admin/dashboard');
  }, [isAuthenticated]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      login(data.token);
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center px-5">
      <div className="w-full max-w-sm animate-fade-up">
        <div className="text-center mb-12">
          <p className="font-mono text-[13px] tracking-[0.3em] uppercase text-white font-bold">RHEA</p>
          <p className="font-mono text-[9px] tracking-[0.2em] text-white/30 mt-1 uppercase">Admin Access</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="USERNAME"
              className="w-full bg-transparent border-b border-white/20 pb-3 font-mono text-[11px] tracking-[0.15em] text-white placeholder:text-white/30 outline-none focus:border-white/60 transition-colors"
              required
            />
          </div>
          <div>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="PASSWORD"
              className="w-full bg-transparent border-b border-white/20 pb-3 font-mono text-[11px] tracking-[0.15em] text-white placeholder:text-white/30 outline-none focus:border-white/60 transition-colors"
              required
            />
          </div>

          {error && (
            <p className="font-mono text-[10px] tracking-wider text-red-400 uppercase">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--gold)] text-white font-mono text-[11px] tracking-[0.2em] uppercase py-4 hover:bg-[var(--gold-light)] transition-colors disabled:opacity-50"
          >
            {loading ? 'SIGNING IN...' : 'SIGN IN'}
          </button>
        </form>
      </div>
    </div>
  );
}
