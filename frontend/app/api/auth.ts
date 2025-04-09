 import { getStrapiURL } from '@/lib/utils';
import { getAuthToken } from 'data/services/get-token';
import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = getStrapiURL();
  const url = new URL('/api/users/me', baseUrl);

  const authToken = await getAuthToken();
  if (!authToken) {
    return NextResponse.json({ ok: false, data: null, error: null });
  }

  try {
    const response = await fetch(url.href, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    });
    const data = await response.json();
    
    if (data.error) {
      return NextResponse.json({ ok: false, data: null, error: data.error });
    }
    
    return NextResponse.json({ ok: true, data, error: null });
  } catch (error) {
    return NextResponse.json({ ok: false, data: null, error });
  }
}