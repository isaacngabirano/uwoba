import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

export async function GET() {
  const supabase = getServiceSupabase();

  if (!supabase) {
    return NextResponse.json([]);
  }

  const { data, error } = await supabase
    .from('orders')
    .select('customer_name, customer_email, customer_phone, total, created_at, payment_status')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const customerMap: Record<string, any> = {};
  (data || []).forEach((order) => {
    const key = order.customer_phone;
    if (!customerMap[key]) {
      customerMap[key] = {
        phone: order.customer_phone,
        name: order.customer_name,
        email: order.customer_email,
        order_count: 0,
        total_spent: 0,
        first_order: order.created_at,
        last_order: order.created_at,
      };
    }
    customerMap[key].order_count += 1;
    if (order.payment_status === 'PAID') {
      customerMap[key].total_spent += Number(order.total);
    }
    if (new Date(order.created_at) > new Date(customerMap[key].last_order)) {
      customerMap[key].last_order = order.created_at;
    }
  });

  const customers = Object.values(customerMap).sort(
    (a: any, b: any) => new Date(b.last_order).getTime() - new Date(a.last_order).getTime()
  );

  return NextResponse.json(customers);
}
