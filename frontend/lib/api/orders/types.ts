/**
 * Tipos e interfaces para o domínio de Orders
 */

export interface OrderItem {
  id?: string;
  documentId?: string;
  item_name?: string;
  quantity?: number;
  unit_price?: number;
  total_item_price?: number;
  product_variant?: {
    id?: string;
    documentId?: string;
    title?: string;
    price?: number;
    cost_price?: number;
    image?: {
      url?: string;
      data?: {
        attributes?: {
          url?: string;
        };
      };
    };
  };
}

export interface Order {
  id?: string | number;
  documentId?: string;
  createdAt?: string;
  updatedAt?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  internalNotes?: string;
  deliveryAddress?: string;
  deliveryCity?: string;
  deliveryZip?: string;
  source_channel?: string;
  eventDetails?: string;
  totalPrice?: number;
  total_cost_price?: number;
  eventDate?: string;
  status?: 'pendente' | 'confirmado' | 'cancelado';
  blockedEventDates?: string[];
  order_events?: any[];
  order_items?: OrderItem[];
  product_variants?: any[];
}

export interface UpdateOrderPayload {
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  internalNotes?: string;
  deliveryAddress?: string;
  deliveryCity?: string;
  deliveryZip?: string;
  source_channel?: string;
  eventDetails?: string;
  totalPrice?: number;
  total_cost_price?: number;
  eventDate?: string;
}

export interface UpdateOrderItemPayload {
  quantity: number;
}

export interface AddOrderItemsPayload {
  order_items: any[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
