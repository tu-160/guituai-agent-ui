<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" title="站内消息" width="340px" class="full-drawer message-drawer" :closeFunc="handleClose">
     无
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { useModal } from '@/components/Modal';
  import { BasicDrawer, useDrawerInner } from '@/components/Drawer';
  import { ScrollContainer, ScrollActionType } from '@/components/Container';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useI18n } from '@/hooks/web/useI18n';
  import { reactive, toRefs, nextTick, ref, unref } from 'vue';
  import { useWebSocket } from '@/hooks/web/useWebSocket';
  import { useRouter } from 'vue-router';
  import { encryptByBase64 } from '@/utils/cipher';
  import { useBaseStore } from '@/store/modules/base';
  import { useDebounceFn } from '@vueuse/core';

  interface State {
    finish: boolean;
    loading: boolean;
    listQuery: any;
    list: any[];
    type: string;
    isNoRead: boolean;
    messageType: any[];
  }
  const emit = defineEmits(['register', 'readMsg']);
  const router = useRouter();
  const { createMessage, createConfirm } = useMessage();
  const { t } = useI18n();
  const [registerDetail, { openModal: openDetailModal }] = useModal();
  const [registerScheduleDetail, { openModal: openScheduleDetailModal }] = useModal();
  const [registerDrawer, { changeLoading, closeDrawer, getOpen }] = useDrawerInner(init);
  const infiniteBody = ref<Nullable<ScrollActionType>>(null);
  const debounceInitData = useDebounceFn(initData, 300);
  const state = reactive<State>({
    finish: false,
    loading: false,
    listQuery: {
      keyword: '',
      currentPage: 1,
      pageSize: 20,
      sort: 'desc',
      type: '',
      isRead: 0,
    },
    list: [],
    type: '全部',
    isNoRead: true,
    messageType: [],
  });
  const { list, listQuery, type, isNoRead, messageType } = toRefs(state);
  const baseStore = useBaseStore();
  const { onWebSocket } = useWebSocket();

  onWebSocket((data: any) => {
    // 消息推送（消息公告用的）
    if (data.method == 'messagePush' && unref(getOpen)) debounceInitData();
  });

  function init() {
    state.listQuery.isRead = 0;
    state.listQuery.keyword = '';
    state.isNoRead = true;
    initData();
    nextTick(() => {
      bindScroll();
      initMessageType();
    });
  }
  function initData() {
    changeLoading(true);
    state.finish = false;
    state.listQuery.currentPage = 1;
    state.list = [];
    getMsgList();
  }
  async function initMessageType() {
    const all = { id: '', fullName: '全部', enCode: '' };
    const list = ((await baseStore.getDictionaryData('msgSourceType')) as any[]) || [];
    state.messageType = [all, ...list];
  }
  function bindScroll() {
    const bodyRef = infiniteBody.value;
    const vBody = bodyRef?.getScrollWrap();
    vBody?.addEventListener('scroll', () => {
      if (vBody.scrollHeight - vBody.clientHeight - vBody.scrollTop <= 200 && !state.loading && !state.finish) {
        state.listQuery.currentPage += 1;
        getMsgList();
      }
    });
  }
  function getMsgList() {
    // state.loading = true;
    // getMessageList(state.listQuery).then(res => {
    //   if (res.data.list.length < state.listQuery.pageSize) state.finish = true;
    //   state.list = [...state.list, ...res.data.list];
    //   state.loading = false;
    //   changeLoading(false);
    // });
  }
  function readInfo(item) {
    // readMsgInfo(item.id).then(res => {
    //   if (item.isRead == '0') {
    //     item.isRead = '1';
    //     emit('readMsg');
    //   }
    //   if (item.type == 4) {
    //     let bodyText = res.data.bodyText ? JSON.parse(res.data.bodyText) : {};
    //     if (bodyText.type == 3) return;
    //     // getScheduleDetail(bodyText.groupId, bodyText.id).then(() => {
    //     //   openScheduleDetailModal(true, { id: bodyText.id, groupId: bodyText.groupId });
    //     // });
    //   } else if (item.type == 2 && item.flowType == 2) {
    //     const bodyText = JSON.parse(res.data.bodyText);
    //     closeDrawer();
    //     router.push('/workFlow/entrust?config=' + bodyText.type);
    //   } else {
    //     if (item.type == 1 || item.type == 3) {
    //       openDetailModal(true, { id: item.id, type: 1 });
    //     } else {
    //       if (!res.data.bodyText) return;
    //       closeDrawer();
    //       router.push('/workFlowDetail?config=' + encodeURIComponent(encryptByBase64(res.data.bodyText)));
    //     }
    //   }
    // });
  }
  function handleTypeClick({ key }) {
    let item = state.messageType.filter(o => o.enCode == key)[0];
    state.type = item.fullName;
    state.listQuery.type = key || '';
    initData();
  }
  function onIsReadChange(val) {
    state.listQuery.isRead = val ? 0 : '';
    initData();
  }
  function handleSearch() {
    initData();
  }
  async function handleClose() {
    const bodyRef = infiniteBody.value;
    const vBody = bodyRef?.getScrollWrap();
    vBody?.removeEventListener('scroll', function () {});
    return true;
  }
  function gotoCenter() {
    closeDrawer();
    router.push('/messageRecord');
  }
  function readAll() {
    createConfirm({
      iconType: 'warning',
      title: '提示',
      content: `您确定全部标识为已读状态, 是否继续?`,
      onOk: () => {
        const query = {
          keyword: state.listQuery.keyword,
          type: state.listQuery.type,
          isRead: state.isNoRead ? 0 : '',
        };
        // readAllMsg(query).then(res => {
        //   createMessage.success(res.msg);
        //   emit('readMsg', true);
        //   if (state.isNoRead) {
        //     initData();
        //   } else {
        //     for (let i = 0; i < state.list.length; i++) {
        //       state.list[i].isRead = '1';
        //     }
        //   }
        // });
      },
    });
  }
</script>
<style lang="less">
  .message-drawer {
    .ant-drawer-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .link-text {
        font-size: 14px;
      }
    }
    .ant-input-search {
      .ant-input-affix-wrapper {
        border-radius: 0;
        border: none !important;
        &.ant-input-affix-wrapper-focused {
          box-shadow: unset;
        }
      }
      .ant-btn {
        border-radius: 0;
        border: none !important;
        height: 31px;
      }
    }
    .tool {
      height: 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-left: 10px;
      border-bottom: 1px solid @border-color-base1;
      .ant-dropdown-trigger {
        color: @text-color-label;
        cursor: pointer;
        flex-shrink: 0;
        .anticon {
          margin-left: 4px;
        }
      }
      .is-read-box {
        font-size: 14px;
        color: @text-color-secondary;
        display: flex;
        align-items: center;
        .ant-switch {
          margin-left: 4px;
        }
      }
    }
    .bottom-box {
      height: 50px;
      padding: 0 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      border-top: 1px solid @border-color-base1;
      .bottom-box-item {
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
        &.bottom-box-item-left {
          color: @text-color-label;
        }
        .ant-switch {
          margin-right: 10px;
        }
        .bottom-box-item-btn {
          width: 30px !important;
          padding: 0 !important;
          text-align: center;
          margin-left: 10px;
        }
      }
    }
    .msg-list {
      height: calc(100% - 90px);
    }
    .msg-list-item {
      position: relative;
      display: block;
      background-color: @component-background;
      padding: 0 20px;
      &:hover {
        background-color: @hover-background;
      }
      .msg-list-item-main {
        border-bottom: 1px solid @border-color-base1;
        height: 60px;
        display: flex;
        align-items: center;
        cursor: pointer;
      }
      .item-icon {
        background-color: #1890ff;
        width: 36px;
        height: 36px;
        display: inline-block;
        font-size: 22px;
        color: #fff;
        line-height: 36px;
        border-radius: 50%;
        text-align: center;
        &.flow-icon {
          background-color: #33cc51;
        }
        &.notice-icon {
          background-color: #e09f0c;
        }
        &.schedule-icon {
          background-color: #7777ff;
        }
      }
      .msg-list-txt {
        margin-left: 14px;
        overflow: hidden;
        flex: 1;
        padding-top: 1px;
        min-width: 0;
        .title {
          font-size: 14px;
          margin-bottom: 5px;
          line-height: 20px;
          overflow: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 20px;
          overflow: hidden;
          .title-left {
            flex: 1;
            min-width: 0;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }
        .name {
          font-size: 12px;
          color: @text-color-secondary;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .content {
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            flex: 1;
            min-width: 0;
          }
          .time {
            flex-shrink: 0;
            margin-left: 5px;
          }
        }
      }
    }
  }
</style>
