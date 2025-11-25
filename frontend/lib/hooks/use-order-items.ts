"use client";

import { ProductVariant } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { OrderItem } from "../api/orders/types";


interface UseOrderItemsProps {
  orderId: string | number | undefined;
  initialItems?: OrderItem[];
}

/**
 * Hook para gerenciar itens de um pedido de forma desacoplada
 * ✅ Começa com initialItems (cache local)
 * ✅ Se invalidateQueries for chamado, refetch do backend
 * ✅ Separa cache de ['order', orderId] para evitar refetch desnecessário
 */
export function useOrderItems({ orderId, initialItems = [] }: UseOrderItemsProps) {
  const queryClient = useQueryClient();

  const { data: items = initialItems, isLoading, error, refetch } = useQuery({
    queryKey: ['orderItems', orderId],
    queryFn: async () => {
      if (!orderId) return initialItems;
      
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        if (!response.ok) throw new Error('Falha ao carregar pedido');
        const result = await response.json();
        return (result.data?.order_items as OrderItem[]) || initialItems;
      } catch (error) {
        console.error('Erro ao buscar itens:', error);
        return initialItems;
      }
    },
    initialData: initialItems,
    staleTime: 0, // ✅ Sempre considera stale, força refetch em invalidation
    gcTime: 5 * 60 * 1000, // 5 minutos
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    enabled: Boolean(orderId),
  });

  /**
   * Invalida apenas o cache de itens (força refetch do backend)
   */
  const invalidateItems = () => {
    queryClient.invalidateQueries({ queryKey: ['orderItems', orderId] });
  };

  /**
   * Atualiza itens no cache local sem fazer requisição
   */
  const updateItemsCache = (newItems: OrderItem[]) => {
    queryClient.setQueryData(['orderItems', orderId], newItems);
  };

  return {
    items,
    isLoading,
    error,
    invalidateItems,
    updateItemsCache,
    refetch,
  };
}
