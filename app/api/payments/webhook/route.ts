import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('Marz webhook received:', JSON.stringify(body, null, 2));

    const supabase = getServiceSupabase();
    if (!supabase) return NextResponse.json({ received: true });

    // Marz sends transaction data in webhook
    const reference = body?.data?.transaction?.reference || body?.reference;
    const status = body?.data?.transaction?.status || body?.status;
    const marzUuid = body?.data?.transaction?.uuid || body?.uuid;

    if (!reference && !marzUuid) {
      console.error('Webhook missing reference/uuid');
      return NextResponse.json({ received: true });
    }

    // Map Marz status to our status
    const paymentStatus = mapStatus(status);

    // Find order by payment_reference or marz_transaction_uuid
    let query = supabase.from('orders').select('id, order_number, customer_name, customer_phone, total');

    if (reference) {
      // Try as UUID first
      try { query = query.eq('payment_reference', reference); }
      catch { query = query.eq('marz_transaction_id', reference); }
    } else {
      query = query.eq('marz_transaction_uuid', marzUuid);
    }

    const { data: orders } = await query.limit(1);
    const order = orders?.[0];

    if (!order) {
      console.error('Order not found for reference:', reference, 'uuid:', marzUuid);
      return NextResponse.json({ received: true });
    }

    // Update order payment status
    await supabase
      .from('orders')
      .update({
        payment_status: paymentStatus,
        order_status: paymentStatus === 'PAID' ? 'CONFIRMED' : undefined,
        marz_transaction_uuid: marzUuid || undefined,
      })
      .eq('id', order.id);

    console.log(`Order ${order.order_number} updated to ${paymentStatus}`);

    // Send WhatsApp if payment confirmed
    if (paymentStatus === 'PAID') {
      await sendWhatsAppNotification(order);
    }

    return NextResponse.json({ received: true, order_id: order.id, status: paymentStatus });

  } catch (err: any) {
    console.error('Webhook error:', err);
    // Always return 200 to Marz so they don't retry
    return NextResponse.json({ received: true });
  }
}

// Also handle GET for redirect-back from card gateway
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

  // Redirect to order confirmation
  return Response.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/order-confirmation?ref=${reference}`);
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
  if (!apiKey || !adminPhone) return;

  const message = `✅ PAYMENT CONFIRMED — RHEA BEAUTY\n\nOrder: ${order.order_number}\nCustomer: ${order.customer_name}\nPhone: ${order.customer_phone}\nTotal: UGX ${Number(order.total).toLocaleString()}\n\nPayment received successfully.`;
  const url = `https://api.callmebot.com/whatsapp.php?phone=${adminPhone}&text=${encodeURIComponent(message)}&apikey=${apiKey}`;
  try { await fetch(url); } catch (e) { console.error('WhatsApp failed:', e); }
}
