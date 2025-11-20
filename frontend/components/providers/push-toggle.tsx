"use client";
import { useState } from 'react';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}

export default function PushToggle() {
  const [loading, setLoading] = useState(false);
  const [enabled, setEnabled] = useState(false);

  const enable = async () => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator) || !('PushManager' in window)) return;
    setLoading(true);
    try {
      // only for logged-in users
      const me = await fetch('/api/users/me', { cache: 'no-store' });
      if (!me.ok) {
        console.warn('[PushToggle] /api/users/me returned', me.status);
        alert('Faça login para ativar as notificações.');
        return;
      }

      const reg = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;

      if (Notification.permission === 'default') {
        await Notification.requestPermission();
      }
      if (Notification.permission !== 'granted') {
        console.warn('[PushToggle] Notification permission not granted:', Notification.permission);
        alert('Permita as notificações no navegador.');
        return;
      }

      const pkRes = await fetch('/api/push/public-key');
      const { publicKey } = await pkRes.json();
      if (!publicKey) {
        console.error('[PushToggle] No public key returned');
        alert('Chave pública de push não configurada.');
        return;
      }
      const applicationServerKey = urlBase64ToUint8Array(publicKey);

      const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey });
      const res = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sub),
      });
      if (!res.ok) throw new Error('Falha ao registrar assinatura');
      setEnabled(true);
    } catch (e) {
      console.error('[PushToggle] Error during enable():', e);
      alert('Não foi possível ativar as notificações.');
    } finally {
      setLoading(false);
    }
  };

  let label = 'Notificações Push\nReceba notificações no navegador';
  if (loading) label = 'Ativando…';
  if (enabled) label = 'Notificações ativadas';

  return (
    <button
      type="button"
      className="px-4 py-2 rounded-md border text-sm"
      onClick={enable}
      disabled={loading || enabled}
      title="Receba notificações no navegador"
    >
      {label}
    </button>
  );
}
