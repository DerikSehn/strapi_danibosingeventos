"use client";

import { ColumnDef } from '@tanstack/react-table';
import { Calendar } from 'lucide-react';
import OrderDetailButton from '@/components/orders/order-detail-button';
import { DeleteOrderButton } from './delete-order-button';
 
export type Order = {
  id?: string;
  documentId?: string;
  createdAt?: string;
  eventDetails?: string;
  eventDate?: string | null;
  totalPrice?: number | null;
  status?: 'pendente' | 'confirmado' | 'em_producao' | 'pronto' | 'entregue' | 'cancelado';
  customerName?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;
};

export const orderColumns: ColumnDef<Order, any>[] = [
  {
    header: "Pedido",
    accessorFn: (row) => (row.id || row.documentId || "").toString(),
    id: "orderId",
    cell: ({ getValue }) => {
      const id = getValue<string>();
      return <span className="font-mono text-sm">#{id}</span>;
    },
  },
  {
    header: "Cliente",
    accessorFn: (row) => row.customerName || '',
    id: 'customer',
    cell: ({ row }) => {
      const o = row.original;
      return (
        <div className="min-w-[200px]">
          <div className="font-medium text-sm">{o.customerName || '-'}</div>
          <div className="text-xs text-muted-foreground">{o.customerPhone || o.customerEmail || ''}</div>
        </div>
      );
    },
  },
  {
    header: "Criado",
    accessorKey: "createdAt",
    cell: ({ getValue }) => {
      const v = getValue<string | undefined>();
      return <span className="text-sm">{v ? new Date(v).toLocaleString('pt-BR') : "-"}</span>;
    },
  },
  {
    header: "Detalhes",
    accessorKey: "eventDetails",
    cell: ({ getValue }) => {
      const v = getValue<string | undefined>();
      return <span className="text-muted-foreground truncate block max-w-xs text-sm">{v || '-'}</span>;
    },
  },
  {
    header: "Evento",
    accessorKey: "eventDate",
    cell: ({ getValue }) => {
      const v = getValue<string | null | undefined>();
      return (
        <div className="flex items-center gap-1 text-muted-foreground text-sm">
          <Calendar className="h-4 w-4" />
          {v ? new Date(v).toLocaleDateString('pt-BR') : '-'}
        </div>
      );
    },
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ getValue }) => {
      const status = getValue<string | undefined>();
      const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
        pendente: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Pendente' },
        confirmado: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Confirmado' },
        em_producao: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Em Produção' },
        pronto: { bg: 'bg-green-100', text: 'text-green-800', label: 'Pronto' },
        entregue: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Entregue' },
        cancelado: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelado' },
      };
      const config = statusConfig[status || ''] || statusConfig.pendente;
      return <span className={`px-2 py-1 rounded text-xs font-medium ${config.bg} ${config.text}`}>{config.label}</span>;
    },
  },
  {
    header: "Total",
    accessorKey: "totalPrice",
    cell: ({ getValue }) => `R$ ${Number(getValue<number | null | undefined>() ?? 0).toFixed(2)}`,
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const o = row.original;
      const id = (o.documentId || o.id) as string;
      return (
        <div className="flex items-center justify-end gap-2">
          <OrderDetailButton orderId={id} />
          <DeleteOrderButton orderId={id} />
        </div>
      );
    },
  },
];
