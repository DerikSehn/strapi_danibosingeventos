'use server';
import { mutatePublicData } from 'data/services/mutate-public-data';
import type { OrderPayload, OrderApiResponse } from '../../types';

export async function createOrder(
  payload: OrderPayload,
): Promise<OrderApiResponse> {
  try {

    const orderResponse = await mutatePublicData(
      'POST',
      '/budget/create-order',
      payload,
    );
    return orderResponse as OrderApiResponse; // Cast to ensure type compatibility
  } catch (error) {
    console.error('Erro ao criar a encomenda:', error);

    if (error instanceof Error) {
      throw new Error(error.message || 'Falha ao criar a encomenda.');
    } else {
      throw new Error('Um erro desconhecido ocorreu ao criar a encomenda.');
    }
  }
}
