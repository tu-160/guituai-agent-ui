import type { AppRouteRecordRaw } from '@/router/types';

import { computed, toRaw, unref } from 'vue';

import { useMultipleTabStore } from '@/store/modules/multipleTab';

import { uniqBy } from 'lodash-es';

import { useMultipleTabSetting } from '@/hooks/setting/useMultipleTabSetting';

import { useRouter } from 'vue-router';

export function useFrameKeepAlive() {
  const router = useRouter();
  const { currentRoute } = router;
  const { getShowMultipleTab } = useMultipleTabSetting();
  const tabStore = useMultipleTabStore();
  const getFramePages = computed(() => {
    const ret = getAllFramePages(toRaw(router.getRoutes()) as unknown as AppRouteRecordRaw[]) || [];
    return ret;
  });

  const getOpenTabList = computed((): string[] => {
    return tabStore.getTabList.reduce((prev: string[], next) => {
      if (next.meta && Reflect.has(next.meta, 'frameSrc')) {
        prev.push(next.name as string);
      }
      return prev;
    }, []);
  });

  // 从参数(路由对象中)获取iframe页面 meta: 存在frameSrc信息则标识是iframe页面
  function getAllFramePages(routes: AppRouteRecordRaw[]): AppRouteRecordRaw[] {
    let res: AppRouteRecordRaw[] = [];
    for (const route of routes) {
      const { meta: { frameSrc } = {}, children } = route;
      if (frameSrc) {
        res.push(route);
      }
      if (children && children.length) {
        res.push(...getAllFramePages(children));
      }
    }
    res = uniqBy(res, 'name');
    return res;
  }

  // 如果 当前item(当前的iframe菜单信息对象)的那么 == 当前路由的name 显示
  function showIframe(item: AppRouteRecordRaw) {
    return item.name === unref(currentRoute).name;
  }

  function hasRenderFrame(name: string) {
    if (!unref(getShowMultipleTab)) {
      return router.currentRoute.value.name === name;
    }
    return unref(getOpenTabList).includes(name);
  }

  return { hasRenderFrame, getFramePages, showIframe, getAllFramePages };
}
