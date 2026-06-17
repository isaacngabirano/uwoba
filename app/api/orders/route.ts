import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { generateOrderNumber } from '@/lib/utils';
import { DEMO_ORDERS } from '@/lib/demoData';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customer_name, customer_email, customer_phone, delivery_address, payment_method, items, subtotal, delivery_fee, total } = body;

    if (!customer_name || !customer_phone || !delivery_address || !items?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = getServiceSupabase();
    const order_number = generateOrderNumber();

    if (!supabase) {
      // Demo mode — pretend it worked
      await sendWhatsAppNotification(order_number, customer_name, customer_phone, items, total, payment_method);
      return NextResponse.json({ order_number, order_id: 'demo-new' }, { status: 201 });
    }

    const { data: order, error: orderError } = await supabase
      .from('orders').insert({ order_number, customer_name, customer_email, customer_phone, delivery_address, payment_method, subtotal, delivery_fee, total, payment_status: 'PENDING', order_status: 'PENDING' })
      .select().single();

    if (orderError) throw orderError;

    await supabase.from('order_items').insert(
      items.map((item: any) => ({ order_id: order.id, product_id: item.product_id, product_name: item.product_name, product_code: item.product_code, quantity: item.quantity, unit_price: item.unit_price, subtotal: item.subtotal }))
    );

    for (const item of items) {
      await supabase.rpc('decrement_stock', { p_product_id: item.product_id, p_quantity: item.quantity }).maybeSingle();
    }

    await sendWhatsAppNotification(order_number, customer_name, customer_phone, items, total, payment_method);
    return NextResponse.json({ order_number, order_id: order.id }, { status: 201 });
  } catch (err: any) {
    console.error('Order error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  const supabase = getServiceSupabase();
  if (!supabase) return NextResponse.json(DEMO_ORDERS);

  const { data, error } = await supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

async function sendWhatsAppNotification(orderNumber: string, customerName: string, customerPhone: string, items: any[], total: number, paymentMethod: string) {
  const apiKey = process.env.CALLMEBOT_API_KEY;
  const adminPhone = process.env.ADMIN_WHATSAPP_NUMBER;
  if (!apiKey || !adminPhone) return;

  const itemsList = items.map((i: any) => `${i.product_code} x${i.quantity}`).join(', ');
  const message = `🌸 NEW ORDER — RHEA BEAUTY\n\nOrder: ${orderNumber}\nCustomer: ${customerName}\nPhone: ${customerPhone}\nItems: ${itemsList}\nTotal: UGX ${total.toLocaleString()}\nPayment: ${paymentMethod}`;
  const url = `https://api.callmebot.com/whatsapp.php?phone=${adminPhone}&text=${encodeURIComponent(message)}&apikey=${apiKey}`;
  try { await fetch(url); } catch (e) { console.error('WhatsApp failed:', e); }
}
