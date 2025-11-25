'use client';

import { useMonthlyTrend } from '@/lib/hooks/useFinances';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export function MonthlyTrendChart() {
  const { data, isLoading, error } = useMonthlyTrend();

  if (isLoading) {
    return (
      <div className="p-6 bg-white border border-slate-200 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Tendência Mensal
        </h3>
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 bg-white border border-slate-200 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Tendência Mensal
        </h3>
        <p className="text-sm text-red-600">Erro ao carregar dados</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white border border-slate-200 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">
        Tendência Mensal
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="month" stroke="#64748b" />
          <YAxis stroke="#64748b" />
          <Tooltip
            formatter={(value) => formatCurrency(value as number)}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#3b82f6"
            fillOpacity={1}
            fill="url(#colorRevenue)"
            name="Receita"
          />
          <Area
            type="monotone"
            dataKey="cost"
            stroke="#ef4444"
            fillOpacity={1}
            fill="url(#colorCost)"
            name="Custo"
          />
          <Area
            type="monotone"
            dataKey="profit"
            stroke="#10b981"
            fillOpacity={1}
            fill="url(#colorProfit)"
            name="Lucro"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
