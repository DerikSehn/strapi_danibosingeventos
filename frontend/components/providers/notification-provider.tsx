'use client';

import React, { useEffect } from 'react';
import { useNotificationPoller, Order } from '@/lib/hooks/use-notification-poller';
import { useNotificationService } from '@/lib/hooks/use-notification-service';
import { useAuth } from '@/lib/hooks/use-auth';

/**
 * Provider que gerencia:
 * - Polling de novos pedidos (TanStack Query + cache)
 * - Web Push notifications
 * - Notificações do navegador
 * 
 * Deve envolver toda a app para funcionar corretamente
 */
export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const { showNotificationWithFallback } = useNotificationService();

  // Callback quando um novo pedido é detectado
  const handleNewOrder = async (order: Order) => {

    const contactName = order.customerName || 'Cliente';
    const people = order.numberOfPeople ? `${order.numberOfPeople} pessoas` : '';
    const details = order.eventDetails || order.status;

    // Mostra notificação
    await showNotificationWithFallback({
      title: '🎉 Novo Pedido Recebido!',
      body: `${contactName}${people ? ` (${people})` : ''}\n${details}`,
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      tag: `order-${order.id}`, // Agrupa notificações do mesmo pedido
      requireInteraction: true, // Exige interação do usuário
      data: {
        url: `/dashboard/orders/${order.documentId || order.id}`,
        orderId: order.id,
      },
    });
  };

  // Usa o hook de polling apenas se autenticado
  useNotificationPoller(
    handleNewOrder,
    isAuthenticated, // Ativa/desativa com autenticação
    30000 // 30 segundos de intervalo
  );

  return <>{children}</>;
}
