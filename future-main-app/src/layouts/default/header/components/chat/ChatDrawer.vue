<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" title="内部聊天" width="340px" class="full-drawer chat-drawer" :closeFunc="handleClose">
    <a-tabs v-model:activeKey="activeKey" :tabBarGutter="10" class="average-tabs h-full" @change="onTabsChange" size="small">
      <a-tab-pane key="reply" tab="消息">
        <ScrollContainer>
          <template v-if="replyList.length">
            <div v-for="(item, i) in replyList" :key="i" class="user-list-item" @click="readInfo(item, true)" @contextmenu="handleContext($event, item)">
              <div class="user-list-item-main">
                <a-avatar :size="36" :src="apiUrl + item.headIcon" />
                <div class="user-list-txt">
                  <p class="title">
                    <span class="title-left">{{ item.realName }}/{{ item.account }}</span>
                    <Badge :count="item.unreadMessage" v-if="item.unreadMessage" />
                  </p>
                  <p class="name">
                    <span class="content">{{ getMsgText(item.latestMessage, item.messageType) }}</span>
                    <span class="time">{{ toDateText(item.latestDate) }}</span>
                  </p>
                </div>
              </div>
            </div>
          </template>
          <future-empty v-if="!replyList.length" />
        </ScrollContainer>
      </a-tab-pane>
      <a-tab-pane key="contacts" tab="联系人">
        <div class="tool">
          <a-input-search :placeholder="t('common.drawerSearchText')" allowClear v-model:value="listQuery.keyword" @search="handleSearch" />
        </div>
        <ScrollContainer ref="infiniteBody" class="user-list">
          <div v-for="(item, i) in userList" :key="i" class="user-list-item" @click="readInfo(item)" v-if="userList.length">
            <div class="user-list-item-main">
              <a-avatar :size="36" :src="apiUrl + item.headIcon" />
              <div class="user-list-txt">
                <p class="title">
                  <span class="title-left">{{ item.realName }}/{{ item.account }}</span>
                </p>
                <p class="name">
                  <span>{{ item.department }}</span>
                </p>
              </div>
            </div>
          </div>
          <future-empty v-if="!userList.length" />
        </ScrollContainer>
      </a-tab-pane>
    </a-tabs>
    <Im ref="imRef" />
  </BasicDrawer>
</template>
<script lang="ts" setup>
  // import { getImUser } from '@/api/permission/user';
  // import { getIMReply, deleteChatRecord, removeChatRecord } from '@/api/system/message';
  import { BasicDrawer, useDrawerInner } from '@/components/Drawer';
  import { ScrollContainer, ScrollActionType } from '@/components/Container';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useI18n } from '@/hooks/web/useI18n';
  import { reactive, toRefs, nextTick, ref } from 'vue';
  import { Badge } from 'ant-design-vue';
  import { useGlobSetting } from '@/hooks/setting';
  import { toDateText } from '@/utils/future';
  import { useContextMenu } from '@/hooks/web/useContextMenu';
  import { useWebSocket } from '@/hooks/web/useWebSocket';
  import Im from './Im.vue';
  import dayjs from 'dayjs';

  interface State {
    activeKey: string;
    replyList: any[];
    finish: boolean;
    loading: boolean;
    listQuery: any;
    userList: any[];
  }
  const emit = defineEmits(['register', 'toggleTwinkle']);
  const { createConfirm } = useMessage();
  const { t } = useI18n();
  const [createContextMenu] = useContextMenu();
  const globSetting = useGlobSetting();
  const apiUrl = ref(globSetting.apiUrl);
  const imRef = ref<any>(null);
  const [registerDrawer, { changeLoading }] = useDrawerInner(init);
  const infiniteBody = ref<Nullable<ScrollActionType>>(null);
  const state = reactive<State>({
    activeKey: 'reply',
    replyList: [],
    finish: false,
    loading: false,
    listQuery: {
      keyword: '',
      currentPage: 1,
      pageSize: 20,
    },
    userList: [],
  });
  const { activeKey, replyList, userList, listQuery } = toRefs(state);

  const { onWebSocket, sendWsMsg } = useWebSocket();

  onWebSocket((data: any) => {
    // 接收对方发送的消息
    if (data.method == 'receiveMessage') {
      // 判断是否打开窗口
      if (!imRef.value?.getImVisible() || imRef.value?.getOtherUser().id !== data.formUserId) {
        updateReply(data, 1);
        emit('toggleTwinkle', true);
        return;
      }
      const messItem = {
        userId: data.formUserId,
        messageType: data.messageType,
        message: data.formMessage,
        dateTime: dayjs(data.dateTime).format('YYYY-MM-DD HH:mm:ss'),
      };
      imRef.value?.addItem(messItem);
      //更新已读
      const msg = { method: 'UpdateReadMessage', formUserId: data.formUserId };
      sendWsMsg(JSON.stringify(msg));
      updateReply(data);
    }
    //显示自己发送的消息
    if (data.method == 'sendMessage') {
      if (imRef.value?.getOtherUser().id !== data.toUserId) return;
      //添加到客户端
      const messItem = {
        userId: data.UserId,
        messageType: data.messageType,
        message: data.toMessage,
        dateTime: dayjs(data.dateTime).format('YYYY-MM-DD HH:mm:ss'),
      };
      updateLatestMessage(data);
      imRef.value?.addItem(messItem);
    }
  });

  function init() {
    changeLoading(true);
    state.activeKey = 'reply';
    getReplyList();
  }
  function onTabsChange(val) {
    if (val === 'contacts' && !state.userList.length) {
      getUserList();
      nextTick(() => {
        bindScroll();
      });
    }
  }
  function bindScroll() {
    const bodyRef = infiniteBody.value;
    const vBody = bodyRef?.getScrollWrap();
    vBody?.addEventListener('scroll', () => {
      if (vBody.scrollHeight - vBody.clientHeight - vBody.scrollTop <= 200 && !state.loading && !state.finish) {
        state.listQuery.currentPage += 1;
        getUserList();
      }
    });
  }
  function getReplyList() {
    // getIMReply().then(res => {
    //   state.replyList = res.data.list;
    //   changeLoading(false);
    // });
  }
  function getUserList() {
    state.loading = true;
    // getImUser(state.listQuery).then(res => {
    //   if (res.data.list.length < state.listQuery.pageSize) state.finish = true;
    //   state.userList = [...state.userList, ...res.data.list];
    //   state.loading = false;
    // });
  }
  function getMsgText(text, type) {
    if (type === 'voice') return '[语音]';
    if (type === 'image') return '[图片]';
    return text;
  }
  function readInfo(item, isReply = false) {
    const msg = {
      method: 'UpdateReadMessage',
      formUserId: item.id,
    };
    sendWsMsg(JSON.stringify(msg));
    if (isReply) {
      item.unreadMessage = 0;
    } else {
      for (let i = 0; i < state.replyList.length; i++) {
        if (item.id === state.replyList[i].id) {
          state.replyList[i].unreadMessage = 0;
          break;
        }
      }
    }
    toggleTwinkle();
    imRef.value?.openIm(item);
  }
  function handleContext(e: MouseEvent, item) {
    createContextMenu({
      event: e,
      items: [
        {
          label: '移除',
          handler: () => {
            removeRecord(item);
          },
        },
        {
          label: '删除聊天记录',
          handler: () => {
            delChatRecord(item);
          },
        },
      ],
    });
  }
  function removeRecord(item) {
    imRef.value?.closeIm();
    // removeChatRecord(item.id).then(() => {
    //   state.replyList = state.replyList.filter(o => o.id !== item.id);
    // });
  }
  function delChatRecord(item) {
    imRef.value?.closeIm();
    createConfirm({
      iconType: 'warning',
      title: '提示',
      content: `是否清空当前聊天的所有记录?`,
      onOk: () => {
        // deleteChatRecord(item.id).then(() => {
        //   item.latestMessage = '';
        //   item.messageType = '';
        //   item.unreadMessage = 0;
        //   toggleTwinkle();
        // });
      },
    });
  }
  function toggleTwinkle() {
    const boo = state.replyList.some(o => o.unreadMessage);
    emit('toggleTwinkle', boo);
  }
  function handleSearch() {
    state.userList = [];
    state.finish = false;
    state.listQuery.currentPage = 1;
    state.listQuery.pageSize = 20;
    getUserList();
  }
  async function handleClose() {
    imRef.value?.closeIm();
    return true;
  }
  function updateReply(data, isAdd = 0) {
    let boo = false;
    const len = state.replyList.length;
    for (let i = 0; i < len; i++) {
      if (data.formUserId === state.replyList[i].id) {
        if (isAdd) state.replyList[i].unreadMessage += 1;
        state.replyList[i].latestMessage = data.formMessage;
        state.replyList[i].messageType = data.messageType;
        state.replyList[i].latestDate = data.latestDate;
        boo = true;
        break;
      }
    }
    if (boo) return;
    if (isAdd) data.unreadMessage = 1;
    data.latestMessage = data.formMessage;
    data.id = data.formUserId;
    state.replyList.unshift(data);
  }
  function updateLatestMessage(data) {
    let boo = false;
    const len = state.replyList.length;
    for (let i = 0; i < len; i++) {
      if (data.toUserId === state.replyList[i].id) {
        state.replyList[i].latestMessage = data.toMessage;
        state.replyList[i].messageType = data.messageType;
        state.replyList[i].latestDate = data.latestDate;
        boo = true;
        break;
      }
    }
    if (boo) return;
    const item = {
      account: data.toAccount,
      headIcon: data.toHeadIcon,
      id: data.toUserId,
      latestDate: data.latestDate,
      latestMessage: data.toMessage,
      messageType: data.messageType,
      realName: data.toRealName,
      unreadMessage: 0,
    };
    state.replyList.unshift(item);
  }
</script>
<style lang="less">
  .chat-drawer {
    .ant-tabs-content {
      height: 100%;
    }
    .tool {
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-bottom: 1px solid @border-color-base1;
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
    }
    .user-list {
      height: calc(100% - 40px);
    }
    .user-list-item {
      position: relative;
      display: block;
      padding: 0 20px;
      background-color: @component-background;
      cursor: pointer;
      .offLine {
        filter: grayscale(1);
      }
      &:hover {
        background-color: @hover-background;
      }
      .user-list-item-main {
        border-bottom: 1px solid @border-color-base1;
        height: 60px;
        display: flex;
        align-items: center;
        cursor: pointer;
      }
      .user-list-txt {
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
          .ant-badge {
            flex-shrink: 0;
            margin-left: 5px;
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
