import { NextRequest, NextResponse } from 'next/server';
import { createServerApi } from '@/lib/server-api';

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
  const { id } = await ctx.params;
    const form = await req.formData();
  const status = form.get('status');
  const eventDate = form.get('eventDate');
  const eventDetails = form.get('eventDetails');
  const totalPrice = form.get('totalPrice');
  const total_cost_price = form.get('total_cost_price');
  const customerName = form.get('customerName');
  const customerEmail = form.get('customerEmail');
  const customerPhone = form.get('customerPhone');
    const payload: any = { data: {} };
  if (typeof status === 'string' && status) payload.data.status = status;
  if (typeof eventDate === 'string' && eventDate) {
    // Preserve local time chosen by the user: build an ISO string for the local time
    // eventDate format comes as YYYY-MM-DDTHH:mm (no timezone)
    const [ymd, hm] = eventDate.split('T');
    const [y, m, d] = (ymd || '').split('-').map(n => parseInt(n, 10));
  const [hh, mm] = (hm || '').split(':').map(n => parseInt(n, 10));
  if (y && m && d && !isNaN(hh) && !isNaN(mm)) {
      const local = new Date(y, m - 1, d, hh, mm, 0, 0);
      // Encode as ISO string so Strapi gets DateTime; this will be UTC but decodifiable to the same local time
      payload.data.eventDate = local.toISOString();
    }
  }
  if (typeof eventDetails === 'string') payload.data.eventDetails = eventDetails;
  if (typeof totalPrice === 'string' && totalPrice) payload.data.totalPrice = Number(totalPrice);
  if (typeof total_cost_price === 'string' && total_cost_price) payload.data.total_cost_price = Number(total_cost_price);
  if (typeof customerName === 'string') payload.data.customerName = customerName;
  if (typeof customerEmail === 'string') payload.data.customerEmail = customerEmail;
  if (typeof customerPhone === 'string') payload.data.customerPhone = customerPhone;

  const api = createServerApi(req.headers);
  const base = api.base;
  const res = await api.request(`/api/orders/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
    if (!res.ok) {
      const txt = await res.text();
      const msg = encodeURIComponent(txt || 'Falha ao atualizar pedido');
      return NextResponse.redirect(`${base}/dashboard/orders/${id}?error=${msg}`);
    }
  return NextResponse.redirect(`${base}/dashboard/orders/${id}?updated=1`);
  } catch (e: any) {
  const api = createServerApi(req.headers);
  const base = api.base;
    const msg = encodeURIComponent(e?.message || 'Erro ao enviar formulário');
    return NextResponse.redirect(`${base}/dashboard/orders/${(await ctx.params).id}?error=${msg}`);
  }
}
