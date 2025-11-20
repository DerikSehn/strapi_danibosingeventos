import { factories } from '@strapi/strapi';

export default (factories.createCoreController as any)('api::push-subscription.push-subscription', ({ strapi }) => ({
	async subscribe(ctx) {
			if (!ctx.state.user) {
				return ctx.unauthorized('Login required');
			}
		const body = ctx.request.body || {};
		const { endpoint, keys, userAgent } = body;
		if (!endpoint || !keys?.p256dh || !keys?.auth) {
			return ctx.badRequest('Invalid subscription');
		}

		// Upsert by endpoint
		const existing = await (strapi as any).entityService.findMany('api::push-subscription.push-subscription', {
			filters: { endpoint },
			fields: ['id'],
			limit: 1,
		});

		let saved;
		if (Array.isArray(existing) && existing.length > 0) {
			const id = (existing[0] as any).id;
			saved = await (strapi as any).entityService.update('api::push-subscription.push-subscription', id, {
				data: {
					p256dh: keys.p256dh,
					auth: keys.auth,
					userAgent: userAgent || ctx.request.headers['user-agent'] || '',
			  user: ctx.state.user.id,
				},
			});
		} else {
			saved = await (strapi as any).entityService.create('api::push-subscription.push-subscription', {
				data: {
					endpoint,
					p256dh: keys.p256dh,
					auth: keys.auth,
					userAgent: userAgent || ctx.request.headers['user-agent'] || '',
					createdByRoute: ctx.request.url,
			  user: ctx.state.user.id,
				},
			});
		}

		return ctx.send({ ok: true, id: (saved as any)?.id });
	},

	async publicKey(ctx) {
		const pub = process.env.VAPID_PUBLIC_KEY || '';
		return ctx.send({ publicKey: pub });
	},
}));
