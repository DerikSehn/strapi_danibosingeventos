'use server';
import { mutatePublicData } from 'data/services/mutate-public-data';
import type { OrderPayload, OrderApiResponse } from '../../types';

export async function createOrder(
  payload: OrderPayload,
): Promise<OrderApiResponse> {
  try {
    const orderResponse = await mutatePublicData(
      'POST',
      '/api/budget/create-order',
      payload,
    );
    // Normalize backend response to expected shape
    const anyResp: any = orderResponse;
    if (anyResp && anyResp.data && anyResp.data.id) {
      return anyResp as OrderApiResponse;
    }
    if (anyResp && (anyResp.id || anyResp.documentId)) {
      return { data: { id: anyResp.id ?? 0, attributes: {} } } as unknown as OrderApiResponse;
    }
    if (anyResp && anyResp.error) {
      throw new Error(anyResp.error?.message || 'Falha ao criar a encomenda.');
    }
    // Fallback
    return anyResp as OrderApiResponse;
  } catch (error) {
    console.error('Erro ao criar a encomenda:', error);

    if (error instanceof Error) {
      throw new Error(error.message || 'Falha ao criar a encomenda.');
    } else {
      throw new Error('Um erro desconhecido ocorreu ao criar a encomenda.');
    }
  }
}
