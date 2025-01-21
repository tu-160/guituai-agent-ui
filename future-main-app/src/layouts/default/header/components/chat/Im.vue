<template>
  <div class="im-container" v-if="visible">
    <div class="header">
      <a-avatar :size="30" :src="apiUrl + otherUser.headIcon" />
      <span class="name">{{ otherUser.realName }}/{{ otherUser.account }}</span>
      <i class="icon-ym icon-ym-nav-close" @click="visible = false"></i>
    </div>
    <div class="main">
      <div class="chatBox">
        <div class="chatList" ref="chatListRef">
          <div class="chatList-item" v-for="(item, index) in list" :key="index" :class="{ 'chatList-item--mine': item.userId == userInfo.userId }">
            <div class="chatList-user" v-if="item.userId == userInfo.userId">
              <a-avatar :size="40" :src="apiUrl + userInfo.headIcon" />
              <cite>
                <i>{{ item.dateTime }}</i>
                我
              </cite>
            </div>
            <div class="chatList-user" v-else>
              <a-avatar :size="40" :src="apiUrl + otherUser.headIcon" />
              <cite>
                {{ otherUser.realName }}<i>{{ item.dateTime }}</i>
              </cite>
            </div>
            <div class="chatList-text">
              <div class="chatList-arrow"></div>
              <p v-if="item.messageType == 'text'" v-html="item.message" class="chatList__msg--text"></p>
              <img
                :src="apiUrl + item.message.path"
                class="chatList__msg--img"
                @click="handlePreview(apiUrl + item.message.path)"
                v-if="item.messageType == 'image' && item.message.path" />
              <audio class="chatList__msg--audio" controls :src="apiUrl + item.message.path" v-if="item.messageType == 'voice' && item.message.path"></audio>
              <video :src="item.message" controls class="chatList__msg--video" v-if="item.messageType == 'video'"></video>
            </div>
          </div>
        </div>
        <div class="toolBox">
          <div class="toolBox-left">
            <a-popover placement="topLeft" trigger="click" overlayClassName="emoji-popover" v-model:open="state.popoverVisible">
              <i class="link-text ym-custom ym-custom-emoticon-neutral" title="发送表情"></i>
              <template #content>
                <div class="emojiBox">
                  <ul class="emoji">
                    <li v-for="(item, i) in state.emojiList" :key="i" @click="selectEmoji(item)">
                      <img :src="'/resource/emoji/' + item.url" />
                    </li>
                  </ul>
                </div>
              </template>
            </a-popover>
            <a-upload
              :showUploadList="false"
              :action="uploadUrl + '/IM'"
              class="uploadImg-btn"
              :headers="getHeaders"
              accept="image/*"
              :before-upload="beforeUpload"
              @change="handleChange">
              <i class="link-text ym-custom ym-custom-image" title="发送图片"></i>
            </a-upload>
          </div>
          <div class="toolBox-right" @click="openHistory">
            <i class="link-text icon-ym icon-ym-generator-time"></i>
            <span>聊天记录</span>
          </div>
        </div>
        <div class="writeBox">
          <future-textarea placeholder="点击这里，直接输入消息咨询" v-model:value.trim="messageContent" @keyup.enter.native="sendMessage()" />
          <div class="btns">
            <a-button type="primary" @click="sendMessage()">发送</a-button>
          </div>
        </div>
      </div>
      <div class="historyBox" v-if="showHistory">
        <a-input-search :placeholder="t('common.drawerSearchText')" allowClear v-model:value="state.keyword" @search="searchHistory()" />
        <div class="historyList-box" ref="historyListRef">
          <div class="chatList historyList">
            <div class="chatList-item" v-for="(item, index) in historyList" :key="index">
              <div class="chatList-user" v-if="item.userId == userInfo.userId">
                <a-avatar :size="40" :src="apiUrl + userInfo.headIcon" />
                <cite>
                  我<i>{{ item.dateTime }}</i>
                </cite>
              </div>
              <div class="chatList-user" v-else>
                <a-avatar :size="40" :src="apiUrl + otherUser.headIcon" />
                <cite
                  >{{ otherUser.realName }}<i>{{ item.dateTime }}</i>
                </cite>
              </div>
              <div class="chatList-text">
                <div class="chatList-arrow"></div>
                <span v-if="item.messageType == 'text'" v-html="item.message"></span>
                <img
                  :src="apiUrl + item.message.path"
                  class="chatList__msg--img"
                  @click="handlePreview(apiUrl + item.message.path)"
                  v-if="item.messageType == 'image' && item.message.path" />
                <audio class="chatList__msg--audio" controls :src="apiUrl + item.message.path" v-if="item.messageType == 'voice' && item.message.path"></audio>
                <video :src="item.message" controls class="chatList__msg--video" v-if="item.messageType == 'video'"></video>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import emojiJson from './emoji.json';
  import { reactive, toRefs, ref, nextTick, computed } from 'vue';
  import { useWebSocket } from '@/hooks/web/useWebSocket';
  import { useUserStore } from '@/store/modules/user';
  import { useGlobSetting } from '@/hooks/setting';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useI18n } from '@/hooks/web/useI18n';
  import dayjs from 'dayjs';
  import { getToken } from '@/utils/auth';
  import type { UploadChangeParam } from 'ant-design-vue';
  import { createImgPreview } from '@/components/Preview/index';

  interface State {
    visible: boolean;
    showHistory: boolean;
    list: any[];
    otherUser: any;
    userInfo: any;
    historyList: any[];
    emojiList: any[];
    historyDefaultList: any[];
    currentPage: number;
    pageSize: number;
    finish: boolean;
    loading: boolean;
    messageContent: string;
    keyword: string;
    popoverVisible: boolean;
  }

  const { onWebSocket, sendWsMsg } = useWebSocket();

  onWebSocket((data: any) => {
    // 接收对方发送的消息
    if (data.method == 'messageList') {
      initData(data);
    }
  });

  const { createMessage } = useMessage();
  const { t } = useI18n();
  const globSetting = useGlobSetting();
  const apiUrl = ref(globSetting.apiUrl);
  const uploadUrl = ref(globSetting.uploadUrl);
  const chatListRef = ref(null);
  const historyListRef = ref(null);
  const userStore = useUserStore();
  const state = reactive<State>({
    visible: false,
    showHistory: false,
    list: [],
    otherUser: {},
    userInfo: userStore.getUserInfo,
    emojiList: emojiJson,
    historyList: [],
    historyDefaultList: [],
    currentPage: 1,
    pageSize: 50,
    finish: false,
    loading: false,
    messageContent: '',
    keyword: '',
    popoverVisible: false,
  });
  const { visible, userInfo, list, otherUser, historyList, showHistory, messageContent } = toRefs(state);
  const getHeaders = computed(() => ({ Authorization: getToken() as string }));

  defineExpose({
    getImVisible,
    getOtherUser,
    openIm,
    closeIm,
    addItem,
  });

  function getOtherUser() {
    return state.otherUser;
  }
  function getImVisible() {
    return state.visible;
  }
  function openIm(item) {
    state.visible = true;
    state.showHistory = false;
    state.otherUser = item;
    //获取消息列表
    const msg = {
      method: 'MessageList',
      toUserId: item.id,
      formUserId: state.userInfo.userId,
      currentPage: 1,
      pageSize: 30,
      sord: 'desc',
    };
    sendWsMsg(JSON.stringify(msg));
    state.list = [];
  }
  function closeIm() {
    state.showHistory = false;
    state.visible = false;
  }
  function initData(data) {
    let list: any[] = [];
    for (let i = 0; i < data.list.length; i++) {
      const item = data.list[i];
      if (item.contentType === 'text') {
        item.content = replaceEmoji(item.content);
      } else {
        item.content = JSON.parse(item.content);
      }
      list.push({
        userId: item.sendUserId,
        messageType: item.contentType,
        message: item.content,
        dateTime: dayjs(item.sendTime).format('YYYY-MM-DD HH:mm:ss'),
      });
    }
    if (!state.showHistory) {
      state.list = list;
      nextTick(() => {
        scroll(500);
      });
    } else {
      state.historyList = [...state.historyList, ...list];
      state.currentPage += 1;
      state.finish = list.length < data.pagination.pageSize;
    }
    state.loading = false;
  }
  function replaceEmoji(str) {
    //替换表情符号为图片
    let replacedStr = str.replace(/\[([^(\]|\[)]*)\]/g, item => {
      let obj = '';
      for (let i = 0; i < state.emojiList.length; i++) {
        let row = state.emojiList[i];
        if (row.alt == item) {
          obj = `<img src="/resource/emoji/${row.url}" class="chatList-text-emoji" />`;
          break;
        }
      }
      return obj;
    });
    str = replacedStr;
    return str;
  }
  function scroll(num = 0) {
    setTimeout(() => {
      nextTick(() => {
        let ele: any = chatListRef.value;
        if (!ele) return;
        //设置滚动条到最底部
        if (ele.scrollHeight > ele.clientHeight) ele.scrollTop = ele.scrollHeight;
      });
    }, num);
  }
  function addItem(item) {
    if (item.messageType === 'text') {
      item.message = replaceEmoji(item.message);
    }
    state.list.push(item);
    scroll(200);
    if (state.showHistory) state.historyList.push(item);
  }
  function sendMessage() {
    if (!state.messageContent) return;
    const msg = {
      method: 'SendMessage',
      toUserId: state.otherUser.id,
      messageType: 'text',
      messageContent: state.messageContent,
    };
    sendWsMsg(JSON.stringify(msg));
    state.messageContent = '';
  }
  // 选择表情
  function selectEmoji(item) {
    state.messageContent += item.alt;
    state.popoverVisible = false;
  }
  function openHistory() {
    state.showHistory = !state.showHistory;
    if (!state.showHistory) return;
    state.historyList = [];
    state.currentPage = 1;
    state.pageSize = 50;
    state.finish = false;
    sendList();
    nextTick(() => {
      bindScroll();
    });
  }
  function sendList() {
    state.loading = true;
    const msg = {
      method: 'MessageList',
      toUserId: state.otherUser.id,
      formUserId: state.userInfo.userId,
      currentPage: state.currentPage,
      pageSize: state.pageSize,
      sord: 'asc',
      keyword: state.keyword,
    };
    sendWsMsg(JSON.stringify(msg));
  }
  function bindScroll() {
    const ele: any = historyListRef.value;
    if (!ele) return;
    ele.addEventListener('scroll', function () {
      if (state.finish || state.loading) return;
      if (ele.scrollTop >= ele.scrollHeight - ele.clientHeight - 100) sendList();
    });
  }
  function searchHistory() {
    state.currentPage = 1;
    state.pageSize = 50;
    state.finish = false;
    state.historyList = [];
    sendList();
    nextTick(() => {
      const ele: any = historyListRef.value;
      if (!ele) return;
      ele.scrollTop = 0;
    });
  }
  function beforeUpload(file) {
    const isRightSize = file.size < 1024 * 1024 * 5;
    if (!isRightSize) createMessage.error(`图片大小不能超过5M`);
    return isRightSize;
  }
  function handleChange({ file }: UploadChangeParam) {
    if (file.status === 'error') {
      createMessage.error('上传失败');
      return;
    }
    if (file.status === 'done') {
      if (file.response.code === 200) {
        if (!file.response.data || !file.response.data.name) return;
        const name = file.response.data.name;
        getBase64(file.originFileObj).then((data: any) => {
          getImgSize(data.e).then((res: any) => {
            let messageContent: any = {
              name,
              width: res.width,
              height: res.height,
            };
            const msg = {
              method: 'SendMessage',
              toUserId: state.otherUser.id,
              messageType: 'image',
              messageContent,
            };
            sendWsMsg(JSON.stringify(msg));
            nextTick(() => {
              scroll(500);
            });
          });
        });
      } else {
        createMessage.error(file.response.msg);
      }
    }
  }
  function getImgSize(event) {
    return new Promise(function (resolve, reject) {
      let size = { width: 0, height: 0 };
      const txt = event.target.result;
      const img = document.createElement('img');
      img.src = txt;
      img.onload = function () {
        size.width = img.width;
        size.height = img.height;
        resolve(size);
      };
      img.onerror = function (error) {
        reject(error);
      };
    });
  }
  function getBase64(file) {
    return new Promise(function (resolve, reject) {
      let reader: any = new FileReader();
      let msg = { base64: '', e: null };
      reader.readAsDataURL(file);
      reader.onload = function (event) {
        msg.base64 = reader.result.replace(/data:image\/.*;base64,/, '');
        msg.e = event;
      };
      reader.onerror = function (error) {
        reject(error);
      };
      reader.onloadend = function () {
        resolve(msg);
      };
    });
  }
  function handlePreview(url) {
    createImgPreview({ imageList: [url] });
  }
</script>
<style lang="less">
  .im-container {
    .chatList-item.chatList-item--mine .chatList-text {
      background-color: @primary-color !important;
      .chatList-arrow,
      .chatList-arrow::after {
        border-left-color: @primary-color !important;
      }
    }
  }
</style>
<style lang="less" scoped>
  .im-container {
    position: fixed;
    right: 350px;
    bottom: 10px;
    z-index: 3000;
    background: #e6e9f0;
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 0 0 6px 1px rgba(0, 0, 0, 0.3);
    * {
      box-sizing: border-box;
    }
    .header {
      background: @component-background;
      height: 50px;
      border-bottom: 1px solid @border-color-base;
      padding: 0 10px;
      font-size: 0;
      .ant-avatar {
        margin-top: 10px;
        vertical-align: top;
        margin-right: 10px;
        &.offLine {
          filter: grayscale(1);
        }
      }
      span {
        line-height: 49px;
        font-size: 16px;
      }
      .icon-ym {
        float: right;
        font-size: 16px;
        line-height: 50px;
        cursor: pointer;
        &:hover {
          color: @error-color;
        }
      }
    }
    .main {
      display: flex;
      .chatBox {
        width: 600px;
        height: 480px;
        .chatList {
          height: 335px;
          overflow: auto;
          overflow-x: hidden;
          padding: 5px 15px 5px;
          background: @component-background;
        }
        .toolBox {
          height: 35px;
          display: flex;
          justify-content: space-between;
          padding: 0 10px;
          align-items: center;
          font-size: 0;
          i {
            line-height: 35px;
            font-size: 20px;
            margin-right: 10px;
            color: #6b7a99;
            cursor: pointer;
          }
          .toolBox-left {
            .uploadImg-btn {
              display: inline-block;
            }
          }
          .toolBox-right {
            color: #6b7a99;
            line-height: 35px;
            font-size: 14px;
            display: flex;
            align-items: center;
            cursor: pointer;
            i {
              font-size: 18px;
              margin-right: 5px;
            }
          }
        }
        .writeBox {
          background: @component-background;
          height: 110px;
          .ant-input {
            border: none !important;
            box-shadow: none !important;
            resize: none;
          }
          .btns {
            padding-right: 10px;
            text-align: right;
          }
        }
      }
      .historyBox {
        width: 350px;
        height: 480px;
        margin-left: 10px;
        background: @component-background;
        .historyList-box {
          height: 448px;
          overflow: auto;
          overflow-x: hidden;
          padding: 5px;
          border-bottom-right-radius: 4px;
          .chatList-item .chatList-text {
            max-width: 94%;
          }
          .chatList__msg--audio {
            width: 230px;
          }
        }
      }
    }
    .chatList-item {
      position: relative;
      font-size: 0;
      margin-bottom: 10px;
      padding-left: 60px;
      min-height: 68px;
      text-align: left;
      .chatList-user,
      .chatList-text {
        display: inline-block;
        vertical-align: top;
        font-size: 14px;
      }
      .chatList-user {
        position: absolute;
        cursor: pointer;
        left: 3px;
      }
      .chatList-user img {
        &.offLine {
          filter: grayscale(1);
        }
      }
      .chatList-user cite {
        position: absolute;
        left: 60px;
        top: -2px;
        line-height: 24px;
        font-size: 12px;
        white-space: nowrap;
        color: @text-color-secondary;
        text-align: left;
        font-style: normal;
      }
      .chatList-user cite i {
        padding-left: 15px;
        font-style: normal;
      }
      .chatList-text {
        max-width: 75%;
        position: relative;
        line-height: 22px;
        margin-top: 25px;
        padding: 8px 15px;
        background-color: @app-main-background;
        border-radius: 3px;
        border: 1px solid @app-main-background;
        word-break: break-all;
      }
      .chatList__msg--text {
        line-height: 24px;
        img {
          vertical-align: top;
          width: 24px;
          height: 24px;
          display: inline-block;
        }
      }
      .chatList-arrow {
        top: 6px;
        left: -8px;
        position: absolute;
        display: block;
        width: 0;
        height: 0;
        border-color: transparent;
        border-style: solid;
        border-width: 8px;
        border-left-width: 0;
        border-right-color: @app-main-background;
      }
      .chatList-arrow::after {
        content: ' ';
        top: -7px;
        left: 1px;
        position: absolute;
        display: block;
        width: 0;
        height: 0;
        border-color: transparent;
        border-style: solid;
        border-width: 7px;
        border-left-width: 0;
        border-right-color: @app-main-background;
      }
      &.chatList-item--mine .chatList-text .chatList-arrow {
        left: auto;
        right: -5px;
        border-color: transparent;
        border-style: solid;
        border-width: 8px;
        border-right-width: 0;
      }
      &.chatList-item--mine .chatList-text .chatList-arrow::after {
        left: auto;
        right: -2px;
        border-color: transparent;
        border-style: solid;
        border-width: 7px;
        border-right-width: 0;
      }
      &.chatList-item--mine {
        text-align: right;
        padding-left: 0;
        padding-right: 60px;
      }
      &.chatList-item--mine .chatList-user {
        left: auto;
        right: 3px;
      }
      &.chatList-item--mine .chatList-user cite {
        left: auto;
        right: 60px;
        text-align: right;
      }
      &.chatList-item--mine .chatList-user cite i {
        padding-left: 0;
        padding-right: 15px;
      }
      &.chatList-item--mine .chatList-text {
        margin-left: 0;
        text-align: left;
        background-color: @primary-color;
        color: #fff;
      }
      .chatList__msg--video,
      .chatList__msg--file {
        position: relative;
        max-width: 100%;
        min-width: 200px;
        width: 100%;
        margin: 10px 0;
        overflow: hidden;
        border-radius: 5px;
        cursor: pointer;
        display: block;
      }
      .chatList__msg--img {
        position: relative;
        max-width: 200px;
        width: 100%;
        margin: 10px 0;
        overflow: hidden;
        border-radius: 5px;
        cursor: pointer;
        display: block;
      }
    }
  }
  .emojiBox {
    height: 150px;
    width: 300px;
    overflow: auto;
    text-align: left;
  }
  .emojiBox .emoji {
    padding: 0;
  }
  .emojiBox li {
    display: inline-block;
    width: 28px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    cursor: pointer;
  }
</style>
<style lang="less">
  .emoji-popover {
    z-index: 30000 !important;
    .ant-popover-inner-content {
      padding: 10px;
    }
  }
</style>
