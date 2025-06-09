import { Core } from '@strapi/strapi';
import mjml2html from 'mjml';
import { fetchBusinessContact } from '../../budget/services/fetch-items';
 
interface OrderItemDetail {
  itemId: string | number;
  itemName: string;
  itemPrice: number;
  quantity: number; // Added quantity
  totalItemPrice: number; // Added total price for the item (unit price * quantity)
}

export async function sendOrderMail({
  name,
  phone,
  email, // Added email for customer copy, if desired
  eventDetails,
  totalItemsPrice,
  orderItemsDetails,
  strapi,
}: {
  name: string;
  phone: string;
  email?: string; // Optional: if you want to send a copy to the customer
  eventDetails?: string;
  totalItemsPrice: number;
  orderItemsDetails: OrderItemDetail[];
  strapi: Core.Strapi;
}) {
  strapi.log.debug('[Send Order Mail] Starting email generation');
  strapi.log.debug('[Send Order Mail] Order items details:', JSON.stringify(orderItemsDetails, null, 2));
  strapi.log.debug('[Send Order Mail] Total items price:', totalItemsPrice);
  
  const businessContact = await fetchBusinessContact(strapi);

  if (!orderItemsDetails || orderItemsDetails.length === 0) {
    strapi.log.warn('[Send Order Mail] No order items provided for the email. Aborting email send.');
    return; // Or throw an error, depending on desired behavior
  }
  const itemsTableRows = orderItemsDetails
    .map((item) => {
      // Validate that itemPrice and totalItemPrice are numbers
      const itemPrice = typeof item.itemPrice === 'number' ? item.itemPrice : 0;
      const totalItemPrice = typeof item.totalItemPrice === 'number' ? item.totalItemPrice : 0;
      const quantity = typeof item.quantity === 'number' ? item.quantity : 0;
      const itemName = item.itemName || 'Unknown Item';
      
      return `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #ecedee;">${itemName}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ecedee; text-align: center;">${quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ecedee; text-align: right;">R$ ${itemPrice.toFixed(2)}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ecedee; text-align: right;">R$ ${totalItemPrice.toFixed(2)}</td>
      </tr>
      `;
    })
    .join('');

  const itemsSection = `
  <mj-section background-color="#ffffff" padding="20px">
    <mj-column>
      <mj-text font-size="20px" color="#F45E43" font-family="helvetica">Detalhes da Encomenda</mj-text>
      <mj-table>
        <tr style="border-bottom: 1px solid #ecedee; text-align: left; padding: 15px 0;">
          <th style="padding: 10px 0;">Produto</th>
          <th style="padding: 10px 0; text-align: center;">Quantidade</th>
          <th style="padding: 10px 0; text-align: right;">Preço Unit.</th>
          <th style="padding: 10px 0; text-align: right;">Preço Total</th>
        </tr>
        ${itemsTableRows}        <tr style="border-top: 2px solid #F45E43;">
          <td colspan="3" style="padding: 10px; font-weight: bold; text-align: right;">Total da Encomenda:</td>
          <td style="padding: 10px; font-weight: bold; text-align: right;">R$ ${(typeof totalItemsPrice === 'number' ? totalItemsPrice : 0).toFixed(2)}</td>
        </tr>
      </mj-table>
    </mj-column>
  </mj-section>
  `;

  const mjmlTemplate = `
  <mjml>
    <mj-body background-color="#f4f4f4">
      <mj-section background-color="#ffffff" padding-bottom="20px" padding-top="20px">
        <mj-column width="100%">
          <mj-wrapper background-color="rgba(0, 0, 0, 0.5)">
            <mj-image src="${'https://ci3.googleusercontent.com/meips/ADKq_NZmZgJ4FbWSitygxnSEiBQPZaneA_n41A_8865T26q0xeOFvHMJxGm9O1HmcArr-MPH9dC3mTLxOmV6i1Qys7VxDZp59CAlp2jyGLBiLggyPtPeYDzocV4aorhqpgXB=s0-d-e1-ft#https://danibosingeventos.s3.us-east-1.amazonaws.com/2024/logo-strapi.png'}" alt="Logo" width="150px"></mj-image>
          </mj-wrapper>
          <mj-divider border-color="#F45E43"></mj-divider>
          <mj-text font-size="24px" font-weight="bold" color="#F45E43" font-family="helvetica" align="center">Nova Encomenda Recebida!</mj-text>
          <mj-text font-size="18px" color="#000000" font-family="helvetica">
            <strong>Nome do Cliente:</strong> ${name}<br />
            <strong>Telefone:</strong> ${phone}${email ? `<br /><strong>Email:</strong> ${email}` : ''}<br />
            ${eventDetails ? `<strong>Detalhes/Observações:</strong> ${eventDetails}<br />` : ''}
          </mj-text>
          
          ${itemsSection}
          
          <mj-divider border-color="#F45E43"></mj-divider>
          <mj-text font-size="16px" color="#000000" font-family="helvetica">
            Por favor, entre em contato com o cliente para confirmar os detalhes e o pagamento.
          </mj-text>
          <mj-text font-size="16px" color="#000000" font-family="helvetica">
            <strong>Contato da Empresa:</strong><br />
            Email: ${businessContact.email}<br />
            Telefone: ${businessContact.phone}
          </mj-text>
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>
  `;

  const { html, errors: mjmlErrors } = mjml2html(mjmlTemplate);

  if (mjmlErrors && mjmlErrors.length > 0) {
    strapi.log.error('[Send Order Mail] MJML Compilation Errors:', JSON.stringify(mjmlErrors, null, 2));
    // Decide if you want to throw an error or try to send a fallback email
  }

  try {
    await strapi.plugins['email'].services.email.send({
      to: 'danibosing@gmail.com', // Send to business owner
      ...(email && { cc: email }), // Optional: CC customer if email is provided
      from: 'derikbosing@gmail.com', // Use a configured sender email
      subject: `Nova Encomenda Recebida - ${name} - Dani Bosing Eventos`,
      html,
    });
    strapi.log.info(`[Send Order Mail] Order email sent successfully to ${businessContact.email} (CC: ${email || 'none'}) for order by ${name}.`);
  } catch (error) {
    strapi.log.error('[Send Order Mail] Error sending email:', error);
    // Rethrow or handle as appropriate for your application
    throw error;
  }
}
