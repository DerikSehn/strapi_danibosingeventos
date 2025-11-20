import { Core } from '@strapi/strapi';
import mjml2html from 'mjml';
import { fetchBusinessContact } from './fetch-items';

/**
 * Sends a negotiation quote/budget for an order
 * Includes only final values and items that will be included in the quote
 */
export async function sendOrderQuote({
  orderId,
  strapi,
}: {
  orderId: string | number;
  strapi: Core.Strapi;
}) {
  strapi.log.info('[Send Order Quote] Starting quote sending process', { orderId });

  try {
    // Fetch the order with all necessary details
    const docId = String(orderId);
    const order: any = await strapi.documents('api::budget.budget').findFirst({
      filters: { documentId: docId },
      populate: {
        order_items: {
          populate: {
            product_variant: {
              populate: {
                image: true,
                product: {
                  populate: ['category', 'product_group'],
                },
              },
            },
          },
        },
        party_type: true,
      },
    });

    if (!order) {
      throw new Error(`Order not found: ${orderId}`);
    }

    strapi.log.debug('[Send Order Quote] Order loaded:', {
      orderId: order.documentId || order.id,
      customerName: order.customerName,
      totalPrice: order.totalPrice,
      itemCount: order.order_items?.length || 0,
    });

    // Extract order details
    const customerName = order.customerName || 'Cliente';
    const customerEmail = order.customerEmail;
    const customerPhone = order.customerPhone;
    const totalPrice = Number(order.totalPrice || 0);
    const eventDetails = order.eventDetails || '';

    // Extract items with final values
    const items = Array.isArray(order.order_items)
      ? order.order_items.map((oi: any) => ({
          id: oi.id || oi.documentId,
          name: oi.item_name || oi.product_variant?.title || 'Item',
          quantity: Number(oi.quantity || 0),
          unitPrice: Number(oi.unit_price || 0),
          totalPrice: Number(oi.total_item_price || 0),
        }))
      : [];

    strapi.log.debug('[Send Order Quote] Items extracted:', items);

    // Fetch business contact
    const businessContact = await fetchBusinessContact(strapi);
    strapi.log.debug('[Send Order Quote] Business contact:', businessContact);

    // Generate email HTML using MJML template
    const emailHtml = generateQuoteEmail({
      customerName,
      customerEmail,
      customerPhone,
      totalPrice,
      items,
      eventDetails,
      businessContact,
    });

    // Send email using Strapi's mail service
    await strapi
      .plugin('email')
      .service('email')
      .send({
        to: customerEmail || businessContact?.email,
        from: businessContact?.email,
        subject: `Orçamento de Negociação - ${customerName}`,
        html: emailHtml,
      });

    strapi.log.info('[Send Order Quote] Quote email sent successfully', {
      orderId: order.documentId || order.id,
      customerEmail: customerEmail || businessContact?.email,
    });

    return {
      success: true,
      message: 'Quote sent successfully',
      orderId: order.documentId || order.id,
    };
  } catch (error) {
    strapi.log.error('[Send Order Quote] Error sending quote:', error);
    throw error;
  }
}

/**
 * Generates HTML email for order quote
 */
function generateQuoteEmail({
  customerName,
  customerEmail,
  customerPhone,
  totalPrice,
  items,
  eventDetails,
  businessContact,
}: {
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  totalPrice: number;
  items: Array<{
    id: any;
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  eventDetails: string;
  businessContact: any;
}) {
  const mjmlTemplate = `
    <mjml>
      <mj-body background-color="#f9fafb">
        <mj-section background-color="#1f2937">
          <mj-column>
            <mj-text align="center" color="#ffffff" font-size="28px" font-weight="bold" padding="20px">
              Orçamento de Negociação
            </mj-text>
            <mj-text align="center" color="#d1d5db" padding="0px 20px 20px">
              Seu pedido foi confirmado e este é nosso orçamento para negociação
            </mj-text>
          </mj-column>
        </mj-section>

        <mj-section background-color="#ffffff" padding="30px">
          <mj-column>
            <mj-text font-size="16px" font-weight="bold" color="#111827" padding="0px 0px 10px">
              Dados do Cliente
            </mj-text>
            <mj-text font-size="14px" color="#374151" padding="5px 0px">
              <strong>Nome:</strong> ${customerName}
            </mj-text>
            ${customerPhone ? `<mj-text font-size="14px" color="#374151" padding="5px 0px"><strong>Telefone:</strong> ${customerPhone}</mj-text>` : ''}
            ${customerEmail ? `<mj-text font-size="14px" color="#374151" padding="5px 0px"><strong>Email:</strong> ${customerEmail}</mj-text>` : ''}
            ${eventDetails ? `<mj-text font-size="14px" color="#374151" padding="5px 0px"><strong>Detalhes:</strong> ${eventDetails}</mj-text>` : ''}
          </mj-column>
        </mj-section>

        <mj-section background-color="#ffffff" padding="30px">
          <mj-column>
            <mj-text font-size="16px" font-weight="bold" color="#111827" padding="0px 0px 15px">
              Itens do Pedido
            </mj-text>
            <mj-table cellpadding="10px" border="1px solid #e5e7eb">
              <tr style="background-color: #f3f4f6; border-bottom: 2px solid #d1d5db;">
                <th style="text-align: left; padding: 10px; color: #111827; font-weight: bold;">Item</th>
                <th style="text-align: center; padding: 10px; color: #111827; font-weight: bold;">Quantidade</th>
                <th style="text-align: right; padding: 10px; color: #111827; font-weight: bold;">Preço Unitário</th>
                <th style="text-align: right; padding: 10px; color: #111827; font-weight: bold;">Total</th>
              </tr>
              ${items
                .map(
                  (item) => `
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 10px; color: #374151;">${item.name}</td>
                  <td style="text-align: center; padding: 10px; color: #374151;">${item.quantity}</td>
                  <td style="text-align: right; padding: 10px; color: #374151;">R$ ${item.unitPrice.toFixed(2)}</td>
                  <td style="text-align: right; padding: 10px; color: #374151; font-weight: bold;">R$ ${item.totalPrice.toFixed(2)}</td>
                </tr>
              `
                )
                .join('')}
              <tr style="background-color: #f3f4f6; border-top: 2px solid #d1d5db;">
                <td colspan="3" style="padding: 12px; text-align: right; color: #111827; font-weight: bold;">TOTAL:</td>
                <td style="padding: 12px; text-align: right; color: #1f2937; font-weight: bold; font-size: 16px;">R$ ${totalPrice.toFixed(2)}</td>
              </tr>
            </mj-table>
          </mj-column>
        </mj-section>

        <mj-section background-color="#ffffff" padding="20px">
          <mj-column>
            <mj-text font-size="12px" color="#6b7280" padding="10px 0px">
              <em>Este é um orçamento de negociação. Os valores e itens listados acima são nossos valores finais para este pedido.</em>
            </mj-text>
          </mj-column>
        </mj-section>

        <mj-section background-color="#f3f4f6" padding="20px">
          <mj-column>
            <mj-text align="center" font-size="12px" color="#6b7280">
              ${businessContact?.name || 'Cheff Daniela Bosing'} | ${businessContact?.phone || ''} | ${businessContact?.email || ''}
            </mj-text>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>
  `;

  const result = mjml2html(mjmlTemplate);
  if (result.errors.length > 0) {
    console.error('MJML errors:', result.errors);
  }
  return result.html;
}
