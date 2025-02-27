module.exports = {
  routes: [
    {
      // Path defined with an URL parameter
      method: 'POST',
      path: '/budget/calculate',
      handler: 'calculate.getBudgetCalculation',
    },
  ],
};
