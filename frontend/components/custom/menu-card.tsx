"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface MenuCardProps {
  children: React.ReactNode;
  variant?: 'elegant' | 'rustic' | 'modern' | 'vintage' | 'dark';
  title?: string;
  subtitle?: string;
  className?: string;
}

const MenuCard = React.forwardRef<HTMLDivElement, MenuCardProps>(
  ({ children, variant = 'elegant', title, subtitle, className, ...props }, ref) => {
    const variantStyles = {
      elegant: {
        container: "bg-gradient-to-b from-stone-50 via-stone-100 to-amber-50 border-l-4 border-r-4 border-secondary-600 shadow-2xl",
        header: "bg-gradient-to-r from-secondary-600 via-secondary-500 to-secondary-600 text-stone-50",
        title: "font-food text-2xl font-bold tracking-[0.2em] uppercase",
        subtitle: "font-serif text-sm italic opacity-90 tracking-wide",
        decoration: "italian-elegant"
      },
      rustic: {
        container: "bg-gradient-to-b from-amber-50 via-stone-100 to-amber-100 border-2 border-secondary-400 shadow-xl",
        header: "bg-gradient-to-r from-secondary-700 via-secondary-600 to-secondary-700 text-amber-50",
        title: "font-rustic text-3xl font-extrabold tracking-[0.3em] uppercase",
        subtitle: "font-serif text-base italic font-medium",
        decoration: "tuscan-rustic"
      },
      modern: {
        container: "bg-gradient-to-b from-white via-stone-50 to-amber-50 border-t-2 border-b-2 border-secondary-500 shadow-lg",
        header: "bg-gradient-to-r from-secondary-600 to-secondary-500 text-white",
        title: "font-food text-xl font-bold tracking-[0.15em] uppercase",
        subtitle: "font-sans text-xs font-medium tracking-wider uppercase",
        decoration: "milanese-modern"
      },
      vintage: {
        container: "bg-gradient-to-b from-amber-100 via-stone-100 to-amber-200 border-4 border-double border-secondary-700 shadow-2xl",
        header: "bg-gradient-to-r from-secondary-800 via-secondary-700 to-secondary-800 text-amber-100",
        title: "font-rustic text-2xl font-black tracking-[0.4em] uppercase",
        subtitle: "font-serif text-sm italic font-semibold tracking-wide",
        decoration: "venetian-vintage"
      },
      dark: {
        container: "bg-neutral-600/20 border-l-2 border-secondary-500 shadow-xl hover:shadow-2xl transition-all duration-300",
        header: "bg-gradient-to-r from-secondary-600 to-secondary-500 text-amber-100",
        title: "font-food text-lg font-bold tracking-[0.1em] text-amber-200",
        subtitle: "font-serif text-sm italic text-amber-100/80",
        decoration: "dark-elegant"
      }
    };

    const currentVariant = variantStyles[variant];

    return (
      <div 
        ref={ref}
        className={cn(
          "relative overflow-hidden transform transition-all duration-500 hover:shadow-3xl ",
          currentVariant.container,
          className
        )}
        {...props}
      >
        {/* Italian Restaurant Decorative Elements */}
        {variant === 'elegant' && (
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            {/* Corner flourishes */}
            <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-secondary-600"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-secondary-600"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-secondary-600"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-secondary-600"></div>
            {/* Central medallion */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 border border-secondary-400 rotate-45"></div>
          </div>
        )}

        {variant === 'rustic' && (
          <div className="absolute inset-0 opacity-8 pointer-events-none">
            {/* Tuscan stone texture */}
            <div className="absolute inset-0 bg-gradient-to-br from-stone-200/30 via-transparent to-amber-200/30"></div>
            {/* Horizontal texture lines */}
            <div className="absolute top-6 left-0 w-full h-px bg-secondary-400 opacity-20"></div>
            <div className="absolute top-12 left-0 w-full h-px bg-secondary-400 opacity-15"></div>
            <div className="absolute bottom-6 left-0 w-full h-px bg-secondary-400 opacity-20"></div>
            {/* Vertical accent lines */}
            <div className="absolute top-0 left-4 w-px h-full bg-secondary-500 opacity-10"></div>
            <div className="absolute top-0 right-4 w-px h-full bg-secondary-500 opacity-10"></div>
          </div>
        )}

        {variant === 'modern' && (
          <div className="absolute inset-0 opacity-6 pointer-events-none">
            {/* Clean geometric patterns */}
            <div className="absolute top-4 left-4 w-12 h-px bg-secondary-500"></div>
            <div className="absolute top-4 right-4 w-12 h-px bg-secondary-500"></div>
            <div className="absolute bottom-4 left-4 w-12 h-px bg-secondary-500"></div>
            <div className="absolute bottom-4 right-4 w-12 h-px bg-secondary-500"></div>
            {/* Minimal squares */}
            <div className="absolute top-6 left-6 w-2 h-2 bg-secondary-400"></div>
            <div className="absolute top-6 right-6 w-2 h-2 bg-secondary-400"></div>
          </div>
        )}        {variant === 'vintage' && (
          <>
            {/* Venetian ornate decorations */}
            <div className="absolute top-3 left-3 w-6 h-6 opacity-15">
              <div className="w-full h-full border border-secondary-700"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 border border-secondary-700 rotate-45"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-secondary-700"></div>
            </div>
            <div className="absolute top-3 right-3 w-6 h-6 opacity-15">
              <div className="w-full h-full border border-secondary-700"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 border border-secondary-700 rotate-45"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-secondary-700"></div>
            </div>
            <div className="absolute bottom-3 left-3 w-6 h-6 opacity-15">
              <div className="w-full h-full border border-secondary-700"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 border border-secondary-700 rotate-45"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-secondary-700"></div>
            </div>
            <div className="absolute bottom-3 right-3 w-6 h-6 opacity-15">
              <div className="w-full h-full border border-secondary-700"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 border border-secondary-700 rotate-45"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-secondary-700"></div>
            </div>
            {/* Ornate border pattern */}
            <div className="absolute top-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-secondary-600 to-transparent opacity-20"></div>
            <div className="absolute bottom-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-secondary-600 to-transparent opacity-20"></div>
          </>
        )}

        {variant === 'dark' && (
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            {/* Dark elegant texture */}
            <div className="absolute inset-0 bg-gradient-to-br from-secondary-500/20 via-transparent to-secondary-400/20"></div>
            {/* Subtle accent lines */}
            <div className="absolute top-3 left-0 w-full h-px bg-secondary-500 opacity-30"></div>
            <div className="absolute bottom-3 left-0 w-full h-px bg-secondary-500 opacity-30"></div>
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-3 h-3 border-l border-t border-secondary-500 opacity-40"></div>
            <div className="absolute top-0 right-0 w-3 h-3 border-r border-t border-secondary-500 opacity-40"></div>
          </div>
        )}

        {/* Header Section - Italian Restaurant Style */}
        {(title || subtitle) && (
          <div className={cn(
            "relative px-6 py-4 text-center border-b-2 border-secondary-300/30",
            currentVariant.header
          )}>
            {/* Header accent lines */}
            {variant === 'elegant' && (
              <>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-px bg-stone-200/40"></div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-px bg-stone-200/40"></div>
              </>
            )}
            
            {variant === 'rustic' && (
              <>
                <div className="absolute top-2 left-8 w-4 h-px bg-amber-200/50"></div>
                <div className="absolute top-2 right-8 w-4 h-px bg-amber-200/50"></div>
                <div className="absolute bottom-2 left-10 w-3 h-px bg-amber-200/50"></div>
                <div className="absolute bottom-2 right-10 w-3 h-px bg-amber-200/50"></div>
              </>
            )}            {variant === 'modern' && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-white/60"></div>
            )}

            {variant === 'dark' && (
              <>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-px bg-amber-200/30"></div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-px bg-amber-200/40"></div>
              </>
            )}

            <div className="relative z-10">
              {title && (
                <h2 className={cn(
                  "transition-all duration-300 mb-1",
                  currentVariant.title
                )}>
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className={cn(
                  "transition-all duration-300",
                  currentVariant.subtitle
                )}>
                  {subtitle}
                </p>
              )}
            </div>

            {/* Italian restaurant header decorations */}
            {variant === 'vintage' && (
              <>
                <div className="absolute top-2 left-2 w-3 h-3 border-l border-t border-amber-200/40"></div>
                <div className="absolute top-2 right-2 w-3 h-3 border-r border-t border-amber-200/40"></div>
                <div className="absolute bottom-2 left-2 w-3 h-3 border-l border-b border-amber-200/40"></div>
                <div className="absolute bottom-2 right-2 w-3 h-3 border-r border-b border-amber-200/40"></div>
              </>
            )}
          </div>
        )}

        {/* Content Section */}
        <div className="relative z-10 p-6">
          {children}
        </div>

        {/* Italian fine dining accent elements */}
        {variant === 'elegant' && (
          <>
            <div className="absolute top-1/3 right-6 opacity-20">
              <div className="w-1 h-1 bg-secondary-600 animate-pulse"></div>
            </div>
            <div className="absolute bottom-1/3 left-6 opacity-20">
              <div className="w-1 h-1 bg-secondary-500 animate-pulse"></div>
            </div>
          </>
        )}

        {variant === 'modern' && (
          <div className="absolute bottom-3 right-3 opacity-15">
            <div className="w-4 h-4 border border-secondary-600 rotate-45"></div>
          </div>
        )}

        {/* Sophisticated hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-secondary-500/0 via-transparent to-secondary-400/0 hover:from-secondary-500/5 hover:to-secondary-400/5 transition-all duration-500 pointer-events-none"></div>
        
        {/* Wine accent border on hover */}
        <div className="absolute inset-0 border-2 border-transparent hover:border-secondary-300/30 transition-all duration-500 pointer-events-none"></div>
      </div>
    );
  }
);

MenuCard.displayName = "MenuCard";

export { MenuCard };
