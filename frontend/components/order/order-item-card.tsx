// frontend/components/order/order-item-card.tsx
"use client";

import { StrapiImage } from "../strapi-image";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { Minus, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PureProductVariant } from "@/types";

interface OrderItemCardProps {
  id: string | number;
  title: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  onQuantityChange?: (quantity: number) => void;
  onRemove?: () => void;
  isEditable?: boolean;
  showRemoveButton?: boolean;
}

export function OrderItemCard({
  id,
  title,
  price,
  quantity,
  imageUrl,
  onQuantityChange,
  onRemove,
  isEditable = false,
  showRemoveButton = false,
}: OrderItemCardProps) {
  const step = 10;

  const handleIncrement = () => {
    onQuantityChange?.(quantity + step);
  };

  const handleDecrement = () => {
    if (quantity >= step) {
      onQuantityChange?.(quantity - step);
    } else if (quantity > 0 && quantity < step) {
      onQuantityChange?.(0);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newQuantity = parseInt(e.target.value, 10);
    if (!isNaN(newQuantity)) {
      if (newQuantity < 0) newQuantity = 0;
      onQuantityChange?.(newQuantity);
    } else if (e.target.value === "") {
      onQuantityChange?.(0);
    }
  };

  const total = price * quantity;

  return (
    <Card className="w-full overflow-hidden shadow-none transition-all border-none border-b">
      <CardContent className="p-0">
        <div className="flex flex-row items-center space-x-3">
          {/* Details Section */}
          <div className="flex-grow min-w-0">
            <h4 className="text-md sm:text-md text-neutral-700 truncate">{title}</h4>
            <p className="text-sm font-thin text-neutral-600 ml-0.5">
              R$ {price?.toFixed(2)}
            </p>
            {!isEditable && (
              <p className="text-xs font-semibold text-neutral-800">
                Subtotal: R$ {total.toFixed(2)}
              </p>
            )}
          </div>

          {/* Image Section */}
          {imageUrl && (
            <div className="relative w-14 h-12 sm:w-20 sm:h-20 flex-shrink-0">
              <StrapiImage
                src={imageUrl}
                alt={title}
                fill
                className="object-cover rounded-none"
              />
            </div>
          )}

          {/* Quantity Control Section (always visible and interactive) */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDecrement}
              disabled={quantity === 0}
              className="h-8 w-8 sm:h-8 sm:w-8"
              aria-label="Diminuir quantidade"
            >
              <Minus
                className={cn(
                  "h-6 w-6 sm:h-4 sm:w-4 scale-125 transition-opacity",
                  quantity ? "opacity-100" : "opacity-0"
                )}
              />
            </Button>
            <Input
              type="number"
              step={step}
              min="0"
              value={quantity}
              onChange={handleInputChange}
              className="w-10 h-7 sm:w-12 sm:h-8 text-center px-1 text-sm"
              aria-label="Quantidade"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleIncrement}
              className="h-8 w-8 sm:h-8 sm:w-8"
              aria-label="Aumentar quantidade"
            >
              <Plus className="h-6 w-6 sm:h-4 sm:w-4 scale-125" />
            </Button>
          </div>

          {/* Remove Button (only if editable) */}
          {isEditable && showRemoveButton && (
            <button
              type="button"
              onClick={onRemove}
              className="p-1 hover:bg-red-50 rounded transition-colors flex-shrink-0"
              title="Remover item"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
