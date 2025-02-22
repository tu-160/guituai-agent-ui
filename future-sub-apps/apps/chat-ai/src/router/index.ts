import { createRouter, createWebHistory } from 'vue-router';

import { useUserStore } from '@/store/modules/useUserStore';

import mRoutes from './routes/index';

const routes = [{ path: '/', redirect: '/chat' }, ...mRoutes];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 白名单
const whitelist = new Set(['/agreement', '/chat', '/none', '/privacypolicy']);
router.beforeEach(async (to, from, next) => {

  const userStore = useUserStore();
  const isWhitelisted = [...whitelist].some((item) => {
    if (typeof item === 'string') {
      return item === to.path || (item === '/chat' && to.path.startsWith('/chat/'));
    }
    return false;
  });
  // 检查 token 和 userInfo 是否存在
  // const token = userStore.getToken;
  // const userInfo = userStore.getUserInfo;
  // let infoUser = await userStore.getInfoCheck();
  // if (isWhitelisted) {
  //   next();
  // } else {
    if (userStore.getToken == '') {
      userStore.openLoginModal();
      return next(false);
    }
    userStore.getInfoCheck();
    next();
  // }
});

export default router;
