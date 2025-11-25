'use client';

import { ReactLenis } from 'lenis/react';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface LenisProviderProps {
  children: ReactNode;
}

export function LenisProvider({ children }: LenisProviderProps) {
  const pathname = usePathname();
  
  // Desabilitar Lenis no dashboard e suas subrotas
  const isDashboard = pathname?.startsWith('/dashboard');
  
  if (isDashboard) {
    return <>{children}</>;
  }

  return (
    <ReactLenis root options={{ touchMultiplier: 0, syncTouch: false }}>
      {children}
    </ReactLenis>
  );
}
