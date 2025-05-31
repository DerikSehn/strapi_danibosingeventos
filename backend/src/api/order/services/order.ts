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
    strapi.log.info('[Order Service] Attempting to create order with params:', JSON.stringify(params, null, 2));
    const { data } = params;
    let totalOrderPrice = 0;

    if (!data.order_items || data.order_items.length === 0) {
      strapi.log.error('[Order Service] Validation Error: Order must contain at least one item.');
      throw new errors.ApplicationError('Order must contain at least one item.');
    }
    strapi.log.info('[Order Service] Passed order_items presence validation.');

    for (const item of data.order_items) {
      strapi.log.info(`[Order Service] Processing order_item: ${JSON.stringify(item)}`);
      if (item.product_variant && typeof item.quantity === 'number') {
        if (item.quantity <= 0) {
          strapi.log.error(`[Order Service] Validation Error: Quantity for product variant ID ${item.product_variant} must be positive. Received: ${item.quantity}`);
          throw new errors.ApplicationError(
            `Quantity for product variant ID ${item.product_variant} must be positive. Received: ${item.quantity}`
          );
        }
        strapi.log.info(`[Order Service] Product variant ID ${item.product_variant} quantity validation passed.`);

        const productVariant = await strapi.db.query('api::product-variant.product-variant').findOne({
          where: { id: item.product_variant },
          select: ['price'],
        });
        strapi.log.info(`[Order Service] Fetched product_variant ${item.product_variant}: ${JSON.stringify(productVariant)}`);
        
        if (productVariant && typeof productVariant.price === 'number') {
          (item as any).unit_price = productVariant.price;
          (item as any).total_item_price = productVariant.price * item.quantity;
          totalOrderPrice += (item as any).total_item_price;
          strapi.log.info(`[Order Service] Calculated prices for item ${item.product_variant}: unit_price=${(item as any).unit_price}, total_item_price=${(item as any).total_item_price}. Current totalOrderPrice=${totalOrderPrice}`);
        } else {
          strapi.log.error(`[Order Service] Validation Error: Product variant with ID ${item.product_variant} not found, or it has an invalid/missing price.`);
          throw new errors.ApplicationError(
            `Product variant with ID ${item.product_variant} not found, or it has an invalid/missing price.`
          );
        }
      } else {
        strapi.log.error('[Order Service] Validation Error: Each order item must have a valid product_variant (ID) and quantity (number). Item:', JSON.stringify(item));
        throw new errors.ApplicationError(
          'Each order item must have a valid product_variant (ID) and quantity (number).'
        );
      }
    }

    // Assign calculated total and default status to the data object that will be passed to super.create
    const processedData = {
      ...data,
      total_order_price: totalOrderPrice,
      status: data.status ?? 'pending',
    };
    strapi.log.info(`[Order Service] Final calculated total_order_price: ${processedData.total_order_price}, status: ${processedData.status}`);
  
    strapi.log.info('[Order Service] Calling super.create with processed data:', JSON.stringify(processedData, null, 2));
    try {
      // Pass the modified data directly to super.create
      const result = await super.create({ ...params, data: processedData }); 
      strapi.log.info('[Order Service] Order created successfully:', JSON.stringify(result, null, 2));
      return result;
    } catch (error) {
      strapi.log.error('[Order Service] Error during super.create:', error);
      throw error; // Re-throw the error to be caught by Strapi's error handler
    }
  },

}));
