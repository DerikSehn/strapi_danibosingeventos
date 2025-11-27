'use server';

import { cookies } from 'next/headers';
import { getStrapiURL } from '@/lib/utils';
import { revalidatePath } from 'next/cache';

export async function deleteOrderAction(orderId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('jwt')?.value;

  if (!token) {
    return { ok: false, error: 'Unauthorized' };
  }

  const base = getStrapiURL();
  const url = `${base}/api/orders/${orderId}`;

  try {
    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      return { ok: false, error: error?.error?.message || 'Failed to delete order' };
    }

    revalidatePath('/dashboard/orders');
    return { ok: true };
  } catch (error: any) {
    return { ok: false, error: error.message || 'Failed to delete order' };
  }
}
