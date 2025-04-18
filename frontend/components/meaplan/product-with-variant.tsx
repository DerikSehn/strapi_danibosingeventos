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

    return (
        <Accordion type="multiple" defaultValue={[`product-0`]} className="border-none shadow-none">
            {products.map((product, index) => {
                // Filter selected items from the current product
                const selectedItemsFromCategory = product.product_variants
                    ?.filter((variant: ApiProductVariantProductVariant['attributes']) =>
                        selectedItems.some((item) => item.id === variant.id)
                    );
                const hasSelectedItems = selectedItemsFromCategory.length > 0;

                return (
                    <AccordionItem
                        className="relative mt-0 -mx-6 border-l-2"
                        key={product.id}
                        value={`product-${index}`}
                     >
                        <Check className={cn("absolute text-white top-5 left-2 w-8 h-8 transition-opacity opacity-0", hasSelectedItems && "opacity-100")} />
                        <AccordionTrigger
                            className="bg-primary px-4 pl-12 flex justify-between items-center hover:bg-primary/80 transition-colors"
                         >
                            <div className=" text-white font-food text-3xl flex flex-col text-left items-start ">
                                {product.title}
                                <motion.span
                                    className="text-xs text-muted-foreground"
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
                        <AccordionContent className="px-2 border-none shadow-none my-2 py-2">
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
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