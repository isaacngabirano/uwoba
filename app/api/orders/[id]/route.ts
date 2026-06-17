import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const supabase = getServiceSupabase();
  if (!supabase) return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  const { data, error } = await supabase.from('orders').select('*, order_items(*)').eq('id', params.id).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = getServiceSupabase();
  if (!supabase) return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  const body = await req.json();
  const { data, error } = await supabase.from('orders').update(body).eq('id', params.id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
