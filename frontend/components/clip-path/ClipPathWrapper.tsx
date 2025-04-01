import { cn } from '@/lib/utils';
import React from 'react';

interface ClipPathWrapperProps {
  id: string;
  filterId: string;
  children: React.ReactNode;
  className?: string;
  borderRadius?: number;
}

export default function ClipPathWrapper({ id, filterId, children, borderRadius = 40, className  }: Readonly<ClipPathWrapperProps>) {
  return (
    <div
        className={cn( "absolute overflow-hidden", className)}
            id={id} style={{ filter: `url(#${filterId})` }}>
      {children}
      <svg className="absolute hidden" width="0" height="0" xmlns="http://www.w3.org/2000/svg" version="1.1">
        <defs>
          <filter id={filterId}>
            <feGaussianBlur in="SourceGraphic" stdDeviation={String(borderRadius)} result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>
    </div>
  );
};
