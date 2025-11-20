export async function recordOrderEvent(strapi: any, budgetId: string | number, type: string, payload: any = {}) {
  try {
    await strapi.documents('api::order-event.order-event').create({
      data: { budget: budgetId, type, payload }
    });
  } catch (e) {
    strapi.log?.warn?.('[order-event] failed to record event', e);
  }
}