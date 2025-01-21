/**
The routing of this file will not show the layout.
It is an independent new page.
the contents of the file still need to log in to access
 */
import type { AppRouteModule } from '@/router/types';

// test
// http:ip:port/main-out
export const mainOutRoutes: AppRouteModule[] = [
  {
    path: '/sso',
    component: () => import('@/views/basic/login/sso-redirect.vue'),
    name: 'sso',
    meta: {
      title: 'sso',
      hideMenu: true,
      ignoreAuth: true,
    },
  }
];

export const mainOutRouteNames = mainOutRoutes.map(item => item.name);
