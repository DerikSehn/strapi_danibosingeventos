"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";

function isValid(d: any) {
    return d instanceof Date && !isNaN(d as any);
}

function parseDateTime(input?: string | null): { date?: Date; time: string } {
    if (!input || typeof input !== "string") return { date: undefined, time: "18:00" };
    // Normalize by splitting date and time; ignore timezone to avoid day shift
    const [datePart, timePartRaw] = input.split("T");
    if (datePart) {
        const [y, m, d] = datePart.split("-").map((n) => parseInt(n, 10));
        const date = y && m && d ? new Date(y, m - 1, d) : undefined;
        // Extract HH:mm if present
        let time = "18:00";
        if (timePartRaw) {
            // If backend returned ISO with timezone (e.g., ...Z or +00:00), convert to local HH:mm
            const hasTZ = /Z$|[+-]\d{2}:?\d{2}$/.test(input);
            if (hasTZ) {
                const dt = new Date(input);
                if (isValid(dt)) {
                    const hh = String(dt.getHours()).padStart(2, "0");
                    const mm = String(dt.getMinutes()).padStart(2, "0");
                    time = `${hh}:${mm}`;
                }
            } else {
                const m = /(\d{2}):(\d{2})/.exec(timePartRaw);
                if (m) time = `${m[1]}:${m[2]}`;
            }
        }
        return { date, time };
    }
    // No T present: expect yyyy-MM-dd
    const [y, m, dd] = input.split("-").map((n) => parseInt(n, 10));
    if (y && m && dd) return { date: new Date(y, m - 1, dd), time: "18:00" };
    return { date: undefined, time: "18:00" };
}

function formatYMD(date: Date | undefined): string {
    if (!date) return "";
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

export function EventDatePicker({ defaultValue, name = "eventDate", disabledDates = [], onValueChange }: { readonly defaultValue?: string; readonly name?: string; readonly disabledDates?: string[]; readonly onValueChange?: (value: string) => void }) {
    const parsed = useMemo(() => parseDateTime(defaultValue), [defaultValue]);
    const [selected, setSelected] = useState<Date | undefined>(() => parsed.date || new Date());
    const [month, setMonth] = useState<Date>(() => parsed.date || new Date());
    const [time, setTime] = useState<string>(() => parsed.time);
    // If defaultValue changes (navegação entre pedidos), re-sincroniza estado
    useEffect(() => {
        if (parsed.date) {
            setSelected(parsed.date);
            setMonth(parsed.date);
        }
        setTime(parsed.time);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultValue]);

    // precomputed tile strings
    const tile = useMemo(() => {
        const monthName = selected?.toLocaleString("pt-BR", { month: "short" }).toUpperCase() ?? "";
        const day = selected?.getDate() ?? undefined;
        const weekday = selected?.toLocaleString("pt-BR", { weekday: "short" }) ?? "";
        return { month: monthName, day, weekday };
    }, [selected]);

    // keep hidden input value in sync (combine date + time)
    const [value, setValue] = useState<string>(() => {
        const ymd = formatYMD(selected);
        return ymd && time ? `${ymd}T${time}` : ymd;
    });
    useEffect(() => {
        const ymd = formatYMD(selected);
        const next = ymd && time ? `${ymd}T${time}` : ymd;
        setValue(next);
        if (onValueChange) onValueChange(next);
    }, [selected, time]);

    // helpers
    const today = useMemo(() => {
        const t = new Date();
        t.setHours(0, 0, 0, 0);
        return t;
    }, []);

    // Disable days: 1) explicit disabledDates from backend (other orders), 2) days before today.
    // Always allow the initially selected date (even if it appears in lists) to permit edits.
    const disabledMatcher = useMemo(() => {
        const initialYmd = parsed.date ? formatYMD(parsed.date) : undefined;
        const disabledSet = new Set<string>((disabledDates || []).filter(Boolean));
        return (d: Date) => {
            const ymd = formatYMD(d);
            if (initialYmd && ymd === initialYmd) return false;
            if (disabledSet.has(ymd)) return true;
            const isBeforeToday = d < today; // DayPicker supplies midnight Date objects
            if (isBeforeToday) return true;
            return false;
        };
    }, [parsed.date, today, disabledDates]);

    return (
        <div className="flex flex-col gap-4">
            {/* Time and summary (right) */}
            <div className=" flex gap-3 justify-between">

                <div className="rounded-lg  p-3 bg-gray-50">
                    <div className="text-xs uppercase text-gray-600">{tile.month}</div>
                    <div className="text-3xl font-bold leading-none">{tile.day ?? '-'}</div>
                    <div className="text-xs text-gray-500">{tile.weekday}</div>
                    <div className="mt-2 text-sm text-gray-700">
                        {selected ? selected.toLocaleDateString("pt-BR") : "-"} {time ? `às ${time}` : ""}
                    </div>
                </div>
                <div>

                    <input
                        id={`${name}-time`}
                        type="time"
                        step={900}
                        className="border rounded px-3 py-2 w-full h-full font-food text-4xl"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                    />
                </div>
                {/* Hidden combined value */}
                <input type="hidden" name={name} value={value} />
            </div>

            <div className="md:col-span-2 rounded-lg border bg-gray-50 p-3">
                <Calendar
                    mode="single"
                    locale={ptBR as any}
                    month={month}
                    onMonthChange={setMonth}
                    selected={selected}
                    onSelect={setSelected}
                    disabled={disabledMatcher}
                    initialFocus
                    className="w-full p-0"
                    classNames={{ nav: "hidden", caption: "hidden", caption_label: "hidden" }}
                    components={{ Caption: () => null }}
                    footer={(
                        <div className="mt-3 flex items-center justify-between gap-3">
                            <button
                                type="button"
                                aria-label="Mês anterior"
                                className="h-9 w-9 inline-flex items-center justify-center rounded-full border bg-white hover:bg-muted"
                                onClick={() => setMonth((m) => { const d = new Date(m); d.setMonth(d.getMonth() - 1); return d; })}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <div className="text-sm font-medium select-none">
                                {month.toLocaleString("pt-BR", { month: "long", year: "numeric" })}
                            </div>
                            <button
                                type="button"
                                aria-label="Próximo mês"
                                className="h-9 w-9 inline-flex items-center justify-center rounded-full border bg-white hover:bg-muted"
                                onClick={() => setMonth((m) => { const d = new Date(m); d.setMonth(d.getMonth() + 1); return d; })}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                />
            </div>

        </div>
    );
}

export default EventDatePicker;
