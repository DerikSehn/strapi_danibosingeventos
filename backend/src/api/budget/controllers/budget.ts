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
import { createBudget } from '../services/create-budget';
import { ApiBudgetBudget } from '../../../../types/generated/contentTypes';

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

        console.log({
          partyType,
          selectedItems,
          numberOfPeople,
          eventDuration,
        });

        // Fetch party type details
        const partyTypeDetails = await fetchPartyType(strapi, partyType);
        console.log(partyTypeDetails);

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
