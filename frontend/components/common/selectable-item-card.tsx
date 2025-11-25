"use client"
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { StrapiImage } from "../strapi-image";

export interface SelectableItemCardProps {
  item: any;
  isSelected: boolean;
  onToggle(): void;
  layout?: 'compact' | 'large';
  showPrice?: boolean;
  price?: number;
}

/**
 * Componente genérico reutilizável para seleção de itens (produtos, variantes, etc)
 * Pode ser usado em diferentes contextos mantendo o layout consistente
 */
export default function SelectableItemCard({
  item,
  isSelected,
  onToggle,
  layout = 'large',
  showPrice = true,
  price,
}: SelectableItemCardProps) {
  const title = item.title || 'Item sem nome';
  const itemPrice = price ?? Number(item.price || 0);
  const imageUrl = item.image?.url || item.image?.data?.attributes?.url || '';

  // Compact: usado em tabelas/listas (altura menor)
  if (layout === 'compact') {
    return (
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "w-full relative group flex flex-row items-center gap-3 p-2 rounded border-2 transition-all duration-200",
           (isSelected
              ? "border-green-500 bg-green-50"
              : "border-gray-200 bg-white hover:border-primary hover:shadow-md")
        )}
      >
        {/* Image */}
        {imageUrl && (
          <div className="relative w-12 h-12 flex-shrink-0 rounded bg-gray-100 overflow-hidden">
            <StrapiImage
              src={imageUrl}
              alt={title}
              fill
              className={cn("object-cover", isSelected && "opacity-60")}
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-grow min-w-0 text-left">
          <h4 className={cn(
            "text-sm font-semibold truncate transition-colors",
            isSelected ? "text-green-700" : "text-gray-900"
          )}>
            {title}
          </h4>
          {showPrice && (
            <p className={cn(
              "text-xs transition-colors",
              isSelected ? "text-green-600" : "text-primary"
            )}>
              R$ {itemPrice.toFixed(2)}
            </p>
          )}
        </div>

        {/* Checkmark */}
        {isSelected && (
          <Check className="w-5 h-5 text-green-500 flex-shrink-0" strokeWidth={3} />
        )}
      </button>
    );
  }

  // Large: usado em meal planner (layout grande com espaço)
  if (layout === 'large') {
    return (
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "group transition-colors relative flex flex-col items-center space-y-4 pb-4 border font-food",
          isSelected ? "bg-primary-400/90" : ""
        )}
      >
        <div className="relative w-full flex justify-center">
          <figure className="relative w-full h-1/2 min-h-40">
            {imageUrl ? (
              <StrapiImage
                fill
                alt={title}
                src={imageUrl}
                className={cn(
                  "w-32 h-32 md:w-40 md:h-40 object-cover group-hover:opacity-75 transition-opacity",
                  isSelected ? "brightness-75" : "opacity-100"
                )}
              />
            ) : (
              <div className="w-32 h-32 md:w-40 md:h-40 bg-gray-200 flex items-center justify-center text-gray-400">
                Sem imagem
              </div>
            )}

            {isSelected ? (
              <Check className="absolute text-primary-500 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24" />
            ) : (
              <div className="absolute inset-0 md:inset-4 rounded-none bg-primary/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white font-bold text-2xl md:text-4xl">
                  Clique para selecionar
                </span>
              </div>
            )}
          </figure>
        </div>
        <div className="text-center w-full p-1">
          <h3 className={cn(
            "text-xl md:text-2xl transition-colors",
            isSelected && "text-white"
          )}>
            {title}
          </h3>
        </div>
      </button>
    );
  }

  return null;
}
