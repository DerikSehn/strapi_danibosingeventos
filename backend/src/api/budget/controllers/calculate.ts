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
    /**
     * @swagger
     * /api/budget/calculate:
     *   post:
     *     tags:
     *       - Budget
     *     summary: Calculate budget for an event
     *     description: Calculates the total budget for an event based on party type, selected items, and number of people
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - data
     *             properties:
     *               data:
     *                 type: object
     *                 required:
     *                   - partyType
     *                   - selectedItems
     *                   - numberOfPeople
     *                   - contactInfo
     *                 properties:
     *                   partyType:
     *                     type: string
     *                     description: Document ID of the party type
     *                     example: "xyz123abc"
     *                   selectedItems:
     *                     type: array
     *                     items:
     *                       type: string
     *                     description: Array of product variant document IDs
     *                     example: ["item1", "item2", "item3"]
     *                   numberOfPeople:
     *                     type: integer
     *                     minimum: 1
     *                     description: Number of people attending the event
     *                     example: 50
     *                   eventDetails:
     *                     type: string
     *                     description: Additional details about the event
     *                     example: "Festa de aniversário no jardim"
     *                   contactInfo:
     *                     type: object
     *                     required:
     *                       - name
     *                       - phone
     *                     properties:
     *                       name:
     *                         type: string
     *                         description: Customer name
     *                         example: "Maria Silva"
     *                       phone:
     *                         type: string
     *                         description: Customer phone number
     *                         example: "(11) 98765-4321"
     *     responses:
     *       200:
     *         description: Budget calculated successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 documentId:
     *                   type: string
     *                   description: Created budget document ID
     *                 totalPrice:
     *                   type: number
     *                   description: Total budget price
     *                   example: 1250.00
     *                 totalItemPrice:
     *                   type: number
     *                   description: Total price of selected items
     *                   example: 875.00
     *                 waiterPrice:
     *                   type: number
     *                   description: Total cost for waiters
     *                   example: 200.00
     *                 numberOfWaiters:
     *                   type: integer
     *                   description: Number of waiters required
     *                   example: 2
     *       400:
     *         description: Bad request - missing required fields
     *       404:
     *         description: Party type or selected items not found
     *       500:
     *         description: Internal server error
     */
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
        }); strapi.log.debug('New budget created:', newBudget);

        strapi.log.info('[Budget Calculate] Starting budget email send process');
        try {
          await sendBudgetEmail({
            name: contactInfo.name,
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
          strapi.log.info('[Budget Calculate] Budget email sent successfully');
        } catch (emailError) {
          strapi.log.error('[Budget Calculate] Error sending budget email:', emailError);
          // We still return the budget result even if email fails
        }
        const result = { ...newBudget, success: true }

        return result
      } catch (error) {
        ctx.throw(500, error);
      }
    },

    /**
     * @swagger
     * /api/budget/create-order:
     *   post:
     *     tags:
     *       - Budget
     *     summary: Create a direct order without party type
     *     description: Creates an order directly from selected items with quantities, calculates total price and sends notification email
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - data
     *             properties:
     *               data:
     *                 type: object
     *                 required:
     *                   - contactName
     *                   - contactPhone
     *                   - orderItems
     *                 properties:
     *                   contactName:
     *                     type: string
     *                     description: Customer name
     *                     example: "Ana Costa"
     *                   contactPhone:
     *                     type: string
     *                     description: Customer phone number
     *                     example: "(11) 91234-5678"
     *                   contactEmail:
     *                     type: string
     *                     format: email
     *                     description: Customer email (optional)
     *                     example: "ana@email.com"
     *                   orderDetailsNotes:
     *                     type: string
     *                     description: Additional notes about the order
     *                     example: "Entrega no sábado às 14h"
     *                   orderItems:
     *                     type: array
     *                     items:
     *                       type: object
     *                       required:
     *                         - id
     *                         - quantity
     *                       properties:
     *                         id:
     *                           type: string
     *                           description: Product variant document ID
     *                           example: "variant123"
     *                         quantity:
     *                           type: number
     *                           minimum: 1
     *                           description: Quantity of this item
     *                           example: 10
     *                     description: Array of items with quantities
     *                     example: [{"id": "variant1", "quantity": 5}, {"id": "variant2", "quantity": 3}]
     *     responses:
     *       200:
     *         description: Order created successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 documentId:
     *                   type: string
     *                   description: Created budget document ID
     *                 totalPrice:
     *                   type: number
     *                   description: Total order price
     *                   example: 485.50
     *       400:
     *         description: Bad request - missing required fields or invalid data
     *       404:
     *         description: No valid items found
     *       500:
     *         description: Internal server error
     */
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
        const detailedOrderItemsForEmail = [];        for (const orderItem of orderItems) {
          const detail = selectedItemsDetails.find(d => d.documentId === orderItem.id);
          if (detail) {
            const unitPrice = Number(detail.price) || 0;
            const quantity = Number(orderItem.quantity);
            const totalPriceForItem = unitPrice * quantity;

            calculatedTotalItemsPrice += totalPriceForItem;
            detailedOrderItemsForEmail.push({
              itemId: orderItem.id,
              itemName: detail.title || 'Unknown Item',
              itemPrice: unitPrice,
              quantity: quantity,
              totalItemPrice: totalPriceForItem,
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

        const result = { ...newBudget, success: true }

        return result
      } catch (error) {
        strapi.log.error('[Budget/createOrder] Error processing order:', error);
        if (error.isBoom) {
          return ctx.throw(error.output.statusCode, error);
        }
        return ctx.throw(500, 'An unexpected error occurred while creating the order.');
      }
    },

    /**
     * @swagger
     * /api/budget/test-email:
     *   post:
     *     tags:
     *       - Budget
     *     summary: Test email sending functionality
     *     description: Sends a test budget email to verify email configuration
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - name
     *               - phone
     *               - numberOfPeople
     *             properties:
     *               name:
     *                 type: string
     *                 description: Customer name
     *                 example: "João Silva"
     *               phone:
     *                 type: string
     *                 description: Customer phone number
     *                 example: "(11) 99999-9999"
     *               email:
     *                 type: string
     *                 format: email
     *                 description: Customer email (optional)
     *                 example: "joao@email.com"
     *               numberOfPeople:
     *                 type: integer
     *                 minimum: 1
     *                 description: Number of people for the event
     *                 example: 50
     *               eventDetails:
     *                 type: string
     *                 description: Additional event details
     *                 example: "Festa de aniversário no sábado"
     *     responses:
     *       200:
     *         description: Email sent successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 message:
     *                   type: string
     *                   example: "Test email sent successfully"
     *       400:
     *         description: Bad request - missing required fields
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: "Missing required fields: name, phone, numberOfPeople"
     *       500:
     *         description: Internal server error
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: "Failed to send email"
     */
    async testEmail(ctx) {
      try {
        const { name, phone, email, numberOfPeople, eventDetails } = ctx.request.body;

        // Validate required fields
        if (!name || !phone || !numberOfPeople) {
          return ctx.badRequest('Missing required fields: name, phone, numberOfPeople are required.');
        }

        if (numberOfPeople <= 0) {
          return ctx.badRequest('numberOfPeople must be greater than 0.');
        }

        strapi.log.info('[Test Email] Starting test email process');
        strapi.log.debug('[Test Email] Input data:', { name, phone, email, numberOfPeople, eventDetails });

        // Create mock data for testing
        const mockPartyType = {
          title: 'Festa de Aniversário (Teste)',
          price: 500
        };

        const mockSelectedItems = [
          {
            title: 'Salgadinho Variado (Teste)',
            price: '15.50',
            product: {
              title: 'Salgadinho Variado',
              category: {
                name: 'Salgados'
              },
              product_group: {
                name: 'Salgados Fritos',
                quantity_per_people: 8
              }
            }
          },
          {
            title: 'Refrigerante 2L (Teste)',
            price: '8.00',
            product: {
              title: 'Refrigerante 2L',
              category: {
                name: 'Bebidas'
              },
              product_group: {
                name: 'Bebidas Não Alcoólicas',
                quantity_per_people: 2
              }
            }
          }
        ];

        // Calculate mock values
        const totalItemPrice = mockSelectedItems.reduce((total, item) => {
          const itemPrice = parseFloat(item.price) * numberOfPeople;
          return total + itemPrice;
        }, 0);

        const waiterPrice = numberOfPeople > 30 ? 200 : 150;
        const extraHours = 0;
        const extraHourPrice = 0;
        const totalPrice = totalItemPrice + mockPartyType.price + waiterPrice;

        await sendBudgetEmail({
          name,
          phone,
          eventDetails: eventDetails ?? 'Email de teste - funcionalidade de envio',
          numberOfPeople,
          totalPrice,
          selectedItemsDetails: mockSelectedItems,
          partyTypeDetails: mockPartyType,
          waiterPrice: 0,
          numberOfWaiters: 0,
          totalItemPrice,
          extraHours,
          extraHourPrice,
          strapi,
        });

        strapi.log.info('[Test Email] Test email sent successfully');

        return ctx.send({
          success: true,
          message: 'Test email sent successfully',
          details: {
            recipient: 'Business contact email',
            totalPrice: totalPrice,
            numberOfPeople: numberOfPeople,
            itemsCount: mockSelectedItems.length
          }
        });

      } catch (error) {
        strapi.log.error('[Test Email] Error sending test email:', error);
        return ctx.throw(500, `Failed to send test email: ${error.message}`);
      }
    },
  }),
);
