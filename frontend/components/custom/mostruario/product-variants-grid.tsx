"use client";

import { motion } from "framer-motion";
import { StrapiImage } from "@/components/strapi-image";
import { MenuCard } from "@/components/custom/menu-card";
import { ApiProductVariantProductVariant } from "types/generated/contentTypes";

interface ProductVariantsGridProps {
    productVariants: ApiProductVariantProductVariant['attributes'][];
    productId: string;
    containerVariants: any;
    variantCardVariants: any;
}

export function ProductVariantsGrid({ 
    productVariants, 
    productId, 
    containerVariants, 
    variantCardVariants 
}: Readonly<ProductVariantsGridProps>) {
    if (!productVariants || productVariants.length === 0) {
        return null;
    }

    return (
        <motion.div 
            className="grid md:grid-cols-2 gap-6"
            variants={containerVariants}
        >
            {productVariants.map((variant: ApiProductVariantProductVariant['attributes'], variantIndex: number) => (
                <motion.div
                    key={`variant-${productId}-${variantIndex}`}
                    variants={variantCardVariants}
                >
                    <MenuCard
                        variant="dark"
                        className="h-full"
                    >
                        <div className="flex gap-4">
                            {/* Variant Image */}
                            {variant.image && (
                                <div className="relative h-24 w-24 flex-shrink-0 rounded-lg overflow-hidden">
                                    <StrapiImage
                                        src={variant.image.url}
                                        alt={variant.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}

                            {/* Variant Details */}
                            <div className="flex-1 space-y-2">
                                <h4 className="text-xl font-food text-amber-200">
                                    {variant.title}
                                </h4>

                                {variant.description && (
                                    <p className="text-amber-100/70 text-sm leading-relaxed">
                                        {variant.description}
                                    </p>
                                )}

                                {/* Variant Price */}
                                {variant.price && (
                                    <div className="flex justify-between items-center pt-2 border-t border-amber-200/20">
                                        <span className="text-sm text-amber-300 font-food">
                                            Preço
                                        </span>
                                        <span className="text-lg font-food text-amber-200">
                                            R$ {variant.price.toFixed(2).replace('.', ',')}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </MenuCard>
                </motion.div>
            ))}
        </motion.div>
    );
}
