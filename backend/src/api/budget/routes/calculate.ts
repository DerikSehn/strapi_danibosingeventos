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
    },
  ],
};
