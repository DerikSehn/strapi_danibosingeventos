import { InputMask, createCNPJMask, createCPFMask, createPhoneMask } from '@/lib/utils/input-mask';
import { useCallback, useMemo, useState } from 'react';

export type MaskType = 'phone' | 'cpf' | 'cnpj' | 'cep' | 'date' | 'time' | 'custom';

export interface UseMaskOptions {
  type?: MaskType;
  mask?: string;
  placeholder?: string;
  showMask?: boolean;
  initialValue?: string;
}

export function useMask(options: UseMaskOptions = {}) {
  const { type = 'custom', mask, placeholder, showMask = false, initialValue = '' } = options;
  
  const [value, setValue] = useState(initialValue);
  const [displayValue, setDisplayValue] = useState('');

  // Create mask instance based on type or custom mask
  const maskInstance = useMemo(() => {
    switch (type) {
      case 'phone':
        return createPhoneMask();
      case 'cpf':
        return createCPFMask();
      case 'cnpj':
        return createCNPJMask();
      case 'cep':
        return new InputMask({
          mask: '99999-999',
          placeholder: placeholder ?? '12345-678',
          showMask
        });
      case 'date':
        return new InputMask({
          mask: '99/99/9999',
          placeholder: placeholder ?? 'DD/MM/AAAA',
          showMask
        });
      case 'time':
        return new InputMask({
          mask: '99:99',
          placeholder: placeholder ?? 'HH:MM',
          showMask
        });
      case 'custom':
        if (!mask) {
          throw new Error('Custom mask requires a mask pattern');
        }
        return new InputMask({
          mask,
          placeholder,
          showMask
        });
      default:
        throw new Error(`Unknown mask type: ${type}`);
    }
  }, [type, mask, placeholder, showMask]);

  // Update display value when value changes
  useMemo(() => {
    const maskedValue = maskInstance.applyMask(value);
    setDisplayValue(maskedValue);
  }, [value, maskInstance]);

  const handleChange = useCallback((cleanValue: string, maskedValue: string) => {
    setValue(cleanValue);
    setDisplayValue(maskedValue);
  }, []);

  const reset = useCallback(() => {
    setValue('');
    setDisplayValue('');
  }, []);

  const isValid = useCallback(() => {
    const cleanValue = maskInstance.cleanValue(value);
    return cleanValue.length === maskInstance.mask.replace(/[^9x_]/g, '').length;
  }, [value, maskInstance]);

  const getPlaceholder = useCallback(() => {
    return maskInstance.getPlaceholder();
  }, [maskInstance]);

  return {
    value,
    displayValue,
    maskInstance,
    handleChange,
    reset,
    isValid,
    getPlaceholder,
    // Direct setters for external control
    setValue,
    setDisplayValue
  };
}
