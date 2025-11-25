"use client";
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { FinancialMetricsClient } from '@/components/dashboard/financial-metrics-client';
import { MonthlyTrendChart } from '@/components/dashboard/monthly-trend-chart';
import { TopProductsChart } from '@/components/dashboard/top-products-chart';
import { ProfitByCategoryChart } from '@/components/dashboard/profit-by-category-chart';
import { OrderStatusChart } from '@/components/dashboard/order-status-chart';
import DashboardHeader from '@/components/dashboard/dashboard-header';

export default function FinancesPage() {

  return (
    <div className="space-y-8">
      <DashboardHeader
        title="Finanças"
        description="Análise completa de receitas, custos e lucros"
      />

      {/* Métricas Principais */}
      <FinancialMetricsClient />

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonthlyTrendChart />
        <TopProductsChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProfitByCategoryChart />
        <OrderStatusChart />
      </div>
    </div>
  );
}