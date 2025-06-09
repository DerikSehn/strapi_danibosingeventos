/**
 * Input mask utility for dynamic masks
 * 9 = digit (0-9)
 * x = letter (a-z, A-Z)
 * _ = any character
 */

import React from 'react';

export interface MaskOptions {
  mask: string;
  placeholder?: string;
  showMask?: boolean;
}

export class InputMask {
  public mask: string;
  private readonly placeholder: string;
  private readonly showMask: boolean;

  constructor(options: MaskOptions) {
    this.mask = options.mask;
    this.placeholder = options.placeholder || this.generatePlaceholder();
    this.showMask = options.showMask ?? true;
  }

  private generatePlaceholder(): string {
    return this.mask
      .replace(/9/g, '_')
      .replace(/x/g, '_')
      .replace(/_/g, '_');
  }

  private isValidChar(char: string, maskChar: string): boolean {
    switch (maskChar) {
      case '9':
        return /\d/.test(char);
      case 'x':
        return /[a-zA-Z]/.test(char);
      case '_':
        return true;
      default:
        return char === maskChar;
    }
  }

  private getNextValidPosition(value: string, position: number): number {
    const maskChars = this.mask.split('');
    
    for (let i = position; i < maskChars.length; i++) {
      const maskChar = maskChars[i];
      if (maskChar === '9' || maskChar === 'x' || maskChar === '_') {
        return i;
      }
    }
    
    return maskChars.length;
  }

  private getPreviousValidPosition(value: string, position: number): number {
    const maskChars = this.mask.split('');
    
    for (let i = position - 1; i >= 0; i--) {
      const maskChar = maskChars[i];
      if (maskChar === '9' || maskChar === 'x' || maskChar === '_') {
        return i;
      }
    }
    
    return 0;
  }

  applyMask(value: string): string {
    if (!value) return '';

    const cleanValue = this.cleanValue(value);
    const maskChars = this.mask.split('');
    const result: string[] = [];
    let valueIndex = 0;

    for (let i = 0; i < maskChars.length && valueIndex < cleanValue.length; i++) {
      const maskChar = maskChars[i];
      const inputChar = cleanValue[valueIndex];

      if (maskChar === '9' || maskChar === 'x' || maskChar === '_') {
        if (this.isValidChar(inputChar, maskChar)) {
          result.push(inputChar);
          valueIndex++;
        } else {
          // Skip invalid character
          valueIndex++;
          i--; // Stay at the same mask position
        }
      } else {
        // Fixed character in mask
        result.push(maskChar);
      }
    }

    return result.join('');
  }

  cleanValue(value: string): string {
    if (!value) return '';
    
    // Remove all non-alphanumeric characters that are not part of the input
    const maskChars = this.mask.split('');
    const fixedChars = maskChars
      .filter(char => char !== '9' && char !== 'x' && char !== '_')
      .join('');
    
    // Create regex to remove fixed characters
    if (fixedChars.length === 0) {
      return value.replace(/[^a-zA-Z0-9]/g, '');
    }
    
    const fixedCharsRegex = new RegExp(`[${fixedChars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]`, 'g');
    
    return value.replace(fixedCharsRegex, '');
  }

  getPlaceholder(): string {
    return this.placeholder;
  }

  getDisplayValue(value: string): string {
    if (!value && this.showMask) {
      return this.placeholder;
    }
    return this.applyMask(value);
  }

  handleKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>,
    currentValue: string,
    cursorPosition: number
  ): { newValue: string; newCursorPosition: number } | null {
    const { key } = event;
    
    if (key === 'Backspace') {
      if (cursorPosition === 0) {
        return null;
      }

      // Remove the last character from clean value
      const cleanValue = this.cleanValue(currentValue);
      if (cleanValue.length === 0) {
        return null;
      }
      
      const newCleanValue = cleanValue.slice(0, -1);
      const maskedValue = this.applyMask(newCleanValue);
      
      return {
        newValue: maskedValue,
        newCursorPosition: maskedValue.length
      };
    }

    if (key === 'Delete') {
      // For delete, we'll use the same logic as backspace for simplicity
      return this.handleKeyDown(
        { ...event, key: 'Backspace' } as React.KeyboardEvent<HTMLInputElement>,
        currentValue,
        cursorPosition
      );
    }

    // Handle character input
    if (key.length === 1 && !event.ctrlKey && !event.altKey && !event.metaKey) {
      const cleanValue = this.cleanValue(currentValue);
      const newCleanValue = cleanValue + key;
      const maskedValue = this.applyMask(newCleanValue);
      
      // Only accept if the masked value is longer (meaning the character was valid)
      if (maskedValue.length > currentValue.length) {
        return {
          newValue: maskedValue,
          newCursorPosition: maskedValue.length
        };
      }
    }

    return null;
  }

  private getCleanPosition(maskedPosition: number): number {
    let cleanPos = 0;
    let maskedPos = 0;
    
    while (maskedPos < maskedPosition && maskedPos < this.mask.length) {
      const maskChar = this.mask[maskedPos];
      if (maskChar === '9' || maskChar === 'x' || maskChar === '_') {
        cleanPos++;
      }
      maskedPos++;
    }
    
    return cleanPos;
  }
}

// Predefined masks
export const PHONE_MASK = '(99) 99999-9999';
export const CPF_MASK = '999.999.999-99';
export const CNPJ_MASK = '99.999.999/9999-99';
export const CEP_MASK = '99999-999';
export const DATE_MASK = '99/99/9999';
export const TIME_MASK = '99:99';

// Create mask instances
export const createMask = (options: MaskOptions): InputMask => {
  return new InputMask(options);
};

export const createPhoneMask = (): InputMask => {
  return new InputMask({
    mask: PHONE_MASK,
    placeholder: '(11) 98765-4321',
    showMask: false
  });
};

export const createCPFMask = (): InputMask => {
  return new InputMask({
    mask: CPF_MASK,
    placeholder: '000.000.000-00',
    showMask: false
  });
};

export const createCNPJMask = (): InputMask => {
  return new InputMask({
    mask: CNPJ_MASK,
    placeholder: '00.000.000/0000-00',
    showMask: false
  });
};

export default InputMask;