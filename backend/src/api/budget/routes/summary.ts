export default {
  routes: [
    {
      method: 'GET',
      path: '/budget/summary',
      handler: 'calculate.getSummary',
      config: {
        policies: [],
        auth: {},
      },
    },
  ],
};
