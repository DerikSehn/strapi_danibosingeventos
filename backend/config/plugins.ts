module.exports = ({ env }) => ({
  email: {
    provider: 'nodemailer',
    providerOptions: {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: env('SMTP_EMAIL'),
        pass: env('SMTP_EMAIL_PASS'),
      },
    },
    settings: {
      defaultFrom: env('SMTP_EMAIL'),
      defaultReplyTo: env('SMTP_EMAIL'),
    },
  },
});
