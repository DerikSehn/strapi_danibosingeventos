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
  // Agrupar itens por categoria
  const itemsByProduct = selectedItemsDetails.reduce((acc, item) => {
    const product = item.product.title;
    if (!acc[product]) {
      acc[product] = [];
    }
    acc[product].push(item);
    return acc;
  }, {});

  // Criar tabelas para cada categoria
  const categoryTables = Object.keys(itemsByProduct)
    .map((product) => {
      const items = itemsByProduct[product]
        .map(
          (item) => `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ecedee;">
              <img src="${item.image.url}" alt="${
            item.title
          }" width="50" height="50" style="border-radius: 5px; margin-right: 10px;" />
              ${item.title}
            </td>
            <td style="padding: 10px; border-bottom: 1px solid #ecedee;">R$ ${(
              item.price * numberOfPeople
            ).toFixed(2)}</td>
          </tr>
        `,
        )
        .join('');

      return `
        <h3>${product}</h3>
        <mj-table>
          <tr style="border-bottom: 1px solid #ecedee; text-align: left; padding: 15px 0;">
            <th style="padding: 10px 0;">Produto</th>
            <th style="padding: 10px 0;">Preço</th>
          </tr>
          ${items}
        </mj-table>
      `;
    })
    .join('');

  // Resumo do orçamento
  const budgetSummary = `
    <mj-section background-color="#ffffff" padding="20px">
      <mj-column>
        <mj-text font-size="20px" color="#F45E43" font-family="helvetica">Resumo do Orçamento</mj-text>
        <mj-table>
          <tr style="border-bottom: 1px solid #ecedee; text-align: left; padding: 15px 0;">
            <th style="padding: 10px 0;">Categoria</th>
            <th style="padding: 10px 0;">Variações</th>
            <th style="padding: 10px 0 0 auto;">Preço Total</th>
          </tr>
          ${Object.keys(itemsByProduct)
            .map((product) => {
              const totalItems = itemsByProduct[product].length;
              const totalPrice = itemsByProduct[product].reduce(
                (acc, item) => acc + item.price * numberOfPeople,
                0,
              );
              return `
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #ecedee;">${product}</td>
                  <td style="padding: 10px; border-bottom: 1px solid #ecedee;">${totalItems}</td>
                  <td style="padding: 10px; border-bottom: 1px solid #ecedee;">R$ ${totalPrice.toFixed(
                    2,
                  )}</td>
                </tr>
              `;
            })
            .join('')}
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
            ${budgetSummary}
            ${categoryTables}
            <mj-divider border-color="#F45E43"></mj-divider>
            <mj-text font-size="16px" color="#000000" font-family="helvetica">
              <strong>Obrigado por escolher nossos serviços!</strong><br />
              Se você tiver alguma dúvida ou precisar de mais informações, não hesite em nos contatar.
            </mj-text>
            <mj-text font-size="16px" color="#000000" font-family="helvetica">
              <strong>Contato:</strong><br />
              Email: contato@danibosingeventos.com<br />
              Telefone: (11) 1234-5678
            </mj-text>
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
    html,
  });
}
