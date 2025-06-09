"use client";

import React, { useState, useRef, useEffect } from 'react';
import { InputMask, MaskOptions } from '@/lib/utils/input-mask';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface MaskedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  mask: string;
  value?: string;
  onChange?: (value: string, maskedValue: string) => void;
  placeholder?: string;
  showMask?: boolean;
  className?: string;
}

export const MaskedInput = React.forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ mask, value = '', onChange, placeholder, showMask = false, className, ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState('');
    const [cursorPosition, setCursorPosition] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const maskInstance = useRef<InputMask>();

    // Initialize mask instance
    useEffect(() => {
      const maskOptions: MaskOptions = {
        mask,
        placeholder,
        showMask
      };
      maskInstance.current = new InputMask(maskOptions);
    }, [mask, placeholder, showMask]);

    // Update display value when value prop changes
    useEffect(() => {
      if (maskInstance.current) {
        const maskedValue = maskInstance.current.applyMask(value);
        setDisplayValue(maskedValue);
      }
    }, [value]);    // Set cursor position - only for text inputs that support selection
    useEffect(() => {
      if (inputRef.current && inputRef.current.type === 'text') {
        try {
          inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
        } catch (error) {
          // Ignore errors for input types that don't support selection
          console.warn('setSelectionRange not supported for this input type');
        }
      }
    }, [cursorPosition, displayValue]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!maskInstance.current) return;

      const newValue = event.target.value;
      const cleanValue = maskInstance.current.cleanValue(newValue);
      const maskedValue = maskInstance.current.applyMask(newValue);
      
      setDisplayValue(maskedValue);
      setCursorPosition(maskedValue.length);
      
      if (onChange) {
        onChange(cleanValue, maskedValue);
      }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (!maskInstance.current || !inputRef.current) return;

      const currentCursorPosition = inputRef.current.selectionStart || 0;
      const result = maskInstance.current.handleKeyDown(event, displayValue, currentCursorPosition);

      if (result) {
        event.preventDefault();
        const { newValue, newCursorPosition } = result;
        const cleanValue = maskInstance.current.cleanValue(newValue);
        
        setDisplayValue(newValue);
        setCursorPosition(newCursorPosition);
        
        if (onChange) {
          onChange(cleanValue, newValue);
        }
      }
    };

    return (
      <Input
        {...props}
        ref={(node) => {
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
          (inputRef as any).current = node;
        }}
        type="text"
        value={displayValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={maskInstance.current?.getPlaceholder() || placeholder}
        className={cn(className)}
      />
    );
  }
);

MaskedInput.displayName = 'MaskedInput';
