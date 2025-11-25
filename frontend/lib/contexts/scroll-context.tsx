'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLenis } from 'lenis/react';

interface ScrollContextType {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  scrollAreaRef: React.RefObject<HTMLDivElement>;
}

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

export function ScrollProvider({ children }: { children: React.ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const lenis = useLenis();
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!lenis) return;

    if (isModalOpen) {
      // Desabilitar Lenis global quando modal abrir
      lenis.stop();
    } else {
      // Reabilitar Lenis quando modal fechar
      lenis.start();
    }

    return () => {
      if (lenis) {
        lenis.start();
      }
    };
  }, [isModalOpen, lenis]);

  return (
    <ScrollContext.Provider value={{ isModalOpen, setIsModalOpen, scrollAreaRef }}>
      {children}
    </ScrollContext.Provider>
  );
}

export function useScrollContext() {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error('useScrollContext deve ser usado dentro de ScrollProvider');
  }
  return context;
}
