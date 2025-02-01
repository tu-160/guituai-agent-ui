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
      title: t('header.knowledgeBase'),
    },
    name: 'knowledge',
    path: '/',
    children: [
      {
        name: 'Knowledge',
        path: '/knowledge',
        component: () => import('@/views/knowledge/index.vue'),
        meta: {
          affixTab: true,
          icon: 'lucide:area-chart',
          title: t('header.knowledgeBase'),
        },
      },
      {
        name: 'Dataset',
        path: '/knowledge/dataset',
        component: () => import('@/views/knowledge/dataset/index.vue'),
        meta: {
          icon: 'carbon:workspace',
          title: t('knowledgeDetails.dataset'),
        },
      },
      {
        name: 'Testing',
        path: '/knowledge/testing',
        component: () => import('@/views/knowledge/testing/index.vue'),
        meta: {
          icon: 'carbon:workspace',
          title: t('knowledgeDetails.testing'),
        },
      },
      {
        name: 'Configuration',
        path: '/knowledge/configuration',
        component: () => import('@/views/knowledge/configuration/index.vue'),
        meta: {
          icon: 'carbon:workspace',
          title: t('knowledgeDetails.configuration'),
        },
      },
    ],
  },
];

export default routes;
