import type { RouteRecordRaw } from 'vue-router';

import AdminBasicLayout from '@/layout/admin-layout/index.vue';

const routes: RouteRecordRaw[] = [
  {
    component: AdminBasicLayout,
    meta: {
      icon: 'lucide:layout-dashboard',
      order: -1,
      title: '知识库',
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
          title: '知识库',
        },
      },
      {
        name: 'Dataset',
        path: '/knowledge/dataset',
        component: () => import('@/views/knowledge/dataset/index.vue'),
        meta: {
          icon: 'carbon:workspace',
          title: '数据集',
        },
      },
      {
        name: 'Testing',
        path: '/knowledge/testing',
        component: () => import('@/views/knowledge/testing/index.vue'),
        meta: {
          icon: 'carbon:workspace',
          title: '检索测试',
        },
      },
      {
        name: 'Configuration',
        path: '/knowledge/configuration',
        component: () => import('@/views/knowledge/configuration/index.vue'),
        meta: {
          icon: 'carbon:workspace',
          title: '配置',
        },
      },
    ],
  },
];

export default routes;
