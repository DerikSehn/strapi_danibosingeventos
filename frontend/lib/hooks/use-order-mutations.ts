/**
 * Hooks customizados para operações de Orders
 * ✅ SÓ operações que afetam dados gerais do pedido
 * ✅ Items têm hooks separados em use-item-mutations.ts
 */

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  updateOrder,
  confirmOrderStatus,
} from "@/lib/api/orders/actions";
import { deleteOrderAction } from "@/data/actions/orders-actions";
import type { UpdateOrderPayload } from "@/lib/api/orders/types";

/**
 * Hook para atualizar informações gerais do pedido
 */
export function useUpdateOrderMutation(orderId: string | number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<UpdateOrderPayload>) =>
      updateOrder(orderId, payload),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({
          queryKey: ["order", orderId],
        });
        toast.success("Pedido atualizado");
      } else {
        toast.error(result.error || "Erro ao atualizar pedido");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao atualizar pedido");
    },
  });
}

/**
 * Hook para confirmar status do pedido
 */
export function useConfirmOrderStatusMutation(orderId: string | number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => confirmOrderStatus(orderId),
    onSuccess: (result) => {
      if (result.success) {
        // ✅ Invalida cache do pedido
        queryClient.invalidateQueries({
          queryKey: ["order", orderId],
        });
        toast.success("Pedido confirmado com sucesso!");
      } else {
        toast.error(result.error || "Erro ao confirmar pedido");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao confirmar pedido");
    },
  });
}

/**
 * Hook para excluir um pedido
 * ✅ Invalida cache da lista de orders
 */
export function useDeleteOrderMutation(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => deleteOrderAction(orderId),
    onSuccess: (result) => {
      if (result.ok) {
        queryClient.invalidateQueries({ queryKey: ["orders"] });
        toast.success("Pedido excluído com sucesso");
        onSuccess?.();
      } else {
        toast.error(result.error || "Erro ao excluir pedido");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao excluir pedido");
    },
  });
}
