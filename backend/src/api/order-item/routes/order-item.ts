export default {
  routes: [
    {
      method: 'PUT',
      path: '/order-items/:id',
      handler: 'api::order-item.order-item.update',
      config: {
        policies: [],
        auth: false,
      },
    },

    {
      method: 'DELETE',
      path: '/order-items/:id',
      handler: 'api::order-item.order-item.delete',
      config: {
        policies: [],
        auth: false,
      },
    },

    {
      method: 'POST',
      path: '/order-items',
      handler: 'api::order-item.order-item.create',
      config: {
        policies: [],
        auth: false,
      },
    },
  ],
};
