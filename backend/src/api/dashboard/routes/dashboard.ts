export default {
    routes: [
      {
        method: 'GET',
        path: '/dashboard', // O path que o frontend vai chamar
        handler: 'dashboard.getDashboardData', // Aponta para o controller.action
        config: {
          policies: ['global::isAuthenticated', 'global::isOwnerTenant'], // Garante autenticação e isolamento de tenant
          auth: false, // A policy 'isAuthenticated' já cuida disso
        },
      },
    ],
  };