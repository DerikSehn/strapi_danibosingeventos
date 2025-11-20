"use client";
import { useEffect } from 'react';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}

export default function PushClient() {

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator) || !('PushManager' in window)) return;

    const run = async () => {
      try {
        // Require login before subscribing
        const me = await fetch('/api/users/me', { cache: 'no-store' });
        if (me.ok) {
          const reg = await navigator.serviceWorker.register('/sw.js');
          await navigator.serviceWorker.ready;

          if (Notification.permission === 'default') {
            await Notification.requestPermission();
          }
          if (Notification.permission !== 'granted') return;

          const pkRes = await fetch('/api/push/public-key');
          const { publicKey } = await pkRes.json();
          if (!publicKey) return;
          const applicationServerKey = urlBase64ToUint8Array(publicKey);

          const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey });
          await fetch('/api/push/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sub),
          });
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.debug('Push setup error:', e);
      }
    };

    run();
  }, []);

  return null;
}
