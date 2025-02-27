"use client"
import { ApiProductProduct, ApiProductVariantProductVariant } from "types/generated/contentTypes";
import { cn } from "@/lib/utils";
import { StrapiImage } from "../strapi-image";
import { Checkbox } from "@radix-ui/react-checkbox";
import CheckboxAnimated from "../checkbox-animated";
import { useState } from "react";
import ProductVariant from "./product-variant";

interface ProductListWithVariantsProps {
    products: ApiProductProduct['attributes'][];
    onSelect: (item: ApiProductVariantProductVariant['attributes']) => void;
}

const ProductListWithVariants: React.FC<ProductListWithVariantsProps> = ({ products, onSelect }) => {
 
    return (
        <div className=" space-y-4">
            {products.map((product, index) => (
                <div key={index} className="">
                    <h3 className="text-xl font-semibold">{product.title}</h3>
                    <p className="text-sm text-muted-foreground">{product.description}</p>
                    <div className="mt-4 space-y-2">
                        {product.product_variants?.map((variant: ApiProductVariantProductVariant['attributes'], index: number) => (
                            <ProductVariant key={index} item={variant} onSelect={onSelect} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductListWithVariants;