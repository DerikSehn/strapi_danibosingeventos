'use client';

import { useFinancialSummary, useAverageMetrics } from '@/lib/hooks/useFinances';
import { MetricCard, MetricCardSkeleton } from '@/components/ui/metric-card';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, DollarSign, Zap, Package } from 'lucide-react';

export function FinancialMetricsClient() {
  const { data: summary, isLoading: summaryLoading } = useFinancialSummary();
  const { data: avgMetrics, isLoading: avgLoading } = useAverageMetrics();

  const skeletons = Array.from({ length: 4 });

  if (summaryLoading || avgLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {skeletons.map((_, i) => (
          <MetricCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!summary || !avgMetrics) {
    return <div>Erro ao carregar métricas</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        label="Receita Total"
        value={formatCurrency(summary.totalRevenue)}
        icon={<DollarSign className="w-5 h-5" />}
        trend={12.5}
        trendLabel="vs mês anterior"
        subText={`${summary.totalOrders} pedidos`}
      />

      <MetricCard
        label="Lucro Total"
        value={formatCurrency(summary.totalProfit)}
        icon={<TrendingUp className="w-5 h-5" />}
        trend={8.2}
        trendLabel="vs mês anterior"
        subText={`Margem: ${summary.profitMargin.toFixed(1)}%`}
      />

      <MetricCard
        label="Custo Total"
        value={formatCurrency(summary.totalCost)}
        icon={<Zap className="w-5 h-5" />}
        trend={-2.1}
        trendLabel="vs mês anterior"
        subText={`${((summary.totalCost / summary.totalRevenue) * 100).toFixed(1)}% da receita`}
      />

      <MetricCard
        label="Ticket Médio"
        value={formatCurrency(summary.averageOrderValue)}
        icon={<Package className="w-5 h-5" />}
        trend={5.3}
        trendLabel="vs mês anterior"
        subText={`Lucro por pedido: ${formatCurrency(avgMetrics.avgProfitPerOrder)}`}
      />
    </div>
  );
}
