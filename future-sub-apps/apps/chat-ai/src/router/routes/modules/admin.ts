import type { RouteRecordRaw } from 'vue-router';

import AdminBasicLayout from '@/layout/admin-layout/index.vue';

const routes: RouteRecordRaw[] = [
  {
    component: AdminBasicLayout,
    meta: {
      icon: 'lucide:layout-dashboard',
      order: -1,
      title: '智能体创作中心',
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
          title: '我的智能体',
        },
      },
      {
        name: 'Createbot',
        path: '/admin/createbot',
        component: () => import('@/views/admin/createbot/index.vue'),
        meta: {
          icon: 'carbon:workspace',
          title: '智能体创建',
        },
      },
      {
        name: 'Flow',
        path: '/admin/flow',
        component: () => import('@/views/admin/flow/index.vue'),
        meta: {
          icon: 'carbon:workspace',
          title: '高阶智能体',
        },
      },
      {
        name: 'Createflow',
        path: '/admin/createflow',
        component: () => import('@/views/admin/flow/create.vue'),
        meta: {
          icon: 'carbon:workspace',
          title: '高阶智能体创建',
        },
      },
    ],
  },
];

export default routes;
