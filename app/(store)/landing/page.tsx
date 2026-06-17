'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const WHITE_LOGO = 'https://res.cloudinary.com/dpl464cjn/image/upload/v1781282488/white-removebg-preview_lg1e3u.png';

// First 7: women artisans | Last 2: shop/product images
const IMAGES = [
  'https://res.cloudinary.com/dpl464cjn/image/upload/v1779182154/R_1_gohcbz.jpg',           // 0 – artisan (intro left)
  'https://res.cloudinary.com/dpl464cjn/image/upload/v1759836616/crafts_yjxn5y.jpg',         // 1 – artisan
  'https://res.cloudinary.com/dpl464cjn/image/upload/v1765202689/WhatsApp_Image_2025-10-30_at_02.32.16_4b7842dc_bh84dt.jpg', // 2 – artisan
  'https://res.cloudinary.com/dpl464cjn/image/upload/v1765202688/WhatsApp_Image_2025-10-30_at_02.32.15_6bf35ab9_hzenfs.jpg', // 3 – artisan
  'https://res.cloudinary.com/dpl464cjn/image/upload/v1765202687/WhatsApp_Image_2025-10-30_at_02.32.16_2c11cbc4_ydt67t.jpg', // 4 – artisan (split section)
  'https://res.cloudinary.com/dpl464cjn/image/upload/v1765202687/WhatsApp_Image_2025-10-30_at_02.32.19_6323d60d_mfpm1y.jpg', // 5 – artisan
  'https://res.cloudinary.com/dpl464cjn/image/upload/v1765202687/WhatsApp_Image_2025-10-30_at_02.32.19_c4b4b817_x5yspp.jpg', // 6 – artisan
  'https://res.cloudinary.com/dpl464cjn/image/upload/v1765202687/WhatsApp_Image_2025-10-30_at_02.32.18_3c51309e_nd4qtp.jpg', // 7 – shop/product (full bleed)
  'https://res.cloudinary.com/dpl464cjn/image/upload/v1765202687/WhatsApp_Image_2025-10-30_at_02.32.19_c4b4b817_x5yspp.jpg', // 8 – final CTA bg (reuse shop)
];

const VIDEO_URL = 'https://res.cloudinary.com/dpl464cjn/video/upload/v1781111445/haffy_jibhiv.mp4';

// ── Donation Modal ──────────────────────────────────────────────────────────
const DONATION_AMOUNTS = [10000, 25000, 50000, 100000];

function formatUGX(n: number) {
  return `UGX ${n.toLocaleString()}`;
}

function DonationModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<'amount' | 'details' | 'processing' | 'success' | 'error'>('amount');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [phone, setPhone] = useState('');
  const [payMethod, setPayMethod] = useState<'MOBILE_MONEY' | 'CARD'>('MOBILE_MONEY');
  const [errorMsg, setErrorMsg] = useState('');

  const amount = selectedAmount ?? (customAmount ? Number(customAmount.replace(/,/g, '')) : null);

  async function handleDonate() {
    if (!amount || amount < 1000) { setErrorMsg('Minimum donation is UGX 1,000'); return; }
    if (payMethod === 'MOBILE_MONEY' && !phone.trim()) { setErrorMsg('Please enter your phone number'); return; }
    setErrorMsg('');
    setStep('processing');

    try {
      // Create a pseudo order_id for donations
      const donationRef = `DONATION-${Date.now()}`;

      const res = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: donationRef,
          payment_method: payMethod,
          phone_number: payMethod === 'MOBILE_MONEY' ? phone : undefined,
          amount,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Payment failed. Please try again.');
        setStep('error');
        return;
      }

      // Card redirect
      if (payMethod === 'CARD' && data.redirect_url) {
        window.location.href = data.redirect_url;
        return;
      }

      setStep('success');
    } catch (e: any) {
      setErrorMsg(e.message || 'Something went wrong.');
      setStep('error');
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}>
      <div className="relative bg-[#0d0d0d] border border-white/10 w-full max-w-md p-8">
        {/* close */}
        <button onClick={onClose} className="absolute top-4 right-5 text-white/30 hover:text-white text-xl leading-none">✕</button>

        {step === 'amount' && (
          <>
            <p className="text-[9px] tracking-[0.5em] uppercase text-[#C4832A] mb-2">UWOBA FOUNDATION</p>
            <h2 className="text-[22px] font-light mb-2" style={{ fontFamily: 'Georgia, serif' }}>Support a woman artisan</h2>
            <p className="text-[11px] text-white/40 leading-relaxed mb-8">
              Your donation goes directly to Ugandan women weavers — helping them earn fair wages, access materials, and preserve their craft.
            </p>

            {/* preset amounts */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {DONATION_AMOUNTS.map((a) => (
                <button
                  key={a}
                  onClick={() => { setSelectedAmount(a); setCustomAmount(''); }}
                  className="border py-3 text-[11px] tracking-wider uppercase transition-all duration-200"
                  style={{
                    borderColor: selectedAmount === a ? '#C4832A' : 'rgba(255,255,255,0.15)',
                    color: selectedAmount === a ? '#C4832A' : 'rgba(255,255,255,0.6)',
                    background: selectedAmount === a ? 'rgba(196,131,42,0.08)' : 'transparent',
                  }}
                >
                  {formatUGX(a)}
                </button>
              ))}
            </div>

            {/* custom amount */}
            <input
              type="text"
              placeholder="Or enter custom amount (UGX)"
              value={customAmount}
              onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null); }}
              className="w-full bg-transparent border border-white/15 text-white/70 text-[12px] px-4 py-3 mb-6 outline-none focus:border-[#C4832A] placeholder-white/25 tracking-wide"
            />

            <button
              onClick={() => { if (!amount) return; setStep('details'); }}
              disabled={!amount}
              className="w-full py-4 text-[11px] tracking-[0.25em] uppercase font-bold transition-all duration-300"
              style={{
                background: amount ? '#C4832A' : 'rgba(255,255,255,0.1)',
                color: amount ? '#fff' : 'rgba(255,255,255,0.3)',
                cursor: amount ? 'pointer' : 'not-allowed',
              }}
            >
              {amount ? `Donate ${formatUGX(amount)} →` : 'Select an amount'}
            </button>
          </>
        )}

        {step === 'details' && (
          <>
            <p className="text-[9px] tracking-[0.5em] uppercase text-[#C4832A] mb-2">PAYMENT DETAILS</p>
            <h2 className="text-[22px] font-light mb-1" style={{ fontFamily: 'Georgia, serif' }}>Donating {formatUGX(amount!)}</h2>
            <p className="text-[11px] text-white/30 mb-8">Choose how you'd like to give.</p>

            {/* method toggle */}
            <div className="flex mb-6 border border-white/10">
              {(['MOBILE_MONEY', 'CARD'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setPayMethod(m)}
                  className="flex-1 py-3 text-[10px] tracking-[0.15em] uppercase transition-all duration-200"
                  style={{
                    background: payMethod === m ? '#C4832A' : 'transparent',
                    color: payMethod === m ? '#fff' : 'rgba(255,255,255,0.4)',
                  }}
                >
                  {m === 'MOBILE_MONEY' ? 'Mobile Money' : 'Card'}
                </button>
              ))}
            </div>

            {payMethod === 'MOBILE_MONEY' && (
              <input
                type="tel"
                placeholder="Phone number (e.g. 0781234567)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-transparent border border-white/15 text-white/70 text-[12px] px-4 py-3 mb-6 outline-none focus:border-[#C4832A] placeholder-white/25 tracking-wide"
              />
            )}

            {errorMsg && <p className="text-[11px] text-red-400 mb-4">{errorMsg}</p>}

            <button
              onClick={handleDonate}
              className="w-full bg-[#C4832A] text-white py-4 text-[11px] tracking-[0.25em] uppercase font-bold hover:bg-white hover:text-black transition-all duration-300 mb-3"
            >
              Confirm Donation →
            </button>
            <button onClick={() => setStep('amount')} className="w-full text-[10px] text-white/25 hover:text-white/50 tracking-wider uppercase py-2 transition-colors">
              ← Change amount
            </button>
          </>
        )}

        {step === 'processing' && (
          <div className="text-center py-10">
            <div className="w-10 h-10 border-t border-[#C4832A] rounded-full animate-spin mx-auto mb-6" />
            <p className="text-[12px] text-white/50 tracking-wider">Processing your donation…</p>
            {payMethod === 'MOBILE_MONEY' && (
              <p className="text-[11px] text-white/30 mt-3 tracking-wide">Check your phone for a payment prompt.</p>
            )}
          </div>
        )}

        {step === 'success' && (
          <div className="text-center py-8">
            <div className="w-14 h-14 rounded-full border border-[#C4832A] flex items-center justify-center mx-auto mb-6">
              <span className="text-[#C4832A] text-2xl">✓</span>
            </div>
            <h2 className="text-[24px] font-light mb-3" style={{ fontFamily: 'Georgia, serif' }}>Thank you.</h2>
            <p className="text-[12px] text-white/40 leading-relaxed mb-8 max-w-xs mx-auto">
              Your generosity helps Ugandan women weavers earn fair livelihoods and keep their craft alive.
            </p>
            <button onClick={onClose} className="text-[10px] tracking-[0.25em] uppercase text-[#C4832A] border-b border-[#C4832A]/40 pb-0.5">
              Close
            </button>
          </div>
        )}

        {step === 'error' && (
          <div className="text-center py-8">
            <p className="text-[13px] text-white/60 mb-4">Payment could not be completed.</p>
            {errorMsg && <p className="text-[11px] text-red-400 mb-6">{errorMsg}</p>}
            <button
              onClick={() => setStep('details')}
              className="bg-[#C4832A] text-white text-[11px] tracking-[0.2em] uppercase px-8 py-3 hover:bg-white hover:text-black transition-all"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Landing Page ────────────────────────────────────────────────────────────
export default function LandingPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [donateOpen, setDonateOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Attempt to load video programmatically for better cross-browser support
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.load();
    const onCanPlay = () => setVideoLoaded(true);
    const onError = () => setVideoError(true);
    v.addEventListener('canplay', onCanPlay);
    v.addEventListener('error', onError);
    return () => {
      v.removeEventListener('canplay', onCanPlay);
      v.removeEventListener('error', onError);
    };
  }, []);

  return (
    <div className="bg-black text-white min-h-screen overflow-x-hidden" style={{ fontFamily: 'var(--font-mono)' }}>

      {donateOpen && <DonationModal onClose={() => setDonateOpen(false)} />}

      {/* NAV */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 h-14 transition-all duration-500"
        style={{ background: `rgba(0,0,0,${Math.min(scrollY / 150, 0.9)})`, backdropFilter: 'blur(10px)' }}
      >
        <img src={WHITE_LOGO} alt="Uwoba Uganda Women's Basketry Association" className="h-9 w-auto object-contain" />
        <div className="flex items-center gap-4">
          <button
            onClick={() => setDonateOpen(true)}
            className="text-[10px] tracking-[0.2em] uppercase bg-[#C4832A]/20 border border-[#C4832A]/50 text-[#C4832A] px-4 py-2 hover:bg-[#C4832A] hover:text-white transition-all duration-300"
          >
            DONATE ♥
          </button>
          <Link href="/shop"
            className="text-[10px] tracking-[0.2em] uppercase border border-white/40 px-5 py-2 hover:bg-white hover:text-black transition-all duration-300">
            SHOP →
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Video hero – show fallback image if video fails */}
        {!videoError && (
          <video
            ref={videoRef}
            src={VIDEO_URL}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
            style={{ opacity: videoLoaded ? 1 : 0 }}
          />
        )}
        {/* Fallback image shown while video loads or if it errors */}
        <img
          src={IMAGES[0]}
          alt="Ugandan woman artisan with handwoven basket"
          className="absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-1000"
          style={{ opacity: videoLoaded && !videoError ? 0 : 1 }}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-black/80" />

        <div
          className="relative z-10 text-center px-6"
          style={{ transform: `translateY(${scrollY * 0.25}px)`, opacity: Math.max(0, 1 - scrollY / 600) }}
        >
          <p className="text-[9px] md:text-[10px] tracking-[0.5em] uppercase text-white/50 mb-6">
            CULTURE · CRAFT · COMMUNITY
          </p>
          <img src={WHITE_LOGO} alt="Uwoba Uganda Women's Basketry Association" className="h-32 md:h-48 w-auto object-contain mx-auto mb-6" />
          <p className="text-[13px] md:text-[15px] tracking-[0.15em] text-white/70 mb-3"
            style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
            Handwoven Baskets
          </p>
          <p className="text-[11px] md:text-[12px] tracking-[0.25em] uppercase text-white/40 mb-12">
            Handmade in Uganda by women artisans using age-old weaving traditions.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link href="/shop"
              className="bg-[#C4832A] text-white text-[11px] tracking-[0.25em] uppercase px-10 py-4 hover:bg-white hover:text-black transition-all duration-300 font-bold">
              SHOP NOW
            </Link>
            <button
              onClick={() => setDonateOpen(true)}
              className="text-white text-[11px] tracking-[0.25em] uppercase px-10 py-4 border border-white/40 hover:border-[#C4832A] hover:text-[#C4832A] transition-all duration-300 font-bold"
            >
              DONATE ♥
            </button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2"
          style={{ opacity: Math.max(0, 1 - scrollY / 200) }}>
          <div className="w-px h-14 bg-gradient-to-b from-white/0 to-white/40 mx-auto" />
        </div>
      </section>

      {/* INTRO — image left, text right */}
      <section id="story" className="grid grid-cols-1 md:grid-cols-2 min-h-[70vh]">
        <div className="relative overflow-hidden min-h-[60vw] md:min-h-0">
          <img src={IMAGES[3]} alt="Woman weaving a basket in Uganda" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-black/10" />
        </div>
        <div className="bg-[#080808] flex flex-col justify-center px-8 md:px-16 py-16 md:py-0">
          <p className="text-[9px] tracking-[0.5em] uppercase text-[#C4832A] mb-8">THE COLLECTION</p>
          <h2 className="text-[26px] md:text-[44px] font-light leading-tight mb-8"
            style={{ fontFamily: 'Georgia, serif' }}>
            Woven by women.<br />Loved around the world.
          </h2>
          <p className="text-[12px] text-white/40 leading-[2.2] tracking-wider mb-10">
            Each basket is hand-crafted from locally harvested grasses and fibers, reflecting the heritage and resilience of Ugandan women.
            Every piece is made with care, purpose, and a story you can feel in your home.
          </p>
          <Link href="/shop"
            className="self-start text-[11px] tracking-[0.2em] uppercase border-b border-white/20 pb-0.5 hover:border-[#C4832A] hover:text-[#C4832A] transition-all duration-300">
            SHOP NOW →
          </Link>
        </div>
      </section>

      {/* FULL BLEED IMAGE */}
      <section className="h-[75vh] md:h-screen relative overflow-hidden">
        <img src={IMAGES[7]} alt="Handwoven baskets displayed" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-10 left-6 md:left-12">
          <p className="text-[9px] tracking-[0.4em] uppercase text-white/40 mb-2">HANDCRAFTED IN UGANDA</p>
          <p className="text-[22px] md:text-[36px] font-light" style={{ fontFamily: 'Georgia, serif' }}>
            Woven from tradition.<br />Shared with pride.
          </p>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="py-24 md:py-32 px-6 md:px-12">
        <p className="text-[9px] tracking-[0.5em] uppercase text-[#C4832A] text-center mb-20">WHY UWOBA BASKETRY</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {[
            { num: '01', title: 'Empowers Women', desc: 'Every purchase supports Ugandan artisans and strengthens community income.' },
            { num: '02', title: 'Sustainable Craft', desc: 'Made with natural grasses, reeds, and dyes grown with respect for the land.' },
            { num: '03', title: 'Heritage Skill', desc: 'Handwoven using techniques passed down through generations of women.' },
            { num: '04', title: 'Unique by Nature', desc: 'No two baskets are the same — each one tells its own story.' },
          ].map((b) => (
            <div key={b.num} className="border-t border-white/10 pt-6">
              <p className="font-mono text-[10px] tracking-[0.2em] text-white/20 mb-4">{b.num}</p>
              <p className="font-mono text-[11px] tracking-[0.12em] uppercase mb-3 font-bold">{b.title}</p>
              <p className="font-mono text-[11px] text-white/35 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* IMAGE TRIO — women artisans */}
      <section className="grid grid-cols-3 gap-0">
        {[IMAGES[1], IMAGES[2], IMAGES[6]].map((src, i) => (
          <div key={i} className="relative overflow-hidden group" style={{ aspectRatio: '1' }}>
            <img src={src} alt="Ugandan basketry and woven craft" className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all duration-500" />
          </div>
        ))}
      </section>

      {/* QUOTE */}
      <section className="py-24 md:py-40 px-6 md:px-12 text-center max-w-4xl mx-auto">
        <p className="text-[9px] tracking-[0.5em] uppercase text-white/20 mb-10">WHAT PEOPLE SAY</p>
        <blockquote className="text-[20px] md:text-[30px] font-light leading-relaxed text-white/80"
          style={{ fontFamily: 'Georgia, serif' }}>
          "Every basket feels alive with the hands that made it. The colors, the weave, the care — it brings Uganda into our home."
        </blockquote>
        <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/25 mt-8">— KAMPALA, UGANDA</p>
      </section>

      {/* SPLIT SECTION — Our Story */}
      <section className="grid grid-cols-1 md:grid-cols-2 min-h-[85vh]">
        <div className="relative overflow-hidden min-h-[55vw] md:min-h-0">
          <img src={IMAGES[4]} alt="Ugandan artisan with woven basket" className="w-full h-full object-cover object-top" />
        </div>
        <div className="bg-[#080808] flex flex-col justify-center px-8 md:px-16 py-16 md:py-0">
          <p className="text-[9px] tracking-[0.5em] uppercase text-[#C4832A] mb-6">OUR STORY</p>
          <h3 className="text-[26px] md:text-[40px] font-light leading-snug mb-6"
            style={{ fontFamily: 'Georgia, serif' }}>
            From the heart<br />of Uganda.
          </h3>
          <p className="font-mono text-[12px] text-white/35 leading-[2.2] tracking-wider mb-10">
            Uwoba brings authentic basketry from women artisans across Uganda to your home.
            Every order nurtures local craft, preserves cultural storytelling, and helps women build independent livelihoods.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/shop"
              className="self-start font-mono text-[11px] tracking-[0.2em] uppercase border-b border-white/20 pb-0.5 hover:border-[#C4832A] hover:text-[#C4832A] transition-all duration-300">
              SHOP NOW →
            </Link>
            <button
              onClick={() => setDonateOpen(true)}
              className="self-start font-mono text-[11px] tracking-[0.2em] uppercase border-b border-[#C4832A]/40 pb-0.5 text-[#C4832A]/70 hover:text-[#C4832A] hover:border-[#C4832A] transition-all duration-300"
            >
              DONATE ♥
            </button>
          </div>
        </div>
      </section>

      {/* DONATION IMPACT STRIP */}
      <section className="py-20 px-6 md:px-12 border-t border-b border-white/5">
        <p className="text-[9px] tracking-[0.5em] uppercase text-[#C4832A] text-center mb-14">YOUR DONATION GOES DIRECTLY TO</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto text-center">
          {[
            { figure: 'UGX 10K', label: 'Covers materials for one basket' },
            { figure: 'UGX 25K', label: 'Funds a day\'s wages for an artisan' },
            { figure: 'UGX 100K', label: 'Supports a weaver for a full week' },
          ].map((item) => (
            <div key={item.figure}>
              <p className="text-[32px] md:text-[40px] font-light text-[#C4832A] mb-2" style={{ fontFamily: 'Georgia, serif' }}>{item.figure}</p>
              <p className="text-[11px] text-white/35 tracking-wider uppercase">{item.label}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-14">
          <button
            onClick={() => setDonateOpen(true)}
            className="inline-block border border-[#C4832A] text-[#C4832A] font-mono text-[11px] tracking-[0.25em] uppercase px-12 py-4 hover:bg-[#C4832A] hover:text-white transition-all duration-300"
          >
            MAKE A DONATION
          </button>
        </div>
      </section>

      {/* ARTISANS HORIZONTAL STRIP */}
      <section className="py-20 overflow-hidden">
        <p className="text-[9px] tracking-[0.5em] uppercase text-white/20 text-center mb-12">THE WOMEN BEHIND THE BASKETS</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1 px-1">
          {[IMAGES[0], IMAGES[2], IMAGES[4], IMAGES[5]].map((src, i) => (
            <div key={i} className="relative overflow-hidden" style={{ aspectRatio: '3/4' }}>
              <img src={src} alt="Uwoba woman artisan" className="w-full h-full object-cover object-top" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative py-28 md:py-40 overflow-hidden">
        <img src={IMAGES[6]} alt="Ugandan basketry" className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 text-center px-6">
          <img src={WHITE_LOGO} alt="Uwoba Uganda Women's Basketry Association" className="h-14 w-auto object-contain mx-auto mb-8 opacity-60" />
          <h2 className="text-[32px] md:text-[60px] font-light mb-10 leading-tight"
            style={{ fontFamily: 'Georgia, serif' }}>
            Bring home story-rich<br />basketry from Uganda.
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link href="/shop"
              className="inline-block bg-white text-black font-mono text-[11px] tracking-[0.25em] uppercase px-14 py-5 hover:bg-[#C4832A] hover:text-white transition-all duration-300 font-bold">
              SHOP UWOBA COLLECTION
            </Link>
            <button
              onClick={() => setDonateOpen(true)}
              className="inline-block border border-white/40 text-white font-mono text-[11px] tracking-[0.25em] uppercase px-14 py-5 hover:border-[#C4832A] hover:text-[#C4832A] transition-all duration-300 font-bold"
            >
              DONATE ♥
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/8 px-6 md:px-12 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <img src={WHITE_LOGO} alt="Uwoba Uganda Women's Basketry Association" className="h-8 w-auto object-contain opacity-50" />
        <p className="font-mono text-[10px] text-white/25 tracking-wider">Kampala, Uganda</p>
        <p className="font-mono text-[9px] text-white/15 tracking-wider">© 2026 UWOBA</p>
      </footer>
    </div>
  );
}