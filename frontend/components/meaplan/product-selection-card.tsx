"use client"
import SelectableItemCard, { SelectableItemCardProps } from "../common/selectable-item-card";

interface ProductSelectionCardProps {
  item: any;
  isSelected: boolean;
  onSelect: () => void;
  onDeselect: () => void;
  disabled?: boolean
}

export default function ProductSelectionCard({
  item,
  isSelected,
  onSelect,
  onDeselect,
  disabled
}: ProductSelectionCardProps) {
  // Função que se integra com SelectableItemCard
  // Recebe o item mas descarta (usa callbacks já capturados)
  const handleToggle = () => {
    if (isSelected) {
      onDeselect();
    } else {
      onSelect();
    }
  };

  return (
    <SelectableItemCard
      item={item}
      isSelected={isSelected}
      onToggle={handleToggle}
      layout="large"
      showPrice={true}
    />
  );
}
