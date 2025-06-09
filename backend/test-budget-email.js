const axios = require('axios');

async function testBudgetEmail() {
  try {

      // Test the actual calculation endpoint
    console.log('\nTesting actual budget calculation endpoint...');
    const baseUrl = 'http://localhost:1337/api';
    const variantsResponse = await axios.get(`${baseUrl}/product-variants?pagination[pageSize]=1000000`);
    const variantsData = variantsResponse.data;
    
    console.log('📦 Product-variants encontrados:', variantsData.data?.length || 0);
    let realIds = [];
    if (variantsData.data && variantsData.data.length > 0) {
      // Usar IDs reais dos primeiros 3 itens
      realIds = variantsData.data.slice(0, 3).map(item => item.documentId);

    }
    const calcResponse = await axios.post('http://localhost:1337/api/budget/calculate', {
      data: {
        partyType: "if8z117zxfgsuqdr5wdglnwz",
        selectedItems: [realIds[0], realIds[1], realIds[2]],
        numberOfPeople: 25,
        eventDetails: "Festa de aniversário teste",
        contactInfo: {
          name: "Maria Santos",
          phone: "(11) 88888-8888"
        }
      }
    });

    console.log('✅ Budget calculation response:', calcResponse.data);
    
  } catch (error) {
    console.error('❌ Budget email test failed:');
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testBudgetEmail();
