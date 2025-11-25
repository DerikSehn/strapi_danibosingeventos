/**
 * budget controller
 */

import { factories } from '@strapi/strapi';
import { calculateBudget } from '../services/calculate-budget';
import { fetchSelectedItemsDetails } from '../services/fetch-items';
import { sendBudgetEmail } from '../services/send-email';
import { sendOrderMail } from '../../order/services/send-order-email';
import { sendOrderQuote } from '../services/send-order-quote';
import { generateQuotePDF } from '../services/generate-quote-pdf';
import { orderPdfSelect, sendQuotePDFEmail } from '../services/send-quote-pdf-email';
import { configureWebPush, sendWebPushNotification } from '../../push-subscription/services/push-service';
import { recordOrderEvent } from '../../order-event/services/record-event';
import { getBudgetFilename } from '../services/filename-helper';

// Helper to match and compute totals for order items
function matchAndSummarize(orderItems: Array<{ id: string | number; quantity: number }>, selectedItemsDetails: any[]) {
  let total = 0;
  const detailed: any[] = [];
  for (const orderItem of orderItems) {
    const detail = selectedItemsDetails.find(
      (d: any) => d.documentId === orderItem.id || d.id === orderItem.id,
    );
    if (!detail) continue;
    const unitPrice = Number(detail.price) || 0;
    const quantity = Number(orderItem.quantity);
    const totalItemPrice = unitPrice * quantity;
    total += totalItemPrice;
    detailed.push({
      itemId: orderItem.id,
      itemName: detail.title || 'Unknown Item',
      itemPrice: unitPrice,
      quantity,
      totalItemPrice,
    });
  }
  return { total, detailed };
}

// Helper: normalize event date string to ISO or null
function normalizeEventDate(input?: string | null): string | null {
  if (!input) return null;
  const d = new Date(input);
  return isNaN(d.getTime()) ? null : d.toISOString();
}

// Helper: group selected variants by product group id
function groupByProductGroup(items: any[]): Record<string, any[]> {
  const grouped: Record<string, any[]> = {};
  for (const v of items || []) {
    const gid = v?.product?.product_group?.id || 'ungrouped';
    if (!grouped[gid]) grouped[gid] = [];
    grouped[gid].push(v);
  }
  return grouped;
}

// Helper: persist derived order_items for a party (festa)
async function createDerivedOrderItemsForParty(opts: {
  strapi: any;
  budgetId: string | number | undefined;
  selectedItemsDetails: any[];
  numberOfPeople: number;
}) {
  const { strapi, budgetId, selectedItemsDetails, numberOfPeople } = opts;
  const grouped = groupByProductGroup(selectedItemsDetails);
  const tasks: Promise<any>[] = [];
  for (const itemsInGroup of Object.values(grouped)) {
    const qtyPerPerson = Number(itemsInGroup?.[0]?.product?.product_group?.quantity_per_people ?? 10);
    const perItemPerPerson = qtyPerPerson / Math.max(itemsInGroup.length, 1);
    const computedQty = Math.max(1, Math.round(perItemPerPerson * Number(numberOfPeople)));
    for (const v of itemsInGroup) {
      tasks.push((async () => {
        try {
          const pv = await strapi.documents('api::product-variant.product-variant').findFirst({
            filters: { $or: [{ documentId: v.documentId }, { id: typeof v.id === 'number' ? v.id : -1 }] },
          });
          const unitPrice = Number(v.price ?? pv?.price ?? 0);
          const unitCost = pv?.cost_price != null ? Number(pv.cost_price) : unitPrice * 0.5;
          const total = unitPrice * computedQty;
          await strapi.documents('api::order-item.order-item').create({
            data: {
              budget: budgetId,
              product_variant: pv?.documentId || pv?.id,
              quantity: computedQty,
              unit_price: unitPrice,
              unit_cost: unitCost,
              total_item_price: total,
              item_name: v.title,
            },
          });
        } catch (e) {
          strapi.log?.warn?.('[Budget/helpers] Failed to create derived order-item', e);
        }
      })());
    }
  }
  await Promise.all(tasks);
}

// Helper: validate minimal order payload
function validateCreateOrderPayload(data: any) {
  const { contactName, contactPhone, orderItems } = data || {};
  if (!contactName || !contactPhone || !Array.isArray(orderItems) || orderItems.length === 0) {
    return 'Missing required fields: contactName, contactPhone, and non-empty orderItems array are required.';
  }
  for (const item of orderItems) {
    if (item?.id === undefined || item?.id === null || typeof item.quantity !== 'number' || item.quantity <= 0) {
      return 'Each order item must have a valid \'id\' and a positive \'quantity\'.';
    }
  }
  return null;
}

// Helper: compute total cost price for an order document
function computeTotalCostPrice(doc: any): number {
  try {
    const items = Array.isArray(doc?.order_items) ? doc.order_items : [];
    let total = 0;
    for (const it of items) {
      const qty = Number(it?.quantity ?? 0) || 0;
      let unitCost: number | null = null;
      if (it?.unit_cost != null && !isNaN(Number(it.unit_cost))) {
        unitCost = Number(it.unit_cost);
      } else if (
        it?.product_variant?.cost_price != null &&
        !isNaN(Number(it.product_variant.cost_price))
      ) {
        unitCost = Number(it.product_variant.cost_price);
      }
      if (unitCost != null) {
        total += unitCost * qty;
      } else {
        // fallback: 50% of total item price
        const totalItem = Number(
          it?.total_item_price ?? Number(it?.unit_price ?? 0) * qty
        ) || 0;
        total += totalItem * 0.5;
      }
    }
    return Number.isFinite(total) ? Number(total.toFixed(2)) : 0;
  } catch {
    return 0;
  }
}

// Helper: fetch variants by IDs (documentId or numeric id) and return a map for quick lookup
async function fetchVariantsByIds(strapi: any, ids: Array<string | number>): Promise<Record<string | number, any>> {
  const unique = Array.from(new Set(ids.filter(Boolean)));
  const map: Record<string | number, any> = {};
  // Strapi documents() findMany with $in on documentId (string) may not accept mixed numeric; fallback to individual fetches
  // We attempt a batched fetch for string documentIds first
  const stringIds = unique.filter(id => typeof id === 'string');
  if (stringIds.length) {
    try {
      const batch = await strapi.documents('api::product-variant.product-variant').findMany({
        filters: { documentId: { $in: stringIds } },
        pageSize: stringIds.length,
      });
      for (const v of Array.isArray(batch) ? batch : []) {
        map[v.documentId] = v;
      }
    } catch { /* ignore batch errors */ }
  }
  // Fetch missing (including numeric ids) individually to guarantee coverage
  await Promise.all(unique.map(async (id) => {
    if (map[id]) return; // already have string doc variant
    try {
      const pv = await strapi.documents('api::product-variant.product-variant').findFirst({
        filters: { $or: [{ documentId: typeof id === 'string' ? id : undefined }, { id: typeof id === 'number' ? id : -1 }] },
      });
      if (pv) { map[id] = pv; }
    } catch { /* ignore */ }
  }));
  return map;
}

// Helper: compute cost price totals (default 50% of unit price when missing) and return map of unit_costs
async function computeOrderCostAndUnitCostMap(strapi: any, detailedItems: any[]): Promise<{ totalCost: number; itemCostMap: Record<string | number, number>; }> {
  let totalCost = 0;
  const itemCostMap: Record<string | number, number> = {};
  if (!Array.isArray(detailedItems) || !detailedItems.length) {
    return { totalCost: 0, itemCostMap };
  }
  const ids = detailedItems.map(d => d.itemId);
  const variants = await fetchVariantsByIds(strapi, ids);
  for (const d of detailedItems) {
    const ref = variants[d.itemId] || variants[String(d.itemId)] || variants[Number(d.itemId)];
    const unitCost = ref?.cost_price != null && !isNaN(Number(ref.cost_price))
      ? Number(ref.cost_price)
      : Number(d.itemPrice) * 0.5;
    const quantity = Number(d.quantity) || 0;
    const totalItemCost = unitCost * quantity;
    itemCostMap[d.itemId] = unitCost;
    totalCost += totalItemCost;
  }
  return { totalCost, itemCostMap };
}

// Helper: persist order item rows (quantities & pricing)
async function persistOrderItems(strapi: any, budgetId: string | number, detailedItems: any[], itemCostMap: Record<string | number, number>) {
  if (!Array.isArray(detailedItems) || !detailedItems.length) return;
  await Promise.all(detailedItems.map(async (d) => {
    try {
      const pv = await strapi.documents('api::product-variant.product-variant').findFirst({
        filters: { $or: [{ documentId: d.itemId }, { id: typeof d.itemId === 'number' ? d.itemId : -1 }] },
      });
      await strapi.documents('api::order-item.order-item').create({
        data: {
          budget: budgetId,
          product_variant: pv?.documentId || pv?.id,
          quantity: d.quantity,
          unit_price: d.itemPrice,
          // use precomputed map or fallback 50%
          unit_cost: itemCostMap[d.itemId] ?? (Number(d.itemPrice) * 0.5),
          total_item_price: d.totalItemPrice,
          item_name: d.itemName,
        },
      });
    } catch (e) {
      strapi.log.warn('[Budget/helpers] Failed to persist order-item', e);
    }
  }));
}

// Helper: fetch & validate selected item details; returns { selectedItemsDetails, detailedForEmail, totalItemPrice }
async function resolveAndSummarizeOrderItems(strapi: any, orderItems: Array<{ id: string | number; quantity: number }>) {
  const itemIdsToFetch = orderItems.map(i => i.id);
  const selectedItemsDetails = await fetchSelectedItemsDetails(strapi, itemIdsToFetch);
  if ((!selectedItemsDetails || selectedItemsDetails.length === 0) && itemIdsToFetch.length > 0) {
    return { error: `None of the provided item IDs could be found or fetched. Requested: ${JSON.stringify(itemIdsToFetch)}` };
  }
  const { total: calculatedTotalItemsPrice, detailed: detailedOrderItemsForEmail } = matchAndSummarize(orderItems, selectedItemsDetails);
  if (detailedOrderItemsForEmail.length === 0 && orderItems.length > 0) {
    return { error: 'No valid items found to process in the order.' };
  }
  return { selectedItemsDetails, detailedOrderItemsForEmail, calculatedTotalItemsPrice };
}

export default factories.createCoreController(
  'api::budget.budget',
  ({ strapi }) => ({
    async getOrders(ctx) {
      try {
        const page = Number(ctx.query.page || 1);
        const pageSize = Number(ctx.query.pageSize || 20);
        const q = (ctx.query as any)?.q;
        const search = typeof q === 'string' ? q.trim() : '';
        const filters: any = { party_type: { id: { $null: true } } };
        // Filter strictly by string status (enum)
        const statusParam = (ctx.query as any)?.status;
        if (typeof statusParam === 'string' && statusParam.length > 0 && statusParam !== 'all') {
          filters.status = statusParam;
        }
        if (search) {
          filters.$or = [
            { eventDetails: { $containsi: search } },
            { title: { $containsi: search } },
            { customerName: { $containsi: search } },
            { customerEmail: { $containsi: search } },
            { customerPhone: { $containsi: search } },
          ];
        }
        const data = await strapi.documents('api::budget.budget').findMany({
          filters,
          sort: 'createdAt:desc',
          populate: {
            product_variants: true,
            party_type: true,
            order_items: {
              populate: {
                product_variant: {
                  populate: {
                    product: { populate: { category: true } },
                    image: true,
                  },
                },
              },
            },

          },
          // order_events: { sort: 'createdAt:desc', page: 1, pageSize: 1 },  page, pageSize,
        });
        // Ensure total_cost_price is present (computed) in the payload
        const withCosts = Array.isArray(data)
          ? data.map((d: any) => ({
            ...d,
            // Always compute to avoid stale stored values
            total_cost_price: computeTotalCostPrice(d),
            // derive SLA days (difference between today start and event date day)
            sla_days: (() => {
              if (!d?.eventDate) return null;
              try {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const ev = new Date(d.eventDate);
                if (isNaN(ev.getTime())) return null;
                ev.setHours(0, 0, 0, 0);
                const diffMs = ev.getTime() - today.getTime();
                return Math.round(diffMs / 86400000);
              } catch { return null; }
            })(),
          }))
          : data;
        return ctx.send({ ok: true, data: withCosts });
      } catch (e) {
        strapi.log.error(String(e))
        return ctx.throw(500, e);
      }
    },

    async getOrderById(ctx) {
      try {
        const id = ctx.params.id;
        const doc = await strapi.documents('api::budget.budget').findFirst({
          filters: { documentId: id },
          populate: {
            product_variants: true,
            order_items: { populate: { product_variant: { populate: { image: true, product: true } } } },
            // order_events: { sort: 'createdAt:asc' }
          },
        });
        if (!doc) { return ctx.notFound(); }
        // Collect all event dates from other orders to disable on the picker
        const peers = await strapi.documents('api::budget.budget').findMany({
          filters: {
            // Only 'festa' (has party type) blocks a date; 'encomenda' (party_type null) does not
            party_type: { id: { $notNull: true } },
            documentId: { $ne: id },
            eventDate: { $notNull: true },
          },
          select: ['id', 'documentId', 'eventDate'],
          sort: 'eventDate:asc',
          page: 1,
          pageSize: 1000,
        });
        const blockedEventDates = Array.isArray(peers)
          ? peers
            .map((p: any) => p?.eventDate)
            .filter((d: any) => typeof d === 'string' && d.length >= 10)
            .map((iso: string) => {
              const d = new Date(iso);
              if (!isNaN(d.getTime())) {
                const y = d.getFullYear();
                const m = String(d.getMonth() + 1).padStart(2, '0');
                const dd = String(d.getDate()).padStart(2, '0');
                return `${y}-${m}-${dd}`;
              }
              // Fallback to first 10 chars if Date parsing fails
              return iso.slice(0, 10);
            })
          : [];
        const data = {
          ...doc,
          // Always compute to avoid stale stored values
          total_cost_price: computeTotalCostPrice(doc),
          blockedEventDates,
        };
        return ctx.send({ ok: true, data });
      } catch (e) { return ctx.throw(500, e); }
    },

    async getBlockedDates(ctx) {
      try {
        // Public/unauthenticated consumers may need this; keep auth optional
        const peers = await strapi.documents('api::budget.budget').findMany({
          filters: {
            // Only block dates when there is a 'festa' scheduled
            party_type: { id: { $notNull: true } },
            eventDate: { $notNull: true },
          },
          select: ['id', 'documentId', 'eventDate'],
          sort: 'eventDate:asc',
          page: 1,
          pageSize: 2000,
        });
        const dates = Array.isArray(peers)
          ? peers
            .map((p: any) => p?.eventDate)
            .filter((d: any) => typeof d === 'string' && d.length >= 10)
            .map((iso: string) => {
              const d = new Date(iso);
              if (!isNaN(d.getTime())) {
                const y = d.getFullYear();
                const m = String(d.getMonth() + 1).padStart(2, '0');
                const dd = String(d.getDate()).padStart(2, '0');
                return `${y}-${m}-${dd}`;
              }
              return iso.slice(0, 10);
            })
          : [];
        return ctx.send({ ok: true, dates });
      } catch (e) { return ctx.throw(500, e); }
    },

    async updateOrder(ctx) {
      try {
        const id = ctx.params.id;

        // Capture pre-change state for event tracking
        const before = await strapi.documents('api::budget.budget').findFirst({
          filters: { documentId: id },
          select: ['status', 'eventDate']
        });
        if (!before) return ctx.notFound();

        // Sanitize and validate input using core Strapi methods
        await this.validateQuery(ctx);
        const sanitizedInput = await this.sanitizeInput(ctx.request.body?.data, ctx);

        // Use Strapi's standard documents API to update - returns the updated document
        const updated = await strapi.documents('api::budget.budget').update({
          documentId: id,
          data: sanitizedInput,
        });

        // Record events based on what changed
        try {
          if (before.status && updated?.status && updated.status !== before.status) {
            await recordOrderEvent(strapi, id, 'status_changed', { from: before.status, to: updated.status });
          }
          if (before.eventDate && updated?.eventDate && updated.eventDate !== before.eventDate) {
            await recordOrderEvent(strapi, id, 'date_changed', { from: before.eventDate, to: updated.eventDate });
          }
        } catch (eventError) {
          strapi.log.warn('[Budget/updateOrder] Failed to record event:', eventError);
        }

        // Sanitize output before sending
        const sanitized = await this.sanitizeOutput(updated, ctx);
        return ctx.send({ data: sanitized });
      } catch (e) {
        strapi.log.error('[Budget/updateOrder] Error:', e);
        throw e;
      }
    },
    async addInternalNote(ctx) {
      try {
        const id = ctx.params.id;
        const { note } = ctx.request.body?.data || {};
        if (typeof note !== 'string' || !note.trim()) {
          return ctx.badRequest('Note text required');
        }
        const doc: any = await strapi.documents('api::budget.budget').findFirst({ filters: { documentId: id }, select: ['internalNotes'] });
        if (!doc) return ctx.notFound();
        const timestamp = new Date().toISOString();
        const header = `[${timestamp}]`;
        const updatedNotes = doc?.internalNotes ? `${doc.internalNotes}\n${header} ${note}` : `${header} ${note}`;
        await (strapi as any).documents('api::budget.budget').update({ documentId: id, data: { internalNotes: updatedNotes } });
        try { await recordOrderEvent(strapi, id, 'note_added', { snippet: note.slice(0, 140) }); } catch { }
        return ctx.send({ ok: true });
      } catch (e) { return ctx.throw(500, e); }
    },
    async getSummary(ctx) {
      try {
        // Only authenticated users should see the dashboard summary
        if (!ctx.state.user) {
          return ctx.unauthorized('Unauthorized');
        }

        // Counts
        const [totalOrders, confirmedOrders, eventsScheduled] = await Promise.all([
          strapi.documents('api::budget.budget').count({
            filters: { party_type: { id: { $null: true } } },
          }) as unknown as Promise<number>,
          strapi.documents('api::budget.budget').count({
            filters: { status: 'confirmado' },
          }) as unknown as Promise<number>,
          strapi.documents('api::budget.budget').count({
            filters: { eventDate: { $gte: new Date().toISOString() } },
          }) as unknown as Promise<number>,
        ]);

        // Revenue last 30 days (orders only)
        const since = new Date();
        since.setDate(since.getDate() - 30);
        const ordersLast30 = await strapi.documents('api::budget.budget').findMany({
          filters: {
            party_type: { id: { $null: true } },
            createdAt: { $gte: since.toISOString() },
          },
          sort: 'createdAt:desc',
          fields: ['totalPrice', 'createdAt'],
          page: 1,
          pageSize: 100,
        });
        const receita30 = (ordersLast30 || []).reduce((acc: number, item: any) => {
          const price = Number(item?.totalPrice ?? 0);
          return acc + (isNaN(price) ? 0 : price);
        }, 0);

        // Recent activity
        const recent = await strapi.documents('api::budget.budget').findMany({
          sort: 'createdAt:desc',
          fields: ['eventDetails', 'totalPrice', 'createdAt', 'eventDate'],
          populate: { party_type: { fields: ['title'] } },
          page: 1,
          pageSize: 5,
        });
        const recentActivity = (recent || []).map((b: any) => {
          const isOrder = !b?.party_type;
          return {
            id: b.documentId || b.id,
            type: isOrder ? 'Novo Pedido' : 'Orçamento',
            description: b?.eventDetails || (isOrder ? 'Pedido direto sem detalhes' : 'Orçamento gerado'),
            time: b?.createdAt,
            amount: Number(b?.totalPrice ?? 0),
            status: isOrder ? (b?.status || 'pendente') : 'concluido',
          };
        });

        return ctx.send({
          ok: true,
          data: {
            stats: { totalOrders, confirmedOrders, eventsScheduled, receita30 },
            recentActivity,
          },
        });
      } catch (error) {
        strapi.log.error('[Budget/getSummary] Error:', error);
        return ctx.throw(500, 'Failed to get summary');
      }
    },
    /**
     * @swagger
     * /api/budget/calculate:
     *   post:
     *     tags:
     *       - Budget
     *     summary: Calculate budget for an event
     *     description: Calculates the total budget for an event based on party type, selected items, and number of people
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - data
     *             properties:
     *               data:
     *                 type: object
     *                 required:
     *                   - partyType
     *                   - selectedItems
     *                   - numberOfPeople
     *                   - contactInfo
     *                 properties:
     *                   partyType:
     *                     type: string
     *                     description: Document ID of the party type
     *                     example: "xyz123abc"
     *                   selectedItems:
     *                     type: array
     *                     items:
     *                       type: string
     *                     description: Array of product variant document IDs
     *                     example: ["item1", "item2", "item3"]
     *                   numberOfPeople:
     *                     type: integer
     *                     minimum: 1
     *                     description: Number of people attending the event
     *                     example: 50
     *                   eventDetails:
     *                     type: string
     *                     description: Additional details about the event
     *                     example: "Festa de aniversário no jardim"
     *                   contactInfo:
     *                     type: object
     *                     required:
     *                       - name
     *                       - phone
     *                     properties:
     *                       name:
     *                         type: string
     *                         description: Customer name
     *                         example: "Maria Silva"
     *                       phone:
     *                         type: string
     *                         description: Customer phone number
     *                         example: "(11) 98765-4321"
     *     responses:
     *       200:
     *         description: Budget calculated successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 documentId:
     *                   type: string
     *                   description: Created budget document ID
     *                 totalPrice:
     *                   type: number
     *                   description: Total budget price
     *                   example: 1250.00
     *                 totalItemPrice:
     *                   type: number
     *                   description: Total price of selected items
     *                   example: 875.00
     *                 waiterPrice:
     *                   type: number
     *                   description: Total cost for waiters
     *                   example: 200.00
     *                 numberOfWaiters:
     *                   type: integer
     *                   description: Number of waiters required
     *                   example: 2
     *       400:
     *         description: Bad request - missing required fields
     *       404:
     *         description: Party type or selected items not found
     *       500:
     *         description: Internal server error
     */
    async getBudgetCalculation(ctx) {
      try {
        const { partyType, selectedItems, numberOfPeople, eventDetails, contactInfo, eventDate } = ctx.request.body.data;


        if (!partyType || !selectedItems || !contactInfo || !numberOfPeople) {
          return ctx.badRequest('Missing required fields');
        }

        const partyTypeDetails = await strapi.documents('api::party-type.party-type').findFirst({
          filters: { documentId: partyType },
          populate: '*',
        });
        if (!partyTypeDetails) {
          return ctx.notFound('Party type not found');
        }


        const selectedItemsDetails = await fetchSelectedItemsDetails(strapi, selectedItems);
        if (!selectedItemsDetails || selectedItemsDetails.length === 0) {
          return ctx.notFound('No selected items found');
        }

        const budgetCalculation = calculateBudget(
          partyTypeDetails as any,
          selectedItemsDetails as any,
          numberOfPeople,
        );
        strapi.log.debug('Budget calculation:', budgetCalculation);

        // Prepare eventDate value (optional)
        const eventDateValue = normalizeEventDate(eventDate);

        // Link selected product variants to this budget for visibility in dashboard
        const variantIds = Array.isArray(selectedItemsDetails)
          ? selectedItemsDetails.map((v: any) => v?.documentId || v?.id).filter(Boolean)
          : [];

        const newBudget = await strapi.documents('api::budget.budget').create({
          data: {
            partyType,
            eventDetails,
            status: 'pendente',
            ...(eventDateValue ? { eventDate: eventDateValue } : {}),
            ...(contactInfo?.name ? { customerName: contactInfo.name } : {}),
            ...(contactInfo?.phone ? { customerPhone: contactInfo.phone } : {}),
            ...(contactInfo?.email ? { customerEmail: contactInfo.email } : {}),
            ...(variantIds.length ? { product_variants: variantIds } : {}),
            ...budgetCalculation,
          },
        }); strapi.log.debug('New budget created:', newBudget);
        try { await recordOrderEvent(strapi, newBudget?.documentId || newBudget?.id, 'created', {}); } catch { }

        // Create derived order_items with computed quantities so they show in dashboard
        try {
          await createDerivedOrderItemsForParty({
            strapi,
            budgetId: newBudget?.documentId || newBudget?.id,
            selectedItemsDetails,
            numberOfPeople,
          });
        } catch (e) {
          strapi.log.debug?.('[Budget/calculate] Skipped creating derived order_items', e);
        }

        strapi.log.info('[Budget Calculate] Starting budget email send process');
        try {
          // ❌ DESATIVADO: Envio de emails foi descontinuado
          // Apenas admins têm acesso aos preços
          // await sendBudgetEmail({
          //   name: contactInfo.name,
          //   phone: contactInfo.phone,
          //   eventDetails,
          //   numberOfPeople,
          //   totalPrice: budgetCalculation.totalPrice,
          //   selectedItemsDetails,
          //   partyTypeDetails,
          //   waiterPrice: budgetCalculation.waiterPrice,
          //   numberOfWaiters: budgetCalculation.numberOfWaiters,
          //   totalItemPrice: budgetCalculation.totalItemPrice,
          //   extraHours: budgetCalculation.extraHours,
          //   extraHourPrice: budgetCalculation.extraHourPrice,
          //   strapi,
          // });
          strapi.log.info('[Budget Calculate] Budget email send disabled');
        } catch (emailError) {
          strapi.log.error('[Budget Calculate] Error sending budget email:', emailError);
          // We still return the budget result even if email fails
        }
        const result = { ...newBudget, success: true }

        // Notify subscribed clients about a new quote
        try {
          configureWebPush();
          const subs = await (strapi as any).documents('api::push-subscription.push-subscription').findMany({
            fields: ['endpoint', 'p256dh', 'auth'],
            pageSize: 100,
          });
          const list = Array.isArray(subs) ? subs : [];
          await Promise.all(list.map((s: any) => sendWebPushNotification(s, {
            type: 'quote_created',
            title: 'Novo orçamento gerado',
            body: `Orçamento criado para ${contactInfo?.name || 'cliente'} (${numberOfPeople} pessoas)`,
            createdAt: new Date().toISOString(),
          })));
        } catch (e) {
          strapi.log.debug?.('Web push notify (quote) failed:', e);
        }

        return result
      } catch (error) {
        ctx.throw(500, error);
      }
    },

    /**
     * @swagger
     * /api/budget/create-order:
     *   post:
     *     tags:
     *       - Budget
     *     summary: Create a direct order without party type
     *     description: Creates an order directly from selected items with quantities, calculates total price and sends notification email
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - data
     *             properties:
     *               data:
     *                 type: object
     *                 required:
     *                   - contactName
     *                   - contactPhone
     *                   - orderItems
     *                 properties:
     *                   contactName:
     *                     type: string
     *                     description: Customer name
     *                     example: "Ana Costa"
     *                   contactPhone:
     *                     type: string
     *                     description: Customer phone number
     *                     example: "(11) 91234-5678"
     *                   contactEmail:
     *                     type: string
     *                     format: email
     *                     description: Customer email (optional)
     *                     example: "ana@email.com"
     *                   orderDetailsNotes:
     *                     type: string
     *                     description: Additional notes about the order
     *                     example: "Entrega no sábado às 14h"
     *                   orderItems:
     *                     type: array
     *                     items:
     *                       type: object
     *                       required:
     *                         - id
     *                         - quantity
     *                       properties:
     *                         id:
     *                           type: string
     *                           description: Product variant document ID
     *                           example: "variant123"
     *                         quantity:
     *                           type: number
     *                           minimum: 1
     *                           description: Quantity of this item
     *                           example: 10
     *                     description: Array of items with quantities
     *                     example: [{"id": "variant1", "quantity": 5}, {"id": "variant2", "quantity": 3}]
     *     responses:
     *       200:
     *         description: Order created successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 documentId:
     *                   type: string
     *                   description: Created budget document ID
     *                 totalPrice:
     *                   type: number
     *                   description: Total order price
     *                   example: 485.50
     *       400:
     *         description: Bad request - missing required fields or invalid data
     *       404:
     *         description: No valid items found
     *       500:
     *         description: Internal server error
     */
    async createOrder(ctx) {
      try {
        // debug logs removed
        const { contactName, contactPhone, contactEmail, orderDetailsNotes, eventDate, orderItems, internalNotes, deliveryAddress, deliveryCity, deliveryZip, source_channel } = ctx.request.body.data;
        const validationError = validateCreateOrderPayload(ctx.request.body.data);
        if (validationError) {
          return ctx.badRequest(validationError);
        }

        const resolved = await resolveAndSummarizeOrderItems(strapi, orderItems);
        if (resolved.error) {
          // differentiate notFound vs badRequest heuristically
          if (resolved.error.startsWith('None of the provided')) {
            return ctx.notFound(resolved.error);
          }
          return ctx.badRequest(resolved.error);
        }
        const { selectedItemsDetails, calculatedTotalItemsPrice, detailedOrderItemsForEmail } = resolved as any;

        strapi.log.debug('[Budget/createOrder] Calculated Total Price:', calculatedTotalItemsPrice);
        strapi.log.debug('[Budget/createOrder] Detailed items for email:', JSON.stringify(detailedOrderItemsForEmail, null, 2));

        // Prepare eventDate value (optional)
        const eventDateValue = normalizeEventDate(eventDate);

        // Link selected product variants to this order so they appear in the dashboard
        const variantIds = Array.isArray(selectedItemsDetails)
          ? selectedItemsDetails.map((v: any) => v?.documentId || v?.id).filter(Boolean)
          : [];

        // Compute total cost price from product variant cost or default 50% of unit price when missing
        const { totalCost, itemCostMap } = await computeOrderCostAndUnitCostMap(strapi, detailedOrderItemsForEmail);

        // Try to attach the "encomenda" party-type (by caption) for classification
        let encomendaPartyTypeId: string | number | null = null;
        try {
          const encomenda = await strapi.documents('api::party-type.party-type').findFirst({
            filters: { caption: 'encomenda' },
            select: ['id', 'documentId', 'caption'],
          });
          if (encomenda) encomendaPartyTypeId = encomenda.documentId || encomenda.id;
        } catch { /* ignore lookup failure */ }

        const newBudget = await strapi.documents('api::budget.budget').create({
          data: {
            partyType: encomendaPartyTypeId, // if null, stays a direct order logically
            eventDetails: orderDetailsNotes,
            totalPrice: calculatedTotalItemsPrice,
            total_cost_price: totalCost,
            status: 'pendente',
            ...(eventDateValue ? { eventDate: eventDateValue } : {}),
            customerName: contactName,
            customerPhone: contactPhone,
            ...(contactEmail ? { customerEmail: contactEmail } : {}),
            ...(internalNotes ? { internalNotes } : {}),
            ...(deliveryAddress ? { deliveryAddress } : {}),
            ...(deliveryCity ? { deliveryCity } : {}),
            ...(deliveryZip ? { deliveryZip } : {}),
            ...(source_channel ? { source_channel } : {}),
            ...(variantIds.length ? { product_variants: variantIds } : {}),
          },
        });
        try { await recordOrderEvent(strapi, newBudget?.documentId || newBudget?.id, 'created', {}); } catch { }
        strapi.log.debug('[Budget/createOrder] New budget created:', newBudget);

        // Persist order item rows with quantities and pricing (extracted helper)
        await persistOrderItems(strapi, newBudget?.documentId || newBudget?.id, detailedOrderItemsForEmail, itemCostMap);

        await sendOrderMail({
          name: contactName,
          phone: contactPhone,
          email: contactEmail,
          eventDetails: orderDetailsNotes,
          totalItemsPrice: calculatedTotalItemsPrice,
          orderItemsDetails: detailedOrderItemsForEmail,
          strapi,
        });

        const result = { ...newBudget, success: true }

        // Notify subscribed clients about a new order
        try {
          configureWebPush();
          const subs = await (strapi as any).documents('api::push-subscription.push-subscription').findMany({
            fields: ['endpoint', 'p256dh', 'auth'],
            pageSize: 100,
          });
          const list = Array.isArray(subs) ? subs : [];
          await Promise.all(list.map((s: any) => sendWebPushNotification(s, {
            type: 'order_created',
            title: 'Novo pedido recebido',
            body: `Pedido de ${contactName} no valor de R$ ${Number(calculatedTotalItemsPrice).toFixed(2)}`,
            createdAt: new Date().toISOString(),
          })));
        } catch (e) {
          strapi.log.debug?.('Web push notify (order) failed:', e);
        }

        return result
      } catch (error) {
        strapi.log.error('[Budget/createOrder] Error processing order:', error);
        if (error.isBoom) {
          return ctx.throw(error.output.statusCode, error);
        }
        return ctx.throw(500, 'An unexpected error occurred while creating the order.');
      }
    },

    /**
     * @swagger
     * /api/budget/test-email:
     *   post:
     *     tags:
     *       - Budget
     *     summary: Test email sending functionality
     *     description: Sends a test budget email to verify email configuration
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - name
     *               - phone
     *               - numberOfPeople
     *             properties:
     *               name:
     *                 type: string
     *                 description: Customer name
     *                 example: "João Silva"
     *               phone:
     *                 type: string
     *                 description: Customer phone number
     *                 example: "(11) 99999-9999"
     *               email:
     *                 type: string
     *                 format: email
     *                 description: Customer email (optional)
     *                 example: "joao@email.com"
     *               numberOfPeople:
     *                 type: integer
     *                 minimum: 1
     *                 description: Number of people for the event
     *                 example: 50
     *               eventDetails:
     *                 type: string
     *                 description: Additional event details
     *                 example: "Festa de aniversário no sábado"
     *     responses:
     *       200:
     *         description: Email sent successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 message:
     *                   type: string
     *                   example: "Test email sent successfully"
     *       400:
     *         description: Bad request - missing required fields
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: "Missing required fields: name, phone, numberOfPeople"
     *       500:
     *         description: Internal server error
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: "Failed to send email"
     */
    async testEmail(ctx) {
      try {
        const { name, phone, email, numberOfPeople, eventDetails } = ctx.request.body;

        // Validate required fields
        if (!name || !phone || !numberOfPeople) {
          return ctx.badRequest('Missing required fields: name, phone, numberOfPeople are required.');
        }

        if (numberOfPeople <= 0) {
          return ctx.badRequest('numberOfPeople must be greater than 0.');
        }

        strapi.log.info('[Test Email] Starting test email process');
        strapi.log.debug('[Test Email] Input data:', { name, phone, email, numberOfPeople, eventDetails });

        // Create mock data for testing
        const mockPartyType = {
          title: 'Festa de Aniversário (Teste)',
          price: 500
        };

        const mockSelectedItems = [
          {
            title: 'Salgadinho Variado (Teste)',
            price: '15.50',
            product: {
              title: 'Salgadinho Variado',
              category: {
                name: 'Salgados'
              },
              product_group: {
                name: 'Salgados Fritos',
                quantity_per_people: 8
              }
            }
          },
          {
            title: 'Refrigerante 2L (Teste)',
            price: '8.00',
            product: {
              title: 'Refrigerante 2L',
              category: {
                name: 'Bebidas'
              },
              product_group: {
                name: 'Bebidas Não Alcoólicas',
                quantity_per_people: 2
              }
            }
          }
        ];

        // Calculate mock values
        const totalItemPrice = mockSelectedItems.reduce((total, item) => {
          const itemPrice = parseFloat(item.price) * numberOfPeople;
          return total + itemPrice;
        }, 0);

        const waiterPrice = numberOfPeople > 30 ? 200 : 150;
        const extraHours = 0;
        const extraHourPrice = 0;
        const totalPrice = totalItemPrice + mockPartyType.price + waiterPrice;

        // ❌ DESATIVADO: Envio de emails foi descontinuado
        // await sendBudgetEmail({
        //   name,
        //   phone,
        //   eventDetails: eventDetails ?? 'Email de teste - funcionalidade de envio',
        //   numberOfPeople,
        //   totalPrice,
        //   selectedItemsDetails: mockSelectedItems,
        //   partyTypeDetails: mockPartyType,
        //   waiterPrice: 0,
        //   numberOfWaiters: 0,
        //   totalItemPrice,
        //   extraHours,
        //   extraHourPrice,
        //   strapi,
        // });

        strapi.log.info('[Test Email] Test email send disabled');

        return ctx.send({
          success: true,
          message: 'Test email sent successfully',
          details: {
            recipient: 'Business contact email',
            totalPrice: totalPrice,
            numberOfPeople: numberOfPeople,
            itemsCount: mockSelectedItems.length
          }
        });

      } catch (error) {
        strapi.log.error('[Test Email] Error sending test email:', error);
        return ctx.throw(500, `Failed to send test email: ${error.message}`);
      }
    },

    /**
     * @swagger
     * /api/budget/{id}/send-quote:
     *   post:
     *     tags:
     *       - Budget
     *     summary: Send negotiation quote for an order
     *     description: Sends a negotiation quote/budget email for a confirmed order with final values and items
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Order/Budget ID (documentId or numeric id)
     *     responses:
     *       200:
     *         description: Quote sent successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 message:
     *                   type: string
     *                   example: "Quote sent successfully"
     *                 orderId:
     *                   type: string
     *       404:
     *         description: Order not found
     *       500:
     *         description: Internal server error
     */
    async sendOrderQuote(ctx) {
      try {
        const { id } = ctx.params;

        if (!id) {
          return ctx.badRequest('Order ID is required');
        }

        strapi.log.info('[Send Order Quote] Received request for order:', { id });

        // ❌ DESATIVADO: Envio de emails foi descontinuado
        // Apenas admins têm acesso aos preços
        // const result = await sendOrderQuote({
        //   orderId: id,
        //   strapi,
        // });

        const result = {
          success: false,
          message: 'Email sending has been disabled. Only admins can access pricing information.',
          orderId: id,
        };

        try {
          await recordOrderEvent(strapi, id, 'quote_send_attempted', { timestamp: new Date().toISOString(), disabled: true });
        } catch (eventError) {
          strapi.log.warn('[Send Order Quote] Failed to record event:', eventError);
        }

        return ctx.send(result);
      } catch (error) {
        strapi.log.error('[Send Order Quote] Error:', error);
        return ctx.throw(500, error.message || 'Failed to send quote');
      }
    },

    /**
     * @swagger
     * /api/budget/{id}/download-pdf:
     *   get:
     *     tags:
     *       - Budget
     *     summary: Download quote PDF
     *     description: Downloads the quote as a PDF file
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Order/Budget ID
     *     responses:
     *       200:
     *         description: PDF file
     *         content:
     *           application/pdf: {}
     *       404:
     *         description: Order not found
     *       500:
     *         description: Internal server error
     */
    async downloadQuotePDF(ctx) {
      try {
        const { id } = ctx.params;

        if (!id) {
          return ctx.badRequest('Order ID is required');
        }

        strapi.log.info('[Download Quote PDF] Requested for order:', { id });

        // Fetch order
        const docId = String(id);
        const order: any = await strapi.documents('api::budget.budget').findFirst({
          filters: { documentId: docId },
          populate: {
            order_items: {
              populate: {
                product_variant: true,
              },
            },
          },
        });

        if (!order) {
          return ctx.notFound('Order not found');
        }

        // Generate PDF
        const pdfBuffer = await generateQuotePDF({
          orderId: id,
          order,
          strapi,
        });

        strapi.log.debug('[Download Quote PDF] PDF generated', {
          orderId: id,
          bufferSize: pdfBuffer.length,
        });

        const filename = await getBudgetFilename(strapi, id);

        // Send as attachment
        ctx.set('Content-Type', 'application/pdf');
        ctx.set('Content-Disposition', `attachment; filename="${filename}"`);
        ctx.body = pdfBuffer;
      } catch (error) {
        strapi.log.error('[Download Quote PDF] Error:', error);
        return ctx.throw(500, error.message || 'Failed to generate PDF');
      }
    },

    /**
     * @swagger
     * /api/budget/{id}/send-pdf:
     *   post:
     *     tags:
     *       - Budget
     *     summary: Send quote PDF via email
     *     description: Generates and sends quote PDF to customer email
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Order/Budget ID
     *     responses:
     *       200:
     *         description: PDF sent successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                 message:
     *                   type: string
     *       404:
     *         description: Order not found
     *       400:
     *         description: Customer email not found
     *       500:
     *         description: Internal server error
     */
    async sendQuotePDF(ctx) {
      try {
        const { id } = ctx.params;

        if (!id) {
          return ctx.badRequest('Order ID is required');
        }

        strapi.log.info('[Send Quote PDF] Requested for order:', { id });

        // Fetch order
        const docId = String(id);
        const order = await strapi.documents('api::budget.budget').findFirst({
          filters: { documentId: docId },
          populate: orderPdfSelect
        });
        if (!order) {
          return ctx.notFound('Order not found');
        }

        if (!order.customerEmail) {
          return ctx.badRequest('Customer email is required to send PDF');
        }

        // Send PDF via email
        const result = await sendQuotePDFEmail({
          orderId: id,
          order,
          strapi,
        });

        try {
          await recordOrderEvent(strapi, id, 'pdf_sent', { timestamp: new Date().toISOString() });
        } catch (eventError) {
          strapi.log.warn('[Send Quote PDF] Failed to record event:', eventError);
        }

        return ctx.send(result);
      } catch (error) {
        strapi.log.error('[Send Quote PDF] Error:', error);
        return ctx.throw(500, error.message || 'Failed to send PDF');
      }
    },

    /**
     * Get available product variants for an order (excluding those already in the order)
     * Endpoint: GET /api/orders/:orderId/available-variants
     * Query params: page, limit, q (search)
     */
    async getAvailableVariants(ctx) {
      try {
        const { orderId } = ctx.params;
        const pageParam = ctx.query.page as string | undefined;
        const limitParam = ctx.query.limit as string | undefined;
        const qParam = ctx.query.q as string | undefined;

        const page = pageParam ? parseInt(pageParam) : 1;
        const limit = limitParam ? parseInt(limitParam) : 12;
        const q = qParam || '';

        if (!orderId) {
          return ctx.badRequest('Order ID is required');
        }

        // Get all product variant IDs from order_items for this order using Documents API
        const orderItems = await strapi.documents('api::order-item.order-item').findMany({
          filters: {
            budget: {
              documentId: orderId
            },
          },
          populate: ['product_variant']
        });

        // Extract documentIds safely
        const usedVariantIds = Array.isArray(orderItems)
          ? orderItems
            .map((oi: any) => oi?.product_variant?.documentId)
            .filter((id: any) => typeof id === 'string')
          : [];

        const filters: any = {
          ...(q ? { title: { $containsi: q } } : {})
        };

        // Only apply $notIn if we have IDs to exclude
        if (usedVariantIds.length > 0) {
          filters.documentId = { $notIn: usedVariantIds };
        }

        const available = await strapi.documents('api::product-variant.product-variant').findMany({
          filters,
          pagination: {
            page,
            pageSize: limit,
          },
          populate: ['image']
        });



        // Get total count for pagination
        const total = await strapi.documents('api::product-variant.product-variant').count({
          filters,
        });

        const pageCount = Math.ceil(total / limit);


        return ctx.send({
          data: available,
          meta: {
            total,
            page,
            limit,
            pageCount,
            hasNext: page < pageCount,
            hasPrev: page > 1,
          },
        });
      } catch (error) {
        strapi.log.error('[getAvailableVariants] Error:', error);
        return ctx.throw(500, error.message || 'Failed to fetch available variants');
      }
    },
  }),
);

