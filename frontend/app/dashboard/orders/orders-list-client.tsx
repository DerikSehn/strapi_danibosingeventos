"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from 'next-view-transitions';
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  ArrowUpDown,
  Plus,
  Package,
  ShoppingCart,
  Settings,
  DollarSign,
  FileText
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/components/datatable/DataTable";
import { orderColumns, Order } from "@/components/orders/orders-columns";
import { PaginatedResponse } from "@/components/datatable/DynamicTable";
import { cn } from "@/lib/utils";
import { DeleteOrderButton } from "@/components/orders/delete-order-button";

interface OrdersListClientProps {
  initialData?: PaginatedResponse<Order>;
  fetchOrders: (params: any) => Promise<PaginatedResponse<Order>>;
}

export function OrdersListClient({ initialData, fetchOrders }: OrdersListClientProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['orders', page, limit, search, statusFilter],
    queryFn: () => fetchOrders({ 
      page, 
      limit, 
      q: search, 
      filters: statusFilter ? { status: { $eq: statusFilter } } : undefined 
    }),
    initialData: page === 1 && !search && !statusFilter ? initialData : undefined,
    placeholderData: (previousData) => previousData,
  });

  const orders = data?.data || [];
  const meta = data?.meta;

  const statusColors: Record<string, string> = {
    pendente: "bg-yellow-100 text-yellow-800 border-yellow-200",
    confirmado: "bg-blue-100 text-blue-800 border-blue-200",
    em_producao: "bg-purple-100 text-purple-800 border-purple-200",
    pronto: "bg-green-100 text-green-800 border-green-200",
    entregue: "bg-gray-100 text-gray-800 border-gray-200",
    cancelado: "bg-red-100 text-red-800 border-red-200",
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  const pageTotalValue = orders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 space-y-6 pb-20 md:pb-0">
      {/* Mobile Header - Bank Style */}
      <div className="md:hidden bg-primary-500 text-white pt-8 pb-24 px-6 rounded-b-[2.5rem] shadow-xl relative overflow-hidden transition-all duration-300">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Package size={140} />
        </div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/10">
                <ShoppingCart className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-primary-100 text-xs font-medium uppercase tracking-wider">Gerenciamento</p>
                <h1 className="text-xl font-bold">Pedidos</h1>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors backdrop-blur-sm border border-white/10">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">
             {/* Card 1: Total */}
             <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-3 flex flex-col justify-between relative overflow-hidden">
                <div className="flex items-center gap-2 mb-2">
                   <div className="p-1.5 rounded-lg bg-white/20">
                      <Package className="h-3.5 w-3.5 text-white" />
                   </div>
                   <span className="text-[10px] font-medium text-primary-100 uppercase tracking-wider">Total</span>
                </div>
                <div className="flex items-baseline gap-1">
                   <span className="text-2xl font-bold text-white">{meta?.total || 0}</span>
                   <span className="text-[10px] text-primary-100">pedidos</span>
                </div>
             </div>

             {/* Card 2: Valor em Tela */}
             <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-3 flex flex-col justify-between relative overflow-hidden">
                <div className="flex items-center gap-2 mb-2">
                   <div className="p-1.5 rounded-lg bg-white/20">
                      <DollarSign className="h-3.5 w-3.5 text-white" />
                   </div>
                   <span className="text-[10px] font-medium text-primary-100 uppercase tracking-wider">Em Tela</span>
                </div>
                <div className="flex items-baseline gap-1">
                   <span className="text-lg font-bold text-white truncate">
                      {formatCurrency(pageTotalValue)}
                   </span>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Search & Actions Card - Overlapping Header */}
      <div className="md:hidden px-4 -mt-16 relative z-20 mb-4">
        <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-100 flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5">
              <Search className="text-gray-400 h-4 w-4" />
              <input 
                className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400 min-w-0"
                placeholder="Buscar cliente, ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-1 pr-1">
              <Link href="/dashboard/orders/new" className="h-10 w-10 rounded-xl bg-primary-500 text-white flex items-center justify-center shadow-md shadow-primary-200 active:scale-95 transition-all">
                <Plus className="h-5 w-5" />
              </Link>
            </div>
        </div>
      </div>

      {/* Status Filters - Horizontal Scroll */}
      <div className="md:hidden px-4">
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar mask-linear-fade">
           <button
              onClick={() => setStatusFilter(null)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shadow-sm",
                !statusFilter 
                  ? 'bg-gray-900 text-white shadow-gray-200' 
                  : 'bg-white text-gray-600 border border-gray-100'
              )}
           >
             Todos
           </button>
           {['pendente', 'confirmado', 'em_producao', 'pronto'].map((status) => (
             <button
                key={status}
                onClick={() => setStatusFilter(statusFilter === status ? null : status)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shadow-sm border",
                  statusFilter === status 
                    ? 'bg-primary-100 text-primary-700 border-primary-200' 
                    : 'bg-white text-gray-600 border-gray-100'
                )}
             >
               {status.replace('_', ' ').toUpperCase()}
             </button>
           ))}
        </div>
      </div>

      {/* Desktop Header & Actions */}

      {/* Mobile List View (Banking Style) */}
      <div className="md:hidden space-y-3 px-4 md:px-0">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white p-4 rounded-xl border shadow-sm space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))
        ) : orders.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Nenhum pedido encontrado
          </div>
        ) : (
          orders.map((order) => (
            <div 
              key={order.id || order.documentId} 
              className="bg-white p-4 rounded-xl border shadow-sm relative"
            >
              <Link 
                href={`/dashboard/orders/${order.documentId || order.id}`}
                className="block"
              >
                <div className="flex justify-between items-start mb-3 pr-8">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-gray-500">#{order.id || order.documentId}</span>
                    <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 h-5 ${statusColors[order.status || 'pendente']}`}>
                      {order.status}
                    </Badge>
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    {formatCurrency(order.totalPrice || 0)}
                  </span>
                </div>

                <h3 className="font-semibold text-gray-900 mb-1 truncate pr-8">
                  {order.customerName || 'Cliente sem nome'}
                </h3>

                <div className="flex items-center gap-4 text-xs text-gray-500 mt-3 pt-3 border-t border-gray-50">
                  <div className="flex items-center gap-1.5" title="Data do Evento">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(order.eventDate)}
                  </div>
                  {order.eventDate && order.eventDate.includes('T') && (
                     <div className="flex items-center gap-1.5">
                       <Clock className="h-3.5 w-3.5" />
                       {order.eventDate.split('T')[1].substring(0, 5)}
                     </div>
                  )}
                  <div className="flex items-center gap-1.5 ml-auto" title="Data de Criação">
                    <FileText className="h-3.5 w-3.5" />
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'}) : '-'}
                  </div>
                </div>
              </Link>
              <div className="absolute top-3 right-3">
                <DeleteOrderButton orderId={(order.documentId || order.id) as string} />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-lg border shadow-sm overflow-hidden">
        <DataTable 
          columns={orderColumns} 
          data={orders} 
          loading={isLoading}
          page={page}
          pageCount={meta?.pageCount}
          onPageChange={setPage}
          limit={limit}
          onLimitChange={setLimit}
        />
      </div>
    </div>
  );
}
