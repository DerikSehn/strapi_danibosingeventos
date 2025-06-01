/**
 * budget controller
 */

import { factories } from '@strapi/strapi';
import { calculateBudget } from '../services/calculate-budget';
import { fetchSelectedItemsDetails } from '../services/fetch-items';
import { sendBudgetEmail } from '../services/send-email';
import { sendOrderMail } from '../../order/services/send-order-email';

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
      }      const result = { ...newBudget, success: true}

      return result
    } catch (error) {
      ctx.throw(500, error);
    }
  },
  async createOrder(ctx) {
     try {
      const { 
        contactName,
        contactPhone,
        contactEmail,
        orderDetailsNotes,
        orderItems, // Expected: Array<{ id: string | number; quantity: number; }>
       } = ctx.request.body.data;

      // Updated validation for orderItems
      if (
        !contactName || 
        !contactPhone || 
        !orderItems || 
        !Array.isArray(orderItems) || 
        orderItems.length === 0
      ) {
        return ctx.badRequest('Missing required fields: contactName, contactPhone, and non-empty orderItems array are required.');
      }

      for (const item of orderItems) {
        if (item.id === undefined || item.id === null || typeof item.quantity !== 'number' || item.quantity <= 0) {
          return ctx.badRequest('Each order item must have a valid \'id\' and a positive \'quantity\'.');
        }
      }
      
      const itemIdsToFetch = orderItems.map(item => item.id);
      const selectedItemsDetails = await fetchSelectedItemsDetails(strapi, itemIdsToFetch);

      // This check ensures that we found details for at least some of the requested items.
      if (!selectedItemsDetails || selectedItemsDetails.length === 0 && itemIdsToFetch.length > 0) {
        return ctx.notFound('None of the provided item IDs could be found or fetched.');
      }
      
      let calculatedTotalItemsPrice = 0;
      const detailedOrderItemsForEmail = [];

      for (const orderItem of orderItems) {
        const detail = selectedItemsDetails.find(d => d.documentId === orderItem.id); 
        if (detail) {
          const unitPrice = Number(detail.price) || 0;
          const quantity = Number(orderItem.quantity);
          const totalPriceForItem = unitPrice * quantity;
          
          calculatedTotalItemsPrice += totalPriceForItem;

          detailedOrderItemsForEmail.push({
            name: detail.product?.title || 'Unknown Item',
            quantity: quantity,
            unit_price: unitPrice,
            total_item_price: totalPriceForItem,
          });
        } else {
          strapi.log.warn(`[Budget/createOrder] Item detail not found for ID: ${orderItem.id}. This item will be skipped.`);
        }
      }

      // If after processing, no items were valid
      if (detailedOrderItemsForEmail.length === 0 && orderItems.length > 0) {
          return ctx.badRequest('No valid items found to process in the order.');
      }
      
      strapi.log.debug('[Budget/createOrder] Calculated Total Price:', calculatedTotalItemsPrice);
      strapi.log.debug('[Budget/createOrder] Detailed items for email:', JSON.stringify(detailedOrderItemsForEmail, null, 2));

      const newBudget = await strapi.documents('api::budget.budget').create({
        data: {
          partyType: null, 
          eventDetails: orderDetailsNotes,
          totalPrice: calculatedTotalItemsPrice,
        },
      });
      strapi.log.debug('[Budget/createOrder] New budget created:', newBudget);
      
      await sendOrderMail({
        name: contactName,
        phone: contactPhone,
        email: contactEmail,
        eventDetails: orderDetailsNotes,    
        totalItemsPrice: calculatedTotalItemsPrice,
        orderItemsDetails: detailedOrderItemsForEmail,
        strapi,
      });
      
      const result = { ...newBudget, success: true}

      return result
    } catch (error) {
      strapi.log.error('[Budget/createOrder] Error processing order:', error);
      if (error.isBoom) {
        return ctx.throw(error.output.statusCode, error);
      }
      return ctx.throw(500, 'An unexpected error occurred while creating the order.');
    }
  },
}),
);
