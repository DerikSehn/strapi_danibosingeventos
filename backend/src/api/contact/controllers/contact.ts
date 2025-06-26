'use strict';

/**
 * contact controller
 */

export default {
  async send(ctx) {
    const { name, email, message } = ctx.request.body;

    if (!name || !email || !message) {
      return ctx.badRequest('Todos os campos são obrigatórios.');
    }

    try {
      await strapi.plugin('email').service('email').send({
        to: process.env.SMTP_USERNAME || 'danibosing@gmail.com',
        from: `"Formulário de Contato" <${process.env.SMTP_USERNAME}>`,
        replyTo: email,
        subject: `Nova mensagem de ${name} (${email})`,
        text: message,
        html: `<p>${message.replace(/\n/g, '<br>')}</p>`,
      });
      ctx.send({ message: 'Email enviado com sucesso!' });
    } catch (err) {
      ctx.internalServerError('Erro ao enviar o email.', { error: err });
    }
  },
};
