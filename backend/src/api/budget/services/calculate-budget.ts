import { ApiPartyTypePartyType } from '../../../../types/generated/contentTypes';

export function calculateBudget(
  partyTypeDetails: ApiPartyTypePartyType['attributes'],
  selectedItemsDetails: any[],
  numberOfPeople: number,
  eventDuration: number,
) {
  // Calculate total item price
  const totalItemPrice = selectedItemsDetails.reduce(
    (total, item) => total + item.price * numberOfPeople,
    0,
  );

  // Calculate number of waiters and waiter price
  const numberOfWaiters = Math.ceil(numberOfPeople / 25);
  const waiterPrice = numberOfWaiters * 200;

  const partyTypeDuration = partyTypeDetails?.duration || 4;
  const partyTypePrice = partyTypeDetails?.price || 800;
  // Calculate extra hours and extra hour price

  const extraHours = Math.max(0, eventDuration - Number(partyTypeDuration));
  const extraHourPrice =
    (totalItemPrice / Number(partyTypeDuration)) * extraHours;

  // Calculate total price
  const totalPrice =
    totalItemPrice + partyTypePrice + waiterPrice + extraHourPrice;

  return {
    totalItemPrice,
    numberOfWaiters,
    waiterPrice,
    extraHours,
    extraHourPrice,
    totalPrice,
  };
}
