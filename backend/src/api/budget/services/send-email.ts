import { StrapiCommand } from '@strapi/strapi';
import mjml2html from 'mjml';

export async function sendBudgetEmail(
  strapi: any,
  partyTypeDetails: any,
  selectedItemsDetails: any[],
  numberOfPeople: number,
  eventDuration: number,
  totalPrice: number,
) {
  const productsTable = selectedItemsDetails
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #ecedee;">${
          item.title
        }</td>
        <td style="padding: 10px; border-bottom: 1px solid #ecedee;">R$ ${(
          item.price * numberOfPeople
        ).toFixed(2)}</td>
      </tr>
    `,
    )
    .join('');

  const mjmlTemplate = `
    <mjml>
      <mj-body background-color="#f4f4f4">
        <mj-section background-color="#ffffff" padding-bottom="20px" padding-top="20px">
          <mj-column width="100%">
            <mj-wrapper background-color="rgba(0, 0, 0, 0.5)">
              <mj-image src="https://danibosingeventos.s3.us-east-1.amazonaws.com/2024/logo-strapi.png" alt="Logo" align="center" width="200px"></mj-image>
            </mj-wrapper>                  
            <mj-divider border-color="#F45E43"></mj-divider>
            <mj-text font-size="20px" color="#F45E43" font-family="helvetica">Novo Orçamento Criado</mj-text>
            <mj-text font-size="16px" color="#000000" font-family="helvetica">
              <strong>Tipo de Festa:</strong> ${partyTypeDetails.title}<br />
              <strong>Número de Pessoas:</strong> ${numberOfPeople}<br />
              <strong>Duração do Evento:</strong> ${eventDuration} horas<br />
              <strong>Preço Total:</strong> R$ ${totalPrice.toFixed(2)}
            </mj-text>
            <mj-table>
              <tr style="border-bottom: 1px solid #ecedee; text-align: left; padding: 15px 0;">
                <th style="padding: 10px 0;">Produto</th>
                <th style="padding: 10px 0;">Preço</th>
              </tr>
              ${productsTable}
            </mj-table>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>
  `;

  const { html } = mjml2html(mjmlTemplate);

  // Envie o e-mail com o HTML gerado pelo MJML
  await strapi.plugins['email'].services.email.send({
    to: 'danibosing@gmail.com',
    from: 'derikbosing@gmail.com',
    subject: 'ORÇAMENTO',
    html: html,
  });
}
