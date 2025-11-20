"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// using any for flexibility with Strapi payload
type StatusKey = "pendente" | "confirmado" | "em_producao" | "pronto" | "entregue" | "cancelado";

function categoryTotals(order: any): Record<string, number> {
  const totals: Record<string, number> = {};
  const items = Array.isArray(order?.order_items) ? order.order_items : [];
  for (const it of items) {
    const cat = it?.product_variant?.product?.category?.title || "Outros";
    const qty = Number(it?.quantity ?? 0);
    totals[cat] = (totals[cat] || 0) + qty;
  }
  return totals;
}

function groupByStatus(orders: any[]) {
  const cols: Record<StatusKey, any[]> = { pendente: [], confirmado: [], em_producao: [], pronto: [], entregue: [], cancelado: [] };
  for (const o of orders) {
  const s: StatusKey = (o?.status || 'pendente') as StatusKey;
    (cols[s] || cols.pendente).push(o);
  }
  return cols;
}

export function KanbanBoard({ initialOrders }: Readonly<{ initialOrders: any[] }>) {
  const [, startTransition] = useTransition();
  const [columns, setColumns] = useState<Record<StatusKey, any[]>>(() => groupByStatus(initialOrders || []));

  const counts = useMemo(() => ({
    pendente: columns.pendente.length,
    confirmado: columns.confirmado.length,
    em_producao: columns.em_producao.length,
    pronto: columns.pronto.length,
    entregue: columns.entregue.length,
    cancelado: columns.cancelado.length,
  }), [columns]);

  function moveCardLocal(id: string, to: StatusKey) {
    setColumns((prev) => {
  const next: Record<StatusKey, any[]> = { pendente: [], confirmado: [], em_producao: [], pronto: [], entregue: [], cancelado: [] };
  let moving: Record<string, any> | null = null;
      for (const key of Object.keys(prev) as StatusKey[]) {
        for (const o of prev[key]) {
          const oid = o.documentId || o.id;
          if (!moving && (oid === id)) {
            moving = { ...o, status: to };
          } else {
            next[key].push(o);
          }
        }
      }
      if (moving) next[to].unshift(moving);
      return next;
    });
  }

  async function updateStatus(id: string, to: StatusKey) {
    // Guard: cannot move to 'pronto' without a defined eventDate
    if (to === 'pronto') {
      const current = Object.values(columns).flat().find((o) => (o.documentId || o.id) === id);
      if (current && !current.eventDate) {
        toast.error('Defina a data do evento antes de marcar como Pronto.');
        throw new Error('Missing eventDate');
      }
    }
    const res = await fetch(`/api/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: to }),
    });
    if (!res.ok) {
      const msg = await res.text();
      throw new Error(msg || "Falha ao atualizar status");
    }
  }

  function onDropCard(e: React.DragEvent, to: StatusKey) {
    e.preventDefault();
    try {
      const id = e.dataTransfer.getData("text/plain");
      if (!id) return;
      moveCardLocal(id, to);
      startTransition(async () => {
        try {
          await updateStatus(id, to);
          const labels: Record<StatusKey, string> = {
            pendente: 'Pedido marcado como pendente',
            confirmado: 'Pedido confirmado',
            em_producao: 'Movido para produção',
            pronto: 'Pedido pronto',
            entregue: 'Pedido entregue',
            cancelado: 'Pedido cancelado',
          };
          toast.success(labels[to] || 'Status atualizado');
        } catch (err: any) {
          toast.error(err?.message || "Erro ao salvar status");
        }
      });
    } catch {}
  }

  function allowDrop(e: React.DragEvent) {
    e.preventDefault();
  }

  function onDragStart(e: React.DragEvent, id: string) {
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
  }

  const cols = [
    { key: "pendente" as StatusKey, title: `Pendente (${counts.pendente})` },
    { key: "confirmado" as StatusKey, title: `Confirmado (${counts.confirmado})` },
    { key: "em_producao" as StatusKey, title: `Em produção (${counts.em_producao})` },
    { key: "pronto" as StatusKey, title: `Pronto (${counts.pronto})` },
    { key: "entregue" as StatusKey, title: `Entregue (${counts.entregue})` },
    { key: "cancelado" as StatusKey, title: `Cancelado (${counts.cancelado})` },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {cols.map((col) => (
        <Card key={col.key} onDragOver={allowDrop} onDrop={(e) => onDropCard(e, col.key)}>
          <CardHeader>
            <CardTitle>{col.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 min-h-[200px]">
            {columns[col.key].length === 0 && (
              <div className="text-sm text-gray-500">Sem pedidos.</div>
            )}
            {columns[col.key].map((o) => {
              const id = o.documentId || o.id;
              const customer = o.customerName || "Cliente";
              const date = o.eventDate ? new Date(o.eventDate).toLocaleDateString("pt-BR") : "-";
              const totals = categoryTotals(o);
              const totalPairs = Object.entries(totals);
              const status: StatusKey = (o.status || 'pendente') as StatusKey;
              const statusLabel: Record<StatusKey, string> = {
                pendente: 'Pendente',
                confirmado: 'Confirmado',
                em_producao: 'Em produção',
                pronto: 'Pronto',
                entregue: 'Entregue',
                cancelado: 'Cancelado',
              };
              // SLA days derived from backend (sla_days) or computed here
              const sla = (() => {
                if (typeof o.sla_days === 'number') return o.sla_days;
                if (!o.eventDate) return null;
                try {
                  const today = new Date(); today.setHours(0,0,0,0);
                  const ev = new Date(o.eventDate); ev.setHours(0,0,0,0);
                  return Math.round((ev.getTime() - today.getTime()) / 86400000);
                } catch { return null; }
              })();
              let slaLabel: string | null = null;
              if (sla != null) {
                if (sla < 0) slaLabel = `ATRASO ${Math.abs(sla)}`; else if (sla === 0) slaLabel = 'HOJE'; else slaLabel = `D-${sla}`;
              }
              const latestEvent = Array.isArray(o.order_events) && o.order_events.length > 0 ? o.order_events[0] : null;
              const latestEventText = latestEvent ? (() => {
                const t = latestEvent.type;
                const createdAt = latestEvent.createdAt ? new Date(latestEvent.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '';
                const labels: Record<string,string> = { created: 'Criado', status_changed: 'Status', date_changed: 'Data', note_added: 'Nota', item_added: 'Item+', item_updated: 'Item', cost_recalculated: 'Custo' };
                return `${labels[t] || t} ${createdAt}`.trim();
              })() : null;
              return (
       <div key={id}
                     draggable
                     onDragStart={(e) => onDragStart(e, id)}
         role="button"
         tabIndex={0}
         className="block border rounded p-3 hover:bg-muted/50 bg-white">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="text-xs text-muted-foreground">Pedido #{(o.id || o.documentId || '').toString().slice(0, 8)}</div>
                      <div className="font-medium">
                        <Link href={`/dashboard/orders/${id}`} className="hover:underline">{customer}</Link>
                      </div>
                      <div className="text-sm text-muted-foreground">Evento: {date}</div>
                      {latestEventText && (
                        <div className="text-[10px] uppercase tracking-wide text-muted-foreground mt-0.5">{latestEventText}</div>
                      )}
                    </div>
                    <div className="text-right">
                      <Badge variant={status === 'pendente' || status === 'cancelado' ? 'outline' : 'secondary'}>
                        {statusLabel[status]}
                      </Badge>
                      {slaLabel && (
                        <div>
                          <Badge variant={slaLabel.startsWith('ATRASO') ? 'destructive' : slaLabel === 'HOJE' ? 'secondary' : 'outline'} className="text-[10px] font-normal">{slaLabel}</Badge>
                        </div>
                      )}
                      {/* Quick actions */}
                      <div className="mt-2 flex justify-end">
                        {o.customerPhone && (() => {
                          const phone = String(o.customerPhone).replace(/\D/g, '');
                          const orderShort = (o.id || o.documentId || '').toString().slice(0, 8);
                          const msg = `Olá ${customer}, aqui é da Dani Bosing Eventos. Sobre o pedido #${orderShort}.`;
                          const link = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
                          return (
                            <a className="text-xs text-green-600 underline" target="_blank" rel="noreferrer" href={link}>
                              WhatsApp
                            </a>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                  {totalPairs.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {totalPairs.map(([cat, qty]) => (
                        <Badge key={cat} variant="outline">{cat}: {qty as any}</Badge>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
