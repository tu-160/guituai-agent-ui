import type { RouteRecordRaw } from 'vue-router';
import { i18n } from "@/locales/i18n";
const t = i18n.global.t;

import AdminBasicLayout from '@/layout/admin-layout/index.vue';

const routes: RouteRecordRaw[] = [
  {
    component: AdminBasicLayout,
    meta: {
      icon: 'lucide:layout-dashboard',
      order: -1,
      title: t('chat_index.agentCenter'),
    },
    name: 'admin',
    path: '/admin',
    children: [
      { // 设置默认子路由重定向到 /admin/mybot
        path: '', // 默认子路由
        redirect: '/admin/mybot'
      },
      {
        name: 'Mybot',
        path: '/admin/mybot',
        component: () => import('@/views/admin/mybot/index.vue'),
        meta: {
          affixTab: true,
          icon: 'lucide:area-chart',
          title: t('chat_index.myagent'),
        },
      },
      {
        name: 'Createbot',
        path: '/admin/createbot',
        component: () => import('@/views/admin/createbot/index.vue'),
        meta: {
          icon: 'carbon:workspace',
          title: t('chat_index.createAgent'),
        },
      },
      {
        name: 'Flow',
        path: '/admin/flow',
        component: () => import('@/views/admin/flow/index.vue'),
        meta: {
          icon: 'carbon:workspace',
          title: t('chat_index.advancedAgentCenter'),
        },
      },
      {
        name: 'Createflow',
        path: '/admin/createflow',
        component: () => import('@/views/admin/flow/create.vue'),
        meta: {
          icon: 'carbon:workspace',
          title: t('chat_index.createAgent'),
        },
      },
    ],
  },
];

export default routes;
