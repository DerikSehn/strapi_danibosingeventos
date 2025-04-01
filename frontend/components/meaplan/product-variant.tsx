"use client"
import { ApiProductVariantProductVariant } from "types/generated/contentTypes";
import CheckboxAnimated from "../checkbox-animated";
import { useMealItemsStore } from "@/lib/store/meal-items-store";
import { StrapiImage } from "../strapi-image";
import { cn } from "@/lib/utils";

interface ProductVariantProps {
  item: ApiProductVariantProductVariant['attributes'];
}

const ProductVariant: React.FC<ProductVariantProps> = ({ item }) => {
  const { addItem, removeItem, hasItem } = useMealItemsStore();
  
  // Get checked state directly from the store instead of local state
  const isChecked = hasItem(item);
  
  const handleToggle = (checked: boolean) => {
    if (checked) {
      addItem(item);
    } else {
      removeItem(item);
    }
  };

  return (
    <div className={cn("group relative flex items-start space-x-4 p-2 -mx-2 pr-4",
        isChecked ? "bg-green-600/10" : " hover:bg-gray-100/50")}>
        <div className="relative ">
            <StrapiImage width={100} height={100} alt={item.title} src={item.image.url} className="max-w-[64px] max-h-[64px] md:max-h-[100px] md:max-w-[100px] z-0 object-cover rounded-sm aspect-square group-hover:opacity-25 transition-opacity" />
            <CheckboxAnimated
                id={`item-${item.id}`}
                checked={isChecked}
                className="opacity-0 absolute scale-[3] group-hover:opacity-75 transition-opacity top-1/2 -translate-y-1/2 left-10"
                onCheckedChange={handleToggle}
            />
        </div>
        <div className="flex-grow">
            <div className="flex items-center justify-between text-2xl">
                <h3 className=" font-medium">{item.title}</h3>
            </div>
            <div className="text-sm text-muted-foreground flex items-center justify-between">
                <p>
                    {item.description}
                </p>
            </div>
        </div>
    </div>
  );
};

export default ProductVariant;