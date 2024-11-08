const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::email.email', ({ strapi }) => ({
    async sendEmail(ctx) {
        try {
            // Obtenha os dados do corpo da requisição
            const { to, subject, text, html } = ctx.request.body;

            // Envie o email usando o serviço de email do Strapi
            await strapi.plugins['email'].services.email.send({
                to,
                subject,
                text,
                html,
            });

            // Retorne uma resposta de sucesso
            ctx.body = { message: 'Email enviado com sucesso' };
        } catch (err) {
            // Em caso de erro, retorne uma resposta de erro
            ctx.body = { error: err.message };
            ctx.status = 500;
        }
    },
}));