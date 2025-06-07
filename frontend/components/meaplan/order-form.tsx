import { FormValues } from "@/types";
import { GastronomyInput } from "../custom/gastronomy-input";
import { GastronomyTextarea } from "../custom/gastronomy-textarea";
import { MenuCard } from "../custom/menu-card";


interface OrderFormProps {
    formValues: FormValues;
    updateFormValues: (values: Partial<FormValues>) => void;
    isLoading: boolean;
}

export default function OrderForm({ formValues, updateFormValues, isLoading }: Readonly<OrderFormProps>) {
    return (
        <MenuCard variant="rustic" className="max-w-prose mx-auto p-4">
            <div className="mb-4">
                <GastronomyInput
                    variant="chef" 
                    label="Nome"
                    id="contactName"
                    value={formValues.contactName}
                    onChange={(e) => updateFormValues({ contactName: e.target.value })}
                 />
            </div>
            <div className="mb-4">
                <GastronomyInput
                    variant="chef" 
                    label="Número de Celular"
                    id="contactPhone"
                    value={formValues.contactPhone}
                    onChange={(e) => updateFormValues({ contactPhone: e.target.value })}
                 />
            </div>
         {!!formValues.numberOfPeople &&
            <div className="mb-4">
                <GastronomyInput
                    variant="chef" 
                    label="Número de Pessoas"
                    id="numberOfPeople"
                    type="range"
                    min="20"
                    max="300"
                    step="5"
                    value={formValues.numberOfPeople}
                    onChange={(e) => updateFormValues({ numberOfPeople: Number(e.target.value) })}
                 />
                <span>{formValues.numberOfPeople}</span>
            </div>
         }
            <div className="mb-4">
                <GastronomyTextarea
                    id="eventDetails"
                    label="Observações"
                    value={formValues.eventDetails}
                    onChange={(e) => updateFormValues({ eventDetails: e.target.value })}
                 />
            </div>
        </MenuCard>
    );
}