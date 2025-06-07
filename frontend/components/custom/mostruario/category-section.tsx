"use client";

import { PureCategory } from "@/types";
import { motion } from "framer-motion";
import { CategoryHeader } from "./category-header";
import { ProductCard } from "./product-card";
import { ProductVariantsGrid } from "./product-variants-grid";
import { useAnimationVariants } from "./use-animation-variants";

interface CategorySectionProps {
    category: PureCategory;
}

export function CategorySection({ category }: Readonly<CategorySectionProps>) {
    const { categoryVariants, containerVariants, productVariants, variantCardVariants } = useAnimationVariants();
    
    if (!category.products || category.products.length === 0) {
        return null;
    }

    return (
        <motion.div
            key={category.id}
            className="mb-20 relative"
            variants={categoryVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-30px" }}
        >
            {/* Category Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none opacity-10">
                <div className="absolute -top-8 -left-4 w-16 h-16 border border-amber-400/30 rounded-full"></div>
                <div className="absolute -top-4 -right-8 w-12 h-12 border border-orange-400/30 rotate-45"></div>
                <div className="absolute -bottom-12 left-1/4 text-amber-300/40 text-6xl">※</div>
                <div className="absolute -bottom-8 right-1/3 w-8 h-24 bg-gradient-to-t from-amber-500/20 to-transparent rounded-full"></div>
            </div>

            {/* Category Header */}
            <CategoryHeader 
                title={category.title!} 
                description={category.description!} 
            />

            {/* Products Grid */}
            <motion.div 
                className="space-y-12"
                variants={containerVariants}
            >
                {category.products.map((product: any, productIndex: number) => (                    <div key={product.id}>
                        <ProductCard
                            product={product}
                            variants={productVariants}
                        />

                        {/* Product Variants Grid */}
                        <ProductVariantsGrid
                            productVariants={product.product_variants}
                            productId={product.id}
                            containerVariants={containerVariants}
                            variantCardVariants={variantCardVariants}
                        />
                    </div>
                ))}
            </motion.div>
        </motion.div>
    );
}
