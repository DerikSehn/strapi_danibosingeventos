'use server';
import { mutatePublicData } from 'data/services/mutate-public-data';
import nodemailer from 'nodemailer';
import qs from 'qs';
import { ApiBudgetBudget } from 'types/generated/contentTypes';

interface BudgetCalculationData {
  partyTypeId: number;
  selectedItemIds: number[];
  numberOfPeople: number;
  eventDuration: number;
  eventDetails: string;
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
          eventDuration: data.eventDuration,
          eventDetails: data.eventDetails,
        },
      },
    );
    return calculatedBudget;
  } catch (error) {
    console.error('Erro ao calcular o orçamento:', error);
    throw error;
  }
}
