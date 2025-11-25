import { ProductVariant, PureProductVariant } from '@/types';
import { useState, useCallback } from 'react';
import { ApiProductVariantProductVariant } from 'types/generated/contentTypes';



interface UseProductSelectionOptions {
  onSelectionChange?: (items: ProductVariant[]) => void;
  initialSelectedItems: ProductVariant[]
}

export function useProductSelection(options: UseProductSelectionOptions ) {
  const [selectedItems, setSelectedItems] = useState<ProductVariant[]>(options.initialSelectedItems);

  const addItem = useCallback((item: ProductVariant) => {
    setSelectedItems((prev) => {
      // Comparar usando documentId ou id (normalizado)
      const itemId = String(item.documentId || item.id);
      if (!prev.some((i) => String(i.documentId || i.id) === itemId)) {
        const itemWithQuantity = {
          ...item,
          quantity: 10,
        };
        const updated = [...prev, itemWithQuantity];
        options?.onSelectionChange?.(updated);
        return updated;
      }
      return prev;
    });
  }, [options]);

  const addItems = useCallback((items: ProductVariant[]) => {
    setSelectedItems((prev) => {
      const newItems = items.filter(item => {
        const itemId = String(item.documentId || item.id);
        return !prev.some((i) => String(i.documentId || i.id) === itemId);
      }).map(item => ({
        ...item,
        quantity: 10,
      }));
      
      if (newItems.length === 0) return prev;

      const updated = [...prev, ...newItems];
      options?.onSelectionChange?.(updated);
      return updated;
    });
  }, [options]);

  const removeItem = useCallback((itemId: string | number) => {
    setSelectedItems((prev) => {
      const updated = prev.filter((i) => {
        // Normalizar IDs para string para comparação
        const currentId = String(i.id);
        const targetId = String(itemId);
        return currentId !== targetId;
      });
      options?.onSelectionChange?.(updated);
      return updated;
    });
  }, [options]);

  const removeAllItems = useCallback(() => {
    setSelectedItems([]);
    options?.onSelectionChange?.([]);
  }, [options]);

  const getSelectedItemIds = useCallback(() => {
    return selectedItems.map((item) => {
      // Priorizar documentId, depois id
      return String(item.documentId || item.id);
    });
  }, [selectedItems]);

  return {
    selectedItems,
    addItem,
    addItems,
    removeItem,
    removeAllItems,
    getSelectedItemIds,
    count: selectedItems.length,
  };
}
