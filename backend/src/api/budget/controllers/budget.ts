import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::budget.budget',
  ({ strapi }) => ({
    async listBudgets(ctx) {
      try {
        const budgets = await strapi.services['api::budget.budget'].find();
        ctx.send(budgets);
      } catch (error) {
        ctx.throw(500, error);
      }
    },
    async getBudget(ctx) {
      try {
        const { id } = ctx.params;
        const budget = await strapi.services['api::budget.budget'].findOne({
          id,
        });
        ctx.send(budget);
      } catch (error) {
        ctx.throw(500, error);
      }
    },
    async updateBudget(ctx) {
      try {
        const { id } = ctx.params;
        const updatedBudget = await strapi.services[
          'api::budget.budget'
        ].update({ id }, ctx.request.body);
        ctx.send(updatedBudget);
      } catch (error) {
        ctx.throw(500, error);
      }
    },
  }),
);
