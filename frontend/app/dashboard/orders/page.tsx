 import { headers } from 'next/headers';
import { Card, CardContent } from '@/components/ui/card';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { DynamicTable } from '@/components/datatable/DynamicTable';
import { Link } from 'next-view-transitions';
import { orderColumns, Order } from '@/components/orders/orders-columns';
import { getPaginatedData, type GetPaginatedParams } from '@/lib/server-actions';

async function fetchOrders(params: GetPaginatedParams) {
  'use server';
  return getPaginatedData<Order>('/api/orders', params);
}

export default async function OrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold">Pedidos</h1>
          <p className="text-sm text-muted-foreground">Gerencie pedidos diretos (encomendas)</p>
        </div>
        <Link href="/dashboard/orders/kanban" className="text-blue-600 text-sm underline">Ver Kanban</Link>
      </div>

      <div>
        <CardContent className="p-0 ">
          <Suspense
            fallback={
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-40 w-full" />
              </div>
            }
          >
            <DynamicTable<Order>
              tableId="orders-list"
              apiEndpoint={fetchOrders}
              columns={orderColumns}
              defaultLimit={20}
              limitOptions={[10, 20, 50]}
              defaultSort="createdAt"
              defaultOrder="DESC"
              searchPlaceholder="Buscar por detalhes, cliente ou email..."
              emptyMessage="Nenhum pedido encontrado"
              enableSearch={true}
              enableColumnVisibility={true}
              enableExport={true}
              exportFileName="pedidos"
            />
          </Suspense>
        </CardContent>
      </div>
    </div>
  );
}
