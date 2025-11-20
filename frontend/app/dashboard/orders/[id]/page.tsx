import { Link } from 'next-view-transitions';
import { headers } from 'next/headers';
import { createServerApi } from '@/lib/server-api';
import UpdateNotice from '@/components/orders/update-notice';
import { StrapiImage } from '@/components/strapi-image';
import { ApproveSwitch } from '@/components/orders/approve-switch';
import { EventDatePicker } from '@/components/orders/event-date-picker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import OrderTimeline from '@/components/orders/order-timeline';
import { OrderDetailClient } from './client';

async function getOrder(id: string) {
  const h = await headers();
  const api = createServerApi(h);
  try {
    const json = await api.get<{ data: any }>(`/api/orders/${id}`);
    return json?.data || null;
  } catch {
    return null;
  }
}

export default async function OrderDetailPage({ params }: { readonly params: Promise<{ readonly id: string }> }) {
  const { id } = await params;
  const order = await getOrder(id);

  if (!order) {
    return (
      <div className="space-y-4">
        <p className="text-red-600">Pedido não encontrado.</p>
        <Link className="text-blue-600" href="/dashboard/orders">Voltar</Link>
      </div>
    );
  }

  return <OrderDetailClient initialOrder={order} />;
}
