"use client";

import { ChefHat } from "lucide-react";

interface CategoryHeaderProps {
    title: string;
    description?: string;
}

export function CategoryHeader({ title, description }: Readonly<CategoryHeaderProps>) {
    return (
        <div className="text-center mb-12 relative">
            {/* Enhanced Header Decoration */}
            <div className="flex justify-center items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-12 h-0.5 bg-gradient-to-r from-amber-400 to-transparent"></div>
                </div>
                <div className="relative">
                    <ChefHat className="w-6 h-6 text-amber-400" />
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-12 h-0.5 bg-gradient-to-l from-amber-400 to-transparent"></div>
                </div>
            </div>

            <h2 className="text-4xl md:text-5xl font-food text-amber-200 mb-2 relative">
                {title}
            </h2>
            {description && (
                <p className="text-xl text-amber-100/80  max-w-2xl mx-auto">
                    {description}
                </p>
            )}
        </div>
    );
}
