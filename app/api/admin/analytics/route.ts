import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { DEMO_ORDERS, DEMO_PRODUCTS } from '@/lib/demoData';

export async function GET() {
  const supabase = getServiceSupabase();

  if (!supabase) {
    const paidOrders = DEMO_ORDERS.filter((o) => o.payment_status === 'PAID');
    const totalRevenue = paidOrders.reduce((s, o) => s + o.total, 0);
    const pendingOrders = DEMO_ORDERS.filter((o) => o.order_status === 'PENDING').length;
    const lowStock = DEMO_PRODUCTS.filter((p) => p.stock <= 5 && p.stock > 0);
    const outOfStock = DEMO_PRODUCTS.filter((p) => p.stock === 0).length;
    const revenueByDay: Record<string, number> = {
      'Mon': 60000, 'Tue': 75000, 'Wed': 45000,
      'Thu': 135000, 'Fri': 68000, 'Sat': 120000, 'Sun': 0,
    };
    return NextResponse.json({
      totalRevenue, totalOrders: DEMO_ORDERS.length, pendingOrders,
      productCount: DEMO_PRODUCTS.length, outOfStock, lowStock, revenueByDay,
    });
  }

  const { data: paidOrders } = await supabase.from('orders').select('total').eq('payment_status', 'PAID');
  const { data: allOrders } = await supabase.from('orders').select('id, order_status, payment_status, created_at, total');
  const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
  const { data: lowStock } = await supabase.from('products').select('*').lte('stock', 5).gt('stock', 0);
  const { count: outOfStock } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('stock', 0);

  const sevenDaysAgo = new Date(); sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const { data: recentOrders } = await supabase.from('orders').select('total, created_at, payment_status').gte('created_at', sevenDaysAgo.toISOString()).order('created_at', { ascending: true });

  const totalRevenue = (paidOrders || []).reduce((s, o) => s + Number(o.total), 0);
  const totalOrders = allOrders?.length || 0;
  const pendingOrders = (allOrders || []).filter((o) => o.order_status === 'PENDING').length;

  const revenueByDay: Record<string, number> = {};
  (recentOrders || []).forEach((o) => {
    if (o.payment_status === 'PAID') {
      const day = new Date(o.created_at).toLocaleDateString('en-UG', { weekday: 'short' });
      revenueByDay[day] = (revenueByDay[day] || 0) + Number(o.total);
    }
  });

  return NextResponse.json({ totalRevenue, totalOrders, pendingOrders, productCount, outOfStock, lowStock: lowStock || [], revenueByDay });
}
