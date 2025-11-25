"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function ApproveSwitch({
  defaultChecked,
  name = "status",
  isLoading = false,
  approvedText,
  disapprovedText,
  onStatusChange,
  disabled = false,
}: Readonly<{
  defaultChecked?: boolean;
  name?: string;
  isLoading?: boolean;
  onStatusChange?: (status: string) => void;
  approvedText?: string;
  disapprovedText?: string;
  disabled?: boolean;
}>) {
  const [checked, setChecked] = useState(!!defaultChecked);

  const handleClick = () => {
    if (isLoading) return; // Prevent clicks while loading
    
    const newChecked = !checked;
    setChecked(newChecked);
    if (onStatusChange) {
      onStatusChange(newChecked ? 'confirmado' : 'pendente');
    }
  };

  return (
     <Button 
       className={cn("h-full text-lg font-food", disabled && "opacity-50 cursor-not-allowed") }
       variant={'default'} 
       onClick={handleClick}
       disabled={isLoading || disabled}
     >
       {isLoading ? (
         <>
           <Loader2 className="w-4 h-4 mr-2 animate-spin" />
           Enviando orçamento...
         </>
       ) : (
         checked ? disapprovedText || 'Desmarcar Orçamento' : approvedText || 'Confirmar Orçamento'
       )}
     </Button>
  );
}

