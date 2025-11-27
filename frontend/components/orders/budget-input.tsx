'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, Check, TrendingDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

// CSS para remover as setas nativas do input number
const inputNumberStyles = `
  input[type='number']::-webkit-outer-spin-button,
  input[type='number']::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type='number'] {
    -moz-appearance: textfield;
  }
`;

interface BudgetInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  minValue?: number;
  maxValue?: number;
  step?: number;
  placeholder?: string;
  costPrice?: number;
  totalPrice?: number;
  showProfitWarning?: boolean;
  errorMessage?: string;
  hint?: string;
  disabled?: boolean;
}

export function BudgetInput({
  label,
  value,
  onChange,
  minValue = 0,
  maxValue,
  step = 0.01,
  placeholder = '0.00',
  costPrice,
  totalPrice,
  showProfitWarning = false,
  errorMessage,
  hint,
  disabled = false,
}: BudgetInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [localError, setLocalError] = useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Validar lucro mínimo (40% de margem)
  const MIN_MARGIN_PERCENT = 40;
  const isEditingTotal = label.includes('Total');
  const isEditingCost = label.includes('Custo');

  useEffect(() => {
    if (showProfitWarning && isEditingTotal && costPrice !== undefined) {
      const profit = value - costPrice;
      const margin = totalPrice ? (profit / totalPrice) * 100 : 0;

      if (value < costPrice) {
        setLocalError('⚠️ Preço menor que o custo!');
        setIsValid(false);
      } else if (margin < MIN_MARGIN_PERCENT && value > 0) {
        setLocalError(`⚠️ Margem abaixo de ${MIN_MARGIN_PERCENT}% (atual: ${margin.toFixed(1)}%)`);
        setIsValid(false);
      } else {
        setLocalError(null);
        setIsValid(true);
      }
    } else if (showProfitWarning && isEditingCost && totalPrice !== undefined) {
      const profit = totalPrice - value;
      const margin = totalPrice ? (profit / totalPrice) * 100 : 0;

      if (value > totalPrice) {
        setLocalError('⚠️ Custo maior que o total!');
        setIsValid(false);
      } else if (margin < MIN_MARGIN_PERCENT && totalPrice > 0) {
        setLocalError(`⚠️ Margem abaixo de ${MIN_MARGIN_PERCENT}% (atual: ${margin.toFixed(1)}%)`);
        setIsValid(false);
      } else {
        setLocalError(null);
        setIsValid(true);
      }
    } else {
      setLocalError(errorMessage || null);
      setIsValid(!errorMessage);
    }
  }, [value, costPrice, totalPrice, label, showProfitWarning, errorMessage, isEditingTotal, isEditingCost]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value) || 0;

    // Validação de limites - bloqueia valores menores que o mínimo
    if (newValue < minValue && newValue > 0) {
      setLocalError(`Mínimo permitido: R$ ${minValue.toFixed(2)}`);
      setIsValid(false);
      e.target.value = String(value);
      return; // Bloqueia a atualização
    }

    if (maxValue !== undefined && newValue > maxValue) {
      setLocalError(`Máximo: R$ ${maxValue.toFixed(2)}`);
      setIsValid(false);
      e.target.value = String(value);
      return;
    }

    onChange(newValue);
  };

  const handleQuickIncrement = (amount: number) => {
    const newValue = value + amount;
    if (maxValue !== undefined && newValue > maxValue) {
      return;
    }
    onChange(newValue);
  };

  const handleQuickDecrement = (amount: number) => {
    const newValue = Math.max(minValue, value - amount);
    if (newValue < minValue) {
      setLocalError(`Mínimo permitido: R$ ${minValue.toFixed(2)}`);
      setIsValid(false);
      return; // Bloqueia se tentarem diminuir abaixo do mínimo
    }
    onChange(newValue);
  };

  // Verificar se botões estão habilitados
  const canDecrement = (amount: number) => {
    const newValue = value - amount;
    return newValue >= minValue;
  };

  const canIncrement = (amount: number) => {
    const newValue = value + amount;
    return maxValue === undefined || newValue <= maxValue;
  };

  return (
    <div className="space-y-2">
      <style>{inputNumberStyles}</style>
      <label className="block text-xs sm:text-sm font-semibold text-gray-700">{label}</label>

      <motion.div
        className={`relative transition-all duration-200 ${
          isFocused ? 'scale-105' : 'scale-100'
        }`}
      >
        <div
          className={`relative flex items-center border-2 rounded-xl px-2 sm:px-4 py-2 sm:py-3 transition-all duration-200 ${
            disabled
              ? 'border-gray-300 bg-gray-100 cursor-not-allowed'
              : isFocused
                ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-200'
                : isValid
                  ? 'border-gray-200 bg-white hover:border-gray-300'
                  : 'border-red-400 bg-red-50'
          }`}
        >
          <span className={cn(
            'font-medium mr-1 sm:mr-2 text-sm sm:text-base',
            disabled ? 'text-gray-400' : 'text-gray-600'
          )}>R$</span>
          
          <input
            ref={inputRef}
            type="number"
            value={value.toFixed(2) || ''}
            onChange={handleChange}
            onFocus={() => !disabled && setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            step={step}
            disabled={disabled}
            className={cn(
              'flex-1 bg-transparent outline-none text-base sm:text-lg font-semibold appearance-none',
              disabled ? 'text-gray-400 cursor-not-allowed' : isValid ? 'text-gray-900' : 'text-red-700'
            )}
          />
        </div>
      </motion.div>

      {/* Botões de incremento rápido */}
      {!disabled && (
        <motion.div
          className="flex gap-1 sm:gap-2 items-center justify-between overflow-x-auto pb-2"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
        {/* Botões de diminuição à esquerda */}
        <div className="flex gap-1 sm:gap-2 items-center flex-shrink-0">
          <motion.button
            type="button"
            onClick={() => handleQuickDecrement(100)}
            whileHover={canDecrement(100) ? { scale: 1.05 } : {}}
            whileTap={canDecrement(100) ? { scale: 0.95 } : {}}
            disabled={!canDecrement(100)}
            className={`px-2 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex-shrink-0 ${
              canDecrement(100)
                ? 'bg-red-100 hover:bg-red-200 text-red-700 cursor-pointer'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
            }`}
            title={canDecrement(100) ? "Diminuir R$ 100" : `Não pode diminuir abaixo de R$ ${minValue.toFixed(2)}`}
          >
            -100
          </motion.button>
          <motion.button
            type="button"
            onClick={() => handleQuickDecrement(50)}
            whileHover={canDecrement(50) ? { scale: 1.05 } : {}}
            whileTap={canDecrement(50) ? { scale: 0.95 } : {}}
            disabled={!canDecrement(50)}
            className={`px-2 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex-shrink-0 ${
              canDecrement(50)
                ? 'bg-orange-100 hover:bg-orange-200 text-orange-700 cursor-pointer'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
            }`}
            title={canDecrement(50) ? "Diminuir R$ 50" : `Não pode diminuir abaixo de R$ ${minValue.toFixed(2)}`}
          >
            -50
          </motion.button>
          <motion.button
            type="button"
            onClick={() => handleQuickDecrement(10)}
            whileHover={canDecrement(10) ? { scale: 1.05 } : {}}
            whileTap={canDecrement(10) ? { scale: 0.95 } : {}}
            disabled={!canDecrement(10)}
            className={`px-2 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex-shrink-0 ${
              canDecrement(10)
                ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700 cursor-pointer'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
            }`}
            title={canDecrement(10) ? "Diminuir R$ 10" : `Não pode diminuir abaixo de R$ ${minValue.toFixed(2)}`}
          >
            -10
          </motion.button>
        </div>

        {/* Botões de incremento à direita */}
        <div className="flex gap-1 sm:gap-2 items-center flex-shrink-0">
          <motion.button
            type="button"
            onClick={() => handleQuickIncrement(10)}
            whileHover={canIncrement(10) ? { scale: 1.05 } : {}}
            whileTap={canIncrement(10) ? { scale: 0.95 } : {}}
            disabled={!canIncrement(10)}
            className={`px-2 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex-shrink-0 ${
              canIncrement(10)
                ? 'bg-blue-100 hover:bg-blue-200 text-blue-700 cursor-pointer'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
            }`}
            title={canIncrement(10) ? "Aumentar R$ 10" : `Máximo: R$ ${maxValue?.toFixed(2)}`}
          >
            +10
          </motion.button>
          <motion.button
            type="button"
            onClick={() => handleQuickIncrement(50)}
            whileHover={canIncrement(50) ? { scale: 1.05 } : {}}
            whileTap={canIncrement(50) ? { scale: 0.95 } : {}}
            disabled={!canIncrement(50)}
            className={`px-2 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex-shrink-0 ${
              canIncrement(50)
                ? 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700 cursor-pointer'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
            }`}
            title={canIncrement(50) ? "Aumentar R$ 50" : `Máximo: R$ ${maxValue?.toFixed(2)}`}
          >
            +50
          </motion.button>
          <motion.button
            type="button"
            onClick={() => handleQuickIncrement(100)}
            whileHover={canIncrement(100) ? { scale: 1.05 } : {}}
            whileTap={canIncrement(100) ? { scale: 0.95 } : {}}
            disabled={!canIncrement(100)}
            className={`px-2 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex-shrink-0 ${
              canIncrement(100)
                ? 'bg-purple-100 hover:bg-purple-200 text-purple-700 cursor-pointer'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
            }`}
            title={canIncrement(100) ? "Aumentar R$ 100" : `Máximo: R$ ${maxValue?.toFixed(2)}`}
          >
            +100
          </motion.button>
        </div>
      </motion.div>
      )}

      <AnimatePresence>
        {localError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="flex items-start gap-2 p-2 sm:p-3 bg-red-50 border border-red-200 rounded-lg"
          >
            <TrendingDown className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs sm:text-sm text-red-700 break-words">{localError}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {hint && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-xs text-gray-500 px-1"
        >
          {hint}
        </motion.p>
      )}
    </div>
  );
}
