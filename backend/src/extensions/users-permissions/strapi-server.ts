// Disable public user registration by overriding the users-permissions plugin
// This removes the /auth/local/register route and forces 403 if somehow called.
export default (plugin: any) => {
  const disable = async (ctx: any) => {
    ctx.forbidden('User registration is disabled');
  };

  if (plugin.controllers?.auth?.register) {
    plugin.controllers.auth.register = disable;
  }

  if (plugin.routes?.['content-api']?.routes) {
    plugin.routes['content-api'].routes = plugin.routes['content-api'].routes.filter(
      (route: any) => !(route.method === 'POST' && route.path === '/auth/local/register')
    );
  }

  return plugin;
};
