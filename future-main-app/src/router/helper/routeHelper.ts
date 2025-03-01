import type { AppRouteModule, AppRouteRecordRaw } from '@/router/types';
import type { Router, RouteRecordNormalized } from 'vue-router';
import { PageEnum } from '@/enums/pageEnum';

import { getParentLayout, LAYOUT, EXCEPTION_COMPONENT } from '@/router/constant';
import { cloneDeep, omit } from 'lodash-es';
import { warn } from '@/utils/log';
import { createRouter, createWebHashHistory } from 'vue-router';
import { defineComponent, defineAsyncComponent, h } from 'vue';
import { useGlobSetting } from '@/hooks/setting';
import { getToken } from '@/utils/auth';
import { BackMenu } from '@/api/basic/model/userModel';

export type LayoutMapKey = 'LAYOUT';
const IFRAME = () => import('@/views/basic/iframe/FrameBlank.vue');
// const ONLINE_MODEL = () => import('@/views/common/dynamicModel/index.vue');
// const ONLINE_DICT = () => import('@/views/common/dynamicDictionary/index.vue');
// const ONLINE_REPORT = () => import('@/views/common/dynamicDataReport/index.vue');
// const ONLINE_PORTAL = () => import('@/views/common/dynamicPortal/index.vue');

const LayoutMap = new Map<string, () => Promise<typeof import('*.vue')>>();

LayoutMap.set('LAYOUT', LAYOUT);
LayoutMap.set('IFRAME', IFRAME);
// LayoutMap.set('ONLINE_MODEL', ONLINE_MODEL);
// LayoutMap.set('ONLINE_DICT', ONLINE_DICT);
// LayoutMap.set('ONLINE_REPORT', ONLINE_REPORT);
// LayoutMap.set('ONLINE_PORTAL', ONLINE_PORTAL);

let dynamicViewsModules: Record<string, () => Promise<Recordable>>;

/**
 * 将指定组件设置自定义名称
 *
 * @param {String} name 组件自定义名称
 * @param {AsyncComponent} component
 * @return {Component}
 */
function createCustomComponent(customName, asyncComponent) {
  return defineComponent({
    name: customName,
    setup() {
      return () => h(asyncComponent);
    },
  });
}

// Dynamic introduction
function asyncImportRoute(routes: AppRouteRecordRaw[] | undefined) {
  dynamicViewsModules = dynamicViewsModules || import.meta.glob('../../views/**/*.{vue,tsx}');
  if (!routes) return;
  routes.forEach(item => {
    if (!item.component && item.meta?.frameSrc) {
      item.component = 'IFRAME';
    }
    const { component, name } = item;
    const { children } = item;
    if (component) {
      const layoutFound = LayoutMap.get(component.toUpperCase());
      if (layoutFound) {
        item.component = ['LAYOUT', 'IFRAME'].includes(component) ? layoutFound : createCustomComponent(name, defineAsyncComponent(layoutFound));
      } else {
        item.component = dynamicImport(dynamicViewsModules, component as string);
      }
    } else if (name) {
      item.component = getParentLayout();
    }
    children && asyncImportRoute(children);
  });
}

function dynamicImport(dynamicViewsModules: Record<string, () => Promise<Recordable>>, component: string) {
  const keys = Object.keys(dynamicViewsModules);

  const matchKeys = keys.filter(key => {
    const k = key.replace('../../views', '');
    const startFlag = component.startsWith('/');
    const endFlag = component.endsWith('.vue') || component.endsWith('.tsx');
    const startIndex = startFlag ? 0 : 1;
    const lastIndex = endFlag ? k.length : k.lastIndexOf('.');
    return k.substring(startIndex, lastIndex) === component || k.substring(startIndex, lastIndex) === component + '/index';
  });
  if (matchKeys?.length === 1) {
    const matchKey = matchKeys[0];
    return dynamicViewsModules[matchKey];
  } else if (matchKeys?.length > 1) {
    warn(
      'Please do not create `.vue` and `.TSX` files with the same file name in the same hierarchical directory under the views folder. This will cause dynamic introduction failure',
    );
    return;
  } else {
    // warn('在src/views/下找不到`' + component + '.vue` 或 `' + component + '.tsx`, 请自行创建!');
    return EXCEPTION_COMPONENT;
  }
}

// Turn background objects into routing objects
// 将背景对象变成路由对象
export function transformObjToRoute<T = AppRouteModule>(routerList: BackMenu[]): T[] {
  const globSetting = useGlobSetting();
  let routeList: AppRouteModule[] = [];
  function getRouteList(routerList: any) {
    for (let i = 0; i < routerList.length; i++) {
      const e = routerList[i];
      const name = e.enCode.replace(/\./g, '-');
      if (e.type == 0 && e.hasChildren && e.children.length) {
        getRouteList(e.children);
      }
      if (e.type == 1) {
        e.path = '/' + e.enCode;
        if (e.hasChildren && e.children.length) {
          getRouteList(e.children);
        }
      }
      if (e.type == 2) {
        let path = e.urlAddress;
        if (path.indexOf('?') > -1) path = path.split('?')[0];
        e.path = '/' + e.urlAddress;
        const route: AppRouteModule = {
          path: '/' + path,
          component: path,
          name: name,
          meta: {
            title: 'routes.' + name,
            defaultTitle: e.fullName,
            icon: e.icon,
            modelId: e.id,
          },
        };
        routeList.push(route);
      }
      // 表单、字典、报表、门户、流程
      if ([3, 4, 5, 8, 9].indexOf(e.type) > -1) {
        let propertyJson = e.propertyJson ? JSON.parse(e.propertyJson) : null,
          relationId = '',
          isTree = 0,
          component = '';
        if (propertyJson) {
          relationId = propertyJson.moduleId || '';
          isTree = propertyJson.isTree || 0;
        }
        if (e.type == 3 || e.type == 9) {
          component = 'ONLINE_MODEL';
        } else if (e.type == 4) {
          component = 'ONLINE_DICT';
        } else if (e.type == 5) {
          component = 'ONLINE_REPORT';
        } else {
          component = 'ONLINE_PORTAL';
        }
        const componentName = component + '_' + name;
        e.path = '/' + e.urlAddress;
        const route: AppRouteModule = {
          path: '/' + e.urlAddress,
          component: component,
          name: componentName,
          meta: {
            title: 'routes.' + e.enCode.replaceAll(/\./g, '-'),
            defaultTitle: e.fullName,
            icon: e.icon,
            modelId: e.id,
            type: e.type,
            relationId,
            isTree,
          },
        };
        routeList.push(route);
      }
      // 大屏
      if (e.type == 6) {
        let propertyJson = e.propertyJson ? JSON.parse(e.propertyJson) : null,
          moduleId = '';
        if (propertyJson) moduleId = propertyJson.moduleId || '';
        e.path = `${globSetting.dataVUrl}view/${moduleId}?token=${getToken()}`;
      }
      // 外链
      if (e.type == 7) {
        const path = e.urlAddress.replace(/\${dataV}/g, globSetting.dataVUrl).replace(/\${futureToken}/g, getToken());
        if (e.linkTarget === '_self') {
          e.path = '/' + e.enCode;
          const route: AppRouteModule = {
            path: '/' + e.enCode,
            component: 'IFRAME',
            name: name,
            meta: {
              title: 'routes.' + name,
              defaultTitle: e.fullName,
              icon: e.icon,
              modelId: e.id,
              frameSrc: path,
            },
          };
          routeList.push(route);
        } else {
          e.path = path;
          const route: AppRouteModule = {
            path: path,
            component: 'IFRAME',
            name: name,
            meta: {
              title: 'routes.' + name,
              defaultTitle: e.fullName,
              icon: e.icon,
              modelId: e.id,
            },
          };
          routeList.push(route);
        }
      }
    }
  }
  getRouteList(routerList);
  asyncImportRoute(routeList);
  const RootRoute: AppRouteRecordRaw = {
    path: '/asyncRoutes',
    name: 'asyncRoutes',
    redirect: PageEnum.BASE_HOME,
    component: LAYOUT,
    meta: {
      title: 'asyncRoutes',
    },
    children: routeList,
  };
  const asyncRouteList: AppRouteRecordRaw[] = [RootRoute];

  return asyncRouteList as unknown as T[];
}

/**
 * Convert multi-level routing to level 2 routing
 * 将多级路由转换为 2 级路由
 */
export function flatMultiLevelRoutes(routeModules: AppRouteModule[]) {
  const modules: AppRouteModule[] = cloneDeep(routeModules);

  for (let index = 0; index < modules.length; index++) {
    const routeModule = modules[index];
    // 判断级别是否 多级 路由
    if (!isMultipleRoute(routeModule)) {
      // 声明终止当前循环， 即跳过此次循环，进行下一轮
      continue;
    }
    // 路由等级提升
    promoteRouteLevel(routeModule);
  }
  return modules;
}

// Routing level upgrade
// 路由等级提升
function promoteRouteLevel(routeModule: AppRouteModule) {
  // Use vue-router to splice menus
  // 使用vue-router拼接菜单
  // createRouter 创建一个可以被 Vue 应用程序使用的路由实例
  let router: Router | null = createRouter({
    routes: [routeModule as unknown as RouteRecordNormalized],
    history: createWebHashHistory(),
  });
  // getRoutes： 获取所有 路由记录的完整列表。
  const routes = router.getRoutes();
  // 将所有子路由添加到二级路由
  addToChildren(routes, routeModule.children || [], routeModule);
  router = null;

  // omit lodash的函数 对传入的item对象的children进行删除
  routeModule.children = routeModule.children?.map(item => omit(item, 'children'));
}

// Add all sub-routes to the secondary route
// 将所有子路由添加到二级路由
function addToChildren(routes: RouteRecordNormalized[], children: AppRouteRecordRaw[], routeModule: AppRouteModule) {
  for (let index = 0; index < children.length; index++) {
    const child = children[index];
    const route = routes.find(item => item.name === child.name);
    if (!route) {
      continue;
    }
    routeModule.children = routeModule.children || [];
    if (!routeModule.children.find(item => item.name === route.name)) {
      routeModule.children?.push(route as unknown as AppRouteModule);
    }
    if (child.children?.length) {
      addToChildren(routes, child.children, routeModule);
    }
  }
}

// Determine whether the level exceeds 2 levels
// 判断级别是否超过2级
function isMultipleRoute(routeModule: AppRouteModule) {
  // Reflect.has 与 in 操作符 相同, 用于检查一个对象(包括它原型链上)是否拥有某个属性
  if (!routeModule || !Reflect.has(routeModule, 'children') || !routeModule.children?.length) {
    return false;
  }

  const children = routeModule.children;

  let flag = false;
  for (let index = 0; index < children.length; index++) {
    const child = children[index];
    if (child.children?.length) {
      flag = true;
      break;
    }
  }
  return flag;
}
