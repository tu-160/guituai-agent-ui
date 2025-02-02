import { C0003, C0004, C0005, C0009, C0011, C0012 } from '@/api';
import { defineStore } from 'pinia';

import { useUserStore } from './useUserStore';

export interface IDialog {
  // 是否处于活动状态
  id: string;
  name: string;
  isActive?: boolean;
  url?: string;
  params?: any;
  icon: string;
  avatar: string;
  description: string;
  recommend?: IDialog[];
  default_question?: string[];
}

export interface ISession {
  // 是否处于活动状态
  id: string;
  name: string;
  isActive?: boolean;
  create_date: number;
}

export interface IDialogAside {
  // 当前使用智能体
  currentDialog?: IDialog;
  // 常规智能体列表
  normalDialogList: IDialog[];
  // 最近使用智能体列表
  recentDialogList: IDialog[];
  // 按钮状态
  toggleBtnStatus: {
    // 会话历史开关按钮状态
    history: boolean;
  };
  // 加载状态
  loadingStatus: {
    dialogLoading: boolean;
    historySessionLoading: boolean;
    sessionLoading: boolean;
  };
  // 历史智能体的会话信息
  sessionList?: ISession[];
  // 当前智能体的会话信息
  currentSession?: ISession;
  // 当前会话对话详情
  conversationList?: any[];
}

export const useDialogAsideStore = defineStore({
  id: 'app-dialog-aside',
  state: (): IDialogAside => ({
    currentDialog: undefined,
    normalDialogList: [],
    recentDialogList: [],
    toggleBtnStatus: {
      history: false,
    },
    loadingStatus: {
      dialogLoading: true,
      historySessionLoading: false,
      sessionLoading: false,
    },
    sessionList: [],
    currentSession: undefined,
    conversationList: [],
  }),
  getters: {},
  actions: {
    // 获取智能体菜单列表
    async getDialogList() {
      this.loadingStatus.dialogLoading = true;
      const userStore = useUserStore();
      const params = {
        searchSize: 5,
      };

      const invokeApis = [C0012(params)];
      if (userStore.token) {
        invokeApis.push(C0009());
      }
      invokeApis.push(C0009());
      const [res0010, res0009] = await Promise.all(invokeApis).finally(() => {
        this.loadingStatus.dialogLoading = false;
      });

      this.normalDialogList = [...res0010.data, ...res0009.data];

      // 添加url参数
      for (const item of this.normalDialogList) { // 初始化公共智能体
        if(item !=null) {
          item.url = `Chat`;
          item.params = { id: item.id };
        }
      }
      if (res0009) { // 初始化私有智能体
        this.recentDialogList = res0009.data;
        // 添加url参数
        for (const item of this.recentDialogList) {
          if(item !=null) {
            item.url = `Chat`;
            item.params = { id: item.id };
          }

        }
      }
    },
    // 触发会话历史开关按钮状态
    triggerHistoryBtn() {
      this.toggleBtnStatus.history = !this.toggleBtnStatus.history;
    },
    // 设置当前使用智能体
    setCurrentDialog(dialog: any) {
      if (this.currentDialog) {
        this.currentDialog.isActive = false;
      }
      this.currentDialog = dialog;
      if (this.currentDialog) {
        this.currentDialog.isActive = true;
      }
      // 移除当前会话信息, 保证第一次会话都是新的会话
      this.currentSession = undefined;
      // 移除对话历史
      this.conversationList = [];
      // 如果左侧栏有智能体列表, 则设置当前智能体为活动状态
      if (this.recentDialogList) {
        const activeDialog = this.recentDialogList.find((item) => item.id === dialog.id);
        if (activeDialog) {
          this.currentDialog = activeDialog;
          activeDialog.isActive = true;
        }
      }
      // 获取历史会话信息
      this.getSessionList();
    },
    // 添加最近使用智能体
    addRecentDialog(dialog?: IDialog) {
      if (!dialog) return;
      const index = this.recentDialogList.findIndex((item) => item.id === dialog.id);
      if (index === -1 && !this.normalDialogList.some((item) => item.id === dialog.id)) {
        // this.recentDialogList.unshift(dialog);
        this.recentDialogList.push(dialog);
      }
    },
    // 移除最近使用智能体
    removeRecentDialog(dialog?: IDialog, isInvokeRemoveApi: boolean = true) {
      if (!dialog) return;
      const index = this.recentDialogList.findIndex((item) => item.id === dialog.id);
      if (dialog.isActive) {
        this.setCurrentDialog(this.normalDialogList[0]);
      }
      if (index !== -1) {
        this.recentDialogList.splice(index, 1);
      }
      // 调用接口进行移除
      if (isInvokeRemoveApi) {
        C0011({ id: dialog.id });
      }
    },
    // 获取历史会话信息
    async getSessionList() {
      if (!this.currentDialog) return;
      this.loadingStatus.historySessionLoading = true;
      const res = await C0004({ dialog_id: this.currentDialog.id }).finally(() => {
        this.loadingStatus.historySessionLoading = false;
      });
      this.sessionList = res.data;
    },
    // 删除会话
    async delSession(sessionInfo?: ISession) {
      if (!sessionInfo) return;
      await C0005({ conversation_id: sessionInfo.id });
      this.sessionList = this.sessionList?.filter((item) => item.id !== sessionInfo.id);
      // 如果当前会话正在对话中, 也需要删除
      if (sessionInfo.id === this.currentSession?.id) {
        this.currentSession = undefined;
        this.conversationList = [];
      }
    },
    // 打开会话
    async openSession(sessionInfo?: ISession) {
      if (!sessionInfo) return;
      this.currentSession = sessionInfo;
      if (!this.sessionList?.find((item) => item.id === sessionInfo.id)) {
        // 历史里没有,代表是新增的, 不需要去对话详情
        return;
      }
      this.conversationList = [];
      this.loadingStatus.sessionLoading = true;
      const res = await C0003({ conversation_id: sessionInfo.id }).finally(() => {
        this.loadingStatus.sessionLoading = false;
      });
      this.conversationList = res.data.message;
    },
    // 添加对话内容
    addConversation(conversation?: { content?: string; role?: string }) {
      if (!conversation) return;
      if (!this.conversationList) {
        this.conversationList = [];
      }
      this.conversationList.push(conversation);
    },
  },
});
