export default {
  routes: [
    {
      method: 'GET',
      path: '/orders',
      handler: 'api::budget.calculate.getOrders',
      config: {
        policies: [],
        auth: false,
      },
    },

    {
      method: 'GET',
      path: '/orders/:id',
      handler: 'api::budget.calculate.getOrderById',
      config: {
        policies: [],
        auth: false,
      },
    },

    {
      method: 'PUT',
      path: '/orders/:id',
      handler: 'api::budget.calculate.updateOrder',
      config: {
        policies: [],
        auth: false,
      },
    },

    {
      method: 'GET',
      path: '/orders/blocked-dates',
      handler: 'api::budget.calculate.getBlockedDates',
      config: {
        policies: [],
        auth: false,
      },
    },

    {
      method: 'POST',
      path: '/orders/:id/notes',
      handler: 'api::budget.calculate.addInternalNote',
      config: { auth: {} },
    },
  ],
};
