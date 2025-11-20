import { NextResponse } from 'next/server';
import { getStrapiURL } from '@/lib/utils';

export async function GET() {
  try {
    const url = new URL('/api/push/public-key', getStrapiURL());
    const res = await fetch(url, { cache: 'no-store' });
    const json = await res.json();
    return NextResponse.json(json, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    // fallthrough to default
  }
  return NextResponse.json({ publicKey: '' }, { status: 200 });
}
