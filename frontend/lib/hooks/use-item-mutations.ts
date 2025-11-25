/**
 * Hooks customizados para operações de Items (separado de Order)
 * ✅ NÃO invalida cache da order completa
 * ✅ Atualiza cache local de items após mutação
 */

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  updateOrderItem,
  removeOrderItem,
  addOrderItems,
} from "@/lib/api/orders/actions";

/**
 * Hook para atualizar quantidade de item
 * ✅ NÃO invalida cache da order
 * ✅ Atualiza cache local de items
 */
export function useUpdateItemMutation(
  orderId: string | number,
  onSuccess?: () => void
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      updateOrderItem(orderId, itemId, quantity),
    onSuccess: (result) => {
      if (result.success) {
        // Atualizar cache local de items
        queryClient.invalidateQueries({
          queryKey: ['orderItems', orderId],
        });
        toast.success("Quantidade atualizada");
        onSuccess?.();
      } else {
        toast.error(result.error || "Erro ao atualizar quantidade");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao atualizar quantidade");
    },
  });
}

/**
 * Hook para remover item do pedido
 * ✅ NÃO invalida cache da order
 * ✅ Atualiza cache local de items
 */
export function useRemoveItemMutation(
  orderId: string | number,
  onSuccess?: () => void
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => removeOrderItem(orderId, itemId),
    onSuccess: (result) => {
      if (result.success) {
        // Atualizar cache local de items
        queryClient.invalidateQueries({
          queryKey: ['orderItems', orderId],
        });
        toast.success("Item removido");
        onSuccess?.();
      } else {
        toast.error(result.error || "Erro ao remover item");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao remover item");
    },
  });
}

/**
 * Hook para adicionar itens ao pedido
 * ✅ NÃO invalida cache da order
 * ✅ Atualiza cache local de items
 */
export function useAddItemsMutation(
  orderId: string | number,
  onSuccess?: () => void
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (items: any[]) => addOrderItems(orderId, items),
    onSuccess: (result) => {
      if (result.success) {
        // Atualizar cache local de items
        queryClient.invalidateQueries({
          queryKey: ['orderItems', orderId],
        });
        queryClient.invalidateQueries({
          queryKey: ['product-selection'],
        });
        toast.success("Itens adicionados com sucesso");
        onSuccess?.();
      } else {
        toast.error(result.error || "Erro ao adicionar itens");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao adicionar itens");
    },
  });
}
