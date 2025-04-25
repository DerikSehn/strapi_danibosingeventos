import React from 'react';

interface ActionFooterSummaryProps {
  itemCount: number;
  // Add other props like totalPrice if available and needed
}

export default function ActionFooterSummary({ itemCount }: Readonly<ActionFooterSummaryProps>) {
  
  return (
    <div className="hidden md:block font-food  text-primary-400 md:mx-4 p-2 md:p-5">
        {itemCount > 0 ? (
            <p>{itemCount} {itemCount === 1 ? 'item selecionado' : 'itens selecionados'}</p>
        ) : (
            <p className="text-muted-foreground">Escolha doces e salgados</p>
        ) 
        }
      </div>
  );
}
