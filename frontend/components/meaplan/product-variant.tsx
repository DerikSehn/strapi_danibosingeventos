"use client"
import { useMealItemsStore } from "@/lib/store/meal-items-store";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { ApiProductVariantProductVariant } from "types/generated/contentTypes";
import { StrapiImage } from "../strapi-image";

interface ProductVariantProps {
  item: ApiProductVariantProductVariant['attributes'];
}

const ProductVariant: React.FC<ProductVariantProps> = ({ item }) => {
  const { addItem, removeItem, hasItem } = useMealItemsStore();
  
  const isChecked = hasItem(item);
  
  const handleToggle = (checked: boolean) => {
    if (checked) {
      addItem(item);
    } else {
      removeItem(item);
    }
  };

  const backgroundColor = isChecked ? "bg-primary-400/90" : "";

  return (
    <button
      type="button"
      onClick={() => handleToggle(!isChecked)}
      className={cn(
        "group transition-colors relative flex flex-col items-center space-y-4 pb-4 border font-food",
        backgroundColor
      )}
    >
      <div className="relative w-full flex justify-center">
        <figure className="relative w-full h-1/2 min-h-40">
          <StrapiImage
            fill
            alt={item.title}
            src={item.image.url}
            className={cn("w-32 h-32 md:w-40 md:h-40 object-cover group-hover:opacity-75 transition-opacity", isChecked ? "brightness-75" : "opacity-100")}
          />
          {isChecked ? (
            <Check className="absolute text-primary-500 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24" />
          ) : (
            <div className="absolute inset-0 md:inset-4 rounded-none bg-primary/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white font-bold text-2xl md:text-4xl">Clique para selecionar</span>
          </div>
          )}
        </figure>
      </div>
      <div className="text-center w-full p-1">
        <h3 className={cn("text-xl md:text-2xl transition-colors", isChecked && "text-white")}>{item.title}</h3>
      </div>
    </button>
  );
};

export default ProductVariant;