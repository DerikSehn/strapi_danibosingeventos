"use client";

import { useMealItemsStore } from '@/lib/store/meal-items-store';
import { validateBudgetForm, ValidationResult } from '@/lib/utils/validation';
import { calculateBudget } from 'data/actions/calculate-budget';
import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { BudgetFormValues } from 'types/budget-form-values';
import { ApiBudgetBudget, ApiPartyTypePartyType } from 'types/generated/contentTypes';



interface BudgetContextType {
  budgetResult: ApiBudgetBudget['attributes'] | null;
  isLoading: boolean;
  error: string | null;
  validationErrors: ValidationResult | null;
  formValues: BudgetFormValues;
  updateFormValues: (values: Partial<BudgetFormValues>) => void;
  createBudget: (partyType: ApiPartyTypePartyType['attributes']) => Promise<ApiBudgetBudget['attributes'] | null>;
  validateForm: () => ValidationResult;
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
  const [validationErrors, setValidationErrors] = useState<ValidationResult | null>(null);
  const [formValues, setFormValues] = useState<BudgetFormValues>(defaultFormValues);
  
  const { getSelectedItemIds} = useMealItemsStore();
  const updateFormValues = (values: Partial<BudgetFormValues>) => {
    setFormValues(prev => ({ ...prev, ...values }));
    // Clear validation errors when form is updated
    setValidationErrors(null);
  };

  const validateForm = (): ValidationResult => {
    const validation = validateBudgetForm(formValues);
    setValidationErrors(validation);
    return validation;
  };

  const createBudget = async (partyType: ApiPartyTypePartyType['attributes']) => {
    // Validate form before submitting
    const validation = validateForm();
    if (!validation.isValid) {
      setError('Por favor, corrija os erros no formulário antes de continuar.');
      return null;
    }

    // Check if items are selected
    const selectedItemIds = getSelectedItemIds();
    if (selectedItemIds.length === 0) {
      setError('Por favor, selecione pelo menos um item antes de continuar.');
      return null;
    }

    setIsLoading(true);
    setError(null);
    try {
      // Extract just the IDs from the selected items
      const response = await calculateBudget({
        partyTypeId: partyType.documentId,
        selectedItemIds,
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
      setError('Falha ao criar orçamento. Tente novamente.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  const resetBudget = () => {
    setBudgetResult(null);
    setError(null);
    setValidationErrors(null);
    setFormValues(defaultFormValues);
  };

  const budgetContextValues = useMemo(() => ({
    budgetResult,
    isLoading,
    error,
    validationErrors,
    formValues,
    updateFormValues,
    createBudget,
    validateForm,
    resetBudget
  }), [budgetResult, isLoading, error, validationErrors, formValues]);

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
