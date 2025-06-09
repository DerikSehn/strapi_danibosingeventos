import { Core } from '@strapi/strapi';
import mjml2html from 'mjml';
import { fetchBusinessContact } from './fetch-items';

export async function sendBudgetEmail({
  name,
  phone,
  eventDetails,
  numberOfPeople,
  totalPrice,
  selectedItemsDetails,
  partyTypeDetails,
  waiterPrice,
  numberOfWaiters,
  
  totalItemPrice,
  extraHours,
  extraHourPrice,
  
  strapi,
}: {
  name: string;
   phone: string;
  eventDetails: string;
  numberOfPeople: number;
  totalPrice: number;
  selectedItemsDetails: any;
  partyTypeDetails: any;
  waiterPrice: number;
  numberOfWaiters: number;
  
  totalItemPrice: number;
  extraHours: number;
  extraHourPrice: number;
  
  strapi: Core.Strapi; 
}) {
  
  strapi.log.info('[Send Budget Email] Starting email sending process');
  strapi.log.debug('[Send Budget Email] Input parameters:', {
    name,
    phone,
    eventDetails,
    numberOfPeople,
    totalPrice,
    selectedItemsCount: selectedItemsDetails?.length ?? 0,
    partyTypeTitle: partyTypeDetails?.title,
    waiterPrice,
    numberOfWaiters,
    totalItemPrice,
    extraHours,
    extraHourPrice,
  });

  const businessContact = await fetchBusinessContact(strapi);
  strapi.log.debug('[Send Budget Email] Business contact:', businessContact);

  if (!selectedItemsDetails || selectedItemsDetails.length === 0) {
    strapi.log.error('[Send Budget Email] No selected items found for the budget email');
    selectedItemsDetails = [];
  }
  const partyTypePrice = typeof partyTypeDetails?.price === 'number' ? partyTypeDetails.price : 0;
  const partyTypeName = partyTypeDetails?.title ?? 'Festa';
  strapi.log.debug('[Send Budget Email] Party type details:', { partyTypePrice, partyTypeName });
    const groupedItems = selectedItemsDetails.reduce((groups, item) => {
    const groupId = item.product?.product_group?.id ?? 'ungrouped';
    const categoryName = item.product?.category?.name ?? 'Sem categoria';
    
    groups[groupId] ??= {
        items: [], 
        name: item.product?.product_group?.name ?? 'Outros',
        categoryName: categoryName,
        quantityPerPerson: item.product?.product_group?.quantity_per_people ?? 0,
      };
    groups[groupId].items.push(item);
    return groups;
  }, {} as Record<string, { items: any[]; quantityPerPerson: number; name?: string, categoryName: string }>);

  strapi.log.debug('[Send Budget Email] Grouped items:', JSON.stringify(groupedItems, null, 2));  // Validate essential data before building template
  const validationErrors = [];
  if (!name) validationErrors.push('name is missing');
  if (!phone) validationErrors.push('phone is missing');
  if (!numberOfPeople || numberOfPeople <= 0) validationErrors.push('numberOfPeople is invalid');
  if (!totalPrice || totalPrice < 0) validationErrors.push('totalPrice is invalid');
  if (!businessContact?.email) validationErrors.push('businessContact email is missing');
    if (validationErrors.length > 0) {
    strapi.log.error('[Send Budget Email] Validation errors:', validationErrors);
    throw new Error(`Email validation failed: ${validationErrors.join(', ')}`);
  }

  // Helper function for safe numeric conversion
  const safeToNumber = (value: any, fallback: number = 0): number => {
    const num = parseFloat(value);
    return isNaN(num) ? fallback : num;
  };
  
  // Ensure all numeric values are safe for toFixed() calls
  const safeTotalPrice = safeToNumber(totalPrice);
  const safeTotalItemPrice = safeToNumber(totalItemPrice);
  const safeWaiterPrice = safeToNumber(waiterPrice);
  const safeExtraHourPrice = safeToNumber(extraHourPrice);
  const safePartyTypePrice = safeToNumber(partyTypePrice);
  const safeNumberOfWaiters = Math.max(1, numberOfWaiters ?? 1); // Prevent division by zero

  
  const categoryTables = Object.keys(groupedItems).length > 0
    ? Object.keys(groupedItems)
        .map((groupId) => {
          const group = groupedItems[groupId];
          const totalQuantityPerPerson = group.quantityPerPerson;
          const itemQuantityPerPerson = totalQuantityPerPerson / group.items.length;          const items = group.items
            .map((item) => {
              const safeItemPrice = safeToNumber(item.price);
              const itemPrice = itemQuantityPerPerson * safeItemPrice * numberOfPeople;
              const safeItemPrice4Display = safeToNumber(itemPrice);
              const totalQuantity = Math.ceil(itemQuantityPerPerson * numberOfPeople);

              return `
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ecedee;">
                  ${item.title ?? 'Produto'}
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #ecedee; text-align: center;">${Math.ceil(itemQuantityPerPerson)}</td>
                <td style="padding: 10px; border-bottom: 1px solid #ecedee; text-align: center;">${totalQuantity}</td>
                <td style="padding: 10px; border-bottom: 1px solid #ecedee; text-align: right;">R$ ${safeItemPrice4Display.toFixed(2)}</td>
              </tr>
              `;
            })
            .join('');         
             return `
          <mj-text font-size="18px" color="#F45E43" font-family="helvetica" font-weight="bold">Grupo: ${group.name}</mj-text>
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
    : '<mj-text font-size="16px" color="#555555">Nenhum item selecionado para este orçamento.</mj-text>';    const budgetSummary = `
      <mj-section background-color="#ffffff" padding="20px">
        <mj-column>
          <mj-text font-size="20px" color="#F45E43" font-family="helvetica">Resumo do Orçamento</mj-text>
          <mj-table>
            <tr style="border-bottom: 1px solid #ecedee; text-align: left; padding: 15px 0;">
              <th style="padding: 10px 0;">Descrição</th>
              <th style="padding: 10px 0; text-align: right;">Valor</th>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ecedee;">Custo Total dos Itens Selecionados</td>
              <td style="padding: 10px; border-bottom: 1px solid #ecedee; text-align: right;">R$ ${safeTotalItemPrice.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ecedee;">Custo base do evento (${partyTypeName})</td>
              <td style="padding: 10px; border-bottom: 1px solid #ecedee; text-align: right;">R$ ${safePartyTypePrice.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ecedee;">Garçons (${numberOfWaiters} × R$ ${(safeWaiterPrice / safeNumberOfWaiters).toFixed(2)})</td>
              <td style="padding: 10px; border-bottom: 1px solid #ecedee; text-align: right;">R$ ${safeWaiterPrice.toFixed(2)}</td>
            </tr>
            ${extraHours > 0 ? `
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ecedee;">Horas Extras (${extraHours}h)</td>
              <td style="padding: 10px; border-bottom: 1px solid #ecedee; text-align: right;">R$ ${safeExtraHourPrice.toFixed(2)}</td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 10px; font-weight: bold; text-align: right; border-bottom: 2px solid #F45E43;">Total Geral:</td>
              <td style="padding: 10px; font-weight: bold; text-align: right; border-bottom: 2px solid #F45E43;">R$ ${safeTotalPrice.toFixed(2)}</td>
            </tr>
          </mj-table>
        </mj-column>
      </mj-section>`;const mjmlTemplate = `
  <mjml>
    <mj-body background-color="#f4f4f4">
      <mj-section background-color="#ffffff" padding-bottom="20px" padding-top="20px">
        <mj-column width="100%">
          <mj-image src="https://via.placeholder.com/600x200/F45E43/FFFFFF?text=Dani+Bosing+Eventos" width="600px"></mj-image>
          <mj-divider border-color="#F45E43"></mj-divider>
          <mj-text font-size="20px" color="#F45E43" font-family="helvetica">Novo Orçamento Criado</mj-text>
          <mj-text font-size="16px" color="#000000" font-family="helvetica">
            <strong>Nome:</strong> ${name}<br />
            <strong>Telefone:</strong> ${phone}<br />
            <strong>Tipo de Evento:</strong> ${partyTypeName}<br />
            <strong>Número de Pessoas:</strong> ${numberOfPeople}<br />
            <strong>Detalhes do Evento:</strong> ${eventDetails ?? 'Sem detalhes adicionais'}<br />
          </mj-text>
        </mj-column>
      </mj-section>
      
      ${budgetSummary}
      
      <mj-section background-color="#ffffff" padding="20px">
        <mj-column>
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
    strapi.log.debug('[Send Budget Email] MJML Template length:', mjmlTemplate.length);
  strapi.log.debug('[Send Budget Email] MJML Template preview (first 500 chars):', mjmlTemplate.substring(0, 500));
  
  const mjmlResult = mjml2html(mjmlTemplate);
  
  if (mjmlResult.errors && mjmlResult.errors.length > 0) {
    strapi.log.error('[Send Budget Email] MJML Errors:', mjmlResult.errors);
    throw new Error(`MJML compilation errors: ${mjmlResult.errors.map(e => e.message).join(', ')}`);
  }
  
  const { html } = mjmlResult;

  strapi.log.debug('[Send Budget Email] MJML template compiled successfully');
  strapi.log.debug('[Send Budget Email] HTML length:', html.length);
  strapi.log.debug('[Send Budget Email] Email details:', {
    to: businessContact.email,
    from: 'derikbosing@gmail.com',
    subject: `Orçamento - ${name} - ${numberOfPeople} pessoas - Dani Bosing Eventos`,
    htmlPreview: html.substring(0, 200) + '...'
  });
  
  try {
    await strapi.plugins['email'].services.email.send({
      to: businessContact.email,
      from: 'derikbosing@gmail.com',
      subject: `Orçamento - ${name} - ${numberOfPeople} pessoas - Dani Bosing Eventos`,
      html,
    });
    strapi.log.info(`[Send Budget Email] Budget email sent successfully to ${businessContact.email} for ${name}.`);
  } catch (error) {
    strapi.log.error('[Send Budget Email] Error sending email:', error);
    throw error;
  }
}