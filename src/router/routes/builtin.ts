import type { CustomRoute } from '@elegant-router/types';
import { layouts, views } from '../elegant/imports';
import { getRoutePath, transformElegantRoutesToVueRoutes } from '../elegant/transform';

export const ROOT_ROUTE: CustomRoute = {
  name: 'root',
  path: '/',
  redirect: getRoutePath(import.meta.env.VITE_ROUTE_HOME) || '/home',
  meta: {
    title: 'root',
    constant: true
  }
};

const NOT_FOUND_ROUTE: CustomRoute = {
  name: 'not-found',
  path: '/:pathMatch(.*)*',
  component: 'layout.blank$view.404',
  meta: {
    title: 'not-found',
    constant: true
  }
};

// const EXCEPTION_ROUTE: CustomRoute[] = [
//   {
//     name: 'exception',
//     path: '/exception',
//     component: 'layout.base',
//     meta: {
//       title: 'exception',
//       i18nKey: 'route.exception',
//       icon: 'ant-design:exception-outlined',
//       order: 7
//     },
//     children: [
//       {
//         name: 'exception_403',
//         path: '/exception/403',
//         component: 'view.403',
//         meta: {
//           title: 'exception_403',
//           i18nKey: 'route.exception_403',
//           icon: 'ic:baseline-block'
//         }
//       },
//       {
//         name: 'exception_404',
//         path: '/exception/404',
//         component: 'view.404',
//         meta: {
//           title: 'exception_404',
//           i18nKey: 'route.exception_404',
//           icon: 'ic:baseline-web-asset-off'
//         }
//       },
//       {
//         name: 'exception_500',
//         path: '/exception/500',
//         component: 'view.500',
//         meta: {
//           title: 'exception_500',
//           i18nKey: 'route.exception_500',
//           icon: 'ic:baseline-wifi-off'
//         }
//       }
//     ]
//   }
// ];

/** builtin routes, it must be constant and setup in vue-router */
const builtinRoutes: CustomRoute[] = [ROOT_ROUTE, NOT_FOUND_ROUTE];

/** create builtin vue routes */
export function createBuiltinVueRoutes() {
  return transformElegantRoutesToVueRoutes(builtinRoutes, layouts, views);
}
