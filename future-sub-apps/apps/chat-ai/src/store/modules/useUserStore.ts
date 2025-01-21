import { infoCheck, infoGet, userLogin } from '@/api/modules/a2';
import { defineStore } from 'pinia';

interface UserState {
  userInfo?: any;
  token?: string;
  permissionList?: Array<any>;
  backMenuList?: Array<any>;
  backRouterList?: Array<any>;
  sessionTimeout?: boolean;
  lastUpdateTime?: number;
  showLoginModal?: boolean; // 新增：控制弹窗显示的状态
  loginLoading?: boolean;
  selectedKeys?: string[];
  pollingInterval?: null | number;
}

interface LoginParams {
  account?: string;
  password?: string;
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
    // 新增：控制弹窗显示的状态
    showLoginModal: false,
    loginLoading: false,
    selectedKeys: ['1'],
    pollingInterval: null,
  }),
  getters: {
    getUserInfo(): any {
      return this.userInfo || JSON.parse(localStorage.getItem('USER_INFO_') || '{}');
    },
    getToken(): string {
      return this.token || localStorage.getItem('TOKEN_') || '';
    },
    getLoginStatus(): string {
      const userInfo = this.userInfo || JSON.parse(localStorage.getItem('USER_INFO_') || '{}');
      const token = this.token || localStorage.getItem('TOKEN_') || '';
      return token && userInfo && userInfo.userId;
    },
  },
  actions: {
    setToken(info: string | undefined) {
      this.token = info || ''; // for null or undefined value
      localStorage.setItem('TOKEN_', info || '');
    },
    setTIMESTAMP() {
      const currentTime: number = Date.now();
      localStorage.setItem('TIMESTAMP', currentTime.toString());
    },
    updateToken(info: string | undefined) {
      this.lastUpdateTime = 0;
      localStorage.setItem('TOKEN_', info || '');
    },
    setPermissionList(permissionList: Array<any>) {
      this.permissionList = permissionList;
      localStorage.setItem('PERMISSIONS_', JSON.stringify(permissionList));
    },
    setBackMenuList(backMenuList: Array<any>) {
      this.backMenuList = backMenuList;
    },
    setBackRouterList(backRouterList: Array<any>) {
      this.backRouterList = backRouterList;
    },
    setUserInfo(info: any) {
      this.userInfo = info ? { ...this.userInfo, ...info } : info;
      this.lastUpdateTime = Date.now();
      localStorage.setItem('USER_INFO_', JSON.stringify(this.userInfo));
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
      this.showLoginModal = false; // 重置弹窗状态
      localStorage.removeItem('TOKEN_');
      localStorage.removeItem('TIMESTAMP');
      localStorage.removeItem('USER_INFO_');
      localStorage.removeItem('PERMISSIONS_');
    },
    // 新增：控制弹窗显示的方法
    openLoginModal() {
      this.showLoginModal = !this.showLoginModal;
      console.log('触发了弹窗打开', this.showLoginModal);
    },
    closeLoginModal() {
      this.showLoginModal = false;
    },
    /* 在这里定义登录方法并储存对应的值*/
    // 登录
    async logIn(params: LoginParams) {
      try {
        // 调用登录接口
        this.loginLoading = true;
        const res = await userLogin(params);
        const token = res.data?.token;
        this.setToken(token);
        this.setTIMESTAMP();
        // 调用获取用户信息接口
        await this.getUseInfo()
          .then(() => {
            this.loginLoading = false;
            window.location.reload();
          })
          .catch((error) => {
            console.error('获取会话信息失败', error);
          });
      } catch (error) {
        console.error('登录失败', error);
        this.loginLoading = false;
      }
    },

    // 获取登录用户信息
    async getUseInfo() {
      const response = await infoGet({});
      const userInfoList = response.data;
      this.setUserInfo(userInfoList);
      return response;
    },

    // 会话校验
    async getInfoCheck() {
      this.stopPolling();
      const response = await infoCheck({})
        .then(() => {
          this.startPolling();
        })
        .catch(() => {
          this.stopPolling();
          this.resetState();
          this.openLoginModal();
        });
      return response;
    },
    // 启动定时器
    startPolling() {
      this.pollingInterval = window.setInterval(() => this.getInfoCheck(), 3_600_000); // 每 1h 查询一次
    },
    // 关闭定时器
    stopPolling() {
      if (this.pollingInterval !== null) {
        window.clearInterval(this.pollingInterval);
        this.pollingInterval = null;
      }
    },

    // 退出登录
    async loginOut() {
      this.resetState();
      setTimeout(() => {
        window.location.reload();
      }, 200);
    },
  },
});

// export function useUserStoreWithOut() {
//   return useUserStore(store);
// }
