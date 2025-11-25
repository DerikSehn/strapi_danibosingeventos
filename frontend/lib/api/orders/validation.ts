/**
 * Validações para o domínio de Orders
 */

import { UpdateOrderPayload, UpdateOrderItemPayload } from "./types";

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

/**
 * Valida e normaliza o payload de atualização de pedido
 */
export function validateUpdateOrderPayload(
  payload: Partial<UpdateOrderPayload>
): UpdateOrderPayload {
  const result: UpdateOrderPayload = {};

  // Campos de texto
  if (payload.customerName !== undefined) {
    const name = String(payload.customerName).trim();
    if (name.length > 0) {
      result.customerName = name;
    }
  }

  if (payload.customerEmail !== undefined) {
    const email = String(payload.customerEmail).trim().toLowerCase();
    if (email && isValidEmail(email)) {
      result.customerEmail = email;
    } else if (email) {
      throw new ValidationError("Email inválido");
    }
  }

  if (payload.customerPhone !== undefined) {
    const phone = String(payload.customerPhone).trim();
    if (phone.length > 0) {
      result.customerPhone = phone;
    }
  }

  if (payload.deliveryAddress !== undefined) {
    const address = String(payload.deliveryAddress).trim();
    if (address.length > 0) {
      result.deliveryAddress = address;
    }
  }

  if (payload.deliveryCity !== undefined) {
    const city = String(payload.deliveryCity).trim();
    if (city.length > 0) {
      result.deliveryCity = city;
    }
  }

  if (payload.deliveryZip !== undefined) {
    const zip = String(payload.deliveryZip).trim();
    if (zip.length > 0) {
      result.deliveryZip = zip;
    }
  }

  if (payload.source_channel !== undefined) {
    const channel = String(payload.source_channel).trim();
    if (channel === '') {
      throw new ValidationError("Canal de origem é obrigatório");
    }
    const validChannels = ['site', 'whatsapp', 'presencial', 'outro'];
    if (!validChannels.includes(channel)) {
      throw new ValidationError(`Canal inválido: ${channel}`);
    }
    result.source_channel = channel;
  }

  if (payload.eventDetails !== undefined) {
    const details = String(payload.eventDetails).trim();
    if (details.length > 0) {
      result.eventDetails = details;
    }
  }

  if (payload.internalNotes !== undefined) {
    const notes = String(payload.internalNotes).trim();
    if (notes.length > 0) {
      result.internalNotes = notes;
    }
  }

  // Campos numéricos
  if (payload.totalPrice !== undefined) {
    const price = Number(payload.totalPrice);
    if (!isNaN(price) && price >= 0) {
      result.totalPrice = price;
    }
  }

  if (payload.total_cost_price !== undefined) {
    const costPrice = Number(payload.total_cost_price);
    if (!isNaN(costPrice) && costPrice >= 0) {
      result.total_cost_price = costPrice;
    }
  }

  // Data do evento
  if (payload.eventDate !== undefined) {
    const date = validateEventDate(String(payload.eventDate));
    if (date) {
      result.eventDate = date;
    }
  }

  return result;
}

/**
 * Valida payload de atualização de item
 */
export function validateUpdateOrderItemPayload(
  payload: any
): UpdateOrderItemPayload {
  const quantity = Number(payload?.quantity);

  if (isNaN(quantity)) {
    throw new ValidationError("Quantidade deve ser um número");
  }

  if (!Number.isInteger(quantity)) {
    throw new ValidationError("Quantidade deve ser um número inteiro");
  }

  if (quantity < 1) {
    throw new ValidationError("Quantidade deve ser maior que 0");
  }

  return { quantity };
}

/**
 * Valida e normaliza data do evento
 * Formato esperado: YYYY-MM-DDTHH:mm (sem timezone)
 */
export function validateEventDate(dateStr: string): string | null {
  if (!dateStr || typeof dateStr !== "string") {
    return null;
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(dateStr);
  if (!match) {
    throw new ValidationError("Formato de data inválido. Use: YYYY-MM-DDTHH:mm");
  }

  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const day = parseInt(match[3], 10);
  const hour = parseInt(match[4], 10);
  const minute = parseInt(match[5], 10);

  // Validar ranges
  if (month < 1 || month > 12) {
    throw new ValidationError("Mês deve estar entre 01 e 12");
  }

  if (day < 1 || day > 31) {
    throw new ValidationError("Dia deve estar entre 01 e 31");
  }

  if (hour < 0 || hour > 23) {
    throw new ValidationError("Hora deve estar entre 00 e 23");
  }

  if (minute < 0 || minute > 59) {
    throw new ValidationError("Minuto deve estar entre 00 e 59");
  }

  // Criar data local e converter para ISO
  const local = new Date(year, month - 1, day, hour, minute, 0, 0);
  return local.toISOString();
}

/**
 * Valida email usando regex simples
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida ID (documentId ou id numérico)
 */
export function validateOrderId(id: any): string {
  const idStr = String(id).trim();
  if (!idStr) {
    throw new ValidationError("ID do pedido não fornecido");
  }
  return idStr;
}

/**
 * Valida ID do item
 */
export function validateItemId(id: any): string {
  const idStr = String(id).trim();
  if (!idStr) {
    throw new ValidationError("ID do item não fornecido");
  }
  return idStr;
}
