'use client';

import NumberFlow from '@number-flow/react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import React from 'react';

interface MotionNumberDisplayProps {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  format?: 'currency' | 'percentage' | 'default';
  color?: 'green' | 'blue' | 'red' | 'amber';
  showTrend?: boolean;
  trendValue?: number;
  size?: 'sm' | 'md' | 'lg';
}

export function MotionNumberDisplay({
  value,
  label,
  prefix = '',
  suffix = '',
  format = 'default',
  color = 'blue',
  showTrend = false,
  trendValue,
  size = 'md',
}: MotionNumberDisplayProps) {
  const colorMap = {
    green: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    blue: 'bg-blue-50 border-blue-200 text-blue-900',
    red: 'bg-red-50 border-red-200 text-red-900',
    amber: 'bg-amber-50 border-amber-200 text-amber-900',
  };

  const sizeMap = {
    sm: 'text-lg font-semibold',
    md: 'text-2xl font-bold',
    lg: 'text-3xl font-bold',
  };

  const formatValue = (val: number) => {
    if (format === 'currency') {
      return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
    if (format === 'percentage') {
      return val.toFixed(1) + '%';
    }
    return val.toLocaleString('pt-BR');
  };

  const isTrendPositive = trendValue ? trendValue > 0 : true;

  return (
    <motion.div
      className={`rounded-lg border-2 p-4 transition-all duration-300 ${colorMap[color]}`}
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <p className="text-xs font-medium opacity-75 uppercase tracking-wider mb-2">{label}</p>
          <motion.div
            className={`${sizeMap[size]} flex items-baseline gap-1`}
            layout
            layoutId={`value-${label}`}
          >
            {prefix && <span className="text-sm opacity-80">{prefix}</span>}
            <NumberFlow
              value={value}
              format={{
                notation: 'standard',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }}
            />
            {suffix && <span className="text-sm opacity-80">{suffix}</span>}
          </motion.div>
        </div>

        {showTrend && trendValue !== undefined && (
          <motion.div
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
              isTrendPositive
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-red-100 text-red-700'
            }`}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            {isTrendPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <NumberFlow
              value={Math.abs(trendValue)}
              format={{ maximumFractionDigits: 1 }}
            />
            %
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
