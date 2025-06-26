import LRUCache from 'lru-cache';

const rateLimit = new LRUCache({
  max: 100, // max 100 users in cache
  ttl: 1000 * 60, // 1 minute
});

export default (config, { strapi }) => {
  return async (ctx, next) => {
    const ip = ctx.request.ip;
    const userLimit = (rateLimit.get(ip) as number[]) || [];
    const now = Date.now();

    // Remove timestamps older than 1 minute
    const validTimestamps = userLimit.filter((timestamp) => timestamp > now - 1000 * 60);

    if (validTimestamps.length >= 10) { // Max 10 requests per minute
      strapi.log.warn(`Rate limit exceeded for IP: ${ip}`);
      return ctx.badRequest('Too many requests, please try again later.');
    }

    validTimestamps.push(now);
    rateLimit.set(ip, validTimestamps);

    strapi.log.info(`Request from IP: ${ip}, count: ${validTimestamps.length}`);
    await next();
  };
};
