// Validation utilities for frontend forms

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Phone number validation (Brazilian format)
export const validatePhoneNumber = (phone: string): boolean => {
  // Remove all non-digit characters
  console.log(phone)
  const cleaned = phone.replace(/\D/g, '');
  // Brazilian phone: 11 digits (with area code) or 10 digits (landline)
  return cleaned.length >= 10 && cleaned.length <= 12;
};

// Email validation
export const validateEmail = (email: string): boolean => {
  if (!email.trim()) return true; // Email is optional
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Name validation
export const validateName = (name: string): boolean => {
  return name.trim().length >= 2;
};

// Budget form validation
export interface BudgetFormData {
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  numberOfPeople: number;
  eventDetails: string;
}

export const validateBudgetForm = (formData: BudgetFormData): ValidationResult => {
  const errors: ValidationError[] = [];

  // Required field validations
  if (!formData.contactName.trim()) {
    errors.push({ field: 'contactName', message: 'Nome é obrigatório' });
  } else if (!validateName(formData.contactName)) {
    errors.push({ field: 'contactName', message: 'Nome deve ter pelo menos 2 caracteres' });
  }

  if (!formData.contactPhone.trim()) {
    errors.push({ field: 'contactPhone', message: 'Telefone é obrigatório' });
  } else if (!validatePhoneNumber(formData.contactPhone)) {
    errors.push({ field: 'contactPhone', message: 'Telefone deve ter formato válido (10-11 dígitos)' });
  }

  if (formData.contactEmail && !validateEmail(formData.contactEmail)) {
    errors.push({ field: 'contactEmail', message: 'Email deve ter formato válido' });
  }

  if (!formData.numberOfPeople || formData.numberOfPeople < 1) {
    errors.push({ field: 'numberOfPeople', message: 'Número de pessoas deve ser maior que 0' });
  } else if (formData.numberOfPeople > 1000) {
    errors.push({ field: 'numberOfPeople', message: 'Número de pessoas não pode exceder 1000' });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Order form validation
export interface OrderFormData {
  contactName: string;
  contactPhone: string;
  contactEmail?: string;
  orderDetailsNotes?: string;
  orderItems: Array<{ id: number | string; quantity: number }>;
}

export const validateOrderForm = (formData: OrderFormData): ValidationResult => {
  const errors: ValidationError[] = [];

  // Required field validations
  if (!formData.contactName.trim()) {
    errors.push({ field: 'contactName', message: 'Nome é obrigatório' });
  } else if (!validateName(formData.contactName)) {
    errors.push({ field: 'contactName', message: 'Nome deve ter pelo menos 2 caracteres' });
  }

  if (!formData.contactPhone.trim()) {
    errors.push({ field: 'contactPhone', message: 'Telefone é obrigatório' });
  } else if (!validatePhoneNumber(formData.contactPhone)) {
    errors.push({ field: 'contactPhone', message: 'Telefone deve ter formato válido (10-11 dígitos)' });
  }

  if (formData.contactEmail && !validateEmail(formData.contactEmail)) {
    errors.push({ field: 'contactEmail', message: 'Email deve ter formato válido' });
  }

  // Order items validation
  if (!formData.orderItems || formData.orderItems.length === 0) {
    errors.push({ field: 'orderItems', message: 'Pelo menos um item deve ser selecionado' });
  } else {
    // Validate each order item
    formData.orderItems.forEach((item, index) => {
      if (!item.id) {
        errors.push({ field: `orderItems[${index}].id`, message: `Item ${index + 1}: ID é obrigatório` });
      }
      if (!item.quantity || item.quantity <= 0) {
        errors.push({ field: `orderItems[${index}].quantity`, message: `Item ${index + 1}: Quantidade deve ser maior que 0` });
      }
      if (item.quantity > 1000) {
        errors.push({ field: `orderItems[${index}].quantity`, message: `Item ${index + 1}: Quantidade não pode exceder 1000` });
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Helper function to format phone number
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    // Mobile: (11) 91234-5678
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  } else if (cleaned.length === 10) {
    // Landline: (11) 1234-5678
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }
  
  return phone; // Return original if not valid length
};

// Helper function to clean phone number for API
export const cleanPhoneNumber = (phone: string): string => {
  return phone.replace(/\D/g, '');
};
