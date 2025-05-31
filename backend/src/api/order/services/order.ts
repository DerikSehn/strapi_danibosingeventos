import { factories } from '@strapi/strapi';
import { errors } from '@strapi/utils';

const uid = 'api::order.order';

interface OrderItemInput {
  product_variant: number;
  quantity: number;

}

interface CreateOrderServiceParamsData {
  contact_name: string;
  contact_phone: string;
  contact_email?: string;
  order_details_notes?: string;
  order_items: OrderItemInput[];
  status?: string;
  total_order_price?: number;
}

export default factories.createCoreService(uid as any, ({ strapi }) =>  ({
  async create(params: { data: CreateOrderServiceParamsData; [key: string]: any }) {
    const { data } = params;
    let totalOrderPrice = 0;

    if (!data.order_items || data.order_items.length === 0) {
      throw new errors.ApplicationError('Order must contain at least one item.');
    }

    for (const item of data.order_items) {
      if (item.product_variant && typeof item.quantity === 'number') {
        if (item.quantity <= 0) {
          throw new errors.ApplicationError(
            `Quantity for product variant ID ${item.product_variant} must be positive. Received: ${item.quantity}`
          );
        }

        const productVariant = await strapi.db.query('api::product-variant.product-variant').findOne({
          where: { id: item.product_variant },
          select: ['price'],
        });
        
        if (productVariant && typeof productVariant.price === 'number') {
        
        
          (item as any).unit_price = productVariant.price;
          (item as any).total_item_price = productVariant.price * item.quantity;
          totalOrderPrice += (item as any).total_item_price;
        } else {
          throw new errors.ApplicationError(
            `Product variant with ID ${item.product_variant} not found, or it has an invalid/missing price.`
          );
        }
      } else {
        throw new errors.ApplicationError(
          'Each order item must have a valid product_variant (ID) and quantity (number).'
        );
      }
    }

    data.total_order_price = totalOrderPrice;
    data.status = data.status ?? 'pending';

  
  
    const result = await super.create(params);
    return result;
  },


















}));
