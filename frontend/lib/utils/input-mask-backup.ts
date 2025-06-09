/**
 * Input mask utility for dynamic masks
 * 9 = digit (0-9)
 * x = letter (a-z, A-Z)
 * _ = any character
 */

export interface MaskOptions {
  mask: string;
  placeholder?: string;
  showMask?: boolean;
}

export class InputMask {
  public mask: string;
  private placeholder: string;
  private showMask: boolean;

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
  }  handleKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>,
    currentValue: string,
    cursorPosition: number
  ): { newValue: string; newCursorPosition: number } | null {
    const { key } = event;
    
    if (key === 'Backspace') {
      if (cursorPosition === 0) {
        return null;
      }

      // Find the previous valid input position
      const previousPosition = this.getPreviousValidPosition(currentValue, cursorPosition);
      const cleanValue = this.cleanValue(currentValue);
      const cleanPosition = this.getCleanPosition(previousPosition);
      
      // Remove character at clean position
      const newCleanValue = cleanValue.slice(0, cleanPosition) + cleanValue.slice(cleanPosition + 1);
      const maskedValue = this.applyMask(newCleanValue);
      
      return {
        newValue: maskedValue,
        newCursorPosition: previousPosition
      };
    }

    if (key === 'Delete') {
      const cleanValue = this.cleanValue(currentValue);
      const maskedValue = this.applyMask(cleanValue);
      const nextPosition = this.getNextValidPosition(maskedValue, cursorPosition);
      
      if (nextPosition < maskedValue.length) {
        const newCleanValue = cleanValue.slice(0, this.getCleanPosition(cursorPosition)) + 
                             cleanValue.slice(this.getCleanPosition(cursorPosition) + 1);
        return {
          newValue: this.applyMask(newCleanValue),
          newCursorPosition: cursorPosition
        };
      }
      
      return null;
    }

    // Handle character input
    if (key.length === 1 && !event.ctrlKey && !event.altKey && !event.metaKey) {
      const nextInputPosition = this.getNextValidPosition(currentValue, cursorPosition);
      
      if (nextInputPosition >= this.mask.length) {
        return null; // Mask is full
      }
      
      const maskChar = this.mask[nextInputPosition];
      
      if (this.isValidChar(key, maskChar)) {
        const cleanValue = this.cleanValue(currentValue);
        const cleanPosition = this.getCleanPosition(cursorPosition);
        const newCleanValue = cleanValue.slice(0, cleanPosition) + key + cleanValue.slice(cleanPosition);
        const maskedValue = this.applyMask(newCleanValue);
        const newCursorPosition = this.getNextValidPosition(maskedValue, nextInputPosition);
        
        return {
          newValue: maskedValue,
          newCursorPosition: newCursorPosition
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
