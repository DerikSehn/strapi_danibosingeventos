"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogActions } from "../ui/dialog";
import ProductSelectionList from "./product-selection-list";
import { useState } from "react";
import { ProductVariant } from "@/types";

interface ProductSelectionModalProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly title?: string;
  readonly description?: string;
  readonly onConfirm?: (selectedItems: ProductVariant[]) => void;
  readonly onCancel?: () => void;
  readonly confirmButtonText?: string;
  readonly cancelButtonText?: string;
  readonly orderId?: string;
}

export default function ProductSelectionModal({
  open,
  onOpenChange,
  title = "Adicionar Itens",
  description = "Selecione itens das categorias abaixo",
  onConfirm,
  onCancel,
  confirmButtonText = "Confirmar",
  cancelButtonText = "Cancelar",
  orderId,
}: ProductSelectionModalProps) {

  const [selected, setSelected] = useState<any[]>([])

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      onCancel?.();
      setSelected([]);
      onOpenChange(false);
    }
  };

  const handleConfirm = () => {
    onConfirm?.(selected);
    setSelected([]);
  };
    
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0 flex flex-col">
        <div className="flex-1 overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl">{title}</DialogTitle>
            {description && (
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            )}
          </DialogHeader>
          <ProductSelectionList
            onItemsChange={setSelected}
            orderId={orderId}
          />
        </div>

        <DialogActions>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
          >
            {cancelButtonText}
          </Button>
          {selected.length > 0 && (
            <Button
              type="button"
              variant="default"
              onClick={handleConfirm}
            >
              {confirmButtonText} ({selected.length})
            </Button>
          )}
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
