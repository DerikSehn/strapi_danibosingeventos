import { cn } from "@/lib/utils";
import { motion, useScroll } from "framer-motion"; // Import useTransform
import { useRef } from "react";
import { ApiCategoryCategory } from "types/generated/contentTypes";
import CategoryCard from "../meaplan/category-card";
import { Card } from "../ui/card";

interface CategoriesSelectorProps {
    categories: ApiCategoryCategory['attributes'][];
    className?: string;
}

export default function CategoriesSelector({ categories, className }: Readonly<CategoriesSelectorProps>) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: scrollRef, offset: ['start 300px', 'end end'] });

    // Transform scrollYProgress to calculate the circle's position

    if (!categories || categories.length === 0) {
        return (
            <div className="md:col-span-2 space-y-6 my-6">
                <p className="text-muted-foreground">Nenhuma categoria disponível.</p>
            </div>
        );
    }

    return (
        <div className={cn("relative md:col-span-2 my-6 h-full", className)}>
            <div ref={scrollRef} className="space-y-6 h-full overflow-y-auto ">
                {categories.map((category: ApiCategoryCategory['attributes']) => (
                    <CategoryCard key={category.documentId} item={category} />
                 ))}
            </div>
            {/* Scroll progress indicator */}
            <div className="absolute top-[1px] -left-4 md:-left-1 bottom-0 w-2 bg-primary  overflow-hidden">
                <motion.div
                    className="relative h-full w-full bg-primary-600 origin-top"
                    style={{ scaleY: scrollYProgress }}
                >
                </motion.div>
            </div>
            {/* Big OK Icon telling that all categories habe been shown */}
             <Card className=" flex flex-col items-center justify-center p-8 mt-4">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-48 w-48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M9 11l3 3L22 4" />
                </svg> 
                <p className="text-2xl font-food text-primary-400">Todas as categorias foram exibidas, Clique em "Próximo" para continuar</p>
            </Card>
        </div>
    );
}