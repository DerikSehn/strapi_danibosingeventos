import { headers } from 'next/headers';
import { Link } from 'next-view-transitions';
import { createServerApi } from '@/lib/server-api';
import { KanbanBoard } from '@/components/orders/kanban-board';

// rendering handled by client component

async function loadOrders(searchParams: { q?: string }) {
  const h = await headers();
  const api = createServerApi(h);
  const q = searchParams?.q || '';
  const params = new URLSearchParams();
  params.set('page', '1');
  params.set('pageSize', '100');
  if (q) params.set('q', q);
  const json = await api.get<{ ok: boolean; data: any[] }>(`/api/orders?${params.toString()}`);
  return Array.isArray(json?.data) ? json.data : [];
}

export default async function OrdersKanbanPage({ searchParams }: { readonly searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams;
  const orders = await loadOrders(params);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Pedidos (Kanban)</h1>
        <Link href="/dashboard/orders" className="text-blue-600">Ver lista</Link>
      </div>
  <KanbanBoard initialOrders={orders} />
    </div>
  );
}
