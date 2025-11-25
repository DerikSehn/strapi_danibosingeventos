import { Core } from '@strapi/strapi';
import { generateQuotePDF, OrderWithPdfPopulate } from './generate-quote-pdf';
import { getBudgetFilename } from './filename-helper';


export const orderPdfSelect = {
  party_type: true,
  order_items: {
    populate: {
      product_variant: {
        populate: {
          product: {
            populate: {
              category: true,
            }
          },
          image: true,
        },
      },
    },
  },
}


/**
 * Sends the quote PDF via email
 */
export async function sendQuotePDFEmail({
  orderId,
  order,
  strapi,
}: {
  orderId?: string | number;
  order: OrderWithPdfPopulate;
  strapi: Core.Strapi;
}): Promise<{
  success: boolean;
  message: string;
  filename?: string;
}> {
  try {
    strapi.log.info('[Send Quote PDF Email] Starting PDF generation and email sending', { orderId });

    // Generate PDF
    const pdfBuffer = await generateQuotePDF({
      orderId,
      order,
      strapi,
    });

    strapi.log.debug('[Send Quote PDF Email] PDF generated successfully', {
      bufferSize: pdfBuffer.length,
    });

    // Prepare email recipient
    const recipientEmail = order.customerEmail;
    if (!recipientEmail) {
      throw new Error('Customer email is required to send PDF');
    }

    // Send email with PDF attachment
    const emailService = strapi.plugin('email').service('email');
    
    const filename = await getBudgetFilename(strapi, order.documentId || order.id || orderId, order);

    await emailService.send({
      to: recipientEmail,
      subject: `Orçamento de Negociação - ${order.customerName || 'Cliente'}`,
      html: `
        <p>Olá <strong>${order.customerName || 'Cliente'}</strong>,</p>
        <p>Segue em anexo o orçamento de negociação para seu pedido.</p>
        <p><strong>Detalhes:</strong></p>
        <ul>
          <li>Pedido: #${order.documentId || order.id}</li>
          <li>Total: <strong>R$ ${Number(order.totalPrice || 0).toFixed(2)}</strong></li>
          <li>Itens: ${Array.isArray(order.order_items) ? order.order_items.length : 0}</li>
        </ul>
        <p>Qualquer dúvida, estamos à disposição!</p>
        <br />
        <p>Atenciosamente,<br />Cheff Daniela Bosing</p>
      `,
      attachments: [
        {
          filename,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    });

    strapi.log.info('[Send Quote PDF Email] Email sent successfully', {
      to: recipientEmail,
      orderId,
    });

    return {
      success: true,
      message: `PDF enviado com sucesso para ${recipientEmail}`,
      filename,
    };
  } catch (error) {
    strapi.log.error('[Send Quote PDF Email] Error:', error);
    throw error;
  }
}
