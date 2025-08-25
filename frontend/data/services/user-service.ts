'use server';

import { cookies } from 'next/headers';
import { getStrapiURL } from '@/lib/utils';

interface User {
  id: number;
  username: string;
  email: string;
  role: {
    id: number;
    name: string;
    type: string;
  };
}

export async function getUserMeLoader(): Promise<{
  ok: boolean;
  data: User | null;
  error: string | null;
}> {
  const baseUrl = getStrapiURL();

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('jwt');

    if (!token?.value) {
      return {
        ok: false,
        data: null,
        error: 'No authentication token found',
      };
    }

    const url = new URL('/api/users/me', baseUrl);
    const response = await fetch(url.href, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.value}`,
      },
      cache: 'no-cache',
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        ok: false,
        data: null,
        error: errorData.error?.message || 'Failed to fetch user data',
      };
    }

    const user = await response.json();
    return {
      ok: true,
      data: user,
      error: null,
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    return {
      ok: false,
      data: null,
      error: 'An error occurred while fetching user data',
    };
  }
}
