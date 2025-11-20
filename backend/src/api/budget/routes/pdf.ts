export default {
  routes: [
     {
      method: 'POST',
      path: '/budget/:id/send-quote',
      handler: 'pdf.sendOrderQuote',
      config: {
        policies: [],
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/budget/:id/download-pdf',
      handler: 'pdf.downloadQuotePDF',
      config: {
        policies: [],
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/budget/:id/send-pdf',
      handler: 'pdf.sendQuotePDF',
      config: {
        policies: [],
        auth: false,
      },
    },
  ],
};
