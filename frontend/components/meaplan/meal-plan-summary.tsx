"use client";
import { useMealItemsStore } from "@/lib/store/meal-items-store";
import { useState } from "react";
import { ApiPartyTypePartyType } from "types/generated/contentTypes";

// Função para validar a seleção de categorias e produtos
const validateSelection = (categories: any[]) => {
    // Check if there are any selected items
    return categories.some(category =>
        category.products.some((product: { product_variants: string | any[]; }) =>
            product.product_variants.length > 0)
    );
};

interface MealPlanSummaryProps {
    partyType: ApiPartyTypePartyType['attributes'];
}

export default function MealPlanSummary({ partyType }: Readonly<MealPlanSummaryProps>) {
    const [step, setStep] = useState(1);
    const { selectedItems, reset } = useMealItemsStore();
   


    return (
        <>
           

        </>
    );
}