 import { headers } from 'next/headers';
import { createServerApi } from '@/lib/server-api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { OrdersTableClient } from '@/components/orders/orders-table-client';
import { Link } from 'next-view-transitions';

async function getOrders(searchParams: { page?: string; pageSize?: string; q?: string; status?: string }) {
  const { page = '1', pageSize = '20', q = '' } = searchParams;
  const params = new URLSearchParams();
  params.set('page', page); 
  params.set('pageSize', pageSize);
  if (q) params.set('q', q);
  if (searchParams.status) params.set('status', searchParams.status);
  const h = await headers();
  const api = createServerApi(h);
  try {
    return await api.get(`/api/orders?${params.toString()}`);
  } catch {
    return { ok: false, data: [] } as any;
  }
}

export default async function OrdersPage({ searchParams }: Readonly<{ searchParams: Promise<{ page?: string; pageSize?: string; q?: string; status?: string }> }>) {
  const params = await searchParams;
  const data = await getOrders(params);
  const list = Array.isArray(data?.data) ? data.data : [];
  const page = Number(params?.page || 1);
  const pageSize = Number(params?.pageSize || 20);
  const q = params?.q || '';
  const status = params?.status || 'all';
  return (
    <div className="space-y-6">
      <div className="border-0 shadow-none">
        <CardHeader className="p-0 flex flex-col md:flex-row md:items-end md:justify-between gap-2">
          <div>
            <CardTitle className="text-2xl font-bold">Pedidos</CardTitle>
            <CardDescription>Gerencie pedidos diretos (sem tipo de festa).</CardDescription>
          </div>
          <Link href="/dashboard/orders/kanban"  className="text-blue-600">Ver Kanban</Link>
        </CardHeader>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form className="grid grid-cols-1 md:grid-cols-3 gap-3" action="/dashboard/orders" method="get">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input name="q" defaultValue={q} placeholder="Buscar por detalhes" className="pl-8" />
            </div>
  <Select name="status" defaultValue={status}
            >
              <SelectTrigger>
    <SelectValue placeholder="Status (todos)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="confirmado">Confirmado</SelectItem>
                <SelectItem value="em_producao">Em produção</SelectItem>
                <SelectItem value="pronto">Pronto</SelectItem>
                <SelectItem value="entregue">Entregue</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button type="submit" className="w-full md:w-auto">Filtrar</Button>
              <Link href="/dashboard/orders" className="w-full md:w-auto">
                <Button type="button" variant="outline" className="w-full md:w-auto">Limpar</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <Suspense
            fallback={
              <div className="space-y-2">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-40 w-full" />
              </div>
            }
          >
            <OrdersTableClient orders={list} />
          </Suspense>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between text-sm">
        <div className="text-muted-foreground">Página {page}</div>
        <div className="flex gap-2">
          <Link href={{ pathname: '/dashboard/orders', query: { q, page: Math.max(1, page - 1), pageSize, status: status !== 'all' ? status : undefined } }}>
            <Button variant="outline" size="sm">Anterior</Button>
          </Link>
          <Link href={{ pathname: '/dashboard/orders', query: { q, page: page + 1, pageSize, status: status !== 'all' ? status : undefined } }}>
            <Button variant="outline" size="sm">Próxima</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
