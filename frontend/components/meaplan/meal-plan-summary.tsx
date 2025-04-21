"use client";
import { useBudget } from "@/lib/context/budget-context";
import { useMealItemsStore } from "@/lib/store/meal-items-store";
import { useState } from "react";
import { ApiCategoryCategory, ApiPartyTypePartyType, ApiProductProduct, ApiProductVariantProductVariant } from "types/generated/contentTypes";
import Stepper from "../ui/stepper";
import ActionFooter from "./action-footer";
import MealPlanDetails from "./details";
import OrderForm from "./order-form";
import SummaryCard from "./summary-card";

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