"use server";

import { fetchBackend } from "@/lib/fetch";
import { revalidatePath } from "next/cache";

export async function saveOrderChanges(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    if (!id) throw new Error("ID do pedido não fornecido");

    const payload: any = { data: {} };

    // Campos que podem ser salvos
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
      "eventDate"
    ];

    for (const field of fields) {
      const value = formData.get(field);
      if (value !== null && value !== undefined && value !== "") {
        if (field === "totalPrice" || field === "total_cost_price") {
          payload.data[field] = Number(value);
        } else if (field === "eventDate") {
          // Preserve local time chosen by the user: build an ISO string for the local time
          // eventDate format comes as YYYY-MM-DDTHH:mm (no timezone)
          const eventDateStr = value as string;
          const [ymd, hm] = eventDateStr.split('T');
          const [y, m, d] = (ymd || '').split('-').map(n => parseInt(n, 10));
          const [hh, mm] = (hm || '').split(':').map(n => parseInt(n, 10));
          if (y && m && d && !isNaN(hh) && !isNaN(mm)) {
            const local = new Date(y, m - 1, d, hh, mm, 0, 0);
            // Encode as ISO string so Strapi gets DateTime; this will be UTC but decodifiable to the same local time
            payload.data.eventDate = local.toISOString();
          }
        } else {
          payload.data[field] = value;
        }
      }
    }

    const data = await fetchBackend(`/orders/${id}`, {}, {
      method: 'PUT',
      body: payload,
      requireAuth: false
    });

    revalidatePath(`/dashboard/orders/${id}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function confirmOrderStatus(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const status = formData.get("status") as string;

    if (!id) throw new Error("ID do pedido não fornecido");
    if (!status) throw new Error("Status não fornecido");

    const payload = {
      data: {
        status: status === "confirmado" ? "confirmado" : "pendente"
      }
    };

    const data = await fetchBackend(`/orders/${id}`, {}, {
      method: 'PUT',
      body: payload,
      requireAuth: false
    });

    // If status changed to "confirmado", send the quote email
    if (status === "confirmado") {
      try {
        await fetchBackend(`/budget/${id}/send-quote`, {}, {
          method: 'POST',
          requireAuth: false
        });
      } catch (quoteError) {
        console.warn('Failed to send quote email:', quoteError);
        // Don't fail the entire operation if quote sending fails
      }
    }

    revalidatePath(`/dashboard/orders/${id}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}