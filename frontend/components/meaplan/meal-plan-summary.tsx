"use client";
import { useState } from "react";
import { ApiCategoryCategory, ApiPartyTypePartyType, ApiProductProduct, ApiProductVariantProductVariant } from "types/generated/contentTypes";
import MealPlanDetails from "./details";
import OrderForm from "./order-form";
import SummaryCard from "./summary-card";
import { useMealItemsStore } from "@/lib/store/meal-items-store";
import { useBudget } from "@/lib/context/budget-context";
import { Button } from "../ui/button";

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
    const { selectedItems} = useMealItemsStore();
    const { formValues, updateFormValues, createBudget, budgetResult, isLoading, error } = useBudget();

    // Estrutura os tipos de festa selecionados
    const filterSelectedVariants = (variants: ApiProductVariantProductVariant['attributes'][]) => {
        return variants.filter(variant => selectedItems.some(item => item.id === variant.id));
    };

    const selectedPartyTypeStructure = partyType.categories.map((category: ApiCategoryCategory['attributes']) => ({
        ...category,
        products: category.products.map((product: ApiProductProduct['attributes']) => ({
            ...product,
            product_variants: filterSelectedVariants(product.product_variants)
        }))
    }));

    // Verifica se a seleção é válida
    const isValid = validateSelection(selectedPartyTypeStructure);

    // Função para lidar com o envio do pedido
    const handleOrder = async () => {
        // Pass the full items for now, our updated budget context will extract IDs
        await createBudget(partyType);
        setStep(2); // Move to result step after submitting
    };

    // Função para avançar para o próximo passo
    const handleNextStep = () => {
        setStep(step + 1);
    };
    
    // Função para voltar ao passo anterior
    const handleBack = () => {
        setStep(step - 1);
    };

    return (
        <SummaryCard>
            {step === 1 && (
                <MealPlanDetails
                    selectedPartyTypeStructure={selectedPartyTypeStructure}
                    isValid={isValid}
                    handleNextStep={handleNextStep}
                />
            )}
            {step === 2 && (
                <OrderForm
                    formValues={formValues}
                    updateFormValues={updateFormValues}
                    handleOrder={handleOrder}
                    handleBack={handleBack}
                    isLoading={isLoading}
                />
            )}
            {step === 3 && budgetResult && (
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold">Orçamento Finalizado</h2>
                    {error ? (
                        <div className="text-red-500 p-4 bg-red-50 rounded-md">
                            {error}
                        </div>
                    ) : (
                        <>
                            <div className="space-y-2 p-4 bg-green-50 rounded-md">
                                <p>Seu orçamento foi enviado com sucesso!</p>
                                <p>Em breve entraremos em contato pelo telefone {formValues.contactPhone}.</p>
                            </div>
                            
                            <div className="pt-4">
                                <Button onClick={() => window.location.href = '/cardapio'} className="w-full">
                                    Voltar ao Catálogo
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </SummaryCard>
    );
}