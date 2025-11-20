export default {
  routes: [
    // Budget-specific routes (quotes/estimates)
    {
      method: 'POST',
      path: '/budget/calculate',
      handler: 'calculate.getBudgetCalculation',
      config: {
        policies: [],
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/budget/create-order',
      handler: 'calculate.createOrder',
      config: {
        policies: [],
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/budget/test-email',
      handler: 'calculate.testEmail',
      config: {
        policies: [],
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/budget/summary',
      handler: 'calculate.getSummary',
      config: { auth: {} },
    },
  ],
};