import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

function formatUgandaPhone(phone: string): string {
  const cleaned = phone.replace(/\s+/g, '').replace(/[^0-9+]/g, '');
  if (cleaned.startsWith('+256')) return cleaned;
  if (cleaned.startsWith('256')) return `+${cleaned}`;
  if (cleaned.startsWith('0')) return `+256${cleaned.slice(1)}`;
  // bare 9-digit number like 781492406
  return `+256${cleaned}`;
}
export async function POST(req: NextRequest) {
  try {
    const { order_id, payment_method, phone_number, amount } = await req.json();

    if (!order_id || !payment_method || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const MARZ_API_URL = process.env.MARZ_API_URL || 'https://wallet.wearemarz.com/api/v1';
    const MARZ_BASIC_AUTH = process.env.MARZ_BASIC_AUTH || '';
    const AUTH_HEADER = MARZ_BASIC_AUTH.startsWith('Basic ')
      ? MARZ_BASIC_AUTH
      : `Basic ${MARZ_BASIC_AUTH}`;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://rhea-tan.vercel.app';

    if (!MARZ_BASIC_AUTH) {
      return NextResponse.json({
        success: true, payment_method,
        reference: crypto.randomUUID(),
        status: 'sandbox', is_sandbox: true, redirect_url: null,
      });
    }

    const supabase = getServiceSupabase();
    const reference = crypto.randomUUID();
    const callbackUrl = `${appUrl}/api/payments/webhook`;

    let body: Record<string, any>;

    if (payment_method === 'CARD') {
      body = {
        amount: Math.round(amount),
        method: 'card',
        reference,
        country: 'UG',
        description: `Rhea Beauty Shop - Order ${order_id}`,
        callback_url: callbackUrl,
      };
    } else {
      if (!phone_number) {
        return NextResponse.json({ error: 'Phone number required for mobile money' }, { status: 400 });
      }
      const formattedPhone = formatUgandaPhone(String(phone_number));
      console.log('Formatted phone:', formattedPhone);

      body = {
        amount: Math.round(amount),
        method: 'mobile_money',
        phone_number: formattedPhone,
        reference,
        country: 'UG',
        description: `Rhea Beauty Shop - Order ${order_id}`,
        callback_url: callbackUrl,
      };
    }

    console.log('Marz request body:', JSON.stringify(body, null, 2));
    console.log('Auth header prefix:', AUTH_HEADER.substring(0, 12));

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    let marzRes: Response;
    try {
      marzRes = await fetch(`${MARZ_API_URL}/collect-money`, {
        method: 'POST',
        headers: {
          'Authorization': AUTH_HEADER,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    const responseText = await marzRes.text();
    console.log('Marz response status:', marzRes.status);
    console.log('Marz response body:', responseText);

    let marzData: any;
    try {
      marzData = JSON.parse(responseText);
    } catch {
      return NextResponse.json({
        error: 'Invalid response from payment provider',
        raw: responseText.slice(0, 300),
      }, { status: 502 });
    }

    if (marzData.status !== 'success') {
      return NextResponse.json({
        error: marzData.message || 'Payment initiation failed',
        details: marzData,
      }, { status: 400 });
    }

    const marzUuid = marzData.data?.transaction?.uuid;
    const redirectUrl = marzData.data?.redirect_url;
    const txStatus = marzData.data?.transaction?.status;
    const isSandbox = txStatus === 'sandbox';

    if (supabase) {
      await supabase.from('orders').update({
        payment_reference: reference,
        marz_transaction_uuid: marzUuid,
        payment_status: isSandbox ? 'PAID' : 'PROCESSING',
        ...(isSandbox ? { order_status: 'CONFIRMED' } : {}),
      }).eq('id', order_id);
    }

    return NextResponse.json({
      success: true, payment_method, reference,
      marz_uuid: marzUuid, status: txStatus,
      redirect_url: redirectUrl || null,
      is_sandbox: isSandbox,
    });

  } catch (err: any) {
    if (err.name === 'AbortError' || err?.cause?.code === 'UND_ERR_CONNECT_TIMEOUT') {
      return NextResponse.json({
        error: 'Payment provider unreachable. Please try again.',
        code: 'NETWORK_TIMEOUT',
      }, { status: 503 });
    }
    console.error('Payment initiation error:', err);
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}