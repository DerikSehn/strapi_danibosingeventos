export async function fetchPartyType(strapi: any, partyType: string) {
  return await strapi.documents('api::party-type.party-type').findFirst({
    filters: {
      documentId: partyType,
    },
    populate: '*',
  });
}
export async function fetchSelectedItemsDetails(
  strapi: any,
  selectedItems: string[],
) {
  return await strapi
    .documents('api::product-variant.product-variant')
    .findMany({
      filters: {
        documentId: {
          $in: selectedItems,
        },
      },
      populate: '*',
    });
}
