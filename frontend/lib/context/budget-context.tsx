"use client";

import { useMealItemsStore } from '@/lib/store/meal-items-store';
import { calculateBudget } from 'data/actions/calculate-budget';
import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { BudgetFormValues } from 'types/budget-form-values';
import { ApiBudgetBudget, ApiPartyTypePartyType } from 'types/generated/contentTypes';



interface BudgetContextType {
  budgetResult: ApiBudgetBudget['attributes'] | null;
  isLoading: boolean;
  error: string | null;
  formValues: BudgetFormValues;
  updateFormValues: (values: Partial<BudgetFormValues>) => void;
  createBudget: (partyType: ApiPartyTypePartyType['attributes']) => Promise<ApiBudgetBudget['attributes'] | null>;
  resetBudget: () => void;
}

const defaultFormValues: BudgetFormValues = {
  numberOfPeople: 20,
  eventDuration: 4,
  eventDetails: "",
  contactName: "",
  contactPhone: "",
  contactEmail: ""
};

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export function BudgetProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [budgetResult, setBudgetResult] = useState<ApiBudgetBudget['attributes'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<BudgetFormValues>(defaultFormValues);
  
  const { getSelectedItemIds} = useMealItemsStore();

  const updateFormValues = (values: Partial<BudgetFormValues>) => {
    setFormValues(prev => ({ ...prev, ...values }));
  };

  const createBudget = async (partyType: ApiPartyTypePartyType['attributes']) => {
    setIsLoading(true);
    setError(null);
    try {
      // Extract just the IDs from the selected items
      const response = await calculateBudget({
        partyTypeId: partyType.documentId,
        selectedItemIds: getSelectedItemIds(),
        numberOfPeople: formValues.numberOfPeople,
        eventDetails: formValues.eventDetails,
        contactInfo: {
          name: formValues.contactName,
          phone: formValues.contactPhone,
          email: formValues.contactEmail
        }
      });
      
      
      setBudgetResult(response);
      return response;
    } catch (error) {
      console.error('Error creating budget:', error);
      setError('Failed to create budget. Please try again.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const resetBudget = () => {
    setBudgetResult(null);
    setError(null);
    setFormValues(defaultFormValues);
  };


  const budgetContextValues = useMemo(() => ({
    budgetResult,
    isLoading,
    error,
    formValues,
    updateFormValues,
    createBudget,
    resetBudget
  }), [budgetResult, isLoading, error, formValues]);

  return (
    <BudgetContext.Provider value={budgetContextValues}>
      {children}
    </BudgetContext.Provider>
  );
}

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
};
