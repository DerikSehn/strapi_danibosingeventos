'use strict';

/**
 * A set of functions called "actions" for the `contact` API.
 */

module.exports = {
  send: async (ctx, next) => {
    try {
      const { name, email, message } = ctx.request.body;

      if (!name || !email || !message) {
        return ctx.badRequest('Name, email, and message are required');
      }

      await strapi.plugin('email').service('email').send({
        to: 'danibosing@gmail.com',
        from: `"Formulário de Contato" <${process.env.SMTP_USERNAME}>`,
        replyTo: email,
        subject: `Nova mensagem de ${name} (${email})`,
        text: message,
        html: `<p>${message.replace(/\n/g, '<br>')}</p>`,
      });

      return ctx.send({ message: 'Email sent successfully!' });
    } catch (err) {
      strapi.log.error('Error sending contact email:', err);
      ctx.internalServerError('Error sending email.');
    }
  }
};
