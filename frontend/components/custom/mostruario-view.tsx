"use client";

import { motion } from "framer-motion";
import { PureCategory } from "@/types";
import {
    HeroSection,
    CategorySection,
    CallToActionSection,
    useAnimationVariants
} from "@/components/custom/mostruario";

interface MostruarioViewProps {
    readonly categoriesData: PureCategory[];
    readonly totalProducts: number;
}

export function MostruarioView({ categoriesData, totalProducts }: MostruarioViewProps) {
    const { containerVariants } = useAnimationVariants();
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-black">
            <HeroSection totalProducts={totalProducts} />
            
            <motion.section
                className="py-16"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={containerVariants}
            >
                <div className="container mx-auto px-4">
                    {categoriesData.map((category: PureCategory) => {
                        if (!category.products || category.products.length === 0) return null;
                        
                        return (
                            <CategorySection
                                key={category.id}
                                category={category}
                            />
                        );
                    })}
                </div>
            </motion.section>
            
            <CallToActionSection />
        </div>
    );
}
