import { useState } from "react";
import { ApiCategoryCategory, ApiPartyTypePartyType } from "types/generated/contentTypes";
import SummaryCard from "./summary-card";
import MealPlanDetails from "./details";
import OrderForm from "./order-form";
import { calculateBudget } from "app/actions";
import { useFormState } from "react-use-form-state";
import { cn } from "@/lib/utils";

// Função para validar a seleção de categorias e produtos
const validateSelection = (categories: (ApiCategoryCategory['attributes'])[]) => {
    return categories.every(category =>
        category.products.every(product =>
            !!product.product_variants.length)
    );
};

interface MealPlanSummaryProps {
    partyType: ApiPartyTypePartyType['attributes'];
    selectedItems: Record<string, any[]>;
}

export default function MealPlanSummary({ partyType, selectedItems = {} }: MealPlanSummaryProps) {
    const [step, setStep] = useState(1);
    const [formState, { text, number }] = useFormState({
        numberOfPeople: 20,
        eventDuration: 4,
        eventDetails: "",
        contactName: "",
        contactPhone: ""
    });

    // Filtra os itens selecionados
    const selectedMeals = Object.values(selectedItems).filter(Boolean);

    // Calcula o preço total dos itens selecionados
    const totalPrice = selectedMeals.reduce((total, meal) => total + meal.price, 0);

    // Estrutura os tipos de festa selecionados
    const selectedPartyTypeStructure = partyType.categories.map(category => ({
        ...category,
        products: category.products.map(product => ({
            ...product,
            product_variants: product.product_variants.filter(pv => pv.id in selectedItems && selectedItems[pv.id])
        }))
    }));

    // Verifica se a seleção é válida
    const isValid = validateSelection(selectedPartyTypeStructure);

    console.log({ selectedPartyTypeStructure });

    // Função para lidar com o envio do pedido
    const handleOrder = async () => {
        try {
            const data = await calculateBudget({
                partyTypeId: partyType.documentId,
                selectedItemIds: selectedMeals.map(meal => meal.documentId),
                numberOfPeople: formState.values.numberOfPeople,
                eventDuration: formState.values.eventDuration,
                eventDetails: formState.values.eventDetails
            });

            if (data.success) {
                alert('Orçamento enviado com sucesso!');
            } else {
                alert('Erro ao enviar orçamento. Por favor, tente novamente.');
            }
        } catch (error) {
            alert('Erro ao enviar orçamento. Por favor, tente novamente.');
        }
    };

    // Função para avançar para o próximo passo
    const handleNextStep = () => {
        setStep(step + 1);

    };

    return (
        <SummaryCard >
            {step === 1 && (
                <MealPlanDetails
                    selectedPartyTypeStructure={selectedPartyTypeStructure}
                    isValid={isValid}
                    handleNextStep={handleNextStep}
                />
            )}
            {step === 2 && (
                <OrderForm
                    formState={formState}
                    text={text}
                    number={number}
                    handleOrder={handleOrder}
                    handleBack={() => setStep(step - 1)}
                />
            )}
        </SummaryCard>
    );
}