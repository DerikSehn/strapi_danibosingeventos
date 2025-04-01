import { ApiBudgetBudget } from '../../../../types/generated/contentTypes';

// optional apibudget interface
interface BudgetCalculationData {
  partyType: number;
  selectedItems: number[];
  numberOfPeople: number;
  eventDetails: string;
  contactName: string;
  contactPhone: string;
  contactEmail?: string;
  totalItemPrice: number;
  numberOfWaiters: number;
  waiterPrice: number;
  extraHours: number;
  extraHourPrice: number;
  totalPrice: number;
  status: 'pending' | 'approved' | 'rejected';
}

export async function createBudget(budget: BudgetCalculationData) {
  try {
    // Create a budget entry in the Strapi database
    const createdBudget = await strapi.entityService.create(
      'api::budget.budget',
      {
        data: {
          party_type: budget.partyType,
          selected_items: budget.selectedItems,
          number_of_people: budget.numberOfPeople,
          event_duration: 4,
          event_details: budget.eventDetails,
          contact_name: budget.contactName,
          contact_phone: budget.contactPhone,
          contact_email: budget.contactEmail,
          total_item_price: budget.totalItemPrice,
          number_of_waiters: budget.numberOfWaiters,
          waiter_price: budget.waiterPrice,
          extra_hours: budget.extraHours,
          extra_hour_price: budget.extraHourPrice,
          total_price: budget.totalPrice,
          status: budget.status,
          publishedAt: new Date(),
        },
      }
    );

    return createdBudget;
  } catch (error) {
    console.error('Error creating budget:', error);
    throw error;
  }
}
