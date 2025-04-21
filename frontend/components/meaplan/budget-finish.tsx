import React from 'react';
import { ApiBudgetBudget, ApiProductVariantProductVariant } from 'types/generated/contentTypes';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { BudgetFormValues } from 'types/budget-form-values';

interface BudgetFinishProps {
    budgetResult: ApiBudgetBudget['attributes'] | null;
    selectedItems: ApiProductVariantProductVariant['attributes'][];
    isLoading: boolean;
    formValues: BudgetFormValues;
    error: string | null;
}

const BudgetFinish: React.FC<BudgetFinishProps> = ({
    budgetResult,
    formValues,
    selectedItems,
    isLoading,
    error
}) => {
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-lg font-semibold">Calculando seu orçamento...</p>
                <p className="text-muted-foreground">Por favor, aguarde.</p>
            </div>
        );
    }

    if (error) {
        return (
            <Card className="border-destructive bg-destructive/10">
                <CardHeader>
                    <CardTitle className="flex items-center text-destructive">
                        <AlertCircle className="mr-2" /> Erro ao Calcular Orçamento
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p>{error}</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Houve um problema ao processar seu pedido. Tente novamente mais tarde ou entre em contato.
                    </p>
                </CardContent>
                <CardFooter>
                    <Link href="/" passHref>
                        <Button variant="destructive">Voltar ao Início</Button>
                    </Link>
                </CardFooter>
            </Card>
        );
    }

    if (!budgetResult) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center text-muted-foreground">
                        <AlertCircle className="mr-2" /> Orçamento Não Encontrado
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Não foi possível encontrar os detalhes do seu orçamento.</p>
                </CardContent>
                 <CardFooter>
                    <Link href="/" passHref>
                        <Button variant="outline">Voltar ao Início</Button>
                    </Link>
                </CardFooter>
            </Card>
        );
    }

    // Success state
    return (
        <Card className="border-green-500 bg-green-500/10">
            <CardHeader>
                <CardTitle className="flex items-center text-green-700">
                    <CheckCircle className="mr-2" /> Orçamento Enviado com Sucesso!
                </CardTitle>
                <CardDescription>
                    Recebemos seu pedido de orçamento. Entraremos em contato em breve com os detalhes.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="font-semibold text-lg mb-2">Resumo do Pedido</h3>
                    <p><strong>Nome:</strong> {formValues.contactName}</p>
                    <p><strong>Email:</strong> {formValues.contactEmail}</p>
                    <p><strong>Telefone:</strong> {formValues.contactPhone}</p>
                    <p><strong>Número de Pessoas:</strong> {formValues.numberOfPeople}</p>
                    <p><strong>Duração do Evento:</strong> {formValues.eventDuration} horas</p>
                    {formValues.eventDetails && <p><strong>Detalhes Adicionais:</strong> {formValues.eventDetails}</p>}
                </div>

                <div>
                    <h3 className="font-semibold text-lg mb-2">Itens Selecionados ({selectedItems.length})</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {selectedItems.map(item => (
                            <li key={item.id}>{item.title}</li>
                        ))}
                    </ul>
                </div>

                
            </CardContent>
            <CardFooter>
                <Link href="/" passHref>
                    <Button variant="default">Voltar ao Início</Button>
                </Link>
            </CardFooter>
        </Card>
    );
};

export default BudgetFinish;

