/**
 * budget controller
 */

import { factories } from '@strapi/strapi';
import { calculateBudget } from '../services/calculate-budget';
import { fetchSelectedItemsDetails } from '../services/fetch-items';
import { sendBudgetEmail } from '../services/send-email';

export default factories.createCoreController(
  'api::budget.budget',
  ({ strapi }) => ({
    async getBudgetCalculation(ctx) {
    try {
      const { partyType, selectedItems, numberOfPeople, eventDetails, contactInfo } = ctx.request.body.data;

      
      
      if (!partyType || !selectedItems || !contactInfo || !numberOfPeople) {
        return ctx.badRequest('Missing required fields');
      }
      
      const partyTypeDetails = await strapi.documents('api::party-type.party-type').findFirst({
        filters: { documentId: partyType },
        populate: '*',
      });
      if (!partyTypeDetails) {
        return ctx.notFound('Party type not found');
      }
      
      
      const selectedItemsDetails = await fetchSelectedItemsDetails(strapi, selectedItems);
      if (!selectedItemsDetails || selectedItemsDetails.length === 0) {
        return ctx.notFound('No selected items found');
      }
      
      const budgetCalculation = calculateBudget(
        partyTypeDetails as any,
        selectedItemsDetails as any,
        numberOfPeople,
      );
      strapi.log.debug('Budget calculation:', budgetCalculation);
      
      const newBudget = await strapi.documents('api::budget.budget').create({
        data: {
          partyType,
          eventDetails,
          ...budgetCalculation,
        },
      });
      strapi.log.debug('New budget created:', newBudget);

      
      if (contactInfo?.email) {
        await sendBudgetEmail({
          name: contactInfo.name,
          email: contactInfo.email,
          phone: contactInfo.phone,
          eventDetails,
          numberOfPeople,
          totalPrice: budgetCalculation.totalPrice,
          selectedItemsDetails,
          partyTypeDetails,
          waiterPrice: budgetCalculation.waiterPrice,
          numberOfWaiters: budgetCalculation.numberOfWaiters,
          
          totalItemPrice: budgetCalculation.totalItemPrice,
          extraHours: budgetCalculation.extraHours,
          extraHourPrice: budgetCalculation.extraHourPrice,
          
          strapi,
        });
      }
      const result = { ...newBudget, success: true}

      return result
    } catch (error) {
      ctx.throw(500, error);
    }
  },
}),
);
