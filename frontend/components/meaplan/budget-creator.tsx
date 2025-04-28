"use client"
import { useBudget } from "@/lib/context/budget-context";
import { useFormStepper } from "@/lib/hooks/useFormStepper";
import { useMealItemsStore } from "@/lib/store/meal-items-store";
import { ApiPartyTypePartyType } from "types/generated/contentTypes";
import CategoriesSelector from "../meal-planner/categories-selector";
import ActionFooter from "./action-footer";
import BudgetFinish from "./budget-finish";
import MealPlanSummary from "./meal-plan-summary";
import OrderForm from "./order-form";

    

export default function BudgetCreator({ partyType }: Readonly<{ partyType: ApiPartyTypePartyType['attributes'] }>) {

 const { formValues, updateFormValues, createBudget, budgetResult, isLoading, error } = useBudget();
 const { selectedItems, reset } = useMealItemsStore();
    // Estrutura os tipos de festa selecionados
   
    // Função para lidar com o envio do pedido
    const handleOrder = async () => {
        await createBudget(partyType);
        nextStep()
    };

    const steps = [
        {
            title: "Seleção de Itens",
            description: "Escolha os itens do seu cardápio",
            content: <CategoriesSelector categories={partyType.categories}/>
        },
        {
            title: "Detalhes do Pedido",
            description: "Preencha os detalhes do seu pedido",
            content: <OrderForm formValues={formValues} updateFormValues={updateFormValues} isLoading={isLoading} />
        },
        {
            title: "Conclusão",
            description: "Mensagem de confirmação",
            content: <BudgetFinish budgetResult={budgetResult} formValues={formValues} selectedItems={selectedItems} isLoading={isLoading} error={error} />
        }
    ]

    

    const {Stepper, nextStep, step, previousStep } = useFormStepper(steps)

    const isFirstStep = step === 1;

    return ( 
            <section className="relative z-10 w-full py-32  min-h-screen bg-muted">
                {/* <MotionBackgroundZoom src={partyType.backgroundImage.url} alt="Hero" /> */}

                <div className="relative px-4 md:px-6 mx-auto">
                {step !== 3 && 
                    <div className=" text-primary text-center">
                        <h1 className="text-4xl lg:text-6xl font-rustic font-bold">2º passo: {partyType?.title} - Monte seu Cardápio</h1>
                        <p className="text-lg mt-4 border-t  border-t-black-700 py-4 max-w-screen-2xl mx-auto text-muted-foreground bg-black-900/50">
                            Escolha os sabores e tipos de salgados e doces de cada categoria para prosseguir com a criação do seu cardápio personalizado.
                        </p>
                    </div>
                     }
                <Stepper  currentStep={step} steps={steps} />

                    <div className="relative">
                        
                        <MealPlanSummary partyType={partyType}  />
                     </div>
                </div>
                {step !== 3 && (
                <ActionFooter 
                    onNext={isFirstStep ? nextStep : handleOrder}
                    onReset={isFirstStep ? reset : previousStep}
                    nextLabel={isFirstStep ? "Próximo" : "Finalizar pedido"}
                    resetLabel={isFirstStep ? "Limpar seleção" : "Voltar"}
                    nextDisabled={isFirstStep ? selectedItems.length === 0 : false}
                    isLoading={isLoading}
                    itemCount={selectedItems.length}
                />
                )}
            </section> 
    )
}