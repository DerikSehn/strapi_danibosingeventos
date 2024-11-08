'use server';

import axios from 'axios';

export async function createAndSendBudget(partyType, selectedItems) {
  try {
    // Montar o orçamento
    const budget = {
      partyType: partyType.name,
      items: Object.entries(selectedItems).map(([id, item]) => ({
        id,
        title: item.title,
        price: item.price,
      })),
      totalPrice: Object.values(selectedItems).reduce(
        (total, item) => total + item.price,
        0,
      ),
    };

    // Enviar para o endpoint Strapi
    const response = await axios.post(
      'http://seu-strapi-url/api/budgets',
      {
        data: budget,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          // Adicione aqui o token de autenticação se necessário
          // 'Authorization': `Bearer ${seu_token_jwt}`
        },
      },
    );

    console.log('Orçamento enviado com sucesso:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Erro ao enviar orçamento:', error);
    return { success: false, error: error.message };
  }
}
