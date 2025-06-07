"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface GastronomyInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'chef' | 'menu' | 'vintage';
  helperText?: string;
}

const GastronomyInput = React.forwardRef<HTMLInputElement, GastronomyInputProps>(
  ({ className, label, icon, variant = 'default', helperText, ...props }, ref) => {
    const variantStyles = {
      default: {
        container: "bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-primary-300 hover:border-primary-500 focus-within:border-primary-600 shadow-md hover:shadow-lg transition-all duration-300",
        label: "text-secondary-600 font-food text-lg tracking-wide",
        input: "bg-transparent text-gray-800 placeholder-primary-400 font-medium",
        icon: "text-primary-500"
      },
      chef: {
        container: "bg-gradient-to-br from-white-100 to-white-200 border-2 border-secondary-400 hover:border-secondary-600 focus-within:border-secondary-700 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden",
        label: "text-secondary-700 font-rustic text-xl font-bold tracking-wider uppercase",
        input: "bg-transparent text-gray-900 placeholder-secondary-500 font-semibold",
        icon: "text-secondary-600"
      },
      menu: {
        container: "bg-gradient-to-r from-primary-100 via-white-200 to-primary-100 border-3 border-primary-400 hover:border-primary-600 focus-within:border-primary-700 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02]",
        label: "text-primary-700 font-food text-2xl font-extrabold tracking-widest uppercase",
        input: "bg-transparent text-gray-900 placeholder-primary-500 font-bold text-lg",
        icon: "text-primary-600"
      },
      vintage: {
        container: "bg-gradient-to-br from-white-300 to-primary-200 border-4 border-double border-secondary-500 hover:border-secondary-700 focus-within:border-secondary-800 shadow-2xl hover:shadow-[0_15px_35px_rgba(0,0,0,0.2)] transition-all duration-700",
        label: "text-secondary-800 font-rustic text-xl font-black tracking-[0.2em] uppercase",
        input: "bg-transparent text-gray-900 placeholder-secondary-600 font-bold italic",
        icon: "text-secondary-700"
      }
    };

    const currentVariant = variantStyles[variant];

    return (
      <div className="relative group mb-6">
        {/* Decorative background pattern for chef and vintage variants */}
        {(variant === 'chef' || variant === 'vintage') && (
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-2 left-4 w-6 h-6 border-2 border-current rounded-full"></div>
            <div className="absolute bottom-2 right-4 w-4 h-4 border-2 border-current rounded-full"></div>
            <div className="absolute top-1/2 right-8 w-2 h-2 bg-current rounded-full"></div>
          </div>
        )}
        
        <div className={cn(
          "relative rounded-xl p-6 transition-all duration-300",
          currentVariant.container,
          className
        )}>
          {/* Vintage ornamental corners */}
          {variant === 'vintage' && (
            <>
              <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-secondary-600"></div>
              <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-secondary-600"></div>
              <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-secondary-600"></div>
              <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-secondary-600"></div>
            </>
          )}

          {/* Menu variant special border effect */}
          {variant === 'menu' && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-300/20 to-transparent animate-pulse"></div>
          )}

          <div className="relative z-10">
            {/* Label with icon */}
            <div className="flex items-center gap-3 mb-3">
              {icon && (
                <div className={cn("text-xl transition-colors duration-300", currentVariant.icon)}>
                  {icon}
                </div>
              )}
              <label className={cn(
                "transition-all duration-300 select-none",
                currentVariant.label
              )}>
                {label}
              </label>
            </div>

            {/* Input field */}
            <div className="relative">
              <input
                ref={ref}
                className={cn(
                  "w-full border-0 outline-none focus:outline-none text-base py-3 px-2 transition-all duration-300",
                  "placeholder:transition-all placeholder:duration-300",
                  "focus:placeholder:opacity-60",
                  currentVariant.input
                )}
                {...props}
              />
              
              {/* Input underline effect */}
              <div className={cn(
                "absolute bottom-0 left-0 h-0.5 bg-gradient-to-r transition-all duration-300 transform scale-x-0 group-focus-within:scale-x-100",
                variant === 'chef' && "from-secondary-500 to-secondary-700",
                variant === 'menu' && "from-primary-500 to-primary-700",
                variant === 'vintage' && "from-secondary-600 to-primary-600",
                variant === 'default' && "from-primary-400 to-primary-600"
              )}></div>
            </div>

            {/* Helper text */}
            {helperText && (
              <p className="mt-2 text-sm text-gray-600 font-medium opacity-70">
                {helperText}
              </p>
            )}
          </div>

          {/* Floating sparkle effect for menu variant */}
          {variant === 'menu' && (
            <div className="absolute top-4 right-4 opacity-30">
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-ping"></div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

GastronomyInput.displayName = "GastronomyInput";

export { GastronomyInput };
