import type { UserInfo, PermissionInfo } from '#/store';
import type { ErrorMessageMode } from '#/axios';
import { defineStore } from 'pinia';
import { store } from '@/store';
import { PageEnum } from '@/enums/pageEnum';
import { PERMISSIONS_KEY, TOKEN_KEY, USER_INFO_KEY } from '@/enums/cacheEnum';
import { getAuthCache, setAuthCache } from '@/utils/auth';
import { GetUserInfoModel, LoginParams, LoginRequestParams, BackMenu } from '@/api/basic/model/userModel';
import { loginApi, getUserInfo, doLogout } from '@/api/basic/user';
import { useI18n } from '@/hooks/web/useI18n';
import { useMessage } from '@/hooks/web/useMessage';
import { router } from '@/router';
import { usePermissionStore } from '@/store/modules/permission';
import { useBaseStore } from '@/store/modules/base';
import { useOrganizeStore } from '@/store/modules/organize';
import { useAppStore } from '@/store/modules/app';
import { useLocale } from '@/locales/useLocale';
import { RouteRecordRaw } from 'vue-router';
import { PAGE_NOT_FOUND_ROUTE } from '@/router/routes/basic';
import { h } from 'vue';
import { deepMerge } from '@/utils';

interface UserState {
  userInfo: Nullable<UserInfo>;
  token?: string;
  permissionList: PermissionInfo[];
  backMenuList: BackMenu[];
  backRouterList: BackMenu[];
  sessionTimeout?: boolean;
  lastUpdateTime: number;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    // user info
    userInfo: null,
    // token
    token: undefined,
    // permissionList
    permissionList: [],
    backMenuList: [],
    backRouterList: [],
    // Whether the login expired
    sessionTimeout: false,
    // Last fetch time
    lastUpdateTime: 0,
  }),
  getters: {
    getUserInfo(): UserInfo {
      return this.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {};
    },
    getToken(): string {
      return this.token || getAuthCache<string>(TOKEN_KEY);
    },
    getPermissionList(): PermissionInfo[] {
      return this.permissionList.length ? this.permissionList : getAuthCache<PermissionInfo[]>(PERMISSIONS_KEY);
    },
    getBackMenuList(): BackMenu[] {
      return this.backMenuList;
    },
    getBackRouterList(): BackMenu[] {
      return this.backRouterList;
    },
    getSessionTimeout(): boolean {
      return !!this.sessionTimeout;
    },
    getLastUpdateTime(): number {
      return this.lastUpdateTime;
    },
  },
  actions: {
    setToken(info: string | undefined) {
      this.token = info ? info : ''; // for null or undefined value
      setAuthCache(TOKEN_KEY, info);
    },
    updateToken(info: string | undefined) {
      this.lastUpdateTime = 0;
      this.setToken(info);
    },
    setPermissionList(permissionList: PermissionInfo[]) {
      this.permissionList = permissionList;
      setAuthCache(PERMISSIONS_KEY, permissionList);
    },
    setBackMenuList(backMenuList: BackMenu[]) {
      this.backMenuList = backMenuList;
    },
    setBackRouterList(backRouterList: BackMenu[]) {
      this.backRouterList = backRouterList;
    },
    setUserInfo(info: DeepPartial<UserInfo> | null) {
      this.userInfo = info ? deepMerge(this.userInfo || {}, info as any) : info;
      this.lastUpdateTime = new Date().getTime();
      setAuthCache(USER_INFO_KEY, info);
    },
    setSessionTimeout(flag: boolean) {
      this.sessionTimeout = flag;
    },
    resetState() {
      this.userInfo = null;
      this.token = '';
      this.permissionList = [];
      this.backMenuList = [];
      this.backRouterList = [];
      this.sessionTimeout = false;
    },
    /**
     * @description: login
     */
    async login(
      params: LoginParams & {
        goHome?: boolean;
        mode?: ErrorMessageMode;
      },
    ): Promise<UserInfo | null> {
      try {
        const { goHome = false, mode, ...loginParams } = params;
        const loginRequestParams: LoginRequestParams = {
          ...loginParams,
          grant_type: 'password',
        };
        const res = await loginApi(loginRequestParams);
        const { token } = res.data;
        this.setToken(token);
        const baseStore = useBaseStore();
        const organizeStore = useOrganizeStore();
        baseStore.resetState();
        organizeStore.resetState();
        return this.afterLoginAction(goHome);
      } catch (error) {
        return null;
      }
    },
    async afterLoginAction(goHome?: boolean): Promise<UserInfo | null> {
      if (!this.getToken) return null;
      // get user info
      const res = await this.getUserInfoAction();
      const { userInfo } = res as GetUserInfoModel;
      const sessionTimeout = this.sessionTimeout;
      if (sessionTimeout) {
        this.setSessionTimeout(false);
      } else {
        const permissionStore = usePermissionStore();

        if (!permissionStore.isDynamicAddedRoute) {
          const routes = await permissionStore.buildRoutesAction();
          routes.forEach(route => {
            router.addRoute(route as unknown as RouteRecordRaw);
          });
          router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw);
          permissionStore.setDynamicAddedRoute(true);
        }
        goHome && (await router.replace(PageEnum.BASE_HOME));
      }
      return userInfo;
    },
    async getUserInfoAction(): Promise<GetUserInfoModel | null> {
      if (!this.getToken) return null;
      const { createMessage } = useMessage();
      const { t } = useI18n();
      // createMessage.loading({
      //   content: t('sys.app.menuLoading'),
      //   duration: 1,
      // });
      const res = await getUserInfo();
      const { userInfo, sysConfigInfo, menuList = [], permissionList = [] } = res.data;
      if (!menuList.length) {
        this.resetToken();
        return Promise.reject('您的权限不足，请联系管理员');
      }
      const { initLocale, getLocale } = useLocale();
      initLocale(getLocale.value);
      this.setUserInfo(userInfo);
      this.setPermissionList(permissionList);
      this.setBackMenuList(menuList);
      this.setBackRouterList(menuList);
      const appStore = useAppStore();
      appStore.setProjectConfig({ sysConfigInfo });
      return res.data;
    },
    /**
     * @description: logout
     */
    async logout(goLogin = false) {
      if (this.getToken) {
        try {
          await doLogout();
        } catch {
          console.log('注销Token失败');
        }
      }
      this.resetToken();
    },

    resetToken() {
      this.setToken(undefined);
      this.setSessionTimeout(false);
      this.setUserInfo(null);
      router.push(PageEnum.BASE_LOGIN);
    },
    /**
     * @description: Confirm before logging out
     */
    confirmLoginOut() {
      const { createConfirm } = useMessage();
      const { t } = useI18n();
      createConfirm({
        iconType: 'warning',
        title: () => h('span', t('sys.app.logoutTip')),
        content: () => h('span', t('sys.app.logoutMessage')),
        onOk: async () => {
          await this.logout(true);
        },
      });
    },
  },
});

// Need to be used outside the setup
export function useUserStoreWithOut() {
  return useUserStore(store);
}
