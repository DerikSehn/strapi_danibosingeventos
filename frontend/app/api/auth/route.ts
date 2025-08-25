import { getStrapiURL } from '@/lib/utils';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const baseUrl = getStrapiURL();
  const url = new URL('/api/users/me', baseUrl);

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('jwt')?.value;

    if (!token) {
      return NextResponse.json(
        { ok: false, data: null, error: 'No token' },
        { status: 401 }
      );
    }

  const res = await fetch(url.href, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      // Never cache auth/user info
      cache: 'no-store',
    });

    const data = await res.json();

    if (!res.ok || data?.error) {
      return NextResponse.json(
        { ok: false, data: null, error: data?.error ?? 'Unauthorized' },
        { status: res.status || 401 }
      );
    }

  return NextResponse.json({ ok: true, data, error: null }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal error';
    return NextResponse.json({ ok: false, data: null, error: message }, { status: 500 });
  }
}
