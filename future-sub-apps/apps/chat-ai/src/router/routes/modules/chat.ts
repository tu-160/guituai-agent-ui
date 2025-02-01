import type { RouteRecordRaw } from 'vue-router';

import ChatBasicLayout from '@/layout/chat-layout/index.vue';
import {i18n} from "@/locales/i18n";

const routes: RouteRecordRaw[] = [
  {
    component: ChatBasicLayout,
    meta: {
      icon: 'lucide:layout-dashboard',
      order: -1,
      title: i18n.global.t('application.title'),
    },
    name: 'Chat-ai',
    path: '/',
    children: [
      {
        name: 'Chat',
        path: 'chat/:id*',
        component: () => import('@/views/chat/index.vue'),
        meta: {
          affixTab: true,
          icon: 'lucide:area-chart',
          title: i18n.global.t('header.chat'),
        },
      },
      {
        name: 'Square',
        path: 'square',
        component: () => import('@/views/chat/square/index.vue'),
        meta: {
          icon: 'carbon:workspace',
          title: i18n.global.t('chat_index.agentPlaza'),
        },
      },
      {
        name: 'Test',
        path: '/test',
        component: () => import('@/views/test1/test.vue'),
        meta: {
          icon: 'carbon:workspace',
          title: i18n.global.t('knowledgeDetails.testingLabel'),
        },
      },
    ],
  },
];

export default routes;
