import { useState, useCallback } from 'react';

export interface SelectableItem {
  id?: string | number;
  documentId?: string;
  title: string;
  image?: {
    url?: string;
  };
  [key: string]: any;
}

export interface UseItemSelectionProps {
  onSelectionChange?: (item: SelectableItem, isSelected: boolean) => void;
}

export function useItemSelection(props?: UseItemSelectionProps) {
  const [selectedItems, setSelectedItems] = useState<Set<string | number>>(new Set());

  const toggle = useCallback((item: SelectableItem) => {
    const itemId = item.id || item.documentId;
    if (!itemId) return;

    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      const isSelected = newSet.has(itemId);

      if (isSelected) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }

      props?.onSelectionChange?.(item, !isSelected);
      return newSet;
    });
  }, [props]);

  const isSelected = useCallback((item: SelectableItem) => {
    const itemId = item.id || item.documentId;
    return itemId ? selectedItems.has(itemId) : false;
  }, [selectedItems]);

  const select = useCallback((item: SelectableItem) => {
    const itemId = item.id || item.documentId;
    if (!itemId) return;

    setSelectedItems((prev) => {
      if (!prev.has(itemId)) {
        const newSet = new Set(prev);
        newSet.add(itemId);
        props?.onSelectionChange?.(item, true);
        return newSet;
      }
      return prev;
    });
  }, [props]);

  const deselect = useCallback((item: SelectableItem) => {
    const itemId = item.id || item.documentId;
    if (!itemId) return;

    setSelectedItems((prev) => {
      if (prev.has(itemId)) {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        props?.onSelectionChange?.(item, false);
        return newSet;
      }
      return prev;
    });
  }, [props]);

  return {
    selectedItems,
    toggle,
    isSelected,
    select,
    deselect,
  };
}
