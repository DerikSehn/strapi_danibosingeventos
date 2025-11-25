'use client';

import { useTopProducts } from '@/lib/hooks/useFinances';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export function TopProductsChart() {
  const { data, isLoading, error } = useTopProducts();

  if (isLoading) {
    return (
      <div className="p-6 bg-white border border-slate-200 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Produtos Mais Vendidos
        </h3>
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 bg-white border border-slate-200 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Produtos Mais Vendidos
        </h3>
        <p className="text-sm text-red-600">Erro ao carregar dados</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white border border-slate-200 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">
        Produtos Mais Vendidos
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="name"
            stroke="#64748b"
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis stroke="#64748b" />
          <Tooltip
            formatter={(value) =>
              typeof value === 'number' ? formatCurrency(value) : value
            }
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Bar
            dataKey="revenue"
            fill="#3b82f6"
            name="Receita"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="cost"
            fill="#ef4444"
            name="Custo"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="profit"
            fill="#10b981"
            name="Lucro"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
