"use client";

import { useEffect, useMemo, useState } from "react";
import { getStrapiURL } from '@/lib/utils';

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function addMonths(d: Date, months: number) {
  return new Date(d.getFullYear(), d.getMonth() + months, 1);
}

type Day = {
  date: Date;
  isCurrentMonth: boolean;
};

function buildMonthDays(activeMonth: Date): Day[] {
  const start = startOfMonth(activeMonth);
  const startWeekDay = start.getDay(); // 0=Sunday
  const days: Day[] = [];
  // Fill leading blanks
  for (let i = 0; i < startWeekDay; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() - (startWeekDay - i));
    days.push({ date: d, isCurrentMonth: false });
  }
  // Current month days
  const month = start.getMonth();
  let d = new Date(start);
  while (d.getMonth() === month) {
    days.push({ date: new Date(d), isCurrentMonth: true });
    d.setDate(d.getDate() + 1);
  }
  // Trailing blanks to complete weeks
  while (days.length % 7 !== 0) {
    days.push({ date: new Date(d), isCurrentMonth: false });
    d.setDate(d.getDate() + 1);
  }
  return days;
}

type BlockedInfo = {
  blockedDates: Set<string>; // YYYY-MM-DD of festa (party) dates (blocked for new festa)
};

export default function CalendarPage() {
  const [month, setMonth] = useState(startOfMonth(new Date()));
  const [selected, setSelected] = useState<Date | null>(null);
  const [blocked, setBlocked] = useState<BlockedInfo>({ blockedDates: new Set() });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const days = useMemo(() => buildMonthDays(month), [month]);

  // Fetch blocked festa dates (uses existing backend endpoint getBlockedDates)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true); setError(null);
      try {
        const base = getStrapiURL();
        const res = await fetch(`${base}/api/budget/blocked-dates`);
        if (!res.ok) throw new Error('Falha ao carregar datas');
        const json = await res.json();
        if (!cancelled) {
          const arr: string[] = Array.isArray(json?.dates) ? json.dates : [];
          setBlocked({ blockedDates: new Set(arr) });
        }
      } catch (e:any) {
        if (!cancelled) setError(e.message || 'Erro ao carregar');
      } finally { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, []);

  function formatKey(date: Date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Calendário de Eventos</h1>
        <div className="flex gap-2">
          <button className="px-3 py-1 border rounded" onClick={() => setMonth(addMonths(month, -1))}>Mês anterior</button>
          <button className="px-3 py-1 border rounded" onClick={() => setMonth(addMonths(month, 1))}>Próximo mês</button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2 text-sm">
        {['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'].map((w) => (
          <div key={w} className="font-medium text-center text-gray-600">{w}</div>
        ))}
        {days.map((d, idx) => {
          const isSelected = selected && d.date.toDateString() === selected.toDateString();
          const label = d.date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
          const key = formatKey(d.date);
          const isBlockedFesta = blocked.blockedDates.has(key);
          return (
            <button
              key={idx}
              onClick={() => setSelected(new Date(d.date))}
              className={`relative aspect-square rounded border flex flex-col items-center justify-center transition-colors ${
                d.isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'
              } ${isSelected ? 'ring-2 ring-blue-600' : ''}`}
              aria-pressed={!!isSelected}
            >
              <span className="text-base font-medium">{d.date.getDate()}</span>
              {isBlockedFesta && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] px-1 py-0.5 rounded bg-rose-600 text-white leading-none">Festa</span>
              )}
              <span className="sr-only">{label}</span>
            </button>
          );
        })}
      </div>
      {selected && (
        <div className="p-3 border rounded">
          <p className="text-sm text-gray-700">Data selecionada: {selected.toLocaleDateString('pt-BR')}</p>
          <div className="mt-2">
            <a className="text-blue-600 underline" href={`/dashboard/orders?page=1&q=&status=all&date=${selected.toISOString().slice(0,10)}`}>
              Ver pedidos nesta data
            </a>
          </div>
          {blocked.blockedDates.has(formatKey(selected)) && (
            <p className="mt-2 text-xs text-rose-600">Data possui Festa agendada. Encomendas ainda são permitidas.</p>
          )}
        </div>
      )}
      <div className="text-xs text-gray-500 space-y-1">
        <p>Legenda:</p>
        <p><span className="inline-block w-3 h-3 bg-rose-600 rounded-sm align-middle mr-1" /> Festa agendada (bloqueia nova festa, permite encomendas)</p>
      </div>
      {loading && <p className="text-xs text-gray-500">Carregando datas...</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
