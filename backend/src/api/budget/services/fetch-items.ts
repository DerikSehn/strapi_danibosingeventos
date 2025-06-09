import { Core } from '@strapi/strapi';

export async function fetchPartyType(strapi: Core.Strapi, partyType: string) {
  return await strapi.documents('api::party-type.party-type').findFirst({
    filters: {
      documentId: partyType,
    },
    populate: '*',
  });
}
export async function fetchSelectedItemsDetails(
  strapi: Core.Strapi,
  selectedItems: string[],
) {
  try {
    strapi.log.debug('[Fetch Items] Input selectedItems:', selectedItems);

    if (!selectedItems || selectedItems.length === 0) {
      strapi.log.error('[Fetch Items] No selected items provided');
      return [];
    }

    
    const items = await strapi.documents('api::product-variant.product-variant').findMany({
      filters: {
        documentId: { $in: selectedItems },
      },
      populate: {
        product: {
          populate: {
              product_group: {
                fields: ['quantity_per_people', 'name'],
              },
            },
        },
      },
    });

    strapi.log.debug('[Fetch Items] Found items count:', items?.length || 0);
    strapi.log.debug('[Fetch Items] Items details:', JSON.stringify(items, null, 2));

    return items || []; 
  } catch (error) {
    strapi.log.error('[Fetch Items] Error in fetchSelectedItemsDetails:', error);
    return [];
  }
}

/**
 * Fetch business contact information from the database
 * This will get the official contact details that should appear in emails
 */
export async function fetchBusinessContact(strapi: Core.Strapi) {
  try {
    strapi.log.debug('[Fetch Business Contact] Starting to fetch business contact');
    
    const user = await strapi.query('plugin::users-permissions.user').findOne({
      where: { username: 'danibosing' },
      select: ['email', 'phone'],
    });

    strapi.log.debug('[Fetch Business Contact] User found:', user);

    if (!user) {
      strapi.log.warn('[Fetch Business Contact] No user found, using default contact');
      return {
        email: 'contato@danibosingeventos.com',
        phone: '(11) 1234-5678',
      };
    }

    const result = {
      email: user.email || 'contato@danibosingeventos.com',
      phone: user.phone || '(11) 1234-5678',
    };
    
    strapi.log.debug('[Fetch Business Contact] Returning contact:', result);
    return result;
  } catch (error) {
    strapi.log.error('[Fetch Business Contact] Error fetching business contact:', error);
    
    return {
      email: 'contato@danibosingeventos.com',
      phone: '(11) 1234-5678',
    };
  }
}