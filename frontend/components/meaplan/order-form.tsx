import { Button } from "../ui/button";
import { FormState } from "react-use-form-state";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";


interface OrderFormProps {
    formState: FormState<any>;
    text: any;
    number: any;
    handleOrder: () => void;
    handleBack: () => void;
}

export default function OrderForm({ formState, text, number, handleOrder, handleBack }: OrderFormProps) {
    return (
        <>
            <div className="mb-4">
                <label htmlFor="contactName" className="block text-sm font-medium text-gray-700">
                    Nome
                </label>
                <Input
                    {...text("contactName")}
                    id="contactName"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">
                    Número de Celular
                </label>
                <Input
                    {...text("contactPhone")}
                    id="contactPhone"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="numberOfPeople" className="block text-sm font-medium text-gray-700">
                    Número de Pessoas
                </label>
                <Input
                    {...number("numberOfPeople")}
                    id="numberOfPeople"
                    type="range"
                    min="20"
                    max="300"
                    step="10"
                    className="mt-1 block w-full"
                />
                <span>{formState.values.numberOfPeople}</span>
            </div>
            <div className="mb-4">
                <label htmlFor="eventDuration" className="block text-sm font-medium text-gray-700">
                    Duração do Evento (horas)
                </label>
                <Input
                    {...number("eventDuration")}
                    id="eventDuration"
                    type="range"
                    min="4"
                    max="5"
                    className="mt-1 block w-full"
                />
                <span>{formState.values.eventDuration} horas</span>
            </div>
            <div className="mb-4">
                <label htmlFor="eventDetails" className="block text-sm font-medium text-gray-700">
                    Observações
                </label>
                <Textarea
                    {...text("eventDetails")}
                    id="eventDetails"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm min-h-28"
                />
            </div>
            <div className="mt-6 md:space-y-2 relative z-10 grid md:block grid-cols-2 bg-[#fff]">
                <Button
                    className="w-full"
                    onClick={handleOrder}
                >
                    Finalizar pedido
                </Button>
                <Button
                    className="w-full"
                    onClick={handleBack}
                >
                    Voltar
                </Button>
            </div>
        </>
    );
}