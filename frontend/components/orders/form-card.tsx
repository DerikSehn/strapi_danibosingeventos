'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface FormCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
}

/**
 * Componente reutilizável para cards em formulários
 * Fornece estrutura consistente com título, subtítulo e customização de classes
 */
export function FormCard({
  title,
  subtitle,
  children,
  className = '',
  headerClassName = '',
  contentClassName = '',
}: FormCardProps) {
  return (
    <Card className={cn('h-full', className)}>
      <CardHeader className={cn('pb-3', headerClassName)}>
        <CardTitle className="text-base sm:text-lg">{title}</CardTitle>
        {subtitle && <CardDescription className="text-xs sm:text-sm">{subtitle}</CardDescription>}
      </CardHeader>
      <CardContent className={cn('grid gap-3', contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
}

interface FormFieldProps {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  disabled?: boolean;
  minHeight?: string;
  children?: React.ReactNode;
  className?: string;
  error?: string;
}

/**
 * Campo de formulário reutilizável com label
 */
export function FormField({
  label,
  id,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  disabled = false,
  minHeight = '',
  children,
  className = '',
  error = '',
}: FormFieldProps) {
  const inputClasses = cn(
    'border rounded px-3 py-2 w-full text-sm',
    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
    'disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed',
    error ? 'border-red-500 focus:ring-red-500 bg-red-50' : 'border-gray-300',
    className
  );

  const isTextarea = type === 'textarea';
  const isSelect = type === 'select';

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium mb-1.5">
        {label}
      </label>
      {isTextarea ? (
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(inputClasses, minHeight && `min-h-[${minHeight}]`, 'resize-none')}
          style={minHeight ? { minHeight } : undefined}
        />
      ) : isSelect ? (
        <select
          id={id}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={inputClasses}
        >
          {children}
        </select>
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={inputClasses}
        />
      )}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}

interface FormRowProps {
  children: React.ReactNode;
  cols?: number;
  gap?: string;
  className?: string;
}

/**
 * Grid layout para organizar campos em linhas
 */
export function FormRow({ children, cols = 2, gap = 'gap-3', className = '' }: FormRowProps) {
  return (
    <div className={cn(`grid grid-cols-1 sm:grid-cols-${cols} ${gap}`, className)}>
      {children}
    </div>
  );
}
