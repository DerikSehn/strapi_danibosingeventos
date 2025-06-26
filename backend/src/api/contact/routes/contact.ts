export default {
  routes: [
    {
      method: 'POST',
      path: '/contact/send',
      handler: 'contact.send',
      config: {
        policies: ['global::rate-limit'], // Aplicando política de segurança
        auth: false, // Rota pública
      },
    },
  ],
};
