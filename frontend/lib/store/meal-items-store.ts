import { ApiProductVariantProductVariant } from 'types/generated/contentTypes';
import { create } from 'zustand';

type MealItemsStore = {
  selectedItems: ApiProductVariantProductVariant['attributes'][];
  addItem: (item: ApiProductVariantProductVariant['attributes']) => void;
  removeItem: (item: ApiProductVariantProductVariant['attributes']) => void;
  hasItem: (item: ApiProductVariantProductVariant['attributes']) => boolean;
  getSelectedItemIds: () => string[];
  reset: () => void; // Add reset method
};

export const useMealItemsStore = create<MealItemsStore>((set, get) => ({
  selectedItems: [],
  
  addItem: (item) => set((state) => {
    if (!get().hasItem(item)) {
      return {
        selectedItems: [
          ...state.selectedItems,
          item
        ]
      };
    }
    return state;
  }),
  
  removeItem: (item) => set((state) => ({
    selectedItems: state.selectedItems.filter((i) => i.id !== item.id)
  })),
  
  hasItem: (item) => get().selectedItems.some((i) => i.id === item.id),
  
  getSelectedItemIds: () => get().selectedItems.map(item => item.documentId),
  
  reset: () => set({ selectedItems: [] }), // Implementation of reset
}));
