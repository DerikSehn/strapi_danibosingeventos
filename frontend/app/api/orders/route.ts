import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getStrapiURL } from '@/lib/utils';

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('jwt')?.value;
    if (!token) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
  const page = searchParams.get('page') || '1';
  const pageSize = searchParams.get('pageSize') || '20';
  const q = searchParams.get('q') || '';
  const status = searchParams.get('status');

    const base = getStrapiURL();
    const url = new URL('/api/orders', base);
    url.searchParams.set('page', page);
    url.searchParams.set('pageSize', pageSize);
  if (q) url.searchParams.set('q', q);
  if (status && status !== 'all') url.searchParams.set('status', status);

  const cookie = req.headers.get('cookie') || '';
  const res = await fetch(url.href, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    cookie,
      },
      cache: 'no-store',
    });
    const json = await res.json();
    if (!res.ok) return NextResponse.json(json, { status: res.status });
    return NextResponse.json(json, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error?.message || 'Failed to load orders' }, { status: 500 });
  }
}
