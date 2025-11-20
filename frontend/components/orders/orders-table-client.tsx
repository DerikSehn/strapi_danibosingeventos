"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { Calendar, CheckCircle2, Circle, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

type Order = {
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

type TableMeta = {
  pendingId: string | null;
  isPending: boolean;
  onToggleApprove: (order: Order) => void;
};

const orderColumns: ColumnDef<Order, any>[] = [
  {
    header: () => "Pedido",
    accessorFn: (row) => (row.id || row.documentId || "").toString(),
    id: "orderId",
  size: 100,
    cell: ({ getValue }) => {
      const id = getValue<string>();
      return <span className="font-mono text-md">#{id}</span>;
    },
  },
  {
    header: () => "Cliente",
    accessorFn: (row) => row.customerName || '',
    id: 'customer',
    size: 260,
    cell: ({ row }) => {
      const o = row.original;
      return (
        <div className="min-w-[12rem]">
          <div className="font-medium">{o.customerName || '-'}</div>
          <div className="text-xs text-muted-foreground">{o.customerPhone || o.customerEmail || ''}</div>
        </div>
      );
    },
  },
  {
    header: () => "Criado",
    accessorKey: "createdAt",
    cell: ({ getValue }) => {
      const v = getValue<string | undefined>();
      return v ? new Date(v).toLocaleString() : "-";
    },
  },
  {
    header: () => "Detalhes",
    accessorKey: "eventDetails",
    cell: ({ getValue }) => {
      const v = getValue<string | undefined>();
      return <span className="text-muted-foreground truncate block max-w-[24rem]">{v || '-'}</span>;
    },
  },
  {
    header: () => "Evento",
    accessorKey: "eventDate",
    cell: ({ getValue }) => {
      const v = getValue<string | null | undefined>();
      return (
        <div className="flex items-center gap-1 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {v ? new Date(v).toLocaleDateString() : '-'}
        </div>
      );
    },
  },
  {
    header: () => "Total",
    accessorKey: "totalPrice",
    cell: ({ getValue }) => `R$ ${Number(getValue<number | null | undefined>() ?? 0).toFixed(2)}`,
  },

  {
    id: "actions",
    header: () => "",
  enableResizing: false,
  size: 100,
    cell: ({ row }) => {
      const o = row.original;
      const id = (o.documentId || o.id) as string;
      return (
        <div className="text-right">
          <Link href={`/dashboard/orders/${id}`}>
            <Button variant="ghost" size="sm">Ver Pedido</Button>
          </Link>
        </div>
      );
    },
  },
];

export function OrdersTableClient({ orders: initialOrders }: { readonly orders: Order[] }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders || []);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");

  async function toggleApprove(order: Order) {
    const id = order.documentId || order.id!;
  const next = order.status === 'pendente' || order.status === 'cancelado';
    setPendingId(id);
  setOrders((prev) => prev.map((o) => (o.documentId === id || o.id === id ? { ...o, status: next ? 'confirmado' : 'pendente' } : o)));
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: next ? 'confirmado' : 'pendente' }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error?.message || "Falha ao atualizar");
      toast.success(next ? "Pedido aprovado" : "Pedido marcado como pendente");
    } catch (err: any) {
  setOrders((prev) => prev.map((o) => (o.documentId === id || o.id === id ? { ...o, status: !next ? 'confirmado' : 'pendente' } : o)));
      toast.error(err?.message || "Não foi possível atualizar o status");
    } finally {
      setPendingId(null);
    }
  }

  const table = useReactTable({
    data: orders,
    columns: orderColumns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  columnResizeMode: "onChange",
    meta: {
      pendingId,
      isPending,
      onToggleApprove: (o: Order) => startTransition(() => toggleApprove(o)),
    } satisfies TableMeta,
  });

  const kpis = useMemo(() => {
    const total = orders.length;
  const approved = orders.filter((o) => ['confirmado','em_producao','pronto','entregue'].includes(o.status as any)).length;
    const pending = total - approved;
    const amount = orders.reduce((acc, o) => acc + Number(o.totalPrice ?? 0), 0);
    return { total, approved, pending, amount };
  }, [orders]);

  if (!orders?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
        <div className="text-4xl mb-2">🍽️</div>
        <p className="font-medium">Nenhum pedido encontrado</p>
        <p className="text-sm">Ajuste os filtros acima ou tente novamente mais tarde.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700">Aprovados: {kpis.approved}</span>
        <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-700">Pendentes: {kpis.pending}</span>
        <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700">Itens na página: {kpis.total}</span>
        <span className="px-2 py-1 rounded-full bg-green-100 text-green-700">Total: {kpis.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="text-sm text-muted-foreground">Ordene clicando nos cabeçalhos</div>
        <div className="w-64">
          <Input
            placeholder="Filtro rápido nesta página..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm" style={{ width: "100%" }}>
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="text-left border-b">
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    className="p-2 select-none relative"
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder ? null : (
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 hover:underline"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        <ArrowUpDown className="h-3 w-3" />
                      </button>
                    )}
                    {header.column.getCanResize() && (
                      <button
                        type="button"
                        aria-label="Redimensionar coluna"
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        onKeyDown={(e) => {
                          if (e.key === 'ArrowLeft') {
                            const newSize = Math.max(header.getSize() - 10, 40);
                            table.setColumnSizing({
                              ...table.getState().columnSizing,
                              [header.column.id]: newSize,
                            });
                          }
                          if (e.key === 'ArrowRight') {
                            const newSize = header.getSize() + 10;
                            table.setColumnSizing({
                              ...table.getState().columnSizing,
                              [header.column.id]: newSize,
                            });
                          }
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className={`absolute right-0 top-0 h-full w-1 cursor-col-resize select-none bg-transparent ${
                          header.column.getIsResizing() ? "bg-primary/40" : "hover:bg-muted"
                        }`}
                      />
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b hover:bg-muted/30">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-2 align-middle" style={{ width: cell.column.getSize() }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
