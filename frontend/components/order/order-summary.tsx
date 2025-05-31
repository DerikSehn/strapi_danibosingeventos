// frontend/components/order/order-summary.tsx
"use client";

import { OrderSummaryProps } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StrapiImage } from "@/components/strapi-image";
import { getStrapiMedia } from "@/lib/utils";

export default function OrderSummary({ selectedItems, formValues, totalPrice, isLoading }: Readonly<OrderSummaryProps>) {
  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader className="bg-muted/50">
        <CardTitle className="text-2xl text-center text-primary">Revisão da Encomenda</CardTitle>
        <CardDescription className="text-center">
          Por favor, revise os itens da sua encomenda e seus dados antes de finalizar.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">Itens Selecionados</h3>
          {selectedItems.length > 0 ? (
            <ScrollArea className="h-64 pr-4">
              <ul className="space-y-3">
                {selectedItems.map((item) => {
                  const itemImage = item.image ? getStrapiMedia(item.image) : undefined;
                  return (
                    <li key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {itemImage && (
                          <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                            <StrapiImage src={itemImage} alt={item.name} fill className="object-cover" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-700">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.quantity} x R$ {item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold text-gray-800">R$ {(item.quantity * item.price).toFixed(2)}</p>
                    </li>
                  );
                })}
              </ul>
            </ScrollArea>
          ) : (
            <p className="text-muted-foreground">Nenhum item selecionado.</p>
          )}
        </div>

        <hr className="my-6 border-gray-200" />

        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-gray-800">Dados de Contato</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div>
              <p className="font-medium text-gray-600">Nome:</p>
              <p className="text-gray-800">{formValues.contactName}</p>
            </div>
            <div>
              <p className="font-medium text-gray-600">Telefone:</p>
              <p className="text-gray-800">{formValues.contactPhone}</p>
            </div>
            {formValues.contactEmail && (
              <div>
                <p className="font-medium text-gray-600">Email:</p>
                <p className="text-gray-800">{formValues.contactEmail}</p>
              </div>
            )}
            {formValues.eventDetails && (
              <div className="md:col-span-2">
                <p className="font-medium text-gray-600">Observações:</p>
                <p className="text-gray-800 whitespace-pre-wrap">{formValues.eventDetails}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-end p-6 bg-muted/50 space-y-2">
        <div className="text-2xl font-bold text-primary">
          Total da Encomenda: R$ {totalPrice.toFixed(2)}
        </div>
        {isLoading && (
          <p className="text-sm text-muted-foreground animate-pulse">Processando encomenda...</p>
        )}
      </CardFooter>
    </Card>
  );
}
