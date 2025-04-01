import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

interface FormValues {
    numberOfPeople: number;
    eventDuration: number;
    eventDetails: string;
    contactName: string;
    contactPhone: string;
    contactEmail: string;
}

interface OrderFormProps {
    formValues: FormValues;
    updateFormValues: (values: Partial<FormValues>) => void;
    handleOrder: () => void;
    handleBack: () => void;
    isLoading: boolean;
}

export default function OrderForm({ formValues, updateFormValues, handleOrder, handleBack, isLoading }: Readonly<OrderFormProps>) {
   
    const handleWrapper = async () => {
        handleOrder();
    }
    return (
        <>
            <div className="mb-4">
                <label htmlFor="contactName" className="block text-sm font-medium text-gray-700">
                    Nome
                </label>
                <Input
                    id="contactName"
                    value={formValues.contactName}
                    onChange={(e) => updateFormValues({ contactName: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">
                    Número de Celular
                </label>
                <Input
                    id="contactPhone"
                    value={formValues.contactPhone}
                    onChange={(e) => updateFormValues({ contactPhone: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                    Email (opcional)
                </label>
                <Input
                    id="contactEmail"
                    value={formValues.contactEmail}
                    onChange={(e) => updateFormValues({ contactEmail: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="numberOfPeople" className="block text-sm font-medium text-gray-700">
                    Número de Pessoas
                </label>
                <Input
                    id="numberOfPeople"
                    type="range"
                    min="20"
                    max="300"
                    step="10"
                    value={formValues.numberOfPeople}
                    onChange={(e) => updateFormValues({ numberOfPeople: Number(e.target.value) })}
                    className="mt-1 block w-full"
                />
                <span>{formValues.numberOfPeople}</span>
            </div>
            <div className="mb-4">
                <label htmlFor="eventDetails" className="block text-sm font-medium text-gray-700">
                    Observações
                </label>
                <Textarea
                    id="eventDetails"
                    value={formValues.eventDetails}
                    onChange={(e) => updateFormValues({ eventDetails: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm min-h-28"
                />
            </div>
            <div className="mt-6 md:space-y-2 relative z-10 grid md:block grid-cols-2 bg-[#fff]">
                <Button
                    className="w-full"
                    onClick={handleWrapper}
                    disabled={isLoading || !formValues.contactName || !formValues.contactPhone}
                >
                    {isLoading ? 'Processando...' : 'Finalizar pedido'}
                </Button>
                <Button
                    className="w-full"
                    onClick={handleBack}
                    disabled={isLoading}
                    variant="outline"
                >
                    Voltar
                </Button>
            </div>
        </>
    );
}