import { Core } from "@strapi/strapi";

 
export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async getDashboardData(ctx) {
    try {
      // A policy 'isOwnerTenant' (ou similar) deve adicionar o ID do tenant ao estado
      const tenantId = ctx.state.user?.tenants?.id;
      if (!tenantId) {
         // Se a policy não injetar, pegue do usuário (ajuste conforme sua estrutura)
         // const userWithTenant = await strapi.entityService.findOne('plugin::users-permissions.user', ctx.state.user.id, { populate: ['tenant'] });
         // tenantId = userWithTenant?.tenant?.id;
         // if (!tenantId) {
            return ctx.forbidden('Usuário não associado a um tenant.');
         // }
      }

      // Chama o serviço para buscar e calcular os dados
      const dashboardData = await strapi
        .service('api::dashboard.dashboard')
        .getSummary(tenantId); // Passa o ID do tenant para o serviço

      ctx.send(dashboardData);
    } catch (err) {
      strapi.log.error('Erro ao buscar dados do dashboard:', err);
      ctx.internalServerError('Erro interno ao processar a solicitação do dashboard.');
    }
  },
});