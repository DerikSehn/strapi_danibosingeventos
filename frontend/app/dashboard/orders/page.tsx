 import { headers } from 'next/headers';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Order } from '@/components/orders/orders-columns';
import { getPaginatedData, type GetPaginatedParams } from '@/lib/server-actions';
import { OrdersListClient } from './orders-list-client';

async function fetchOrders(params: GetPaginatedParams) {
  'use server';
  return getPaginatedData<Order>('/api/orders', params);
}

export default async function OrdersPage() {
  // Fetch initial data for server-side rendering
  const initialData = await fetchOrders({ page: 1, limit: 20 });

  return (
    <Suspense fallback={<div className="p-4"><Skeleton className="h-96 w-full" /></div>}>
      <OrdersListClient initialData={initialData} fetchOrders={fetchOrders} />
    </Suspense>
  );
}
