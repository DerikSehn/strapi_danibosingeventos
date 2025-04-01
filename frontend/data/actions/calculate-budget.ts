'use server';
import { mutatePublicData } from 'data/services/mutate-public-data';
import { ApiBudgetBudget } from 'types/generated/contentTypes';

interface ContactInfo {
  name: string;
  phone: string;
  email?: string;
}

interface BudgetCalculationData {
  partyTypeId: number;
  selectedItemIds: string[];
  numberOfPeople: number;
  eventDetails: string;
  contactInfo: ContactInfo;
}

export async function calculateBudget(
  data: BudgetCalculationData,
): Promise<ApiBudgetBudget['attributes']> {
  try {

    const calculatedBudget = await mutatePublicData(  
      'POST',
      '/api/budget/calculate',
      {
        data: {
          partyType: data.partyTypeId,
          selectedItems: data.selectedItemIds,
          numberOfPeople: data.numberOfPeople,
          eventDetails: data.eventDetails,
          contactInfo: data.contactInfo
        },
      },
    );
    return calculatedBudget;
  } catch (error) {
    console.error('Erro ao calcular o orçamento:', error);
    throw error;
  }
}
