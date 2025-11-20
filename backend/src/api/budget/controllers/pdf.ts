/**
 * PDF controller
 */

import { factories } from '@strapi/strapi';
import { sendOrderQuote } from '../services/send-order-quote';
import { generateQuotePDF } from '../services/generate-quote-pdf';
import { sendQuotePDFEmail } from '../services/send-quote-pdf-email';
import { recordOrderEvent } from '../../order-event/services/record-event';


export default factories.createCoreController(
  'api::budget.budget',
  ({ strapi }) => ({
        /**
     * @swagger
     * /api/budget/{id}/send-quote:
     *   post:
     *     tags:
     *       - Budget
     *     summary: Send negotiation quote for an order
     *     description: Sends a negotiation quote/budget email for a confirmed order with final values and items
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Order/Budget ID (documentId or numeric id)
     *     responses:
     *       200:
     *         description: Quote sent successfully
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
     *                   example: "Quote sent successfully"
     *                 orderId:
     *                   type: string
     *       404:
     *         description: Order not found
     *       500:
     *         description: Internal server error
     */
    async sendOrderQuote(ctx) {
      try {
        const { id } = ctx.params;
        
        if (!id) {
          return ctx.badRequest('Order ID is required');
        }

        strapi.log.info('[Send Order Quote] Received request for order:', { id });

        const result = await sendOrderQuote({
          orderId: id,
          strapi,
        });

        try {
          await recordOrderEvent(strapi, id, 'quote_sent', { timestamp: new Date().toISOString() });
        } catch (eventError) {
          strapi.log.warn('[Send Order Quote] Failed to record event:', eventError);
        }

        return ctx.send(result);
      } catch (error) {
        strapi.log.error('[Send Order Quote] Error:', error);
        return ctx.throw(500, error.message || 'Failed to send quote');
      }
    },

    /**
     * @swagger
     * /api/budget/{id}/download-pdf:
     *   get:
     *     tags:
     *       - Budget
     *     summary: Download quote PDF
     *     description: Downloads the quote as a PDF file
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Order/Budget ID
     *     responses:
     *       200:
     *         description: PDF file
     *         content:
     *           application/pdf: {}
     *       404:
     *         description: Order not found
     *       500:
     *         description: Internal server error
     */
    async downloadQuotePDF(ctx) {
      try {
        const { id } = ctx.params;
        
        if (!id) {
          return ctx.badRequest('Order ID is required');
        }

        strapi.log.info('[Download Quote PDF] Requested for order:', { id });

        // Fetch order
        const docId = String(id);
        const order: any = await strapi.documents('api::budget.budget').findFirst({
          filters: { documentId: docId },
          populate: {
            order_items: {
              populate: {
                product_variant: true,
              },
            },
          },
        });

        if (!order) {
          return ctx.notFound('Order not found');
        }

        // Generate PDF
        const pdfBuffer = await generateQuotePDF({
          orderId: id,
          order,
          strapi,
        });

        strapi.log.debug('[Download Quote PDF] PDF generated', {
          orderId: id,
          bufferSize: pdfBuffer.length,
        });

        // Send as attachment
        ctx.set('Content-Type', 'application/pdf');
        ctx.set('Content-Disposition', `attachment; filename="orcamento-${docId}.pdf"`);
        ctx.body = pdfBuffer;
      } catch (error) {
        strapi.log.error('[Download Quote PDF] Error:', error);
        return ctx.throw(500, error.message || 'Failed to generate PDF');
      }
    },

    /**
     * @swagger
     * /api/budget/{id}/send-pdf:
     *   post:
     *     tags:
     *       - Budget
     *     summary: Send quote PDF via email
     *     description: Generates and sends quote PDF to customer email
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Order/Budget ID
     *     responses:
     *       200:
     *         description: PDF sent successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                 message:
     *                   type: string
     *       404:
     *         description: Order not found
     *       400:
     *         description: Customer email not found
     *       500:
     *         description: Internal server error
     */
    async sendQuotePDF(ctx) {
      try {
        const { id } = ctx.params;
        
        if (!id) {
          return ctx.badRequest('Order ID is required');
        }

        strapi.log.info('[Send Quote PDF] Requested for order:', { id });

        // Fetch order
        const docId = String(id);
        const order: any = await strapi.documents('api::budget.budget').findFirst({
          filters: { documentId: docId },
          populate: {
            order_items: {
              populate: {
                product_variant: true,
              },
            },
          },
        });

        if (!order) {
          return ctx.notFound('Order not found');
        }

        if (!order.customerEmail) {
          return ctx.badRequest('Customer email is required to send PDF');
        }

        // Send PDF via email
        const result = await sendQuotePDFEmail({
          orderId: id,
          order,
          strapi,
        });

        try {
          await recordOrderEvent(strapi, id, 'pdf_sent', { timestamp: new Date().toISOString() });
        } catch (eventError) {
          strapi.log.warn('[Send Quote PDF] Failed to record event:', eventError);
        }

        return ctx.send(result);
      } catch (error) {
        strapi.log.error('[Send Quote PDF] Error:', error);
        return ctx.throw(500, error.message || 'Failed to send PDF');
      }
    },
  }),
);

