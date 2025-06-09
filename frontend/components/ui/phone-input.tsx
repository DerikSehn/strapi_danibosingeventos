"use client";

import React, { useState, useRef, useEffect } from 'react';
 import { GastronomyInput } from '../custom/gastronomy-input';
import { createCPFMask, createPhoneMask, InputMask } from '@/lib/utils/input-mask-fixed';

interface PhoneInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
    [key: string]: any; 
}

// Helper function to safely set cursor position
const safeSetSelectionRange = (input: HTMLInputElement, position: number) => {
  if (input && input.type === 'text') {
    try {
      input.setSelectionRange(position, position);
    } catch (error) {
      // Ignore errors for input types that don't support selection
      console.warn('setSelectionRange not supported for this input type');
    }
  }
};

export function PhoneInput({ value = '', onChange, placeholder, className, ...props }: Readonly<PhoneInputProps>) {
  const [displayValue, setDisplayValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const maskRef = useRef<InputMask>(createPhoneMask());

  useEffect(() => {
    const maskedValue = maskRef.current.applyMask(value);
    setDisplayValue(maskedValue);
  }, [value]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    const cleanValue = maskRef.current.cleanValue(newValue);
    const maskedValue = maskRef.current.applyMask(newValue);
    
    setDisplayValue(maskedValue);
    
    if (onChange) {
      onChange(cleanValue);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!inputRef.current) return;

    const cursorPosition = inputRef.current.selectionStart || 0;
    const result = maskRef.current.handleKeyDown(event, displayValue, cursorPosition);

    if (result) {
      event.preventDefault();
      const { newValue, newCursorPosition } = result;
      const cleanValue = maskRef.current.cleanValue(newValue);
      
      setDisplayValue(newValue);
      
      // Set cursor position after state update
      setTimeout(() => {
        if (inputRef.current) {
          safeSetSelectionRange(inputRef.current, newCursorPosition);
        }
      }, 0);
      
      if (onChange) {
        onChange(cleanValue);
      }
    }
  };
  return (
    <GastronomyInput
      {...props}
      label={props.label || "Telefone"}
      ref={inputRef}
      type="text"
      value={displayValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder={placeholder ?? '(11) 98765-4321'}
      className={className ?? "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"}
    />
  );
}

interface CPFInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function CPFInput({ value = '', onChange, placeholder, className }: Readonly<CPFInputProps>) {
  const [displayValue, setDisplayValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const maskRef = useRef<InputMask>(createCPFMask());

  useEffect(() => {
    const maskedValue = maskRef.current.applyMask(value);
    setDisplayValue(maskedValue);
  }, [value]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    const cleanValue = maskRef.current.cleanValue(newValue);
    const maskedValue = maskRef.current.applyMask(newValue);
    
    setDisplayValue(maskedValue);
    
    if (onChange) {
      onChange(cleanValue);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!inputRef.current) return;

    const cursorPosition = inputRef.current.selectionStart || 0;
    const result = maskRef.current.handleKeyDown(event, displayValue, cursorPosition);

    if (result) {
      event.preventDefault();
      const { newValue, newCursorPosition } = result;
      const cleanValue = maskRef.current.cleanValue(newValue);
      
      setDisplayValue(newValue);
      
      // Set cursor position after state update
      setTimeout(() => {
        if (inputRef.current) {
          safeSetSelectionRange(inputRef.current, newCursorPosition);
        }
      }, 0);
      
      if (onChange) {
        onChange(cleanValue);
      }
    }
  };

  return (
    <GastronomyInput
      label='CPF'
      ref={inputRef}
      type="text"
      value={displayValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder={placeholder ?? '000.000.000-00'}
      className={className ?? "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"}
    />
  );
}
