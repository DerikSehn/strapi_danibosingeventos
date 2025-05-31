'use server';
import { mutatePublicData } from 'data/services/mutate-public-data';
import type { OrderPayload, OrderApiResponse } from '../../types';

export async function createOrder(
  payload: OrderPayload,
): Promise<OrderApiResponse> {
  try {
    console.log('Criando encomenda com os seguintes dados:', payload);
    // The payload already contains the 'data' wrapper, so it can be passed directly.
    const orderResponse = await mutatePublicData(
      'POST',
      '/api/orders',
      payload,
    );
    return orderResponse as OrderApiResponse; // Cast to ensure type compatibility
  } catch (error) {
    console.error('Erro ao criar a encomenda:', error);
    // Ensure the error is re-thrown or handled in a way that the client can understand
    if (error instanceof Error) {
      throw new Error(error.message || 'Falha ao criar a encomenda.');
    } else {
      throw new Error('Um erro desconhecido ocorreu ao criar a encomenda.');
    }
  }
}
