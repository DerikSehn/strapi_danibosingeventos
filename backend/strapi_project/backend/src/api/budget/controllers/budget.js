const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::budget.budget', ({ strapi }) => ({
    async create(ctx) {
        try {
            const { data } = ctx.request.body;

            // Salvar o orçamento no banco de dados
            const budget = await strapi.service('api::budget.budget').create({ data });

            // Enviar o email com os detalhes do orçamento
            await strapi.plugins['email'].services.email.send({
                to: 'destinatario@example.com', // Substitua pelo email do destinatário
                from: strapi.config.get('plugin.email.settings.defaultFrom'),
                subject: 'Detalhes do Orçamento',
                text: `Seu orçamento foi recebido com sucesso. Total: ${data.totalPrice}`,
                html: `<h1>Detalhes do Orçamento</h1>
               <p>Tipo de Festa: ${data.partyType}</p>
               <p>Total: ${data.totalPrice}</p>
               <ul>
                 ${data.items.map(item => `<li>${item.title}: ${item.price}</li>`).join('')}
               </ul>`,
            });

            ctx.body = { success: true, budget };
        } catch (err) {
            ctx.body = { success: false, error: err.message };
            ctx.status = 500;
        }
    },
}));