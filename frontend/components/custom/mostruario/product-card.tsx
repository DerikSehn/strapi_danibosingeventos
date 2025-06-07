"use client";

import { motion } from "framer-motion";
import { StrapiImage } from "@/components/strapi-image";
import { calculatePriceRange } from "./utils";

interface ProductCardProps {
    product: any;
    variants: any;
}

export function ProductCard({ product, variants }: Readonly<ProductCardProps>) {
    return (
        <motion.div 
            key={product.id} 
            className="w-full"
            variants={variants}
        >
            {/* Enhanced Product Container */}
            <div className="relative bg-neutral-800 border-l-4 border-secondary-500 shadow-xl p-0 mb-8 overflow-hidden">
                {/* Product Decorative Elements */}
                <div className="absolute inset-0 pointer-events-none opacity-5">
                    <div className="absolute top-4 right-4 w-8 h-8 border border-amber-400/30 rotate-45"></div>
                    <div className="absolute bottom-4 right-8 text-amber-400/20 text-2xl">✦</div>
                    <div className="absolute top-1/2 right-2 w-1 h-12 bg-gradient-to-b from-amber-500/20 to-transparent rounded-full"></div>
                    <div className="absolute bottom-6 left-4 text-amber-300/20 text-lg">❋</div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6 relative z-10">
                    {/* Enhanced Product Image */}
                    {product.image && (
                        <div className="relative h-40 w-full lg:w-80 flex-shrink-0 overflow-hidden shadow-lg z-0">
                            {/* Image decorative frame */}
                            <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-amber-400/40 rounded-tl-lg z-20"></div>
                            <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-amber-400/40 rounded-tr-lg z-20"></div>
                            <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-amber-400/40 rounded-bl-lg z-20"></div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-amber-400/40 rounded-br-lg z-20"></div>

                            <StrapiImage
                                src={product.image.url}
                                alt={product.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}

                    {/* Product Info */}
                    <div className="relative z-10 flex-1 space-y-2 xl:-ml-20 mt-6">
                        {/* Title and Price Range Row */}
                        <div className="flex items-center justify-between gap-4 p-4 -mt-3 bg-gradient-to-r from-neutral-700 to-50% to-neutral-800">
                            <h3 className="text-3xl font-food text-amber-200 flex-1">
                                {product.title}
                            </h3>

                            {/* Price Range - Right aligned */}
                            {(() => {
                                const priceRange = calculatePriceRange(product);
                                if (!priceRange) return null;

                                const { minPrice, maxPrice } = priceRange;

                                if (minPrice === maxPrice) {
                                    return (
                                        <div className="text-xl font-food text-amber-400/80 whitespace-nowrap">
                                            R$ {minPrice.toFixed(2).replace('.', ',')}
                                        </div>
                                    );
                                } else {
                                    return (
                                        <div className="text-xl font-food text-amber-400/80 whitespace-nowrap">
                                            R$ {minPrice.toFixed(2).replace('.', ',')} - R$ {maxPrice.toFixed(2).replace('.', ',')}
                                        </div>
                                    );
                                }
                            })()}
                        </div>

                        {product.description && (
                            <h3 className="text-amber-100/80 font-food leading-relaxed text-lg pl-5 bg-gradient-to-r from-neutral-700 to-30% to-neutral-800">
                                {product.description}
                            </h3>
                        )}

                        {/* Base Price */}
                        {product.price && (
                            <div className="flex items-center gap-3 pt-2 border-t border-amber-200/20">
                                <span className="text-amber-300 font-food">
                                    Preço base:
                                </span>
                                <span className="text-2xl font-food text-amber-200">
                                    R$ {product.price.toFixed(2).replace('.', ',')}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
