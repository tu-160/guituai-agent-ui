import type { AppRouteRecordRaw } from '@/router/types';

import { PAGE_NOT_FOUND_ROUTE, REDIRECT_ROUTE, COMMON_ROUTE } from '@/router/routes/basic';

import { mainOutRoutes } from './mainOut';
import { PageEnum } from '@/enums/pageEnum';
import { t } from '@/hooks/web/useI18n';

// 根路由
export const RootRoute: AppRouteRecordRaw = {
  path: '/',
  name: 'Root',
  redirect: PageEnum.BASE_HOME,
  meta: {
    title: 'Root',
  },
};

export const LoginRoute: AppRouteRecordRaw = {
  path: '/login',
  name: 'Login',
  component: () => import('@/views/basic/login/Login.vue'),
  meta: {
    title: t('routes.basic.login'),
  },
};
// 表单外链
// export const FormShortLinkRoute: AppRouteRecordRaw = {
//   path: '/formShortLink',
//   name: 'FormShortLink',
//   component: () => import('@/views/common/formShortLink/index.vue'),
//   meta: {
//     title: '',
//   },
// };

// Basic routing without permission
// 未经许可的基本路由
export const basicRoutes = [LoginRoute, RootRoute, ...mainOutRoutes, REDIRECT_ROUTE, PAGE_NOT_FOUND_ROUTE, COMMON_ROUTE];
