"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

export function ApproveSwitch({
  defaultChecked,
  name = "status",
  isLoading = false,
  onStatusChange
}: Readonly<{
  defaultChecked?: boolean;
  name?: string;
  isLoading?: boolean;
  onStatusChange?: (status: string) => void;
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
    <div className="flex items-center px-1 mt-5">
     <Button 
       className="h-[42px]" 
       variant={'outline'} 
       onClick={handleClick}
       disabled={isLoading}
     >
       {isLoading ? (
         <>
           <Loader2 className="w-4 h-4 mr-2 animate-spin" />
           Enviando orçamento...
         </>
       ) : (
         checked ? 'Desmarcar' : 'Confirmar'
       )}
     </Button>
    </div>
  );
}

