import { FormValues } from "@/types";
import { formatPhoneNumber, validateBudgetForm, ValidationResult } from "@/lib/utils/validation";
import { GastronomyInput } from "../custom/gastronomy-input";
import { GastronomyTextarea } from "../custom/gastronomy-textarea";
import { MenuCard } from "../custom/menu-card";
import { AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "../ui/alert";
import { PhoneInput } from "../ui/phone-input";


interface OrderFormProps {
    formValues: FormValues;
    updateFormValues: (values: Partial<FormValues>) => void;
    isLoading: boolean;
    showValidation?: boolean;
}

export default function OrderForm({ formValues, updateFormValues, isLoading, showValidation = false }: Readonly<OrderFormProps>) {
    const [validation, setValidation] = useState<ValidationResult | null>(null);

    // Validate form when showValidation changes or form values change
    useEffect(() => {
        if (showValidation) {
            const result = validateBudgetForm({
                contactName: formValues.contactName,
                contactPhone: formValues.contactPhone,
                contactEmail: formValues.contactEmail,
                numberOfPeople: formValues.numberOfPeople ?? 20,
                eventDetails: formValues.eventDetails
            });
            setValidation(result);
        }
    }, [formValues, showValidation]);

    const getFieldError = (fieldName: string): string | undefined => {
        return validation?.errors.find(error => error.field === fieldName)?.message;
    };

    const handlePhoneChange = (value: string) => {
        const formatted = formatPhoneNumber(value);
        updateFormValues({ contactPhone: formatted });
    }; return (
        <MenuCard variant="rustic" className="max-w-prose mx-auto p-4">
            {validation && !validation.isValid && (
                <Alert className="mb-4 border-red-500 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <AlertDescription className="text-red-700">
                        Por favor, corrija os erros abaixo antes de continuar.
                    </AlertDescription>
                </Alert>
            )}

            <div className="mb-4">
                <GastronomyInput
                    variant="chef"
                    label="Nome *"
                    id="contactName"
                    value={formValues.contactName}
                    onChange={(e) => updateFormValues({ contactName: e.target.value })}
                    disabled={isLoading}
                    className={getFieldError('contactName') ? 'border-red-500' : ''}
                />
                {getFieldError('contactName') && (
                    <p className="text-red-500 text-sm mt-1">{getFieldError('contactName')}</p>
                )}
            </div>

            <div className="mb-4">
                <PhoneInput
                    variant="chef"
                    label="Número de Celular *"
                    id="contactPhone"
                    value={formValues.contactPhone}
                    onChange={handlePhoneChange}
                    disabled={isLoading}
                    placeholder="(11) 98765-4321"
                    className={getFieldError('contactPhone') ? 'border-red-500' : ''}
                />
                {getFieldError('contactPhone') && (
                    <p className="text-red-500 text-sm mt-1">{getFieldError('contactPhone')}</p>
                )}
            </div>

            <div className="mb-4">
                <GastronomyInput
                    variant="chef"
                    label="Email (opcional)"
                    id="contactEmail"
                    type="email"
                    value={formValues.contactEmail}
                    onChange={(e) => updateFormValues({ contactEmail: e.target.value })}
                    disabled={isLoading}
                    placeholder="seu@email.com"
                    className={getFieldError('contactEmail') ? 'border-red-500' : ''}
                />
                {getFieldError('contactEmail') && (
                    <p className="text-red-500 text-sm mt-1">{getFieldError('contactEmail')}</p>
                )}
            </div>

            {!!formValues.numberOfPeople && (
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
                        disabled={isLoading}
                    />
                    <span className="text-sm text-gray-600">{formValues.numberOfPeople} pessoas</span>
                </div>
            )}

            <div className="mb-4">
                <GastronomyTextarea
                    id="eventDetails"
                    label="Observações"
                    value={formValues.eventDetails}
                    onChange={(e) => updateFormValues({ eventDetails: e.target.value })}
                    disabled={isLoading}
                    placeholder="Detalhes adicionais sobre o evento..."
                />
            </div>
        </MenuCard>
    );
}