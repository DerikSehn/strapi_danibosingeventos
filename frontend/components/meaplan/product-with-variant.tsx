"use client"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useMealItemsStore } from "@/lib/store/meal-items-store";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { ApiProductProduct, ApiProductVariantProductVariant } from "types/generated/contentTypes";
import ProductVariant from "./product-variant";

interface ProductListWithVariantsProps {
    products: ApiProductProduct['attributes'][];
}

const ProductListWithVariants: React.FC<ProductListWithVariantsProps> = ({ products }) => {
    // Get selected items from the meal items store
    const { selectedItems } = useMealItemsStore();
    const selectedItemIds = selectedItems.map(item => item.id);

    return (
        <Accordion type="multiple" defaultValue={products.map((_, id) => `product-${id}`)} className="border-none shadow-none">
            {products.map((product, index) => {
                // Filter selected items from the current product
                const selectedItemsFromCategory = product.product_variants
                    ?.filter((variant: ApiProductVariantProductVariant['attributes']) =>
                        selectedItemIds.includes(variant.id)
                    ) ?? [];
                const hasSelectedItems = selectedItemsFromCategory.length > 0;

                // Define class constants
                const checkIconClass = cn(
                    "absolute text-white top-5 left-2 w-8 h-8 transition-opacity opacity-0",
                    hasSelectedItems && "opacity-100"
                );
                const triggerClass = cn(
                    hasSelectedItems ? "bg-green-400 hover:bg-green-600" : "bg-primary hover:bg-primary/80 ",
                    "group px-4 pl-12 flex justify-between items-center  transition-colors"
                );
                const titleClass = cn(
                    hasSelectedItems ? "text-black group-hover:text-white" : "text-white",
                    "font-food text-3xl flex flex-col text-left items-start"
                );

                return (
                    <AccordionItem
                        className="relative mt-0 -mx-6 border-l-2"
                        key={product.id}
                        value={`product-${index}`}
                    >
                        <Check className={checkIconClass} />
                        <AccordionTrigger className={triggerClass}>
                            <div className={titleClass}>
                                {product.title}
                                <motion.span
                                    className={"text-xs text-muted-foreground"}
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={hasSelectedItems ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {selectedItemsFromCategory.length} Produto
                                    {selectedItemsFromCategory.length > 1 ? 's' : ''} vinculado
                                    {selectedItemsFromCategory.length > 1 ? 's' : ''}
                                </motion.span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-1 md:p-2 border-none shadow-none my-2">
                            <div className="grid  grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 md:gap-4">
                                {product.product_variants?.map((variant: ApiProductVariantProductVariant['attributes'], index: number) => (
                                    <ProductVariant key={variant.id} item={variant} />
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                );
            })}
        </Accordion>
    );
};

export default ProductListWithVariants;