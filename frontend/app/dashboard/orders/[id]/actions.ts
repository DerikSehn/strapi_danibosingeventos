/**
 * Server Actions - Wrapper legado para compatibilidade
 * Redireciona para os novos actions em lib/api/orders/actions
 *
 * DEPRECATED: Use os novos actions em lib/api/orders/actions diretamente
 */

"use server";

import {
  updateOrder as updateOrderNew,
  confirmOrderStatus as confirmStatusNew,
  updateOrderItem as updateItemNew,
  removeOrderItem as removeItemNew,
  addOrderItems as addItemsNew,
} from "@/lib/api/orders/actions";

/**
 * @deprecated Use updateOrder diretamente
 */
export async function saveOrderChanges(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    if (!id) throw new Error("ID do pedido não fornecido");

    const payload: any = {};

    const fields = [
      "customerName",
      "customerEmail",
      "customerPhone",
      "deliveryAddress",
      "deliveryCity",
      "deliveryZip",
      "source_channel",
      "eventDetails",
      "internalNotes",
      "totalPrice",
      "total_cost_price",
      "eventDate",
    ];

    for (const field of fields) {
      const value = formData.get(field);
      if (value !== null && value !== undefined && value !== "") {
        if (field === "totalPrice" || field === "total_cost_price") {
          payload[field] = Number(value);
        } else {
          payload[field] = value;
        }
      }
    }

    return await updateOrderNew(id, payload);
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * @deprecated Use confirmOrderStatus diretamente
 */
export async function confirmOrderStatus(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    if (!id) throw new Error("ID do pedido não fornecido");

    return await confirmStatusNew(id);
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * @deprecated Use updateOrderItem diretamente
 */
export async function updateOrderItem(formData: FormData) {
  try {
    const orderId = formData.get("orderId") as string;
    const itemId = formData.get("itemId") as string;
    const quantity = formData.get("quantity") as string;

    return await updateItemNew(orderId, itemId, Number(quantity));
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * @deprecated Use removeOrderItem diretamente
 */
export async function removeOrderItem(formData: FormData) {
  try {
    const orderId = formData.get("orderId") as string;
    const itemId = formData.get("itemId") as string;

    return await removeItemNew(orderId, itemId);
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * @deprecated Use addOrderItems diretamente
 */
export async function addOrderItems(formData: FormData) {
  try {
    const orderId = formData.get("orderId") as string;
    const itemsJSON = formData.get("items") as string;

    if (!orderId || !itemsJSON) {
      throw new Error("Dados inválidos fornecidos");
    }

    const items = JSON.parse(itemsJSON);
    return await addItemsNew(orderId, items);
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
