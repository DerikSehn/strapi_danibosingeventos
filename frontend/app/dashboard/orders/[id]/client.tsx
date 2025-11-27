"use client";

import { useState } from "react";
import { Link } from 'next-view-transitions';
import { useQuery } from "@tanstack/react-query";
import { Loader2, Package, User, Calendar, MapPin, ChevronLeft, Eye, EyeOff, MoreVertical, Clock } from "lucide-react";
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
  // const updateItemMutation = useUpdateItemMutation(orderId!, handleItemsUpdated);
  // const removeItemMutation = useRemoveItemMutation(orderId!, handleItemsUpdated);
  // const addItemsMutation = useAddItemsMutation(orderId!, handleItemsUpdated);

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



  const [showValues, setShowValues] = useState(true);

  return (
    <div className="space-y-4 sm:space-y-6 px-3 sm:px-0 lg:min-w-[1120px] pb-24 md:pb-0">
      {/* Mobile Header - Nubank Style */}
      <div className="md:hidden bg-primary-500 text-white pt-8 pb-6 px-6 -mx-3 -mt-4 mb-6 rounded-b-[2rem] shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Package size={120} />
        </div>
        
        <div className="relative z-10">
          {/* Top Row: Back & Actions */}
          <div className="flex justify-between items-start mb-6">
            <Link href="/dashboard/orders" className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm hover:bg-white/30 transition-colors">
              <ChevronLeft className="h-6 w-6 text-white" />
            </Link>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowValues(!showValues)}
                className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm hover:bg-white/30 transition-colors"
              >
                {showValues ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
              </button>
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm hover:bg-white/30 transition-colors">
                 <QuoteActionButtons orderId={docId} customerEmail={customerEmail} layout="mobile" />
              </div>
            </div>
          </div>

          {/* Order Info */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-secondary-100 text-sm font-medium">Pedido #{displayId}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                order?.status === 'confirmado' ? 'bg-green-400/20 text-green-100' : 'bg-yellow-400/20 text-yellow-100'
              }`}>
                {order?.status || 'Pendente'}
              </span>
            </div>
            <h1 className="text-xl font-bold truncate">{customerName || 'Cliente sem nome'}</h1>
          </div>

          {/* Total Value */}
          <div className="mb-6">
            <p className="text-secondary-100 text-sm mb-1">Valor Total</p>
            <h2 className="text-3xl font-bold tracking-tight">
              {showValues 
                ? formData.totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                : 'R$ ••••'
              }
            </h2>
          </div>

          {/* Date & Time Block (Mobile Only) */}
          <div className="flex gap-3">
              {/* Date Card */}
              <div className="flex-1 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-3 flex flex-col justify-center items-center text-center relative overflow-hidden">
                {(() => {
                   const dateObj = eventDateStr ? new Date(eventDateStr.split('T')[0] + 'T12:00:00') : null;
                   if (!dateObj) return <span className="text-white/60 text-xs">Sem data</span>;
                   return (
                     <>
                       <div className="text-[10px] uppercase text-white/80 font-medium tracking-wide">{dateObj.toLocaleString("pt-BR", { month: "short" }).toUpperCase()}.</div>
                       <div className="text-3xl font-bold leading-none my-1 text-white">{dateObj.getDate()}</div>
                       <div className="text-[10px] text-white/80 lowercase">{dateObj.toLocaleString("pt-BR", { weekday: "short" })}.</div>
                     </>
                   );
                })()}
              </div>

              {/* Time Card */}
              <div className="flex-1 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-3 flex flex-col items-center justify-center gap-1">
                 <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center mb-1">
                    <Clock className="h-4 w-4 text-white" />
                 </div>
                 <div className="text-xl font-bold text-white tracking-tighter">
                   {eventDateStr && eventDateStr.includes('T') ? eventDateStr.split('T')[1].substring(0, 5) : '18:00'}
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block mb-6">
        <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold truncate">Pedido {displayId}</h1>
              <p className="text-sm text-gray-600 truncate">Criado em {createdAt}</p>
            </div>
            <div className="flex items-center gap-3">
              <Link className="text-blue-600 text-sm hover:underline" href="/dashboard/orders">Voltar</Link>
              <QuoteActionButtons orderId={docId} customerEmail={customerEmail} />
            </div>
        </div>
          
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-none shadow-sm">
            <CardContent className="pt-4 px-6">
              <OrderStepper currentStatus={order?.status as any} />
            </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:flex h-auto bg-gray-100/50 p-1 gap-1">
          <TabsTrigger value="details" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Detalhes</TabsTrigger>
          <TabsTrigger value="budget" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Orçamento</TabsTrigger>
          <TabsTrigger value="calendar" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Calendário</TabsTrigger>
          <TabsTrigger value="items" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Itens ({orderItems?.length || 0})</TabsTrigger>
          <TabsTrigger value="timeline" className="col-span-2 md:col-span-1 data-[state=active]:bg-white data-[state=active]:shadow-sm">Histórico</TabsTrigger>
        </TabsList>

        {/* ABA 1: DETALHES (CLIENTE) */}
        <TabsContent value="details" className="space-y-6">
          <form className="grid gap-6">
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
          </form>
        </TabsContent>

        {/* ABA 2: ORÇAMENTO */}
        <TabsContent value="budget" className="space-y-6">
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
        </TabsContent>

        {/* ABA 3: CALENDÁRIO */}
        <TabsContent value="calendar" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
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
        </TabsContent>

        {/* ABA 2: ITENS */}
        <TabsContent value="items" className="space-y-4">
          <Card className="border-none shadow-none md:border md:shadow-sm">
            <CardContent className="p-0 md:pt-6 md:px-6">
              <OrderItemsTable
                items={orderItems || []}
                orderId={String(orderId)}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABA 3: HISTÓRICO */}
        <TabsContent value="timeline" className="space-y-4">
          <Card className="border-none shadow-none md:border md:shadow-sm">
            <CardContent className="p-0 md:pt-6 md:px-6">
              <OrderTimeline events={events} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}