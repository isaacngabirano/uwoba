import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { DEMO_PRODUCTS } from '@/lib/demoData';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const supabase = getServiceSupabase();

  if (!supabase) {
    const filtered = category && category !== 'ALL'
      ? DEMO_PRODUCTS.filter((p) => p.category === category)
      : DEMO_PRODUCTS;
    return NextResponse.json(filtered);
  }

  let query = supabase.from('products').select('*').order('created_at', { ascending: false });
  if (category && category !== 'ALL') query = query.eq('category', category);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const supabase = getServiceSupabase();
  if (!supabase) return NextResponse.json({ error: 'Database not configured' }, { status: 503 });

  const { data, error } = await supabase.from('products').insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
