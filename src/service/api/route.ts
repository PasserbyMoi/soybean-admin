import type { LastLevelRouteKey } from '@elegant-router/types';
import type { ElegantConstRoute } from '@elegant-router/vue/index';
import { getUserRoute } from '@/apis/auth';
import type { RouteItem } from '@/apis/auth/type';
import { request } from '../request';

/** get constant routes */
export function fetchGetConstantRoutes() {
  return [];
}

/** get user routes */
export async function fetchGetUserRoutes() {
  const { data: routeItems, error } = await getUserRoute();
  let routes: ElegantConstRoute[] = [];
  if (!error) {
    const userRoutes = convert(routeItems);
    routes = routes.concat(userRoutes);
  }
  const home: LastLevelRouteKey = 'home';
  return { data: { routes, home }, error };
}

function convert(routeItems: RouteItem[]): Api.Route.MenuRoute[] {
  if (routeItems) {
    const routes: Api.Route.MenuRoute[] = routeItems.map(routeItem => {
      const route: Api.Route.MenuRoute = {
        id: routeItem.id,
        name: routeItem.name,
        path: routeItem.path,
        component: routeItem.component,
        meta: {
          title: routeItem.title,
          // i18nKey: 'route.403',
          constant: false,
          keepAlive: routeItem.isCache,
          localIcon: routeItem.icon,
          order: routeItem.sort,
          hideInMenu: routeItem.isHidden
        }
      };
      const revName = routeItem.path.substring(1).split('/').join('_').toLowerCase();
      let revComponent: string;
      if (routeItem.isExternal) {
        revComponent = 'view.iframe-page';
        if (route.meta) {
          route.meta.href = routeItem.path;
        }
      } else if (routeItem.path.substring(1).includes('/')) {
        revComponent = `view.${revName}`;
      } else {
        revComponent = 'layout.base';
      }
      route.name = revName;
      route.component = revComponent;

      if (routeItem.children) {
        route.children = convert(routeItem.children);
      }
      return route;
    });
    return routes;
  }
  return [];
}

/**
 * whether the route is exist
 *
 * @param routeName route name
 */
export function fetchIsRouteExist(routeName: string) {
  return request<boolean>({ url: '/route/isRouteExist', params: { routeName } });
}
