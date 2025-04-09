import { Core } from '@strapi/strapi';
import mjml2html from 'mjml';
import { fetchBusinessContact } from './fetch-items';

export async function sendBudgetEmail({
  name,
  email,
  phone,
  eventDetails,
  numberOfPeople,
  totalPrice,
  selectedItemsDetails,
  partyTypeDetails,
  waiterPrice,
  numberOfWaiters,
  strapi,
}: {
  name: string;
  email: string;
  phone: string;
  eventDetails: string;
  numberOfPeople: number;
  totalPrice: number;
  selectedItemsDetails: any;
  partyTypeDetails: any;
  waiterPrice: number;
  numberOfWaiters: number;
  strapi: Core.Strapi; 
}) {
  // Get business contact information
  const businessContact = await fetchBusinessContact(strapi);

  // Check if selectedItemsDetails is valid and not empty
  if (!selectedItemsDetails || selectedItemsDetails.length === 0) {
    console.error('No selected items found for the budget email');
    selectedItemsDetails = [];
  }

  const partyTypePrice = typeof partyTypeDetails?.price === 'number' ? partyTypeDetails.price : 0;
  const partyTypeName = partyTypeDetails?.title || 'Festa';

  // Group items by productGroup
  const groupedItems = selectedItemsDetails.reduce((groups, item) => {
    const groupId = item.product?.product_group?.id || 'ungrouped';
    const categoryName = item.product?.category?.name || 'Sem categoria';
    
    if (!groups[groupId]) {
      groups[groupId] = {
        items: [],
        name: item.product?.product_group?.name || 'Outros',
        categoryName: categoryName,
        quantityPerPerson: item.product?.product_group?.quantity_per_people || 0,
      };
    }
    groups[groupId].items.push(item);
    return groups;
  }, {} as Record<string, { items: any[]; quantityPerPerson: number; name?: string, categoryName: string }>);

  // Create tables for each product group
  const categoryTables = Object.keys(groupedItems).length > 0
    ? Object.keys(groupedItems)
        .map((groupId) => {
          const group = groupedItems[groupId];
          const totalQuantityPerPerson = group.quantityPerPerson;
          const itemQuantityPerPerson = totalQuantityPerPerson / group.items.length;
          const items = group.items
            .map((item) => {
              const imageUrl = item.image?.url || 'https://danibosingeventos.s3.us-east-1.amazonaws.com/2024/logo-strapi.png';
              const itemPrice = itemQuantityPerPerson * parseFloat(item.price || 0) * numberOfPeople;
              const totalQuantity = Math.ceil(itemQuantityPerPerson * numberOfPeople);

              return `
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ecedee;">
                  <img src="${imageUrl}" alt="${item.title || 'Produto'}" 
                    width="50" height="50" style="border-radius: 5px; margin-right: 10px;" />
                  ${item.title || 'Produto'}
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #ecedee; text-align: center;">${Math.ceil(itemQuantityPerPerson)}</td>
                <td style="padding: 10px; border-bottom: 1px solid #ecedee; text-align: center;">${totalQuantity}</td>
                <td style="padding: 10px; border-bottom: 1px solid #ecedee; text-align: right;">R$ ${itemPrice.toFixed(2)}</td>
              </tr>
              `;
            })
            .join('');

          return `
          <h3>Categoria: ${group.categoryName} - Grupo: ${group.name}</h3>
          <mj-table>
            <tr style="border-bottom: 1px solid #ecedee; text-align: left; padding: 15px 0;">
              <th style="padding: 10px 0;">Produto</th>
              <th style="padding: 10px 0; text-align: center;">Qt./Pessoa</th>
              <th style="padding: 10px 0; text-align: center;">Qt. Total</th>
              <th style="padding: 10px 0; text-align: right;">Preço</th>
            </tr>
            ${items}
          </mj-table>
          `;
        })
        .join('')
    : '<mj-text font-size="16px" color="#555555">Nenhum item selecionado para este orçamento.</mj-text>';

  // Budget summary
  const budgetSummary = `
  <mj-section background-color="#ffffff" padding="20px">
    <mj-column>
      <mj-text font-size="20px" color="#F45E43" font-family="helvetica">Resumo do Orçamento</mj-text>
      <mj-table>
        <tr style="border-bottom: 1px solid #ecedee; text-align: left; padding: 15px 0;">
          <th style="padding: 10px 0;">Grupo</th>
          <th style="padding: 10px 0;">Itens</th>
          <th style="padding: 10px 0; text-align: right;">Preço Total</th>
        </tr>
        ${Object.keys(groupedItems)
          .map((groupId) => {
            const group = groupedItems[groupId];
            const totalPrice = group.items.reduce((acc, item) => {
              const itemQuantityPerPerson = group.quantityPerPerson / group.items.length;
              return acc + itemQuantityPerPerson * parseFloat(item.price || 0) * numberOfPeople;
            }, 0);

            return `
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ecedee;">${group.categoryName} - ${group.name}</td>
              <td style="padding: 10px; border-bottom: 1px solid #ecedee;">${group.items.length}</td>
              <td style="padding: 10px; border-bottom: 1px solid #ecedee; text-align: right;">R$ ${totalPrice.toFixed(2)}</td>
            </tr>
            `;
          })
          .join('')}
        <tr>
          <td colspan="2" style="padding: 10px; border-bottom: 1px solid #ecedee; font-weight: bold; text-align: left;">Custo base do evento (${partyTypeName})</td>
          <td style="padding: 10px; border-bottom: 1px solid #ecedee; font-weight: bold; text-align: right;">R$ ${partyTypePrice.toFixed(2)}</td>
        </tr>
        <tr>
          <td colspan="2" style="padding: 10px; border-bottom: 1px solid #ecedee; font-weight: bold; text-align: left;">Garçons (${numberOfWaiters} × R$ ${(waiterPrice / numberOfWaiters).toFixed(2)})</td>
          <td style="padding: 10px; border-bottom: 1px solid #ecedee; font-weight: bold; text-align: right;">R$ ${waiterPrice.toFixed(2)}</td>
        </tr>
        <tr>
          <td colspan="2" style="padding: 10px; font-weight: bold; text-align: right; border-bottom: 2px solid #F45E43;">Total Geral:</td>
          <td style="padding: 10px; font-weight: bold; text-align: right; border-bottom: 2px solid #F45E43;">R$ ${totalPrice.toFixed(2)}</td>
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
            <mj-image src="https://danibosingeventos.s3.us-east-1.amazonaws.com/2024/logo-strapi.png" alt="Logo" align="center" width="200px"></mj-image>
          </mj-wrapper>                  
          <mj-divider border-color="#F45E43"></mj-divider>
          <mj-text font-size="20px" color="#F45E43" font-family="helvetica">Novo Orçamento Criado</mj-text>
          <mj-text font-size="16px" color="#000000" font-family="helvetica">
            <strong>Nome:</strong> ${name}<br />
            <strong>Email:</strong> ${email}<br />
            <strong>Telefone:</strong> ${phone}<br />
            <strong>Tipo de Evento:</strong> ${partyTypeName}<br />
            <strong>Número de Pessoas:</strong> ${numberOfPeople}<br />
            <strong>Detalhes do Evento:</strong> ${eventDetails || 'Sem detalhes adicionais'}<br />
          </mj-text>
          ${budgetSummary}
          <mj-divider border-color="#F45E43"></mj-divider>
          <mj-text font-size="20px" color="#F45E43" font-family="helvetica">Detalhamento dos Itens</mj-text>
          ${categoryTables}
          <mj-divider border-color="#F45E43"></mj-divider>
          <mj-text font-size="16px" color="#000000" font-family="helvetica">
            <strong>Obrigado por escolher nossos serviços!</strong><br />
            Se você tiver alguma dúvida ou precisar de mais informações, não hesite em nos contatar.
          </mj-text>
          <mj-text font-size="16px" color="#000000" font-family="helvetica">
            <strong>Contato:</strong><br />
            Email: ${businessContact.email}<br />
            Telefone: ${businessContact.phone}
          </mj-text>
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>
  `;

  const { html } = mjml2html(mjmlTemplate);

  // Send the email with the generated HTML
  await strapi.plugins['email'].services.email.send({
    to: businessContact.email,
    from: 'derikbosing@gmail.com',
    subject: `Orçamento - ${name} - ${numberOfPeople} pessoas - Dani Bosing Eventos`,
    html,
  });
}