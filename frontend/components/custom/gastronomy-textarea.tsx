"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface GastronomyTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  icon?: React.ReactNode;
  variant?: 'recipe' | 'menu' | 'chef-notes' | 'vintage';
  helperText?: string;
}

const GastronomyTextarea = React.forwardRef<HTMLTextAreaElement, GastronomyTextareaProps>(
  ({ className, label, icon, variant = 'recipe', helperText, ...props }, ref) => {
    const variantStyles = {
      recipe: {
        container: "bg-gradient-to-br from-white-100 via-white-200 to-primary-100 border-3 border-dashed border-primary-400 hover:border-primary-600 focus-within:border-primary-700 shadow-lg hover:shadow-xl transition-all duration-500",
        label: "text-primary-700 text-xl tracking-wide",
        textarea: "bg-transparent text-white placeholder-white font-medium resize-none",
        icon: "text-primary-600",
        decoration: "recipe-lines"
      },
      menu: {
        container: "bg-gradient-to-br from-primary-50 to-white-200 border-4 border-double border-secondary-500 hover:border-secondary-700 focus-within:border-secondary-800 shadow-xl hover:shadow-2xl transition-all duration-700",
        label: "text-white text-2xl font-extrabold tracking-widest uppercase",
        textarea: "bg-transparent text-white placeholder-secondary-600 font-semibold text-lg resize-none",
        icon: "text-white",
        decoration: "menu-border"
      },
      'chef-notes': {
        container: "bg-gradient-to-br from-white-200 to-primary-200 border-2 border-solid border-primary-500 hover:border-primary-700 focus-within:border-primary-800 shadow-md hover:shadow-lg transition-all duration-300 relative",
        label: "text-primary-800 text-lg font-bold tracking-wide italic",
        textarea: "bg-transparent text-white placeholder-white font-medium italic resize-none",
        icon: "text-primary-700",
        decoration: "chef-paper"
      },
      vintage: {
        container: "bg-gradient-to-br from-white-300 via-primary-100 to-white-300 border-4 border-double border-secondary-600 hover:border-secondary-800 focus-within:border-secondary-900 shadow-2xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] transition-all duration-700",
        label: "text-white text-xl font-black tracking-[0.3em] uppercase",
        textarea: "bg-transparent text-white placeholder-white font-bold italic resize-none",
        icon: "text-white",
        decoration: "vintage-ornate"
      }
    };

    const currentVariant = variantStyles[variant];

    return (
      <div className="relative group mb-8">
        <div className={cn(
          "relative rounded-2xl p-8 transition-all duration-500",
          currentVariant.container,
          className
        )}>
          {/* Decorative elements based on variant */}
          {variant === 'recipe' && (
            <div className="absolute inset-4 opacity-5 pointer-events-none">
              {/* Recipe paper lines */}
              {[...Array(8)].map((_, i) => (
                <div key={i * 2} className="w-full h-px bg-primary-400 mb-6" style={{ marginTop: `${i * 20}px` }}></div>
              ))}
            </div>
          )}

          {variant === 'menu' && (
            <>
              {/* Menu ornamental corners */}
              <div className="absolute top-4 left-4 w-8 h-8 border-l-3 border-t-3 border-secondary-600"></div>
              <div className="absolute top-4 right-4 w-8 h-8 border-r-3 border-t-3 border-secondary-600"></div>
              <div className="absolute bottom-4 left-4 w-8 h-8 border-l-3 border-b-3 border-secondary-600"></div>
              <div className="absolute bottom-4 right-4 w-8 h-8 border-r-3 border-b-3 border-secondary-600"></div>
              {/* Center ornament */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 border-2 border-secondary-500 rotate-45 opacity-20"></div>
            </>
          )}

          {variant === 'chef-notes' && (
            <>
              {/* Chef paper effect */}
              <div className="absolute top-0 left-8 w-px h-full bg-red-300 opacity-30"></div>
              <div className="absolute top-8 left-4 w-4 h-4 bg-red-400 rounded-full opacity-20"></div>
              <div className="absolute top-16 left-4 w-4 h-4 bg-red-400 rounded-full opacity-20"></div>
              <div className="absolute top-24 left-4 w-4 h-4 bg-red-400 rounded-full opacity-20"></div>
            </>
          )}

          {variant === 'vintage' && (
            <>
              {/* Vintage ornate decorations */}
              <div className="absolute top-2 left-2 w-6 h-6 opacity-30">
                <div className="w-full h-full border-2 border-secondary-700 rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-secondary-700 rounded-full"></div>
              </div>
              <div className="absolute top-2 right-2 w-6 h-6 opacity-30">
                <div className="w-full h-full border-2 border-secondary-700 rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-secondary-700 rounded-full"></div>
              </div>
              <div className="absolute bottom-2 left-2 w-6 h-6 opacity-30">
                <div className="w-full h-full border-2 border-secondary-700 rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-secondary-700 rounded-full"></div>
              </div>
              <div className="absolute bottom-2 right-2 w-6 h-6 opacity-30">
                <div className="w-full h-full border-2 border-secondary-700 rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-secondary-700 rounded-full"></div>
              </div>
            </>
          )}

          <div className="relative z-10">
            {/* Label with icon */}
            <div className="flex items-center gap-4 mb-4">
              {icon && (
                <div className={cn("text-2xl transition-colors duration-300", currentVariant.icon)}>
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

            {/* Textarea field */}
            <div className="relative">
              <textarea
                ref={ref}
                className={cn(
                  "w-full border-0 outline-none focus:outline-none text-base py-4 px-3 min-h-32 transition-all duration-300",
                  "placeholder:transition-all placeholder:duration-300",
                  "focus:placeholder:opacity-60",
                  "scrollbar-thin scrollbar-thumb-primary-400 scrollbar-track-transparent",
                  currentVariant.textarea
                )}
                {...props}
              />
              
              {/* Textarea underline effect */}
              <div className={cn(
                "absolute bottom-0 left-0 h-1 bg-gradient-to-r transition-all duration-500 transform scale-x-0 group-focus-within:scale-x-100",
                variant === 'recipe' && "from-primary-500 to-primary-700",
                variant === 'menu' && "from-secondary-600 to-secondary-800",
                variant === 'chef-notes' && "from-primary-600 to-primary-800",
                variant === 'vintage' && "from-secondary-700 to-primary-700"
              )}></div>
            </div>

            {/* Helper text */}
            {helperText && (
              <p className="mt-3 text-sm text-white opacity-70 italic">
                {helperText}
              </p>
            )}
          </div>

          {/* Floating animation elements */}
          {variant === 'menu' && (
            <>
              <div className="absolute top-8 right-8 opacity-20">
                <div className="w-3 h-3 bg-secondary-600 rounded-full animate-bounce"></div>
              </div>
              <div className="absolute bottom-8 left-8 opacity-20">
                <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse"></div>
              </div>
            </>
          )}

          {variant === 'vintage' && (
            <div className="absolute top-1/2 right-6 opacity-20 transform -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-secondary-700 rotate-45 animate-spin"></div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

GastronomyTextarea.displayName = "GastronomyTextarea";

export { GastronomyTextarea };
