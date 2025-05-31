import { Core } from "@strapi/strapi";

/**
 * Policy to check if the authenticated user belongs to a tenant
 * and potentially injects tenant info into the context state.
 * NOTE: This is a basic example and might need adjustments based on your exact User-Tenant relationship.
 */
export default async (policyContext, config, { strapi }: { strapi: Core.Strapi }) => {
  console.log('isOwnerTenant: Policy invoked.');

  const user = policyContext.state.user;

  // 1. Check if user is authenticated (redundant if isAuthenticated runs first, but good practice)
  if (!user) {
    console.log('isOwnerTenant: User not authenticated.');
    strapi.log.warn('isOwnerTenant: User not authenticated.');
    return false;
  }

  console.log(`isOwnerTenant: Authenticated user ID: ${user.id}`);

  try {
    // 2. Fetch the user with their tenant relation
    console.log('isOwnerTenant: Fetching user with tenant relation...');
    const userWithTenant = await strapi.documents(
      'plugin::users-permissions.user').findFirst(
        {
            filters: { id: user.id },
            populate: ['tenants'], 
            fields: ['id', 'username', 'email'], 
        }
      );

    console.log('isOwnerTenant: User fetched:', userWithTenant);

    // 3. Check if the tenant exists for the user
    if (userWithTenant?.tenants) {
      const tenantId = userWithTenant.tenants?.[0].id;
      console.log(`isOwnerTenant: User ${user.id} belongs to tenant ${tenantId}.`);
      strapi.log.debug(`isOwnerTenant: User ${user.id} belongs to tenant ${tenantId}.`);

      // 4. (Optional, but recommended) Inject tenantId into state for easier access in controllers/services
      policyContext.state.tenantId = tenantId;

      console.log(`isOwnerTenant: Injected tenantId ${tenantId} into policyContext.state.`);
      return true; // User belongs to a tenant, allow access
    } else {
      console.log(`isOwnerTenant: User ${user.id} does not belong to a tenant.`);
      strapi.log.warn(`isOwnerTenant: User ${user.id} does not belong to a tenant.`);
      return false; // User does not have a tenant, deny access
    }
  } catch (error) {
    console.log('isOwnerTenant: Error occurred:', error);
    strapi.log.error('Error in isOwnerTenant policy:', error);
    return false; // Internal error, deny access
  }
};