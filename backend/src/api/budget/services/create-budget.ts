import { ApiBudgetBudget } from '../../../../types/generated/contentTypes';

// optional apibudget interface
interface BudgetCalculationData {
  totalItemPrice: any;
  numberOfWaiters: number;
  waiterPrice: number;
  extraHours: number;
  extraHourPrice: number;
  totalPrice: any;
}

export async function createBudget(budget: BudgetCalculationData) {
  const today = new Date().toLocaleDateString();
}
