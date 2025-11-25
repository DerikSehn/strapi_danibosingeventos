'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchBackend } from '@/lib/fetch';

export interface FinancialSummary {
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  profitMargin: number;
  totalOrders: number;
  averageOrderValue: number;
  periodLabel: string;
}

export interface MonthlyTrendData {
  month: string;
  revenue: number;
  cost: number;
  profit: number;
}

export interface TopProduct {
  name: string;
  quantity: number;
  revenue: number;
  cost: number;
  profit: number;
}

export interface OrderStatusData {
  status: string;
  count: number;
  revenue: number;
}

export interface ProfitByCategory {
  category: string;
  profit: number;
  percentage: number;
  [key: string]: any;
}

export interface AverageMetrics {
  avgItemsPerOrder: number;
  avgOrderValue: number;
  avgCostPerOrder: number;
  avgProfitPerOrder: number;
  avgProfitMarginPerOrder: number;
}

export function useFinancialSummary() {
  return useQuery({
    queryKey: ['financial', 'summary'],
    queryFn: async () => {
      const response = await fetch('/api/finances?endpoint=summary');
      if (!response.ok) throw new Error('Failed to fetch summary');
      const { data } = await response.json();
      return data as FinancialSummary;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useMonthlyTrend() {
  return useQuery({
    queryKey: ['financial', 'monthly-trend'],
    queryFn: async () => {
      const response = await fetch('/api/finances?endpoint=monthly-trend');
      if (!response.ok) throw new Error('Failed to fetch monthly trend');
      const { data } = await response.json();
      return data as MonthlyTrendData[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useTopProducts() {
  return useQuery({
    queryKey: ['financial', 'top-products'],
    queryFn: async () => {
      const response = await fetch('/api/finances?endpoint=top-products');
      if (!response.ok) throw new Error('Failed to fetch top products');
      const { data } = await response.json();
      return data as TopProduct[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useTopVariants() {
  return useQuery({
    queryKey: ['financial', 'top-variants'],
    queryFn: async () => {
      const response = await fetch('/api/finances?endpoint=top-variants');
      if (!response.ok) throw new Error('Failed to fetch top variants');
      const { data } = await response.json();
      return data as TopProduct[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useOrderStatus() {
  return useQuery({
    queryKey: ['financial', 'order-status'],
    queryFn: async () => {
      const response = await fetch('/api/finances?endpoint=order-status');
      if (!response.ok) throw new Error('Failed to fetch order status');
      const { data } = await response.json();
      return data as OrderStatusData[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useProfitByCategory() {
  return useQuery({
    queryKey: ['financial', 'profit-by-category'],
    queryFn: async () => {
      const response = await fetch('/api/finances?endpoint=profit-by-category');
      if (!response.ok) throw new Error('Failed to fetch profit by category');
      const { data } = await response.json();
      return data as ProfitByCategory[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useAverageMetrics() {
  return useQuery({
    queryKey: ['financial', 'average-metrics'],
    queryFn: async () => {
      const response = await fetch('/api/finances?endpoint=average-metrics');
      if (!response.ok) throw new Error('Failed to fetch average metrics');
      const { data } = await response.json();
      return data as AverageMetrics;
    },
    staleTime: 5 * 60 * 1000,
  });
}
