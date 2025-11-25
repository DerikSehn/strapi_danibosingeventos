"use client"
import { useMealItemsStore } from "@/lib/store/meal-items-store";
import { ApiProductVariantProductVariant } from "types/generated/contentTypes";
import SelectableItemCard from "../common/selectable-item-card";

interface ProductVariantProps {
  item: ApiProductVariantProductVariant['attributes'];
}

const ProductVariant: React.FC<ProductVariantProps> = ({ item }) => {
  const { addItem, removeItem, hasItem } = useMealItemsStore();
  
  const isSelected = hasItem(item);
  
  const handleToggle = () => {
    if (isSelected) {
      removeItem(item);
    } else {
      addItem(item);
    }
  };

  return (
    <SelectableItemCard
      item={item}
      isSelected={isSelected}
      onToggle={handleToggle}
      layout="large"
      showPrice={false}
    />
  );
};

export default ProductVariant;