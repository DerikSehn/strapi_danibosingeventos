"use client";

import { useState, useEffect, useRef } from "react";
import { Link } from 'next-view-transitions';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApproveSwitch } from '@/components/orders/approve-switch';
import { EventDatePicker } from '@/components/orders/event-date-picker';
import { QuoteActionButtons } from '@/components/orders/quote-action-buttons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import OrderTimeline from '@/components/orders/order-timeline';
import { Button } from "@/components/ui/button";
import { Loader2, Save, Clock, Check } from "lucide-react";
import { StrapiImage } from '@/components/strapi-image';
import { useDebouncedCallback } from "@/lib/hooks/use-debounce";
import { saveOrderChanges, confirmOrderStatus } from "./actions";

interface Order {
  id?: string | number;
  documentId?: string;
  createdAt?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  internalNotes?: string;
  deliveryAddress?: string;
  deliveryCity?: string;
  deliveryZip?: string;
  source_channel?: string;
  eventDetails?: string;
  totalPrice?: number;
  total_cost_price?: number;
  eventDate?: string;
  status?: string;
  blockedEventDates?: string[];
  order_events?: any[];
  order_items?: any[];
  product_variants?: any[];
}

interface OrderDetailClientProps {
  initialOrder: Order;
}

export function OrderDetailClient({ initialOrder }: OrderDetailClientProps) {
  const queryClient = useQueryClient();
  const formRef = useRef<HTMLFormElement>(null);

  // Local state for form fields - initialize with initialOrder
  const [formData, setFormData] = useState({
    customerName: initialOrder.customerName || '',
    customerEmail: initialOrder.customerEmail || '',
    customerPhone: initialOrder.customerPhone || '',
    internalNotes: initialOrder.internalNotes || '',
    deliveryAddress: initialOrder.deliveryAddress || '',
    deliveryCity: initialOrder.deliveryCity || '',
    deliveryZip: initialOrder.deliveryZip || '',
    source_channel: initialOrder.source_channel || '',
    eventDetails: initialOrder.eventDetails || '',
    totalPrice: Number(initialOrder.totalPrice ?? 0),
    total_cost_price: Number(initialOrder.total_cost_price ?? 0),
  });

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', initialOrder.documentId || initialOrder.id],
    queryFn: async () => {
      const response = await fetch(`/api/orders/${initialOrder.documentId || initialOrder.id}`);
      if (!response.ok) throw new Error('Falha ao carregar pedido');
      const result = await response.json();
      return result.data as Order;
    },
    initialData: initialOrder,
    staleTime: 10000, // 10 seconds
  });


  // Debounced callback para salvar mudanças automaticamente
  const debouncedSave = useDebouncedCallback(async (formData: any) => {
    try {
      const formDataObj = new FormData();
      formDataObj.append('id', formData.id);

      // Adicionar apenas campos que mudaram
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'id' && value !== null && value !== undefined && value !== "") {
          formDataObj.append(key, String(value));
        }
      });

      const result = await saveOrderChanges(formDataObj);
      if (result.success) {
        toast.success('Atualizações salvas automaticamente');
        queryClient.invalidateQueries({ queryKey: ['order', order?.documentId || order?.id] });
      } else {
        toast.error(result.error || "Erro ao salvar alterações");
      }
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar alterações");
    }
  }, 2000);

  const saveMutation = useMutation({
    mutationFn: async (formData: any) => {
      const formDataObj = new FormData();
      formDataObj.append('id', formData.id);

      // Adicionar apenas campos que mudaram
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'id' && value !== null && value !== undefined && value !== "") {
          formDataObj.append(key, String(value));
        }
      });

      return await saveOrderChanges(formDataObj);
    },
    onSuccess: () => {
        toast.success('Atualizações salvas automaticamente')
        queryClient.invalidateQueries({ queryKey: ['order', order?.documentId || order?.id] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao salvar alterações");
    },
  });

  const confirmMutation = useMutation({
    mutationFn: async (formData: any) => {
      const formDataObj = new FormData();
      formDataObj.append('id', formData.id);
      formDataObj.append('status', formData.status);

      return await confirmOrderStatus(formDataObj);
    },
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Status atualizado com sucesso!");
        queryClient.invalidateQueries({ queryKey: ['order', order?.documentId || order?.id] });
      } else {
        toast.error(result.error || "Erro ao atualizar status");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao atualizar status");
    },
  });

  const handleFieldChange = (field: string, value: any) => {
    const newFormData = { ...formData, [field]: value, id: order?.documentId || order?.id };
    setFormData(newFormData);
    debouncedSave(newFormData);
  };

  const createChangeHandler = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    handleFieldChange(field, value);
  };

  const handleDateChange = (value: string) => {
    handleFieldChange('eventDate', value);
  };

  if (isLoading && !order) {
    return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (!order) {
    return (
      <div className="space-y-4">
        <p className="text-red-600">Pedido não encontrado.</p>
        <Link className="text-blue-600" href="/dashboard/orders">Voltar</Link>
      </div>
    );
  }

  // Prefer numeric id for display; keep documentId for API routes
  const displayId = order.id || order.documentId;
  const docId = (order.documentId || order.id) as string | number;
  const createdAt = order.createdAt ? new Date(order.createdAt).toLocaleString('pt-BR') : '-';
  const customerName = order.customerName || '';
  const customerEmail = order.customerEmail || '';
  const customerPhone = order.customerPhone || '';
  const internalNotes = order.internalNotes || '';
  const deliveryAddress = order.deliveryAddress || '';
  const deliveryCity = order.deliveryCity || '';
  const deliveryZip = order.deliveryZip || '';
  const sourceChannel = order.source_channel || '';
  // Robust date handling: keep full datetime if present (picker will parse time)
  const eventDateStr: string = typeof order.eventDate === 'string' ? order.eventDate : '';
  const disabledDates: string[] = Array.isArray(order.blockedEventDates) ? order.blockedEventDates : [];
  const events = Array.isArray(order.order_events) ? order.order_events : [];

  return (
    <div className="space-y-6 lg:min-w-[1120px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pedido {displayId}</h1>
          <p className="text-sm text-gray-600">Criado em {createdAt}</p>
        </div>
        <div className="flex items-center gap-3">
          <QuoteActionButtons orderId={docId} customerEmail={customerEmail} />
          <Link className="text-blue-600" href="/dashboard/orders">Voltar</Link>
        </div>
      </div>

      <form ref={formRef} className="grid gap-6">
        {/* Bento grid using Cards */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className='flex flex-col md:col-span-7 gap-6'>
            <Card className='h-full'>
              <CardHeader>
                <CardTitle>Cliente</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                <div>
                  <label htmlFor="customerName" className="block text-sm font-medium mb-1">Nome</label>
                  <input
                    id="customerName"
                    name="customerName"
                    type="text"
                    value={formData.customerName}
                    onChange={createChangeHandler('customerName')}
                    className="border rounded px-3 py-2 w-full"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="customerPhone" className="block text-sm font-medium mb-1">Celular</label>
                    <input
                      id="customerPhone"
                      name="customerPhone"
                      type="tel"
                      value={formData.customerPhone}
                      onChange={createChangeHandler('customerPhone')}
                      className="border rounded px-3 py-2 w-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="customerEmail" className="block text-sm font-medium mb-1">Email</label>
                    <input
                      id="customerEmail"
                      name="customerEmail"
                      type="email"
                      value={formData.customerEmail}
                      onChange={createChangeHandler('customerEmail')}
                      className="border rounded px-3 py-2 w-full"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="deliveryAddress" className="block text-sm font-medium mb-1">Endereço</label>
                    <textarea
                      id="deliveryAddress"
                      name="deliveryAddress"
                      value={formData.deliveryAddress}
                      onChange={createChangeHandler('deliveryAddress')}
                      className="border rounded px-3 py-2 w-full min-h-[70px]"
                    />
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="deliveryCity" className="block text-sm font-medium mb-1">Cidade</label>
                      <input
                        id="deliveryCity"
                        name="deliveryCity"
                        type="text"
                        value={formData.deliveryCity}
                        onChange={createChangeHandler('deliveryCity')}
                        className="border rounded px-3 py-2 w-full"
                      />
                    </div>
                    <div>
                      <label htmlFor="deliveryZip" className="block text-sm font-medium mb-1">CEP</label>
                      <input
                        id="deliveryZip"
                        name="deliveryZip"
                        type="text"
                        value={formData.deliveryZip}
                        onChange={createChangeHandler('deliveryZip')}
                        className="border rounded px-3 py-2 w-full"
                      />
                    </div>
                    <div>
                      <label htmlFor="source_channel" className="block text-sm font-medium mb-1">Canal</label>
                      <select
                        id="source_channel"
                        name="source_channel"
                        value={formData.source_channel}
                        onChange={createChangeHandler('source_channel')}
                        className="border rounded px-3 py-2 w-full text-sm"
                      >
                        <option value="">—</option>
                        <option value="site">Site</option>
                        <option value="whatsapp">WhatsApp</option>
                        <option value="presencial">Presencial</option>
                        <option value="outro">Outro</option>
                      </select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Orçamento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="totalPrice" className="block text-sm font-medium mb-1">Total (R$)</label>
                      <input
                        id="totalPrice"
                        type="number"
                        step="0.01"
                        name="totalPrice"
                        value={formData.totalPrice}
                        onChange={createChangeHandler('totalPrice')}
                        className="border rounded px-3 py-2 w-full"
                      />
                    </div>
                    <div>
                      <label htmlFor="total_cost_price" className="block text-sm font-medium mb-1">Custo do Evento (R$)</label>
                      <input
                        id="total_cost_price"
                        type="number"
                        step="0.01"
                        name="total_cost_price"
                        value={formData.total_cost_price}
                        onChange={createChangeHandler('total_cost_price')}
                        className="border rounded px-3 py-2 w-full"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 items-start">
                    <div className="flex flex-col">
                      <div className="block text-sm font-medium ">Lucro estimado</div>
                      <div className="text-lg font-medium bg-green-100 mt-1 h-[42px] border rounded p-2 flex items-center">
                        {(() => {
                          const lucro = (formData.totalPrice - formData.total_cost_price) || 0;
                          return lucro.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                        })()}
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="block text-sm font-medium ">Margem (%)</div>
                      <div className="text-lg font-medium bg-blue-50 mt-1 h-[42px] border rounded p-2 flex items-center">
                        {(() => {
                          const total = formData.totalPrice || 0;
                          if (!total) return '—';
                          const lucro = (total - formData.total_cost_price);
                          const perc = (lucro / total) * 100;
                          return perc.toFixed(1) + '%';
                        })()}
                      </div>
                    </div>
                    <div className="pt-1">
                      <ApproveSwitch
                        defaultChecked={order.status === 'confirmado'}
                        isLoading={confirmMutation.isPending}
                        onStatusChange={(status) => {
                          confirmMutation.mutateAsync({ id: order?.documentId || order?.id, status });
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card className='relative md:col-span-5 min-w-96'>
            <CardHeader>
              <CardTitle>Data do Evento</CardTitle>
            </CardHeader>
            <CardContent >
              <EventDatePicker defaultValue={eventDateStr} name="eventDate" disabledDates={disabledDates} onValueChange={handleDateChange} />
            </CardContent>
          </Card>
          <Card className='md:col-span-8'>
            <CardHeader>
              <CardTitle>Itens do Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                if (Array.isArray(order.order_items) && order.order_items.length > 0) {
                  return (
                    <div className="grid grid-cols-1 gap-3">
                      {order.order_items.map((oi: any) => {
                        const pv = oi.product_variant || {};
                        const title = pv.title || oi.item_name || 'Item';
                        const price = Number(oi.unit_price ?? pv.price ?? 0);
                        const qty = Number(oi.quantity ?? 0);
                        const total = Number(oi.total_item_price ?? price * qty);
                        const img = pv?.image?.url;
                        return (
                          <div key={oi.id || pv.documentId || pv.id} className="border-b pb-3 last:border-b-0">
                            <div className="flex flex-row items-center space-x-3">
                              <div className="flex-grow min-w-0">
                                <h4 className="text-sm font-medium text-neutral-800 truncate">{title}</h4>
                                <p className="text-xs text-neutral-600">R$ {price.toFixed(2)}</p>
                                <p className="text-xs text-neutral-700">Quantidade: {qty}</p>
                                <p className="text-xs text-neutral-700">Subtotal: R$ {total.toFixed(2)}</p>
                              </div>
                              {img && (
                                <div className="relative w-14 h-12 sm:w-20 sm:h-20 flex-shrink-0">
                                  <StrapiImage src={img} alt={title} fill className="object-cover" />
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                }
                if (Array.isArray(order.product_variants) && order.product_variants.length > 0) {
                  return (
                    <div className="grid grid-cols-1 gap-3">
                      {order.product_variants.map((pv: any) => {
                        const title = pv?.title || 'Item';
                        const price = Number(pv?.price ?? 0);
                        const img = pv?.image?.url;
                        return (
                          <div key={pv.documentId || pv.id} className="border-b pb-3 last:border-b-0">
                            <div className="flex flex-row items-center space-x-3">
                              <div className="flex-grow min-w-0">
                                <h4 className="text-sm font-medium text-neutral-800 truncate">{title}</h4>
                                <p className="text-xs text-neutral-600">R$ {price.toFixed(2)}</p>
                                <p className="text-xs text-neutral-700">Quantidade: -</p>
                                <p className="text-xs text-neutral-700">Subtotal: -</p>
                              </div>
                              {img && (
                                <div className="relative w-14 h-12 sm:w-20 sm:h-20 flex-shrink-0">
                                  <StrapiImage src={img} alt={title} fill className="object-cover" />
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                }
                return <p className="text-sm text-gray-500">Nenhum item vinculado.</p>;
              })()}
            </CardContent>
          </Card>
          {/* Detalhes à direita (cols 2-3) na mesma linha */}
          <Card className="md:col-span-4 h-min">
            <CardHeader>
              <CardTitle>Detalhes do Evento</CardTitle>
            </CardHeader>
            <CardContent >
              <label htmlFor="eventDetails" className="block text-sm font-medium mb-1">Detalhes</label>
              <textarea
                id="eventDetails"
                name="eventDetails"
                value={formData.eventDetails}
                onChange={createChangeHandler('eventDetails')}
                className="border rounded px-3 py-2 w-full min-h-[120px]"
              />
              <div className="mt-4">
                <label htmlFor="internalNotes" className="block text-sm font-medium mb-1">Notas Internas</label>
                <textarea
                  id="internalNotes"
                  name="internalNotes"
                  value={formData.internalNotes}
                  onChange={createChangeHandler('internalNotes')}
                  placeholder="Visível apenas internamente"
                  className="border rounded px-3 py-2 w-full min-h-[100px] bg-yellow-50"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={saveMutation.isPending}
            className="px-4 py-2"
          >
            {saveMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar'
            )}
          </Button>
          <Link className="px-4 py-2 rounded border inline-flex items-center" href="/dashboard/orders">Cancelar</Link>
        </div>
      </form>

      {/* Timeline */}
      <OrderTimeline events={events} />
    </div>
  );
}