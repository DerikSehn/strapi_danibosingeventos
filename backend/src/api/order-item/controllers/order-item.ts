/**
 * order-item controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::order-item.order-item', {
  async update(ctx) {
    try {
      const { id } = ctx.params;
      const { data } = ctx.request.body;


      if (!id) {
        ctx.throw(400, 'ID is required');
      }

      if (!data) {
        ctx.throw(400, 'Data is required');
      }


      const result = await strapi.query('api::order-item.order-item').update({
        where: { id: Number(id) },
        data
      });


      ctx.body = { data: result };
    } catch (error: any) {
      console.error('[order-item.update] error:', error.message);
      ctx.throw(400, error.message || 'Update failed');
    }
  },

  async delete(ctx) {
    try {
      const { id } = ctx.params;


      if (!id) {
        ctx.throw(400, 'ID is required');
      }

      // Use Strapi's delete method directly
      await strapi.query('api::order-item.order-item').delete({
        where: { id: Number(id) },
      });


      ctx.body = { data: null };
    } catch (error: any) {
      console.error('[order-item.delete] error:', error.message);
      ctx.throw(400, error.message || 'Delete failed');
    }
  },

  async create(ctx) {
    try {
      const { data } = ctx.request.body;


      if (!data) {
        ctx.throw(400, 'Data is required');
      }

      // Handle array of items
      if (Array.isArray(data)) {
        const results = await Promise.all(
          data.map(item =>
            strapi.documents('api::order-item.order-item').create({
              data: item,
              status: 'published',
            })
          )
        );
        ctx.body = { data: results };
      } else {
        // Single item
        const result = await strapi.documents('api::order-item.order-item').create({
          data,
          status: 'published',
        });
        ctx.body = { data: result };
      }
    } catch (error: any) {
      console.error('[order-item.create] error:', error.message);
      ctx.throw(400, error.message || 'Create failed');
    }
  },
});
