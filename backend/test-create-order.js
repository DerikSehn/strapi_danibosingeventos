/**
 * Script para testar o endpoint createOrder
 * Execute este arquivo para fazer uma requisição de teste com dados válidos
 */

const testCreateOrderEndpoint = async () => {
  const baseUrl = 'http://localhost:1337/api';
  
  // Primeiro, vamos buscar alguns product-variants para usar IDs reais
  console.log('🔍 Buscando product-variants disponíveis...');
  
  try {
    const variantsResponse = await fetch(`${baseUrl}/product-variants?pagination[pageSize]=1000000`);
    const variantsData = await variantsResponse.json();
    
    console.log('📦 Product-variants encontrados:', variantsData.data?.length || 0);
    
    if (variantsData.data && variantsData.data.length > 0) {
      // Usar IDs reais dos primeiros 3 itens
      const realIds = variantsData.data.slice(0, 3).map(item => item.documentId);
      console.log('🎯 Usando IDs reais:', realIds);
      
      // Fazer a requisição de teste com IDs reais
      const testOrderData = {
        data: {
          contactName: "Ana Costa Silva - TESTE",
          contactPhone: "(11) 91234-5678",
          contactEmail: "ana.costa.teste@email.com",
          orderDetailsNotes: "🧪 TESTE AUTOMATIZADO - Entrega no sábado às 14h. Festa de aniversário. Favor ignorar este pedido.",
          orderItems: [
            {
              id: realIds[0],
              quantity: 10
            },
            ...(realIds[1] ? [{
              id: realIds[1],
              quantity: 15
            }] : []),
            ...(realIds[2] ? [{
              id: realIds[2],
              quantity: 8
            }] : [])
          ]
        }
      };
      
      console.log('📤 Enviando requisição de teste...');
      console.log('📋 Dados do pedido:', JSON.stringify(testOrderData, null, 2));
      
      const response = await fetch(`${baseUrl}/budget/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testOrderData)
      });
      
      const result = await response.json();
      
      console.log('📊 Status da resposta:', response.status);
      console.log('✅ Resultado:', JSON.stringify(result, null, 2));
      
      if (response.ok) {
        console.log('🎉 Teste realizado com sucesso!');
        console.log('💰 Total do pedido:', result.totalPrice);
      } else {
        console.log('❌ Erro no teste:', result);
      }
      
    } else {
      console.log('⚠️  Nenhum product-variant encontrado. Usando IDs de exemplo...');
      
      // Usar IDs de exemplo se não encontrar dados reais
      const testOrderData = {
        data: {
          contactName: "João Silva - TESTE COM IDS EXEMPLO",
          contactPhone: "(11) 98765-4321", 
          contactEmail: "joao.teste@email.com",
          orderDetailsNotes: "🧪 TESTE com IDs de exemplo - pode falhar se os IDs não existirem",
          orderItems: [
            {
              id: "exemplo1",
              quantity: 5
            },
            {
              id: "exemplo2", 
              quantity: 8
            }
          ]
        }
      };
      
      console.log('📤 Enviando requisição de teste com IDs de exemplo...');
      
      const response = await fetch(`${baseUrl}/budget/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testOrderData)
      });
      
      const result = await response.json();
      console.log('📊 Status:', response.status);
      console.log('📋 Resultado:', JSON.stringify(result, null, 2));
    }
    
  } catch (error) {
    console.error('💥 Erro durante o teste:', error);
  }
};

// Exportar para uso em Node.js se necessário
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testCreateOrderEndpoint };
}

// Auto-executar se rodando diretamente
if (typeof window === 'undefined') {
  testCreateOrderEndpoint();
}
