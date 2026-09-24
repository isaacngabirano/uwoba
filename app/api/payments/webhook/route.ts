//this is D:\projectss\uwoba\app\api\payments\webhook\route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('Marz webhook received:', JSON.stringify(body, null, 2));

    const supabase = getServiceSupabase();
    if (!supabase) return NextResponse.json({ received: true });

    const reference = body?.data?.transaction?.reference || body?.reference;
    const status = body?.data?.transaction?.status || body?.status;
    const marzUuid = body?.data?.transaction?.uuid || body?.uuid;

    if (!reference && !marzUuid) {
      console.error('Webhook missing reference/uuid');
      return NextResponse.json({ received: true });
    }

    const paymentStatus = mapStatus(status);

    // Find order by payment_reference or marz_transaction_uuid
    let query = supabase
      .from('orders')
      .select('id, order_number, customer_name, customer_phone, total, payment_method');

    if (reference) {
      query = query.eq('payment_reference', reference);
    } else {
      query = query.eq('marz_transaction_uuid', marzUuid);
    }

    const { data: orders } = await query.limit(1);
    const order = orders?.[0];

    if (!order) {
      console.error('Order not found for reference:', reference, 'uuid:', marzUuid);
      return NextResponse.json({ received: true });
    }

    // Update order
    await supabase
      .from('orders')
      .update({
        payment_status: paymentStatus,
        ...(paymentStatus === 'PAID' ? { order_status: 'CONFIRMED' } : {}),
        marz_transaction_uuid: marzUuid || undefined,
      })
      .eq('id', order.id);

    console.log(`Order ${order.order_number} updated to ${paymentStatus}`);

    if (paymentStatus === 'PAID') {
      await sendWhatsAppNotification(order);
    }

    return NextResponse.json({ received: true, order_id: order.id, status: paymentStatus });

  } catch (err: any) {
    console.error('Webhook error:', err);
    return NextResponse.json({ received: true });
  }
}

// Handle card payment redirect-back
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const reference = searchParams.get('reference');
  const status = searchParams.get('status');

  if (reference) {
    const supabase = getServiceSupabase();
    if (supabase) {
      const paymentStatus = mapStatus(status || 'successful');
      await supabase
        .from('orders')
        .update({ payment_status: paymentStatus })
        .eq('payment_reference', reference);
    }
  }

  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || '').replace(/\/$/, '');
  return Response.redirect(`${appUrl}/order-confirmation?ref=${reference}`);
}

function mapStatus(marzStatus: string): string {
  const map: Record<string, string> = {
    successful: 'PAID',
    success: 'PAID',
    completed: 'PAID',
    sandbox: 'PAID',
    failed: 'FAILED',
    cancelled: 'FAILED',
    processing: 'PROCESSING',
    pending: 'PROCESSING',
  };
  return map[marzStatus?.toLowerCase()] || 'PROCESSING';
}

async function sendWhatsAppNotification(order: any) {
  const apiKey = process.env.CALLMEBOT_API_KEY;
  const adminPhone = process.env.ADMIN_WHATSAPP_NUMBER;
  if (!apiKey || !adminPhone) {
    console.warn('WhatsApp not configured — missing CALLMEBOT_API_KEY or ADMIN_WHATSAPP_NUMBER');
    return;
  }

  const method = order.payment_method || 'Mobile Money';
  const total = Number(order.total).toLocaleString();

  const message = [
    `🧺 NEW ORDER — UWOBA`,
    ``,
    `Order: ${order.order_number}`,
    `Customer: ${order.customer_name}`,
    `Phone: ${order.customer_phone}`,
    `Total: UGX ${total}`,
    `Payment: ${method}`,
    ``,
    `✅ Payment confirmed. Prepare for delivery.`,
  ].join('\n');

  const url = `https://api.callmebot.com/whatsapp.php?phone=${adminPhone}&text=${encodeURIComponent(message)}&apikey=${apiKey}`;

  try {
    const res = await fetch(url);
    console.log('WhatsApp notification sent, status:', res.status);
  } catch (e) {
    console.error('WhatsApp notification failed:', e);
  }
}