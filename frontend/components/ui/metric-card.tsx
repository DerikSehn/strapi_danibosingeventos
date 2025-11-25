'use client';

import { formatCurrency } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  isLoading?: boolean;
  subText?: string;
}

export function MetricCard({
  label,
  value,
  icon,
  trend,
  trendLabel,
  isLoading,
  subText,
}: MetricCardProps) {
  if (isLoading) {
    return (
      <div className="p-6 bg-white border border-slate-200 rounded-lg shadow-sm">
        <Skeleton className="h-4 w-24 mb-3" />
        <Skeleton className="h-8 w-32 mb-2" />
        <Skeleton className="h-3 w-20" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-600">{label}</h3>
        {icon && <div className="text-slate-400">{icon}</div>}
      </div>

      <div className="space-y-2">
        <p className="text-2xl font-bold text-slate-900">{value}</p>

        {subText && <p className="text-xs text-slate-500">{subText}</p>}

        {trend !== undefined && (
          <div className="flex items-center gap-1 pt-1">
            {trend >= 0 ? (
              <>
                <ArrowUpRight className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-600">
                  +{trend.toFixed(1)}%
                </span>
              </>
            ) : (
              <>
                <ArrowDownRight className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-red-600">
                  {trend.toFixed(1)}%
                </span>
              </>
            )}
            {trendLabel && (
              <span className="text-xs text-slate-500">{trendLabel}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function MetricCardSkeleton() {
  return (
    <div className="p-6 bg-white border border-slate-200 rounded-lg shadow-sm">
      <Skeleton className="h-4 w-24 mb-3" />
      <Skeleton className="h-8 w-32 mb-2" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}
