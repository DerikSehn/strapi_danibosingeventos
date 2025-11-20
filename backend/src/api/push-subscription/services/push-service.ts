// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpush = require('web-push');

const VAPID_PUBLIC = process.env.VAPID_PUBLIC_KEY || '';
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY || '';
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:admin@example.com';

export function configureWebPush() {
  if (VAPID_PUBLIC && VAPID_PRIVATE) {
    webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC, VAPID_PRIVATE);
  }
}

export async function sendWebPushNotification(subscription: any, payload: any) {
  if (!VAPID_PUBLIC || !VAPID_PRIVATE) return;
  const sub = {
    endpoint: subscription.endpoint,
    keys: {
      p256dh: subscription.p256dh,
      auth: subscription.auth,
    },
  };
  const data = JSON.stringify(payload);
  try {
    await webpush.sendNotification(sub as any, data);
  } catch (err) {
    // Swallow per-subscription errors to avoid breaking batch
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.debug('Web push error for one subscription:', err);
    }
  }
}
