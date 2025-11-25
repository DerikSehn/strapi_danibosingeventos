"use client";

import { useState } from "react";
import { Link } from 'next-view-transitions';
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ApproveSwitch } from '@/components/orders/approve-switch';
import { EventDatePicker } from '@/components/orders/event-date-picker';
import { QuoteActionButtons } from '@/components/orders/quote-action-buttons';
import { BudgetSection } from '@/components/orders/budget-section';
import { OrderStepper } from '@/components/orders/order-stepper';
import { FormCard, FormField, FormRow } from '@/components/orders/form-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import OrderTimeline from '@/components/orders/order-timeline';
import { OrderItemsTable } from '@/components/orders/order-items-table';
import { StrapiImage } from '@/components/strapi-image';
import { useDebouncedCallback } from "@/lib/hooks/use-debounce";
import { useOrderItems } from "@/lib/hooks/use-order-items";
import {
  useUpdateOrderMutation,
  useConfirmOrderStatusMutation,
} from "@/lib/hooks/use-order-mutations";
import {
  useUpdateItemMutation,
  useRemoveItemMutation,
  useAddItemsMutation,
} from "@/lib/hooks/use-item-mutations";
import type { Order, UpdateOrderPayload } from "@/lib/api/orders/types";

interface OrderDetailClientProps {
  initialOrder: Order;
}

export function OrderDetailClient({ initialOrder }: OrderDetailClientProps) {
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

  // Track validation errors
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', initialOrder.documentId || initialOrder.id],
    queryFn: async () => {
      const response = await fetch(`/api/orders/${initialOrder.documentId || initialOrder.id}`);
      if (!response.ok) throw new Error('Falha ao carregar pedido');
      const result = await response.json();
      return result.data as Order;
    },
    initialData: initialOrder,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const orderId = order?.documentId || order?.id;

  // Hook para gerenciar itens de forma desacoplada
  const { 
    items: orderItems, 
    updateItemsCache,
  } = useOrderItems({
    orderId,
    initialItems: order?.order_items || [],
  });

  // Callback para atualizar items após mutação bem-sucedida
  const handleItemsUpdated = () => {
    // Items são gerenciados localmente, sem refetch de order
  };

  // Use order mutation hooks (apenas para aba de detalhes)
  const updateMutation = useUpdateOrderMutation(orderId!);
  const confirmMutation = useConfirmOrderStatusMutation(orderId!);

  // Use item mutation hooks (separados, sem invalidar order)
  const updateItemMutation = useUpdateItemMutation(orderId!, handleItemsUpdated);
  const removeItemMutation = useRemoveItemMutation(orderId!, handleItemsUpdated);
  const addItemsMutation = useAddItemsMutation(orderId!, handleItemsUpdated);

  // Debounced callback para salvar mudanças automaticamente
  const debouncedSave = useDebouncedCallback(async (fieldsToUpdate: Record<string, any>) => {
    if (orderId) {
      updateMutation.mutate(fieldsToUpdate);
    }
  }, 2000);

  const handleFieldChange = (field: string, value: any) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    
    // Validar source_channel
    if (field === 'source_channel') {
      const channel = String(value).trim();
      if (channel === '') {
        setFieldErrors(prev => ({ ...prev, source_channel: 'Canal de origem é obrigatório' }));
        return; // Não fazer save automático
      } else {
        setFieldErrors(prev => {
          const next = { ...prev };
          delete next.source_channel;
          return next;
        });
      }
    }
    
    // Validar email
    if (field === 'customerEmail') {
      const email = String(value).trim();
      if (email && !isValidEmail(email)) {
        setFieldErrors(prev => ({ ...prev, customerEmail: 'Email inválido' }));
        return; // Não fazer save automático
      } else {
        setFieldErrors(prev => {
          const next = { ...prev };
          delete next.customerEmail;
          return next;
        });
      }
    }
    
    // Não fazer save automático para eventDate - deixar explícito apenas
    if (field !== 'eventDate') {
      debouncedSave(newFormData);
    }
  };

  // Validação simples de email
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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

  // Calcular totais dos itens
  const { itemsTotal, itemsPriceTotal, itemsCostTotal } = (() => {
    if (Array.isArray(orderItems) && orderItems.length > 0) {
      return orderItems.reduce(
        (acc: any, oi: any) => {
          const itemTotal = Number(oi.total_item_price ?? 0);
          const unitPrice = Number(oi.unit_price ?? oi.product_variant?.price ?? 0);
          const qty = Number(oi.quantity ?? 0);
          
          // Se houver cost_price, usa; senão, usa 50% do preço
          const costPrice = Number(oi.product_variant?.cost_price ?? 0);
          const itemCost = (costPrice > 0 ? costPrice : unitPrice * 0.5) * qty;
          
          return {
            itemsTotal: acc.itemsTotal + itemTotal,
            itemsPriceTotal: acc.itemsPriceTotal + (unitPrice * qty),
            itemsCostTotal: acc.itemsCostTotal + itemCost,
          };
        },
        { itemsTotal: 0, itemsPriceTotal: 0, itemsCostTotal: 0 }
      );
    }
    return { itemsTotal: 0, itemsPriceTotal: 0, itemsCostTotal: 0 };
  })();



  return (
    <div className="space-y-4 sm:space-y-6 px-3 sm:px-0 lg:min-w-[1120px]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl font-bold truncate">Pedido {displayId}</h1>
          <p className="text-xs sm:text-sm text-gray-600 truncate">Criado em {createdAt}</p>
        </div>
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <Link className="text-blue-600 text-sm text-center sm:text-left px-2 sm:px-0 py-2 sm:py-0 rounded sm:rounded-none bg-blue-50 sm:bg-transparent" href="/dashboard/orders">Voltar</Link>
          <QuoteActionButtons orderId={docId} customerEmail={customerEmail} />
        </div>
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
          <OrderStepper currentStatus={order?.status as any} />
        </CardContent>
      </Card>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="details">Detalhes</TabsTrigger>
          <TabsTrigger value="items">Itens ({orderItems?.length || 0})</TabsTrigger>
          <TabsTrigger value="timeline">Histórico</TabsTrigger>
        </TabsList>

        {/* ABA 1: DETALHES */}
        <TabsContent value="details" className="space-y-6">
          <form className="grid gap-6">
            {/* Bento grid using Cards */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left Column: Cliente + Orçamento */}
              <div className='flex flex-col md:col-span-7 gap-6'>
                {/* Cliente Card */}
                <FormCard 
                  title="Cliente" 
                  subtitle="Informações de contato e entrega"
                >
                  <FormField
                    label="Nome"
                    id="customerName"
                    value={formData.customerName}
                    onChange={createChangeHandler('customerName')}
                  />
                  
                  <FormRow cols={2}>
                    <FormField
                      label="Celular"
                      id="customerPhone"
                      type="tel"
                      value={formData.customerPhone}
                      onChange={createChangeHandler('customerPhone')}
                    />
                    <FormField
                      label="Email"
                      id="customerEmail"
                      type="email"
                      value={formData.customerEmail}
                      onChange={createChangeHandler('customerEmail')}
                      error={fieldErrors.customerEmail}
                    />
                  </FormRow>

                  <FormField
                    label="Endereço de Entrega"
                    id="deliveryAddress"
                    type="textarea"
                    minHeight="70px"
                    value={formData.deliveryAddress}
                    onChange={createChangeHandler('deliveryAddress')}
                  />

                  <FormRow cols={3}>
                    <FormField
                      label="Cidade"
                      id="deliveryCity"
                      value={formData.deliveryCity}
                      onChange={createChangeHandler('deliveryCity')}
                    />
                    <FormField
                      label="CEP"
                      id="deliveryZip"
                      value={formData.deliveryZip}
                      onChange={createChangeHandler('deliveryZip')}
                    />
                    <FormField
                      label="Canal"
                      id="source_channel"
                      type="select"
                      value={formData.source_channel}
                      onChange={createChangeHandler('source_channel')}
                      error={fieldErrors.source_channel}
                    >
                      <option value="">—</option>
                      <option value="site">Site</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="presencial">Presencial</option>
                      <option value="outro">Outro</option>
                    </FormField>
                  </FormRow>
                </FormCard>

                {/* Budget Section */}
                <BudgetSection
                  totalPrice={formData.totalPrice}
                  total_cost_price={formData.total_cost_price}
                  onTotalPriceChange={(value) => handleFieldChange('totalPrice', value)}
                  onCostPriceChange={(value) => handleFieldChange('total_cost_price', value)}
                  status={order?.status}
                  isLoadingConfirm={confirmMutation.isPending}
                  onStatusChange={() => {
                    confirmMutation.mutate();
                  }}
                  itemsTotal={itemsTotal}
                  minTotalPrice={itemsPriceTotal}
                  minCostPrice={itemsCostTotal}
                  maxCostPrice={formData.totalPrice}
                />
              </div>

              {/* Right Column: Calendário + Detalhes */}
              <div className='flex flex-col md:col-span-5 gap-6'>
                <FormCard 
                  title="Calendário de Evento" 
                  subtitle="Selecione a data do evento"
                  headerClassName="border-b"
                >
                  <EventDatePicker 
                    defaultValue={eventDateStr} 
                    name="eventDate" 
                    disabledDates={disabledDates} 
                    onValueChange={handleDateChange} 
                  />
                </FormCard>

                <FormCard 
                  title="Detalhes do Evento" 
                  subtitle="Notas e informações adicionais"
                  className="h-min"
                >
                  <FormField
                    label="Descrição do Evento"
                    id="eventDetails"
                    type="textarea"
                    minHeight="100px"
                    value={formData.eventDetails}
                    onChange={createChangeHandler('eventDetails')}
                  />
                  <FormField
                    label="Notas Internas"
                    id="internalNotes"
                    type="textarea"
                    minHeight="80px"
                    placeholder="Visível apenas internamente"
                    value={formData.internalNotes}
                    onChange={createChangeHandler('internalNotes')}
                    className="bg-yellow-50"
                  />
                </FormCard>
              </div>
            </div>

            <div className="flex gap-2">
              <Link className="px-4 py-2 rounded border inline-flex items-center" href="/dashboard/orders">Voltar</Link>
            </div>
          </form>
        </TabsContent>

        {/* ABA 2: ITENS */}
        <TabsContent value="items" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <OrderItemsTable
                items={orderItems || []}
                orderId={String(orderId)}
                onQuantityChange={(itemId, newQuantity) => {
                  updateItemMutation.mutate({ itemId, quantity: newQuantity });
                }}
                onItemRemove={(itemId) => {
                  removeItemMutation.mutate(itemId);
                }}
                onItemsAdd={(newItems) => {
                  addItemsMutation.mutate(newItems);
                }}
                isQuantityLoading={updateItemMutation.isPending}
                isRemoveLoading={removeItemMutation.isPending}
                isAddLoading={addItemsMutation.isPending}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABA 3: HISTÓRICO */}
        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <OrderTimeline events={events} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}