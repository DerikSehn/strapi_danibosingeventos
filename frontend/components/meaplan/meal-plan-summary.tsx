"use client";
import { useState } from "react";
import { ApiCategoryCategory, ApiPartyTypePartyType, ApiProductProduct, ApiProductVariantProductVariant } from "types/generated/contentTypes";
import MealPlanDetails from "./details";
import OrderForm from "./order-form";
import SummaryCard from "./summary-card";
import { useMealItemsStore } from "@/lib/store/meal-items-store";
import { useBudget } from "@/lib/context/budget-context";
import { Button } from "../ui/button";
import ActionFooter from "./action-footer";

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
    const { formValues, updateFormValues, createBudget, budgetResult, isLoading, error, resetBudget } = useBudget();

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
        await createBudget(partyType);
        setStep(3); // Move to result step after submitting
    };

    // Função para avançar para o próximo passo
    const handleNextStep = () => {
        setStep(step + 1);
    };
    
    // Função para reset e voltar
    const handleReset = () => {
        if (step === 1) {
            // Reset selection
            reset();
            resetBudget();
        } else {
            // Go back
            setStep(step - 1);
        }
    };

    return (
        <>
            <div className="pb-20"> 
                <SummaryCard>
                    {step === 1 && (
                        <MealPlanDetails
                            selectedPartyTypeStructure={selectedPartyTypeStructure}
                            isValid={isValid}
                        />
                    )}
                    {step === 2 && (
                        <OrderForm
                            formValues={formValues}
                            updateFormValues={updateFormValues}
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
            </div>

            {step < 3 && (
                <ActionFooter 
                    onNext={step === 1 ? handleNextStep : handleOrder}
                    onReset={handleReset}
                    nextLabel={step === 1 ? "Próximo" : "Finalizar pedido"}
                    resetLabel={step === 1 ? "Limpar seleção" : "Voltar"}
                    nextDisabled={step === 1 ? !isValid : !formValues.contactName || !formValues.contactPhone}
                    isLoading={isLoading}
                    itemCount={selectedItems.length}
                />
            )}
        </>
    );
}