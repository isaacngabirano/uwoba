import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  const adminUser = process.env.ADMIN_USERNAME || 'admin';
  const adminPass = process.env.ADMIN_PASSWORD || '1234';

  if (username === adminUser && password === adminPass) {
    const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
    return NextResponse.json({ token, success: true });
  }

  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}
