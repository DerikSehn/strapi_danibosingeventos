"use client";

import { Input } from "../../ui/input";
import { Search as SearchIcon, X, XCircle } from "lucide-react";
import { cn } from "../../../lib/utils";

interface OrderItemSearchInputProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  placeholder?: string;
  className?: string;
}

export function OrderItemSearchInput({
  searchTerm,
  onSearchTermChange,
  placeholder = "Pesquisar itens...",
  className,
}: Readonly<OrderItemSearchInputProps>) {
     
    const handleClear = () => {
        onSearchTermChange("");
    };

  return (
      <div className={cn("relative w-full", className)}>
        <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <Input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchTermChange(e.target.value)}
        placeholder={placeholder}
        className="pr-10 py-2 w-full border-none outline-none focus-visible:ring-0 focus-visible:border-none focus-visible:shadow-md"
      />
         {searchTerm && (
                <button
                    onClick={handleClear}
                    className="absolute right-10 top-1/2 -m-0.5 transform -translate-y-1/2 h-5 w-5 text-muted-foreground hover:text-foreground"
                >
                    <X />
                </button>
            )}
    </div>

  );
}
