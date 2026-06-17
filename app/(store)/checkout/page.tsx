'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart';
import { formatPrice, DELIVERY_FEE } from '@/lib/utils';
import Navbar from '@/components/store/Navbar';

type PaymentMethod = 'MTN' | 'AIRTEL' | 'CARD';
type CheckoutStep = 'details' | 'processing' | 'awaiting';

function Skeleton() {
  return (
    <div className="min-h-screen px-5 md:px-10 py-10 max-w-5xl mx-auto animate-pulse">
      <div className="h-4 w-16 bg-[#F0F0F0] mb-10" />
      <div className="grid md:grid-cols-2 gap-16">
        <div className="space-y-6">
          <div className="h-3 w-20 bg-[#F0F0F0]" />
          <div className="h-px bg-[#F0F0F0] w-full" />
          <div className="h-12 bg-[#F0F0F0] w-full mt-8" />
        </div>
        <div className="space-y-4">
          <div className="flex gap-4"><div className="w-16 h-16 bg-[#F0F0F0]" /><div className="flex-1 space-y-2 pt-1"><div className="h-3 bg-[#F0F0F0] w-3/4" /><div className="h-3 bg-[#F0F0F0] w-1/2" /></div></div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<CheckoutStep>('details');
  const [orderNumber, setOrderNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSandbox, setIsSandbox] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', address: '',
    paymentMethod: 'MTN' as PaymentMethod,
    momoPhone: '',
  });

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <><Navbar /><Skeleton /></>;

  const subtotal = totalPrice();
  const total = subtotal + DELIVERY_FEE;

  if (items.length === 0 && step === 'details') return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="font-mono text-[11px] tracking-widest uppercase text-[var(--light)]">Your cart is empty</p>
        <button onClick={() => router.push('/shop')} className="nav-link active">← SHOP</button>
      </div>
    </>
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address) { setError('Please fill all required fields.'); return; }
    if (form.paymentMethod !== 'CARD' && !form.momoPhone) { setError('Please enter your mobile money number.'); return; }
    setLoading(true); setError('');

    try {
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: form.name, customer_email: form.email,
          customer_phone: form.phone, delivery_address: form.address,
          payment_method: form.paymentMethod,
          items: items.map(i => ({
            product_id: i.product.id, product_name: i.product.name,
            product_code: i.product.code, quantity: i.quantity,
            unit_price: i.product.price, subtotal: i.product.price * i.quantity,
          })),
          subtotal, delivery_fee: DELIVERY_FEE, total,
        }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error || 'Failed to create order');
      setOrderNumber(orderData.order_number);
      setStep('processing');

      const payRes = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderData.order_id,
          payment_method: form.paymentMethod,
          phone_number: form.paymentMethod !== 'CARD' ? form.momoPhone : undefined,
          amount: total,
        }),
      });
      const payData = await payRes.json();

      if (!payRes.ok) {
        throw new Error(
          payData.code === 'NETWORK_TIMEOUT'
            ? 'Cannot reach payment provider from localhost. Deploy to Vercel to test real payments.'
            : payData.error || 'Payment failed'
        );
      }

      clearCart();

      if (form.paymentMethod === 'CARD' && payData.redirect_url) {
        window.location.href = payData.redirect_url;
        return;
      }

      setIsSandbox(!!payData.is_sandbox);
      setStep('awaiting');
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
      setStep('details');
    } finally {
      setLoading(false);
    }
  }

  if (step === 'processing') return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center gap-5 text-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#E0E0E0] border-t-[var(--charcoal)] animate-spin" />
        <p className="font-mono text-[11px] tracking-[0.2em] uppercase">Connecting to payment provider...</p>
      </div>
    </>
  );

  if (step === 'awaiting') return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center gap-8 px-6 text-center max-w-sm mx-auto">
        <div className="w-16 h-16 border border-[var(--charcoal)] rounded-full flex items-center justify-center text-2xl">
          {isSandbox ? '🧪' : '📱'}
        </div>

        {isSandbox ? (
          <div className="space-y-3">
            <p className="font-mono text-[12px] tracking-widest uppercase font-bold">Sandbox Mode</p>
            <p className="font-mono text-[11px] text-[var(--mid)] leading-relaxed">
              Your Marz account is in test mode. No real prompt will be sent to a phone.
            </p>
            <div className="border border-amber-200 bg-amber-50 rounded px-4 py-3 text-left">
              <p className="font-mono text-[9px] tracking-wider text-amber-700 uppercase font-bold mb-1">🧪 Test Mode</p>
              <p className="font-mono text-[9px] text-amber-600 leading-relaxed">
                Activate your Marz account to go live and send real payment prompts.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="font-mono text-[12px] tracking-widest uppercase font-bold">Check your phone</p>
            <p className="font-mono text-[11px] text-[var(--mid)] leading-relaxed">
              A {form.paymentMethod} Mobile Money prompt has been sent to{' '}
              <span className="font-bold text-[var(--charcoal)]">+256{form.momoPhone}</span>.
              <br /><br />
              Open your phone and approve the payment to complete your order.
            </p>
          </div>
        )}

        <div className="w-full border-t border-[#EBEBEB] pt-5 space-y-2 text-left">
          <div className="flex justify-between"><span className="font-mono text-[10px] uppercase text-[var(--light)]">Order</span><span className="font-mono text-[11px]">{orderNumber}</span></div>
          <div className="flex justify-between"><span className="font-mono text-[10px] uppercase text-[var(--light)]">Amount</span><span className="font-mono text-[11px]">{formatPrice(total)}</span></div>
          <div className="flex justify-between"><span className="font-mono text-[10px] uppercase text-[var(--light)]">Method</span><span className="font-mono text-[11px]">{form.paymentMethod} Mobile Money</span></div>
        </div>

        <button onClick={() => router.push(`/order-confirmation?order=${orderNumber}`)} className="btn-gold w-full">
          {isSandbox ? 'SIMULATE SUCCESS →' : "I'VE APPROVED — VIEW ORDER →"}
        </button>

        {!isSandbox && (
          <p className="font-mono text-[9px] text-[var(--light)] uppercase tracking-wider">
            No prompt?{' '}
            <button onClick={() => setStep('details')} className="underline hover:text-[var(--charcoal)]">Go back</button>
          </p>
        )}
      </div>
    </>
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen px-5 md:px-10 py-10 max-w-5xl mx-auto">
        <button onClick={() => router.back()} className="nav-link active mb-10 block">← BACK</button>
        <h1 className="font-mono text-[11px] tracking-[0.25em] uppercase mb-10">CHECKOUT</h1>

        <div className="grid md:grid-cols-2 gap-16">
          <form onSubmit={handleSubmit} className="space-y-8 animate-fade-up">
            <div>
              <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-[var(--light)] mb-4">CONTACT</p>
              <div className="space-y-4">
                <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name *" className="input-field" required />
                <input name="email" value={form.email} onChange={handleChange} placeholder="Email (optional)" className="input-field" type="email" />
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number *" className="input-field" required />
              </div>
            </div>

            <div>
              <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-[var(--light)] mb-4">DELIVERY</p>
              <textarea name="address" value={form.address} onChange={handleChange}
                placeholder="Delivery Address *" className="input-field resize-none" rows={3} required />
            </div>

            <div>
              <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-[var(--light)] mb-4">PAYMENT METHOD</p>
              <div className="space-y-3">
                {(['MTN', 'AIRTEL', 'CARD'] as PaymentMethod[]).map(method => (
                  <label key={method} className="flex items-center gap-4 cursor-pointer">
                    <div className={`w-4 h-4 border rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${form.paymentMethod === method ? 'border-[var(--charcoal)]' : 'border-[#D0D0D0]'}`}>
                      {form.paymentMethod === method && <div className="w-2 h-2 rounded-full bg-[var(--charcoal)]" />}
                    </div>
                    <input type="radio" name="paymentMethod" value={method}
                      checked={form.paymentMethod === method}
                      onChange={() => setForm(p => ({ ...p, paymentMethod: method, momoPhone: '' }))}
                      className="sr-only" />
                    <span className="font-mono text-[11px] tracking-widest uppercase">
                      {method === 'MTN' ? 'MTN Mobile Money' : method === 'AIRTEL' ? 'Airtel Money' : 'Card (Visa / Mastercard)'}
                    </span>
                  </label>
                ))}
              </div>

              {form.paymentMethod !== 'CARD' && (
                <div className="mt-5 space-y-2">
                  <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-[var(--light)]">{form.paymentMethod} NUMBER *</p>
                  <div className="flex items-end gap-2">
                    <span className="font-mono text-[12px] text-[var(--mid)] pb-3 border-b border-[#D9D9D9] flex-shrink-0">+256</span>
                    <input
                      value={form.momoPhone}
                      onChange={e => {
                        let val = e.target.value.replace(/\D/g, '');
                        if (val.startsWith('256')) val = val.slice(3);
                        if (val.startsWith('0')) val = val.slice(1);
                        setForm(p => ({ ...p, momoPhone: val }));
                      }}
                      placeholder={form.paymentMethod === 'MTN' ? '77XXXXXXX' : '70XXXXXXX'}
                      className="input-field flex-1" maxLength={9} required
                    />
                  </div>
                  <p className="font-mono text-[9px] text-[var(--light)] tracking-wider">
                    {form.paymentMethod === 'MTN' ? 'MTN: 076, 077, 078, 031, 039' : 'Airtel: 070, 071, 072, 073, 074, 075'}
                  </p>
                </div>
              )}

              {form.paymentMethod === 'CARD' && (
                <p className="font-mono text-[9px] text-[var(--light)] mt-3 tracking-wider leading-relaxed">
                  You will be redirected to the Marz secure card gateway.
                </p>
              )}
            </div>

            {error && (
              <div className="border border-red-100 bg-red-50 px-4 py-3">
                <p className="font-mono text-[10px] text-red-600">{error}</p>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-gold">
              {loading ? (
                <span className="flex items-center gap-3 justify-center">
                  <span className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  PROCESSING...
                </span>
              ) : form.paymentMethod === 'CARD'
                ? `PAY WITH CARD — ${formatPrice(total)}`
                : `PAY ${formatPrice(total)} VIA ${form.paymentMethod}`}
            </button>
          </form>

          <div className="animate-fade-up stagger-2">
            <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-[var(--light)] mb-6">ORDER SUMMARY</p>
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.product.id} className="flex gap-4">
                  <div className="w-16 h-16 bg-[#F8F8F8] flex-shrink-0 overflow-hidden">
                    {item.product.image_url
                      ? <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center"><span className="font-mono text-[8px] text-[#CFCFCF]">{item.product.category}</span></div>}
                  </div>
                  <div className="flex-1">
                    <p className="font-mono text-[11px] uppercase font-bold">{item.product.name}</p>
                    <p className="font-mono text-[10px] text-[var(--light)] mt-0.5">QTY {item.quantity}</p>
                  </div>
                  <p className="font-mono text-[11px] text-[var(--mid)]">{formatPrice(item.product.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-[#EBEBEB] space-y-3">
              <div className="flex justify-between"><span className="font-mono text-[10px] uppercase text-[var(--light)]">SUBTOTAL</span><span className="font-mono text-[11px]">{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between"><span className="font-mono text-[10px] uppercase text-[var(--light)]">DELIVERY</span><span className="font-mono text-[11px]">{formatPrice(DELIVERY_FEE)}</span></div>
              <div className="flex justify-between pt-3 border-t border-[#EBEBEB]">
                <span className="font-mono text-[12px] uppercase font-bold">TOTAL</span>
                <span className="font-mono text-[13px] font-bold">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
