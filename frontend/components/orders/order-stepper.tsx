'use client';

import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, Clock, Package, Truck, CheckCircle2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

type OrderStatus = 'pendente' | 'confirmado' | 'em_producao' | 'pronto' | 'entregue' | 'cancelado';

interface OrderStepperProps {
  currentStatus?: OrderStatus;
}

const statusSteps: Record<OrderStatus, number> = {
  'pendente': 1,
  'confirmado': 2,
  'em_producao': 3,
  'pronto': 4,
  'entregue': 5,
  'cancelado': 0,
};

const steps = [
  {
    title: 'Pendente',
    description: 'Aguardando confirmação',
    icon: Clock,
  },
  {
    title: 'Confirmado',
    description: 'Pedido confirmado',
    icon: CheckCircle,
  },
  {
    title: 'Produção',
    description: 'Sendo produzido',
    icon: Package,
  },
  {
    title: 'Pronto',
    description: 'Pronto para entrega',
    icon: CheckCircle2,
  },
  {
    title: 'Entregue',
    description: 'Entregue ao cliente',
    icon: Truck,
  },
];

export function OrderStepper({ currentStatus = 'pendente' }: OrderStepperProps) {
  const currentStep = statusSteps[currentStatus];
  const isCanceled = currentStatus === 'cancelado';
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScroll, 300);
    }
  };

  React.useEffect(() => {
    checkScroll();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      return () => {
        container.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, []);

  if (isCanceled) {
    return (
      <div className="w-full px-3 sm:px-4 py-4 sm:py-6 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 sm:gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
        <div className="min-w-0">
          <p className="font-semibold text-red-800 text-sm sm:text-base">Pedido Cancelado</p>
          <p className="text-xs sm:text-sm text-red-700">Este pedido foi cancelado e não prosseguirá no fluxo.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="relative flex items-center gap-2 sm:gap-3">
        {/* Left Arrow Button */}
        <button
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
          className={cn(
            'hidden sm:flex items-center justify-center w-10 h-10 rounded-lg border transition-all flex-shrink-0',
            canScrollLeft
              ? 'bg-white border-gray-300 hover:bg-gray-50 cursor-pointer'
              : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
          )}
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-x-auto scrollbar-hide"
          onScroll={checkScroll}
        >
          <ol className="flex items-center gap-2 sm:gap-4 pb-2 px-1">
            {steps.map((step, index) => {
              const stepNumber = index + 1;
              const Icon = step.icon;
              const isCompleted = stepNumber < currentStep;
              const isCurrent = stepNumber === currentStep;
              const isUpcoming = stepNumber > currentStep;

              return (
                <li key={step.title} className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                  {/* Step Circle */}
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        'flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 shrink-0 transition-all',
                        isCompleted && 'bg-emerald-50 border-emerald-500',
                        isCurrent && 'bg-blue-50 border-blue-500 ring-4 ring-blue-100',
                        isUpcoming && 'bg-gray-50 border-gray-300'
                      )}
                    >
                      <Icon
                        className={cn(
                          'w-5 h-5 sm:w-6 sm:h-6',
                          isCompleted && 'text-emerald-600',
                          isCurrent && 'text-blue-600',
                          isUpcoming && 'text-gray-400'
                        )}
                      />
                    </div>
                    <div className="flex flex-col items-center mt-1 sm:mt-2">
                      <h3
                        className={cn(
                          'text-xs sm:text-sm font-semibold whitespace-nowrap',
                          isCompleted && 'text-emerald-700',
                          isCurrent && 'text-blue-700',
                          isUpcoming && 'text-gray-500'
                        )}
                      >
                        {step.title}
                      </h3>
                      <p
                        className={cn(
                          'text-xs hidden sm:block',
                          isCompleted && 'text-emerald-600',
                          isCurrent && 'text-blue-600',
                          isUpcoming && 'text-gray-400'
                        )}
                      >
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Connector Line */}
                  {stepNumber < steps.length && (
                    <div
                      className={cn(
                        'hidden sm:block flex-shrink-0 w-8 h-1 transition-all',
                        stepNumber < currentStep
                          ? 'bg-emerald-500'
                          : 'bg-gray-300'
                      )}
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
          className={cn(
            'hidden sm:flex items-center justify-center w-10 h-10 rounded-lg border transition-all flex-shrink-0',
            canScrollRight
              ? 'bg-white border-gray-300 hover:bg-gray-50 cursor-pointer'
              : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
          )}
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* CSS to hide scrollbar */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
