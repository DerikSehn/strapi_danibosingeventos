export default {
  routes: [
    {
      method: 'POST',
      path: '/budget/calculate',
      handler: 'calculate.getBudgetCalculation',
      config: {
        policies: [],
        auth: false,
      },
    },     {
      method: 'POST',
      path: '/budget/create-order',
      handler: 'calculate.createOrder',
      config: {
        policies: [],
        auth: false,
      },
    },
  ],
};
