export default {
  routes: [
    {
  method: 'GET',
  path: '/push/public-key',
  handler: 'push-subscription.publicKey',
  config: { auth: false }
    },
    {
  method: 'POST',
  path: '/push/subscribe',
  handler: 'push-subscription.subscribe',
  config: { auth: {} }
    }
  ]
};
