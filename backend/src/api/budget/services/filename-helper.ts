
import { Core } from '@strapi/strapi';

export async function getBudgetFilename(strapi: Core.Strapi, orderId: string | number, existingOrder?: any): Promise<string> {
  let order = existingOrder;
  
  if (!order) {
    order = await strapi.documents('api::budget.budget').findFirst({
      filters: { documentId: String(orderId) },
      populate: { party_type: true },
    });
  }

  if (!order) {
    return `Orcamento_${orderId}.pdf`;
  }

  const partyTypeTitle = order.party_type?.title || 'encomenda';
  const customerName = order.customerName || 'Cliente';
  
  // Sanitize to be safe for filenames (allow alphanumeric and some accents, replace spaces with _)
  const safePartyType = partyTypeTitle.trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9À-ÿ_]/g, '');
  const safeCustomerName = customerName.trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9À-ÿ_]/g, '');

  return `Orcamento_${safePartyType}_${safeCustomerName}.pdf`;
}
