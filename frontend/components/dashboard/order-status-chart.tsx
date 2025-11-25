'use client';

import { useOrderStatus } from '@/lib/hooks/useFinances';
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

export function OrderStatusChart() {
  const { data, isLoading, error } = useOrderStatus();

  if (isLoading) {
    return (
      <div className="p-6 bg-white border border-slate-200 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Pedidos por Status
        </h3>
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 bg-white border border-slate-200 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Pedidos por Status
        </h3>
        <p className="text-sm text-red-600">Erro ao carregar dados</p>
      </div>
    );
  }

  // Mapeamento de status para cores
  const statusColorMap: Record<string, string> = {
    entregue: '#10b981',
    pendente: '#f59e0b',
    cancelado: '#ef4444',
    processando: '#3b82f6',
  };

  return (
    <div className="p-6 bg-white border border-slate-200 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">
        Pedidos por Status
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="status" stroke="#64748b" />
          <YAxis stroke="#64748b" />
          <Tooltip
            formatter={(value, name) => {
              if (name === 'revenue') {
                return formatCurrency(value as number);
              }
              return value;
            }}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Bar
            dataKey="count"
            fill="#3b82f6"
            name="Quantidade"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="revenue"
            fill="#10b981"
            name="Receita"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
