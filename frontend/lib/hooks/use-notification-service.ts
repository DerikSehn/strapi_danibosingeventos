import { useCallback } from 'react';

interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
  data?: Record<string, any>;
}

/**
 * Hook para gerenciar notificações do navegador
 * 
 * Suporta:
 * - Notificações simples via Notification API
 * - Fallback para Web Push (se service worker está registrado)
 * 
 * Compatibilidade por navegador:
 * ✅ Chrome/Chromium 22+ (Desktop & Android): Completo
 * ✅ Firefox 22+ (Desktop & Android): Completo
 * ✅ Edge 17+ (Desktop): Completo
 * ✅ Opera 25+ (Desktop): Completo
 * ⚠️ Safari 16+ (macOS): Suporta Web Notifications (limitado em PWA)
 * ⚠️ iOS Safari 16+ (iPhone/iPad): Apenas em PWA instalado
 * ❌ IE 11: Não suportado
 * ⚠️ UC Browser: Suporta parcialmente
 * ⚠️ Samsung Browser: Suporta completamente
 */
export function useNotificationService() {
  /**
   * Verifica se o navegador suporta notificações
   */
  const isSupported = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return 'Notification' in window;
  }, []);

  /**
   * Verifica se as notificações estão permitidas
   */
  const isPermissionGranted = useCallback(() => {
    if (!isSupported()) return false;
    return Notification.permission === 'granted';
  }, [isSupported]);

  /**
   * Solicita permissão ao usuário
   * 
   * Nota: Em alguns navegadores (Safari, iOS), isso pode não funcionar
   * ou pode abrir um prompt diferente
   */
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported()) {
      console.warn('[NotificationService] Notifications not supported');
      return false;
    }

    if (isPermissionGranted()) {
      return true;
    }

    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('[NotificationService] Failed to request permission:', error);
      return false;
    }
  }, [isSupported, isPermissionGranted]);

  /**
   * Envia uma notificação simples
   * Funciona mesmo sem service worker
   * 
   * Melhor suporte:
   * - Chrome/Firefox/Edge: Desktop e Mobile
   * - Safari: Apenas macOS 13+
   */
  const showNotification = useCallback(
    async (options: NotificationOptions): Promise<boolean> => {
      if (!isSupported()) {
        console.warn('[NotificationService] Notifications not supported');
        return false;
      }

      if (!isPermissionGranted()) {
        console.warn('[NotificationService] Permission not granted');
        return false;
      }

      try {
        const notification = new Notification(options.title, {
          body: options.body,
          icon: options.icon || '/icon-192x192.png',
          badge: options.badge || '/badge-72x72.png',
          tag: options.tag,
          requireInteraction: options.requireInteraction ?? false,
          data: options.data,
        });

        // Event handlers
        notification.onclick = () => {
          window.focus();
          notification.close();
          if (options.data?.url) {
            window.location.href = options.data.url;
          }
        };

        notification.onerror = () => {
          console.error('[NotificationService] Notification error');
        };

        return true;
      } catch (error) {
        console.error('[NotificationService] Failed to show notification:', error);
        return false;
      }
    },
    [isSupported, isPermissionGranted]
  );

  /**
   * Envia uma notificação via Web Push (requer service worker)
   * 
   * Melhor suporte em:
   * - Chrome/Chromium (Windows, macOS, Linux, Android)
   * - Firefox (Windows, macOS, Linux, Android)
   * - Edge (Windows, macOS, Android)
   * - Opera (Windows, macOS, Linux)
   */
  const sendWebPushNotification = useCallback(
    async (payload: {
      title: string;
      body: string;
      icon?: string;
      tag?: string;
      data?: Record<string, any>;
    }): Promise<boolean> => {
      try {
        if (!('serviceWorker' in navigator)) {
          console.warn('[NotificationService] Service Workers not supported');
          return false;
        }

        const registration = await navigator.serviceWorker.getRegistration();
        if (!registration) {
          console.warn('[NotificationService] No service worker registered');
          return false;
        }

        // Envia mensagem ao service worker
        if (registration.active) {
          registration.active.postMessage({
            type: 'SHOW_NOTIFICATION',
            payload,
          });
          return true;
        }

        return false;
      } catch (error) {
        console.error('[NotificationService] Failed to send web push:', error);
        return false;
      }
    },
    []
  );

  /**
   * Tenta mostrar notificação com fallback inteligente
   * 
   * Estratégia:
   * 1. Tenta Notification API primeiro (mais compatível)
   * 2. Se falhar, tenta Web Push via Service Worker
   * 3. Se tudo falhar, loga no console
   */
  const showNotificationWithFallback = useCallback(
    async (options: NotificationOptions): Promise<boolean> => {
      // Primeiro tenta a Notification API
      if (isPermissionGranted()) {
        const shown = await showNotification(options);
        if (shown) return true;
      }

      // Se falhar, tenta Web Push
      const pushed = await sendWebPushNotification({
        title: options.title,
        body: options.body,
        icon: options.icon,
        tag: options.tag,
        data: options.data,
      });

      return pushed;
    },
    [isPermissionGranted, showNotification, sendWebPushNotification]
  );

  /**
   * Retorna informações de compatibilidade do navegador
   * 
   * Útil para debug e decisões de fallback
   */
  const getCompatibilityInfo = useCallback(() => {
    const ua = navigator.userAgent;
    const browser = {
      isChrome: /Chrome/.test(ua) && !/Edge|Edg/.test(ua),
      isEdge: /Edge|Edg/.test(ua),
      isFirefox: /Firefox/.test(ua),
      isSafari: /Safari/.test(ua) && !/Chrome|Chromium/.test(ua),
      isOpera: /Opera|OPR/.test(ua),
      isMobile: /Mobile|Android|iPhone|iPad|iPod/.test(ua),
      isIOS: /iPhone|iPad|iPod/.test(ua),
      isAndroid: /Android/.test(ua),
      isWindows: /Windows/.test(ua),
      isMacOS: /Macintosh|Mac OS X/.test(ua),
      isLinux: /Linux/.test(ua),
    };

    return {
      userAgent: ua,
      browser,
      notificationsSupported: isSupported(),
      permissionGranted: isPermissionGranted(),
      serviceWorkerSupported: 'serviceWorker' in navigator,
      pushApiSupported: 'PushManager' in window,
      vibrateSupported: 'vibrate' in navigator,
    };
  }, [isSupported, isPermissionGranted]);

  return {
    isSupported,
    isPermissionGranted,
    requestPermission,
    showNotification,
    sendWebPushNotification,
    showNotificationWithFallback,
    getCompatibilityInfo,
  };
}
