'use client';

import { useProfitByCategory } from '@/lib/hooks/useFinances';
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export function ProfitByCategoryChart() {
  const { data, isLoading, error } = useProfitByCategory();

  if (isLoading) {
    return (
      <div className="p-6 bg-white border border-slate-200 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Lucro por Categoria
        </h3>
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 bg-white border border-slate-200 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Lucro por Categoria
        </h3>
        <p className="text-sm text-red-600">Erro ao carregar dados</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white border border-slate-200 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">
        Lucro por Categoria
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ category, percentage }: any) =>
              `${category}: ${percentage}%`
            }
            outerRadius={80}
            fill="#8884d8"
            dataKey="profit"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => formatCurrency(value as number)}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
