import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CalendarClock,
  FileClock,
  History,
  PackagePlus,
  PackageSearch,
  RefreshCw,
  StickyNote,
  Tag,
} from "lucide-react";

type OrderEvent = {
  id?: string | number;
  documentId?: string;
  type: string;
  createdAt?: string;
  payload?: any;
};

function formatDateTime(iso?: string) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function formatDate(iso?: string) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "2-digit" });
}

const typeMeta: Record<string, { label: string; icon: any; variant?: string }> = {
  created: { label: "Pedido criado", icon: History },
  status_changed: { label: "Status alterado", icon: Tag },
  date_changed: { label: "Data alterada", icon: CalendarClock },
  note_added: { label: "Nota interna", icon: StickyNote },
  item_added: { label: "Item adicionado", icon: PackagePlus },
  item_updated: { label: "Item atualizado", icon: PackageSearch },
  cost_recalculated: { label: "Custo recalculado", icon: RefreshCw },
};

function renderDescription(ev: OrderEvent) {
  const p = ev.payload || {};
  switch (ev.type) {
    case "status_changed":
      if (p.from || p.to) return `Status: ${p.from || '—'} → ${p.to || '—'}`;
      return "Status alterado";
    case "date_changed":
      if (p.from || p.to) return `Data: ${formatDate(p.from)} → ${formatDate(p.to)}`;
      return "Data do evento alterada";
    case "note_added":
      if (p.snippet) return `Nota: ${p.snippet}`;
      return "Nota interna adicionada";
    case "item_added":
      if (p.item) return `Item: ${p.item}`;
      return "Item adicionado";
    case "item_updated":
      if (p.item) return `Item atualizado: ${p.item}`;
      return "Item atualizado";
    case "cost_recalculated":
      if (p.delta) return `Diferença de custo: R$ ${Number(p.delta).toFixed(2)}`;
      return "Custos recalculados";
    default:
      return typeMeta[ev.type]?.label || ev.type;
  }
}

export function OrderTimeline({ events }: { events: OrderEvent[] }) {
  const list = Array.isArray(events) ? [...events] : [];
  if (!list.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Nenhum evento registrado.</p>
        </CardContent>
      </Card>
    );
  }

  // Group by calendar date (YYYY-MM-DD)
  const groups = list.reduce<Record<string, OrderEvent[]>>((acc, ev) => {
    const day = (ev.createdAt || '').slice(0, 10);
    acc[day] = acc[day] || [];
    acc[day].push(ev);
    return acc;
  }, {});
  const orderedDays = Object.keys(groups).sort();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Timeline</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {orderedDays.map((day) => {
          const displayDay = formatDate(day);
          return (
            <div key={day} className="space-y-3">
              <div className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">{displayDay}</div>
              <ol className="relative border-l ml-2 pl-4 space-y-4">
                {groups[day].map((ev) => {
                  const meta = typeMeta[ev.type] || { label: ev.type, icon: FileClock };
                  const Icon = meta.icon || FileClock;
                  return (
                    <li key={ev.id || ev.documentId || ev.createdAt} className="flex flex-col gap-1">
                      <div className="absolute -left-3.5 w-6 h-6 rounded-full bg-white border flex items-center justify-center">
                        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-[10px] font-normal uppercase tracking-wide">
                          {meta.label}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDateTime(ev.createdAt)}
                        </span>
                      </div>
                      <div className="text-sm leading-snug text-muted-foreground">
                        {renderDescription(ev)}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

export default OrderTimeline;
