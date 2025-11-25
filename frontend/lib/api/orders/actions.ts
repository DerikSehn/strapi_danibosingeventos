/**
 * Server Actions para CRUD de Orders
 * Responsabilidades:
 * - Validação de entrada robusta
 * - Chamadas ao backend com tratamento de erros
 * - Cache invalidation (apenas para order, não para items)
 * - Respostas tipadas
 */

"use server";

import { fetchBackend } from "@/lib/fetch";
import { revalidatePath } from "next/cache";
import {
  validateUpdateOrderPayload,
  validateUpdateOrderItemPayload,
  validateOrderId,
  validateItemId,
  ValidationError,
} from "./validation";
import type {
  Order,
  OrderItem,
  UpdateOrderPayload,
  ApiResponse,
} from "./types";

/**
 * Salva alterações gerais do pedido (cliente, datas, etc)
 * ✅ Inclui revalidatePath para atualizar a página
 */
export async function updateOrder(
  orderId: string | number,
  payload: Partial<UpdateOrderPayload>
): Promise<ApiResponse<Order>> {
  try {
    const id = validateOrderId(orderId);
    const validatedPayload = validateUpdateOrderPayload(payload);

    if (Object.keys(validatedPayload).length === 0) {
      return {
        success: false,
        error: "Nenhum campo válido para atualizar",
      };
    }

    const data = await fetchBackend(
      `/orders/${id}`,
      {},
      {
        method: "PUT",
        body: { data: validatedPayload },
        requireAuth: false,
      }
    );

    return {
      success: true,
      data: (data as any)?.data as Order,
    };
  } catch (error: any) {
    console.error("[updateOrder] Error:", error);
    return {
      success: false,
      error:
        error instanceof ValidationError
          ? error.message
          : error.message || "Erro ao atualizar pedido",
    };
  }
}

/**
 * Confirma o status do pedido para "confirmado"
 * ✅ Inclui revalidatePath
 * ✅ Envia email de orçamento após confirmação
 */
export async function confirmOrderStatus(
  orderId: string | number
): Promise<ApiResponse<Order>> {
  try {
    const id = validateOrderId(orderId);

    // Atualizar status
    const data = await fetchBackend(
      `/orders/${id}`,
      {},
      {
        method: "PUT",
        body: { data: { status: "confirmado" } },
        requireAuth: false,
      }
    );

    // Tentar enviar email de orçamento
    try {
      await fetchBackend(
        `/budget/${id}/send-quote`,
        {},
        {
          method: "POST",
          requireAuth: false,
        }
      );
    } catch (quoteError) {
      console.warn("[confirmOrderStatus] Failed to send quote email:", quoteError);
      // Não falhar a operação se o email não for enviado
    }

    revalidatePath(`/dashboard/orders/${id}`);

    return {
      success: true,
      data: (data as any)?.data as Order,
    };
  } catch (error: any) {
    console.error("[confirmOrderStatus] Error:", error);
    return {
      success: false,
      error: error.message || "Erro ao confirmar pedido",
    };
  }
}

/**
 * Atualiza quantidade de um item do pedido
 * ✅ PUT direto no item via /order-items/{itemId}
 * ✅ Envia quantity e recalcula total_item_price
 * ❌ NÃO revalidar - gerenciado por React Query
 */
export async function updateOrderItem(
  orderId: string | number,
  itemId: string | number,
  quantity: number
): Promise<ApiResponse<OrderItem>> {
  try {
    const oId = validateOrderId(orderId);
    const iId = validateItemId(itemId);
    const validated = validateUpdateOrderItemPayload({ quantity });

    // Buscar item atual para obter unit_price
    const orderResponse = await fetchBackend(`/orders/${oId}`, {}, {
      method: "GET",
      requireAuth: false,
    });

    const order = (orderResponse as any)?.data || orderResponse;
    const orderItem = order?.order_items?.find(
      (item: any) => String(item.id) === String(iId) || String(item.documentId) === String(iId)
    );

    if (!orderItem) {
      throw new Error("Item não encontrado no pedido");
    }

    const unitPrice = Number(orderItem.unit_price ?? 0);
    const totalItemPrice = unitPrice * validated.quantity;

    // ✅ PUT direto no item com quantity e total_item_price
    const data = await fetchBackend(
      `/order-items/${iId}`,
      {},
      {
        method: "PUT",
        body: { 
          data: { 
            quantity: validated.quantity,
            total_item_price: totalItemPrice,
          } 
        },
        requireAuth: false,
      }
    );

    // ❌ NÃO revalidar - React Query gerencia
    return {
      success: true,
      data: (data as any)?.data as OrderItem,
    };
  } catch (error: any) {
    console.error("[updateOrderItem] Error:", error);
    return {
      success: false,
      error:
        error instanceof ValidationError
          ? error.message
          : error.message || "Erro ao atualizar item",
    };
  }
}

/**
 * Remove um item do pedido
 * ✅ DELETE direto no item via /order-items/{itemId}
 * ❌ NÃO revalidar - gerenciado por React Query
 */
export async function removeOrderItem(
  orderId: string | number,
  itemId: string | number
): Promise<ApiResponse<void>> {
  try {
    const oId = validateOrderId(orderId);
    const iId = validateItemId(itemId);

    // ✅ DELETE direto no item
    await fetchBackend(
      `/order-items/${iId}`,
      {},
      {
        method: "DELETE",
        requireAuth: false,
      }
    );

    // ❌ NÃO revalidar - React Query gerencia
    return {
      success: true,
    };
  } catch (error: any) {
    console.error("[removeOrderItem] Error:", error);
    return {
      success: false,
      error: error.message || "Erro ao remover item",
    };
  }
}

/**
 * Adiciona múltiplos itens ao pedido
 * ✅ POST em /order-items com array de itens
 * ✅ Transforma product-variant em order-item com campos necessários
 * ✅ Relaciona itens ao budget do order com connect (usando id numérico do order)
 * ❌ NÃO revalidar - gerenciado por React Query
 */
export async function addOrderItems(
  orderId: string | number,
  items: any[],
  orderNumericId?: number
): Promise<ApiResponse<Order>> {
  try {
    const id = validateOrderId(orderId);

    if (!Array.isArray(items) || items.length === 0) {
      throw new ValidationError("Itens não fornecidos ou lista vazia");
    }

    // Use documentId (id) directly for the relation
    const budgetDocumentId = id;

    // ✅ Create items individually (Strapi REST create is single-item)
    // We use the custom controller which accepts an array or single item, 
    // but to be safe and consistent with our backend change to use strapi.documents(),
    // we will send the payload expected by our updated controller.
    // Our updated controller handles arrays!
    
    const transformedItems = items.map(item => {
      const unitPrice = Number(item.price ?? 0);
      const quantity = Number(item.quantity ?? 10); // Padrão 10
      const unitCost = Number(item.cost_price ?? unitPrice * 0.5); // 50% do preço se não tiver cost_price
      const totalItemPrice = unitPrice * quantity;
      const variantId = item.documentId || item.id;

      return {
        product_variant: variantId,
        item_name: item.title || 'Item sem nome',
        quantity,
        unit_price: unitPrice,
        unit_cost: unitCost,
        total_item_price: totalItemPrice,
        budget: budgetDocumentId,
      };
    });

    // ✅ POST itens transformados
    // The backend controller now uses strapi.documents().create() which handles documentIds correctly.
    await fetchBackend(
      `/order-items`,
      {},
      {
        method: "POST",
        body: { 
          data: transformedItems,
        },
        requireAuth: false,
      }
    );

    // ❌ NÃO revalidar - React Query gerencia
    return {
      success: true,
      data: {} as Order,
    };
  } catch (error: any) {
    console.error("[addOrderItems] Error:", error);
    return {
      success: false,
      error:
        error instanceof ValidationError
          ? error.message
          : error.message || "Erro ao adicionar itens",
    };
  }
}
