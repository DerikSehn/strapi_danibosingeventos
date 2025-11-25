"use client"

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'

interface DialogContextType {
  isDialogOpen: boolean
  openDialog: () => void
  closeDialog: () => void
}

const DialogContext = createContext<DialogContextType | undefined>(undefined)

export function DialogProvider({ children }: { children: ReactNode }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const openDialog = useCallback(() => {
    setIsDialogOpen(true)
    
    // Delay para garantir que o React renderizou o dialog
    requestAnimationFrame(() => {
      // Bloqueie o scroll principal
      document.documentElement.style.overflow = 'hidden'
      document.documentElement.style.height = '100%'
      document.body.style.overflow = 'hidden'
      document.body.style.height = '100%'
      
      // Desabilite Lenis
      if ((window as any).Lenis) {
        // Se Lenis estiver disponível globalmente, pause
        (window as any).Lenis.stop?.()
      }
    })
  }, [])

  const closeDialog = useCallback(() => {
    setIsDialogOpen(false)
    
    // Restaure o scroll principal
    document.documentElement.style.overflow = ''
    document.documentElement.style.height = ''
    document.body.style.overflow = ''
    document.body.style.height = ''
    
    // Re-ative Lenis
    if ((window as any).Lenis) {
      (window as any).Lenis.start?.()
    }
  }, [])

  return (
    <DialogContext.Provider value={{ isDialogOpen, openDialog, closeDialog }}>
      {children}
    </DialogContext.Provider>
  )
}

export function useDialogContext() {
  const context = useContext(DialogContext)
  if (context === undefined) {
    throw new Error('useDialogContext deve ser usado dentro de DialogProvider')
  }
  return context
}
