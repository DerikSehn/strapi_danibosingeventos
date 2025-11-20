import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getStrapiURL } from '@/lib/utils';

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    const cookieStore = await cookies();
    const token = cookieStore.get('jwt')?.value;
    if (!token) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    const json = await req.json().catch(() => ({}));
    const base = getStrapiURL();
    const res = await fetch(new URL(`/api/orders/${id}/notes`, base), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ data: { note: json.note } }),
    });
    const body = await res.json();
    return NextResponse.json(body, { status: res.status });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Failed to add note' }, { status: 500 });
  }
}
