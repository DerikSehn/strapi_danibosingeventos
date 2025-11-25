// frontend/components/order/order-items-selector.tsx
"use client";

// Use Pure types
import type { PureCategory, PureProduct, PureProductVariant, OrderItemsSelectorProps, SelectedOrderItem } from "../../types"; 
import { Button } from "../ui/button"; 
import { Card, CardContent } from "../ui/card"; 
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion"; 
import { cn } from "@/lib/utils";
import { OrderItemSearchInput } from "./search/order-item-search-input";
import { OrderItemCard } from "./order-item-card";
import { useState, useMemo } from "react";

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
      <div className="grid grid-cols-1 gap-3">
        {productVariants.map((variant: PureProductVariant) => { 
          const variantId = Number(variant.id);
          const selected = selectedItems.find(item => item.id === variantId);
          return (
            <OrderItemCard
              key={variantId}
              id={variantId}
              title={variant.title ?? "Variante"}
              price={variant.price ?? 0}
              quantity={selected?.quantity ?? 0}
              imageUrl={variant.image?.url}
              isEditable
              onQuantityChange={(quantity) => onQuantityChange(variantId, quantity, variant)}
            />
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
