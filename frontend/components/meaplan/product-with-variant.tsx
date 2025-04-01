"use client"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ApiProductProduct, ApiProductVariantProductVariant } from "types/generated/contentTypes";
import ProductVariant from "./product-variant";

interface ProductListWithVariantsProps {
    products: ApiProductProduct['attributes'][];
}

const ProductListWithVariants: React.FC<ProductListWithVariantsProps> = ({ products }) => {
    
    return (
        <Accordion  type="multiple" defaultValue={products.map((_, index) => `product-${index}`)} className="space-y-4">
            {products.map((product, index) => (
                <AccordionItem key={product.id} value={`product-${index}`}>
                    <AccordionTrigger className="text-xl font-semibold">{product.title}</AccordionTrigger>
                    <AccordionContent>
                        <p className="text-sm text-muted-foreground">{product.description}</p>
                        <div className="mt-4 space-y-2">
                            {product.product_variants?.map((variant: ApiProductVariantProductVariant['attributes'], index: number) => (
                                <ProductVariant key={variant.id} item={variant} />
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
};

export default ProductListWithVariants;