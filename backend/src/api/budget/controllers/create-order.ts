/**
 * budget controller
 */

import { factories } from '@strapi/strapi';
import { sendOrderMail } from '../../order/services/send-order-email';
import { fetchSelectedItemsDetails } from '../services/fetch-items';

export default factories.createCoreController(
  'api::budget.budget',
  ({ strapi }) => ({
  async createOrder(ctx) {
     try {
      const { 
        contactName,
        contactPhone,
        contactEmail, // Keep for potential use, though not explicitly in current sendOrderMail call
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
      // If selectedItemsDetails is empty while itemIdsToFetch was not, it means no valid items were found.
      if (!selectedItemsDetails || selectedItemsDetails.length === 0 && itemIdsToFetch.length > 0) {
        return ctx.notFound('None of the provided item IDs could be found or fetched.');
      }
      
      let calculatedTotalItemsPrice = 0;
      const detailedOrderItemsForEmail = [];

      for (const orderItem of orderItems) {
        const detail = selectedItemsDetails.find(d => d.documentId === orderItem.id); 
        if (detail) {
          const unitPrice = Number(detail.price) || 0; // Ensure price is a number
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
          // If strict validation is needed, you could throw an error here:
          // return ctx.badRequest(`Details for item ID ${orderItem.id} could not be found.`);
        }
      }

      // If after processing, no items were valid (e.g., all IDs were bad)
      if (detailedOrderItemsForEmail.length === 0 && orderItems.length > 0) {
          return ctx.badRequest('No valid items found to process in the order.');
      }
      
      strapi.log.debug('[Budget/createOrder] Calculated Total Price:', calculatedTotalItemsPrice);
      strapi.log.debug('[Budget/createOrder] Detailed items for email:', JSON.stringify(detailedOrderItemsForEmail, null, 2));

      const newBudget = await strapi.documents('api::budget.budget').create({
        data: {
          partyType: null, 
          eventDetails: orderDetailsNotes,
          totalPrice: calculatedTotalItemsPrice, // Use the new calculated total
          // Consider if you need to store a representation of orderItems in the budget itself
        },
      });
      strapi.log.debug('[Budget/createOrder] New budget created:', newBudget);
      
      // Assuming sendOrderMail is designed to take these parameters.
      // The 'strapi' instance is passed as part of the options object.
      // If contactEmail is used by sendOrderMail, it should be added here.
      await sendOrderMail({
        name: contactName,
        phone: contactPhone,
        email: contactEmail, // Pass email if your sendOrderMail service uses it
        eventDetails: orderDetailsNotes,    
        totalItemsPrice: calculatedTotalItemsPrice,
        orderItemsDetails: detailedOrderItemsForEmail,
        strapi,
      });
      const result = { ...newBudget, success: true}

      return result
    } catch (error) {
      strapi.log.error('[Budget/createOrder] Error processing order:', error);
      // Ensure the error response is structured if possible, or a generic one
      if (error.isBoom) { // Check if it's a Boom error (Strapi's default HTTP errors)
        return ctx.throw(error.output.statusCode, error);
      }
      return ctx.throw(500, 'An unexpected error occurred while creating the order.');
    }
  },
}),
);
