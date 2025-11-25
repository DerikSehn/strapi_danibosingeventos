import { useEffect, useRef, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export interface Order {
  id: string;
  documentId?: string;
  status: string;
  createdAt: string;
  totalPrice?: number;
  eventDetails?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  numberOfPeople?: number;
}

interface OrdersResponse {
  ok: boolean;
  data?: Order[];  // Backend retorna array direto
}

const ORDERS_QUERY_KEY = ['orders', 'recent'];
const NOTIFIED_ORDERS_KEY = 'notified_orders';
const POLL_INTERVAL = 30000; // 30 segundos

/**
 * Obtém lista de IDs de pedidos já notificados do sessionStorage
 */
function getNotifiedOrderIds(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  
  try {
    const stored = sessionStorage.getItem(NOTIFIED_ORDERS_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch (e) {
    console.warn('[NotificationPoller] Failed to read notified orders:', e);
    return new Set();
  }
}

/**
 * Salva lista de IDs de pedidos notificados no sessionStorage
 */
function saveNotifiedOrderIds(ids: Set<string>) {
  if (typeof window === 'undefined') return;
  
  try {
    sessionStorage.setItem(NOTIFIED_ORDERS_KEY, JSON.stringify(Array.from(ids)));
  } catch (e) {
    console.warn('[NotificationPoller] Failed to save notified orders:', e);
  }
}

/**
 * Hook que usa TanStack Query para polling de novos pedidos com cache
 * 
 * Características:
 * - Cache automático do TanStack Query
 * - Polling periódico (30s)
 * - Detecção de novos pedidos comparando com cache
 * - Callback para novos pedidos
 * - Pode ser desativado via `enabled`
 * 
 * @param onNewOrder - Callback chamado quando um novo pedido é detectado
 * @param enabled - Se true, ativa o polling
 * @param pollInterval - Intervalo de polling em ms (default: 30s)
 */
export function useNotificationPoller(
  onNewOrder: (order: Order) => void,
  enabled: boolean = true,
  pollInterval: number = POLL_INTERVAL
) {
  const queryClient = useQueryClient();
  const previousOrdersRef = useRef<Map<string, Order>>(new Map());
  const notifiedIdsRef = useRef<Set<string>>(getNotifiedOrderIds());

  // Query para buscar pedidos recentes
  const { data, refetch } = useQuery({
    queryKey: ORDERS_QUERY_KEY,
    queryFn: async (): Promise<OrdersResponse> => {
      const response = await fetch('/api/orders?pageSize=100&page=1', {
        cache: 'no-store',
        headers: { 'Accept': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const json = await response.json();
      if (!json.ok) {
        throw new Error('Invalid response');
      }

      return json;
    },
    enabled: enabled,
    refetchInterval: enabled ? pollInterval : false,
    staleTime: 0,
    gcTime: 1000 * 60 * 5, // Keep in cache for 5 minutes
  });

  // Detecta novos pedidos quando data muda
  useEffect(() => {
    if (!data?.data || !Array.isArray(data.data)) return;

    const currentOrders = data.data;
    const newOrders: Order[] = [];

    for (const order of currentOrders) {
      const orderId = order.documentId || order.id;

      // Se nunca vimos este pedido antes
      if (!previousOrdersRef.current.has(orderId) && !notifiedIdsRef.current.has(orderId)) {
        newOrders.push(order);
        notifiedIdsRef.current.add(orderId);
      }

      // Atualiza o mapa de pedidos já vistos
      previousOrdersRef.current.set(orderId, order);
    }

    // Se há novos pedidos, salva e chama callback
    if (newOrders.length > 0) {
      saveNotifiedOrderIds(notifiedIdsRef.current);

      // Chama callback para cada novo pedido
      for (const order of newOrders) {
        onNewOrder(order);
      }

    }
  }, [data?.data, onNewOrder]);

  // Cleanup: salva estado ao desmontar
  useEffect(() => {
    return () => {
      saveNotifiedOrderIds(notifiedIdsRef.current);
    };
  }, []);

  const manualRefetch = useCallback(async () => {
    return refetch();
  }, [refetch]);

  return {
    orders: Array.isArray(data?.data) ? data.data : [],
    isLoading: !data,
    refetch: manualRefetch,
    invalidateCache: () => {
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
    },
  };
}

/**
 * Limpa o cache de pedidos notificados
 */
export function clearNotificationCache() {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(NOTIFIED_ORDERS_KEY);
  } catch (e) {
    console.warn('[NotificationPoller] Failed to clear cache:', e);
  }
}
