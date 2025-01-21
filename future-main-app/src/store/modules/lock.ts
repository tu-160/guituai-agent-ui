import type { LockInfo } from '#/store';

import { defineStore } from 'pinia';

import { LOCK_INFO_KEY } from '@/enums/cacheEnum';
import { Persistent } from '@/utils/cache/persistent';
import { useUserStore } from './user';
import { unlock } from '@/api/basic/user';

interface LockState {
  lockInfo: Nullable<LockInfo>;
}

export const useLockStore = defineStore({
  id: 'app-lock',
  state: (): LockState => ({
    lockInfo: Persistent.getLocal(LOCK_INFO_KEY),
  }),
  getters: {
    getLockInfo(): Nullable<LockInfo> {
      return this.lockInfo;
    },
  },
  actions: {
    setLockInfo(info: LockInfo) {
      this.lockInfo = Object.assign({}, this.lockInfo, info);
      Persistent.setLocal(LOCK_INFO_KEY, this.lockInfo, true);
    },
    resetLockInfo() {
      Persistent.removeLocal(LOCK_INFO_KEY, true);
      this.lockInfo = null;
    },
    // Unlock
    async unLock(password: string) {
      const userStore = useUserStore();
      const tryLogin = async () => {
        try {
          const account = userStore.getUserInfo?.userAccount;
          const res = await unlock({
            account,
            password,
          });
          if (res) this.resetLockInfo();
          return res;
        } catch (error) {
          return false;
        }
      };
      return await tryLogin();
    },
  },
});
