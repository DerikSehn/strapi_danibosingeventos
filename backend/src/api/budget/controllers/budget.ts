import { factories } from '@strapi/strapi';
import { fetchPartyType, fetchSelectedItemsDetails } from '../services/fetch-items';
import { calculateBudget } from '../services/calculate-budget';

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
    async create(ctx) {
      const { 
        partyType, 
        selectedItems, 
        contactInfo, 
        eventDetails, 
        numberOfPeople, 
      } = ctx.request.body;

      try {
        // Validate required fields
        if (!partyType || !selectedItems || !contactInfo || !numberOfPeople) {
          return ctx.badRequest('Missing required fields');
        }

        // Fetch the party type details
        const partyTypeDetails = await fetchPartyType(strapi, partyType);
        if (!partyTypeDetails) {
          return ctx.notFound('Party type not found');
        }        

        // Fetch the selected items details
        const selectedItemsDetails = await fetchSelectedItemsDetails(strapi, selectedItems);

        // Calculate the budget
        const budgetCalculation = calculateBudget(
          partyTypeDetails as any,
          selectedItemsDetails as any[],
          numberOfPeople,
        );

        // Save the budget to the database
        const newBudget = await strapi.documents('api::budget.budget').create({
          data: {
            partyType,
            eventDetails,
            ...budgetCalculation,
          },
        });

        ctx.send(newBudget);
      } catch (error) {
        console.error('Error creating budget:', error);
        ctx.throw(500, 'Internal server error');
      }
    },
  }),
);
