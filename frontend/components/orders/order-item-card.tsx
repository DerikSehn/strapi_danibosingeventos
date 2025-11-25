"use client"
import SelectableItemCard from "../common/selectable-item-card";

interface OrderItemCardProps {
  item: any;
  isSelected: boolean;
  onToggle: () => void;
}

/**
 * Componente para renderizar item de pedido com seleção
 * Usa layout compact para lista/tabela
 */
export default function OrderItemCard({
  item,
  isSelected,
  onToggle,
}: OrderItemCardProps) {
  const price = item.price ?? item.unit_price ?? 0;

  return (
    <SelectableItemCard
      item={item}
      isSelected={isSelected}
      onToggle={onToggle}
      layout="compact"
      showPrice={true}
      price={Number(price)}
    />
  );
}
