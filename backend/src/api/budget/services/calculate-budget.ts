import { ApiPartyTypePartyType, ApiProductVariantProductVariant } from '../../../../types/generated/contentTypes';

export function calculateBudget(
  partyTypeDetails: ApiPartyTypePartyType['attributes'],
  selectedItemsDetails: (ApiProductVariantProductVariant['attributes'] & { 
    product: {
        product_group: { id: string; quantity_per_people: number   };
    };
    price: string;
  } & { title: string; documentId: string; id: string; product: { title: string }

  })[],
  numberOfPeople: number,
) {
 
  // Group items by productGroup
  const groupedItems = selectedItemsDetails.reduce((groups, item) => {
    const groupId = item.product?.product_group?.id || 'ungrouped';
    if (!groups[groupId]) {
      groups[groupId] = [];
    }
    groups[groupId].push(item);
    return groups;
  }, {} as Record<string, typeof selectedItemsDetails>);
  console.log(groupedItems)

  let totalItemPrice = 0;

  // Iterate over each group to calculate the price
  for (const groupId in groupedItems) {
    const itemsInGroup = groupedItems[groupId];
    const quantityPerPerson = itemsInGroup[0]?.product?.product_group?.quantity_per_people || 10;

    // Distribute the quantity equally among the items in the group
    const itemQuantityPerPerson = quantityPerPerson / itemsInGroup.length;

    // Calculate the price for each item in the group
    for (const item of itemsInGroup) {
      const itemPrice = itemQuantityPerPerson * Number(item.price) * numberOfPeople;
      totalItemPrice += itemPrice;
     }
  }

  // Calculate number of waiters and waiter price
  const numberOfWaiters = Math.ceil(numberOfPeople / 25);

  // TODO possibility to put a custom value for the waiter price
  const waiterPrice = numberOfWaiters * 260

  const partyTypeDuration = partyTypeDetails?.duration || 4;
  // TODO possibility to put a custom profit value
  const partyTypePrice = typeof partyTypeDetails?.price === 'number' ? partyTypeDetails.price : 800;

  // Calculate extra hours and extra hour price
  const extraHours = 0;
  const extraHourPrice = (totalItemPrice / Number(partyTypeDuration)) * extraHours;

  // Calculate total price
  const totalPrice = totalItemPrice + (typeof partyTypePrice === 'number' ? partyTypePrice : 0) + waiterPrice + extraHourPrice;

  return {
    totalItemPrice,
    numberOfWaiters,
    waiterPrice,
    extraHours,
    extraHourPrice,
    totalPrice,
  };
}