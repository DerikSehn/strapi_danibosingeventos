"use client";
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from "sonner";

import { createOrder } from '../../data/actions/create-order'; // Corrected import path
import { validateOrderForm } from '@/lib/utils/validation';
import { useFormStepper } from '@/lib/hooks/useFormStepper';
import type {
    FormValues,
    OrderApiResponse,
    OrderPageClientProps,
    OrderPayload,
    SelectedOrderItem
} from '../../types'; // Corrected import path from @/types to relative path
import OrderFinish from './order-finish'; // Reverted: Removed .tsx extension
 import OrderItemsSelector from './order-items-selector';
import ActionFooter from '../meaplan/action-footer';
import OrderForm from '../meaplan/order-form';

export default function OrderPageClient({ categories }: Readonly<OrderPageClientProps>) {
     const [selectedItems, setSelectedItems] = useState<SelectedOrderItem[]>([]);
    const [formValues, setFormValues] = useState<FormValues>({
    eventDuration: 0,
    eventDetails:'',
    eventDate: undefined,
    contactName:'',
    contactPhone:'',
    contactEmail:'',
    });
    const [orderResult, setOrderResult] = useState<OrderApiResponse | { error: string } | null>(null);

    const mutation = useMutation<OrderApiResponse, Error, OrderPayload>({
        mutationFn: createOrder, // Use the createOrder server action
        onSuccess: (data: OrderApiResponse) => { // Explicitly type data
            toast.success('Encomenda enviada com sucesso!');
            setOrderResult(data);
            // nextStep(); // Ensure nextStep is called to advance to the finish/summary step
         },
        onError: (error: Error) => { // Explicitly type error
            toast.error(error.message ?? 'Ocorreu um erro ao enviar a encomenda.');
            setOrderResult({ error: error.message ?? 'Falha no envio' });
         },
    });    const updateFormValues = (newValues: Partial<FormValues>) => {
        setFormValues((prev: FormValues) => ({ ...prev, ...newValues })); // Explicitly type prev
    };
    
    const steps = [
        {
            title: "Seleção de Itens",
            description: "Escolha os itens do seu cardápio",
            content:  <OrderItemsSelector
                        categories={categories}
                        selectedItems={selectedItems}
                        setSelectedItems={setSelectedItems}
                    />
        },
        {
            title: "Detalhes do Pedido",
            description: "Preencha os detalhes do seu pedido",
            content:  <OrderForm
                        formValues={formValues}
                        updateFormValues={updateFormValues}
                        isLoading={mutation.isPending}
                        showValidation={false}
                    />
        },
        {
            title: "Conclusão",
            description: "Mensagem de confirmação",
            content:   <OrderFinish
                orderResult={orderResult}
                formValues={formValues}
                selectedItems={selectedItems}
                isLoading={mutation.isPending}

                />        }
    ]

    const {Stepper, nextStep, step, previousStep } = useFormStepper(steps);

    const handleSubmitOrder = async () => {
        // Validate form before submitting
        const validation = validateOrderForm({
            contactName: formValues.contactName,
            contactPhone: formValues.contactPhone,
            contactEmail: formValues.contactEmail,
            orderDetailsNotes: formValues.eventDetails,
            orderItems: selectedItems.map(item => ({
                id: item.docId ?? item.id,
                quantity: item.quantity,
            })),
        });

        if (!validation.isValid) {
            // Show validation errors
            validation.errors.forEach(error => {
                toast.error(error.message);
            });
            return;
        }
        
        const orderPayload: OrderPayload = {
            data: {
                contactName: formValues.contactName,
                contactPhone: formValues.contactPhone,
                contactEmail: formValues.contactEmail ?? undefined, // Use undefined for optional fields if empty
                orderDetailsNotes: formValues.eventDetails ?? undefined,
                eventDate: formValues.eventDate || undefined,
                orderItems: selectedItems.map(item => ({
                    id: item.docId ?? item.id,
                    quantity: item.quantity,
                })),
            },
        };

        try {
            await mutation.mutateAsync(orderPayload); // Use mutateAsync to await the result
            nextStep();
        } catch (error) {
            console.error("Mutation failed:", error);
        }
    };

  const isFirstStep = step === 1;

    const reset = () => {
        setSelectedItems([]);
        setFormValues({
            eventDuration: 0,
            eventDetails: '',
            eventDate: undefined,
            contactName: '',
            contactPhone: '',
            contactEmail: '',
        });
        setOrderResult(null);
    };
 

    return (
        <div className="container mx-auto py-12 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto ">
                <Stepper  currentStep={step} steps={steps} />
            </div>
             {step !== 3 && (
                            <ActionFooter 
                                onNext={isFirstStep ? nextStep : handleSubmitOrder}
                                onReset={isFirstStep ? reset : previousStep}
                                nextLabel={isFirstStep ? "Próximo" : "Finalizar pedido"}
                                resetLabel={isFirstStep ? "Limpar seleção" : "Voltar"}
                                nextDisabled={isFirstStep ? selectedItems.length === 0 : false}
                                isLoading={mutation.isPending}
                                itemCount={selectedItems.length}
                            />
                            )}
        </div>
    );
}