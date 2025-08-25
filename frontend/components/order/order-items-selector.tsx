// frontend/components/order/order-items-selector.tsx
"use client";

// Use Pure types
import type { PureCategory, PureProduct, PureProductVariant, OrderItemsSelectorProps, SelectedOrderItem } from "../../types"; 
import { StrapiImage } from "../strapi-image"; 
import { Button } from "../ui/button"; 
import { Input } from "../ui/input"; 
import { Card, CardContent } from "../ui/card"; 
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion"; 
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { OrderItemSearchInput } from "./search/order-item-search-input";
import { useState, useMemo } from "react";

interface ProductVariantItemProps {
  variant: PureProductVariant;
  onQuantityChange: (variantId: number, quantity: number, variantAttributes: PureProductVariant) => void;
  currentQuantity: number;
}

function ProductVariantItem({ variant, onQuantityChange, currentQuantity }: Readonly<ProductVariantItemProps>) {
  const variantId = Number(variant.id);
  const step = 10; // Define the step for quantity change

  const handleIncrement = () => {
    onQuantityChange(variantId, currentQuantity + step, variant);
  };

  const handleDecrement = () => {
    if (currentQuantity >= step) {
      onQuantityChange(variantId, currentQuantity - step, variant);
    } else if (currentQuantity > 0 && currentQuantity < step) {
      onQuantityChange(variantId, 0, variant);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newQuantity = parseInt(e.target.value, 10);
    if (!isNaN(newQuantity)) {
      if (newQuantity < 0) newQuantity = 0;
      // Ensure the quantity is a multiple of the step if direct input is allowed
      // Or, if only buttons are meant to change quantity by step, this rounding might be desired
      // For now, allowing any number and buttons will adjust by step.
      onQuantityChange(variantId, newQuantity, variant);
    } else if (e.target.value === "") {
      onQuantityChange(variantId, 0, variant);
    }
  };

  const variantImage = variant.image?.url;
  const title = variant.title ?? "Product variant image";

  return (
    <Card className="w-full  overflow-hidden shadow-none transition-all border-none  border-b"> {/* Reduced mb margin */}
      <CardContent className="p-0">
        <div className="flex flex-row items-center space-x-3"> {/* Horizontal layout */}
          {/* Details Section */} 
          <div className="flex-grow min-w-0">
            <h4 className="text-md sm:text-md  text-neutral-700 truncate">{variant.title}</h4> {/* Adjusted text size */}
            <p className="text-sm font-thin text-neutral-600  ml-0.5">
              R$ {variant.price?.toFixed(2)}
            </p>
          </div>
          {/* Image Section */} 
          {variantImage && (
            <div className="relative w-14 h-12 sm:w-20 sm:h-20 flex-shrink-0"> {/* Smaller image */}
              <StrapiImage
                src={variantImage}
                alt={title}
                fill
                className="object-cover rounded-none" />
            </div>
          )}
          {/* Quantity Control Section */} 
          <div className="flex items-center "> {/* Kept vertical for controls for now, can be changed to horizontal row too if needed */}
           <Button variant="ghost" size="icon" onClick={handleDecrement} disabled={currentQuantity === 0} className="h-8 w-8 sm:h-8 sm:w-8" aria-label="Diminuir quantidade"> {/* Smaller buttons */}
              <Minus className={cn("h-6 w-6 sm:h-4 sm:w-4 scale-125 transition-opacity ", currentQuantity ? "opacity-100" : "opacity-0" )} />
            </Button>
            <Input 
              type="number" 
              step={step} 
              min="0" 
              value={currentQuantity} 
              onChange={handleInputChange} 
              className="w-10 h-7 sm:w-12 sm:h-8 text-center px-1 text-sm" /* Smaller input */
              aria-label="Quantidade" />
             <Button variant="ghost" size="icon" onClick={handleIncrement} className="h-8 w-8 sm:h-8 sm:w-8" aria-label="Aumentar quantidade"> {/* Smaller buttons */}
              <Plus className="h-6 w-6 sm:h-4 sm:w-4 scale-125" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ProductItemProps {
  product: PureProduct; 
  onQuantityChange: (variantId: number, quantity: number, variantAttributes: PureProductVariant) => void; 
  selectedItems: SelectedOrderItem[];
}

function ProductItem({ product, onQuantityChange, selectedItems }: Readonly<ProductItemProps>) {
  const productVariants = product.product_variants;

  if (!Array.isArray(productVariants) || productVariants.length === 0) {
    return (
      <div className="mb-6">
        <h3 className="text-xl mb-3 p-2 -m-2 bg-slate-100 rounded-md">{product.title}</h3>
        <p className="text-sm text-muted-foreground p-2">Este produto não possui variações disponíveis no momento.</p>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h3 className="text-xl mb-3 p-2 -m-2 bg-slate-100 rounded-md">{product.title}</h3>
      {/* Changed grid to flex for horizontal layout of variants if desired, or keep grid for multi-column */}
      {/* For a truly horizontal list of variants, you might use flex here and adjust ProductVariantItem further */}
      <div className="grid grid-cols-1 gap-3"> {/* Simplified to single column for variants to stack cleanly with new horizontal item layout*/}
        {productVariants.map((variant: PureProductVariant) => { 
          const variantId = Number(variant.id);
          const selected = selectedItems.find(item => item.id === variantId);
          return (
            <ProductVariantItem
              key={variantId}
              variant={variant} 
              onQuantityChange={onQuantityChange}
              currentQuantity={selected?.quantity ?? 0} />
          );
        })}
      </div>
    </div>
  );
}

export default function OrderItemsSelector({
  categories, 
  selectedItems,
  setSelectedItems,
}: Readonly<OrderItemsSelectorProps>) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleQuantityChange = (
    variantId: number,
    quantity: number,
    variantAttributes: PureProductVariant 
  ) => {
    setSelectedItems((prevItems: SelectedOrderItem[]) => {
      const existingItemIndex = prevItems.findIndex(item => item.id === variantId);
      if (quantity <= 0) {
        return existingItemIndex !== -1 ? prevItems.filter(item => item.id !== variantId) : prevItems;
      }
      const newItem: SelectedOrderItem = {
        id: variantId,
        docId: (variantAttributes as any)?.documentId, // carry documentId if present
        name: variantAttributes.title ?? "Item sem nome",
        price: variantAttributes.price ?? 0,
        quantity: quantity,
        image: variantAttributes.image?.url, 
      };
      if (existingItemIndex !== -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = newItem;
        return updatedItems;
      }
      return [...prevItems, newItem];
    });
  };

  const filteredCategories = useMemo(() => {
    if (!searchTerm) {
      // If no search term, return all categories that have products.
      return categories.filter(
        category => category.products && category.products.length > 0
      );
    }

    // Apply search term
    const categoriesWithMatchingItems = categories.map(category => {
      const filteredProducts = category.products?.filter(product => {
        const productNameMatches = product.title
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
        const variantMatches = product.product_variants?.some(variant =>
          variant.title?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return productNameMatches || variantMatches;
      });

      if (filteredProducts && filteredProducts.length > 0) {
        return { ...category, products: filteredProducts };
      }
      return null;
    });
    
    return categoriesWithMatchingItems.filter(Boolean) as PureCategory[];
  }, [categories, searchTerm]);

  const defaultAccordionValues = useMemo(() => 
    filteredCategories
      .filter(category => category?.id && category.products && category.products.length > 0)
      .map(cat => `category-${String(cat.id)}`)
  , [filteredCategories]);

  return (
    <div className="space-y-6 ">
      <OrderItemSearchInput
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        className="mb-0"
      />
      {filteredCategories.length === 0 ? (
        (() => {
          if (searchTerm) {
            return <p className="mx-2">Nenhum item encontrado para "{searchTerm}".</p>;
          }
          return <p>Nenhum produto disponível.</p>;
        })()
      ) : (
        <Accordion type="multiple" defaultValue={defaultAccordionValues} className="w-full">
          {filteredCategories.map((categoryItem: PureCategory) => { 
            const categoryIdStr = String(categoryItem.id);
            const products = categoryItem.products; // products will be PureProduct[] here due to filtering
            const currentCategoryKey = `category-${categoryIdStr}`; 

            // This check is technically not needed if filteredCategories ensures products exist and are non-empty
            // However, keeping it for safety or if PureCategory type allows empty products array after filtering.
            if (!Array.isArray(products) || products.length === 0) {
              return (
                <AccordionItem value={currentCategoryKey} key={currentCategoryKey} disabled>
                  <AccordionTrigger className="text-2xl  py-3 px-4 bg-gray-200 text-gray-500 rounded-t-none cursor-not-allowed">
                    {categoryItem.title ?? "Categoria sem título"} (Sem produtos)
                  </AccordionTrigger>
                </AccordionItem>
              );
            }
            
            return (
              <AccordionItem value={currentCategoryKey} key={currentCategoryKey}>
                <AccordionTrigger className="text-2xl  py-3 px-4 bg-primary text-white rounded-t-none hover:bg-primary/90">
                  {categoryItem.title ?? "Categoria sem título"}
                </AccordionTrigger>
                <AccordionContent className="p-2 rounded-b-md">
                  {products.map((product: PureProduct) => { 
                    return (
                      <ProductItem
                        key={String(product.id)} 
                        product={product} 
                        onQuantityChange={handleQuantityChange}
                        selectedItems={selectedItems} />
                    );
                  })}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}
    </div>
  );
}
