import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getStrapiURL } from '@/lib/utils';

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
  const { id } = await ctx.params;
    const cookieStore = await cookies();
    const token = cookieStore.get('jwt')?.value;
    if (!token) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    const base = getStrapiURL();
  const cookie = req.headers.get('cookie') || '';
  const res = await fetch(new URL(`/api/orders/${id}`, base), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, cookie },
      cache: 'no-store',
    });
    const json = await res.json();
    return NextResponse.json(json, { status: res.status, headers: { 'Cache-Control': 'no-store' } });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error?.message || 'Failed to load order' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
  const { id } = await ctx.params;
    const cookieStore = await cookies();
    const token = cookieStore.get('jwt')?.value;
    if (!token) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    const body = await req.text();
    const base = getStrapiURL();
  const cookie = req.headers.get('cookie') || '';
  const res = await fetch(new URL(`/api/orders/${id}`, base), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, cookie },
      body,
    });
    const json = await res.json();
    return NextResponse.json(json, { status: res.status });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error?.message || 'Failed to update order' }, { status: 500 });
  }
}
