// frontend/components/order/order-finish.tsx
"use client";

import type { OrderFinishProps, SelectedOrderItem } from "@/types";
import { Loader2 } from "lucide-react";

// Props for OrderFinish, extending the one from types.ts if necessary for local state/logic
interface OrderFinishPropsExtended extends OrderFinishProps {
  readonly error?: string | null;
}

// Helper function to extract a displayable error message
const getDisplayErrorMessage = (
  orderResult: OrderFinishProps['orderResult'], 
  error?: string | null
): string => {
  if (orderResult && 'error' in orderResult) {
    if (typeof orderResult.error === 'string') {
      return orderResult.error;
    } else if (orderResult.error && typeof orderResult.error.message === 'string') {
      // Assuming Strapi error structure or a similar object with a message property
      return orderResult.error.message;
    }
  }
  if (error) {
    return error;
  }
  return "Ocorreu um erro desconhecido.";
};

// Success State Component
const OrderSuccessDisplay: React.FC<{ orderId: number; formValues: OrderFinishProps['formValues']; selectedItems: SelectedOrderItem[] }> = ({ orderId, formValues, selectedItems }) => (
  <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md shadow-md">
    <h2 className="text-2xl font-semibold mb-3">Pedido Enviado com Sucesso!</h2>
    <p className="mb-2">Obrigado, {formValues.contactName}! Seu pedido <span className="font-bold">#{orderId}</span> foi recebido.</p>
    <p className="mb-1">Em breve entraremos em contato pelo telefone {formValues.contactPhone} {formValues.contactEmail ? `ou email ${formValues.contactEmail}` : ''}.</p>
    <div className="mt-4 pt-3 border-t border-green-200">
      <h3 className="text-lg font-semibold mb-2">Resumo do Pedido:</h3>
      <ul className="list-disc list-inside pl-2 text-sm">
        {selectedItems.map((item) => (
          <li key={item.id} className="mb-1">
            {item.name} - Quantidade: {item.quantity}
          </li>
        ))}
      </ul>
    </div>
    <p className="mt-4 text-sm">
      Acompanhe o status do seu pedido ou entre em contato para mais informações.
    </p>
  </div>
);

// Error State Component
const OrderErrorDisplay: React.FC<{ contactName: string; errorMessage: string }> = ({ contactName, errorMessage }) => (
  <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md">
    <h2 className="text-2xl font-semibold mb-3">Erro ao Enviar Pedido</h2>
    <p className="mb-2">Lamentamos, {contactName}. Ocorreu um problema ao processar seu pedido.</p>
    <p className="mb-1">Detalhes do erro: <span className="font-mono bg-red-50 p-1 rounded text-sm">{errorMessage}</span></p>
    {/* TODO: Adicionar um botão "Tentar Novamente" que reinicia o formulário ou permite reenviar */}
    <p className="mt-4 text-sm">
      Por favor, verifique os dados informados ou tente novamente mais tarde. Se o problema persistir, entre em contato conosco diretamente.
    </p>
  </div>
);

// Loading State Component
const LoadingDisplay: React.FC = () => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
    <p className="text-lg font-semibold text-gray-700">Processando seu pedido...</p>
  </div>
);

// Fallback/Waiting State Component
const WaitingDisplay: React.FC = () => (
  <div className="container mx-auto p-4 max-w-2xl text-center">
    <p className="text-gray-600">Aguardando informações do pedido...</p>
  </div>
);

export default function OrderFinish({ 
  orderResult, 
  formValues, 
  selectedItems, 
  isLoading, 
  error 
}: Readonly<OrderFinishPropsExtended>) {
  
  if (isLoading) {
    return <LoadingDisplay />;
  }

  const wasSuccessful = orderResult && !('error' in orderResult) && orderResult.data;
  const orderId = wasSuccessful ? orderResult.data.id : null;
  
  if (wasSuccessful && orderId) {
    return <OrderSuccessDisplay orderId={orderId} formValues={formValues} selectedItems={selectedItems} />;
  }

  const displayErrorMessage = getDisplayErrorMessage(orderResult, error);
  
  if (!wasSuccessful) { // This covers explicit errors and cases where success is false
      return <OrderErrorDisplay contactName={formValues.contactName} errorMessage={displayErrorMessage} />;
  }

  // Fallback for any other state, though ideally all states are covered above.
  return <WaitingDisplay />;
}
