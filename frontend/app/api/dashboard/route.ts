import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getStrapiURL } from '@/lib/utils';

type StrapiListResponse<T> = {
  data: Array<{ id: string | number; documentId?: string; attributes?: any } & T>;
  meta?: { pagination?: { total?: number } };
  error?: any;
};

async function fetchFromStrapi(path: string, token: string) {
  const base = getStrapiURL();
  const url = new URL(path, base);
  const res = await fetch(url.href, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });
  const json = await res.json();
  if (!res.ok || json?.error) {
    throw new Error(json?.error?.message || `Strapi request failed: ${res.status}`);
  }
  return json as StrapiListResponse<any>;
}

function toISO(date: Date) {
  return date.toISOString();
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('jwt')?.value;
    if (!token) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });

  // Single summary fetch from Strapi to avoid unsupported list routes
  const summary = await fetchFromStrapi('/api/budget/summary', token);
  return NextResponse.json(summary, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error?.message || 'Failed to load dashboard' },
      { status: 500 },
    );
  }
}
