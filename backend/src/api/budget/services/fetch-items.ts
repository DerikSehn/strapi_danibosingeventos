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

    if (!selectedItems || selectedItems.length === 0) {
      console.error('No selected items provided');
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

    return items || []; 
  } catch (error) {
    console.error('Error in fetchSelectedItemsDetails:', error);
    return [];
  }
}

/**
 * Fetch business contact information from the database
 * This will get the official contact details that should appear in emails
 */
export async function fetchBusinessContact(strapi: Core.Strapi) {
  try {
    
    const user = await strapi.query('plugin::users-permissions.user').findOne({
      where: { username: 'danibosing' },
      select: ['email', 'phone'],
    });

    if (!user) {
      
      return {
        email: 'contato@danibosingeventos.com',
        phone: '(11) 1234-5678',
      };
    }

    return {
      email: user.email || 'contato@danibosingeventos.com',
      phone: user.phone || '(11) 1234-5678',
    };
  } catch (error) {
    console.error('Error fetching business contact:', error);
    
    return {
      email: 'contato@danibosingeventos.com',
      phone: '(11) 1234-5678',
    };
  }
}