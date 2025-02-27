/**
 * budget controller
 */

import {
  fetchPartyType,
  fetchSelectedItemsDetails,
} from '../services/fetch-items';
import { calculateBudget } from '../services/calculate-budget';
import { sendBudgetEmail } from '../services/send-email';
import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::budget.budget',
  ({ strapi }) => ({
    async getBudgetCalculation(ctx) {
      try {
        const {
          partyType,
          selectedItems,
          numberOfPeople,
          eventDuration,
          eventDate,
        } = ctx.request.body.data;

        console.log(partyType);

        // Fetch party type details
        const partyTypeDetails = await fetchPartyType(strapi, partyType);

        // Fetch selected items details
        const selectedItemsDetails = await fetchSelectedItemsDetails(
          strapi,
          selectedItems,
        );

        // Calculate budget
        const budget = calculateBudget(
          partyTypeDetails,
          selectedItemsDetails,
          numberOfPeople,
          eventDuration,
        );

        /* const item: ApiBudgetBudget['attributes'] = {
          extraHours: budget.extraHours,
          totalPrice: budget.totalPrice,
          eventDate,
        };

        const result = await createBudget(item); */

        console.log('selectedItemsDetails:', selectedItemsDetails);

        // Send email with budget details
        await sendBudgetEmail(
          strapi,
          partyTypeDetails,
          selectedItemsDetails,
          numberOfPeople,
          eventDuration,
          budget.totalPrice,
        );

        return {
          totalPrice: budget.totalPrice,
        };
      } catch (error) {
        console.error('Erro ao calcular o orçamento:', error);
        throw error;
      }
    },
  }),
);
