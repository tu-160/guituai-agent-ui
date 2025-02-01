import type { RouteRecordRaw } from 'vue-router';
import { i18n } from "@/locales/i18n";
const t = i18n.global.t;

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:layout-dashboard',
      order: -1,
      title: 'protocolPolicy',
    },
    name: 'protocolPolicy',
    path: '/',
    children: [
      {
        name: 'agreement',
        path: '/agreement',
        component: () => import('@/views/common/protocolPolicy/agreement.vue'),
        meta: {
          affixTab: true,
          icon: 'lucide:area-chart',
          title: '用户协议',
        },
      },
      {
        name: 'privacypolicy',
        path: '/privacypolicy',
        component: () => import('@/views/common/protocolPolicy/privacypolicy.vue'),
        meta: {
          icon: 'carbon:workspace',
          title: '隐私政策',
        },
      },
    ],
  },
];

export default routes;
