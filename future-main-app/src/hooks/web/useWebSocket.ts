import { ref } from 'vue';
import { useMessage } from '@/hooks/web/useMessage';
import { useUserStore } from '@/store/modules/user';
import { useGlobSetting } from '@/hooks/setting';
import { getToken } from '@/utils/auth';
import { isDevMode } from '@/utils/env';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { getFutureAppId } from '@/utils/future';

const userStore = useUserStore();
const userInfo = userStore.getUserInfo;
const { createMessage } = useMessage();
const globSetting = useGlobSetting();
const url = isDevMode()
  ? globSetting.webSocketUrl + '/api/message/websocket/'
  : globSetting.webSocketUrl
  ? globSetting.webSocketUrl + '/websocket/'
  : window.location.origin + '/websocket/';
const webSocketUrl = url.replace('https://', 'wss://').replace('http://', 'ws://');

let ws: any;
const listeners = new Map();

export function useWebSocket() {
  const token = getToken();
  const server = ref(webSocketUrl + encodeURIComponent(token as string));
  /** 初始化WebSocket */
  function initWebSocket() {
    if (ws) {
      ws.close();
      ws = null;
    }
    ws = new ReconnectingWebSocket(server.value);

    ws.onopen = onOpen;
    ws.onerror = onError;
    ws.onmessage = onMessage;

    function onOpen() {
      const onConnection = { method: 'OnConnection', mobileDevice: false, systemId: userInfo.systemId, isSeparate: !!getFutureAppId() };
      sendWsMsg(JSON.stringify(onConnection));
    }

    function onError(e) {
      console.log('[WebSocket] 连接发生错误: ', e);
    }

    function onMessage(res) {
      if (res.data) {
        try {
          let dataStr = res.data;
          const data = JSON.parse(dataStr);
          for (const callback of listeners.keys()) {
            try {
              callback(data);
            } catch (err) {
              console.error(err);
            }
          }
          // initMessage: //初始化
          // sendMessage: //发送消息
          // receiveMessage: //接收消息
          // messageList: //消息列表
          // messagePush: //消息推送
          switch (data.method) {
            //刷新页面
            case 'refresh':
              if (data.msg) {
                createMessage.error(data.msg);
                setTimeout(() => {
                  location.reload();
                }, 2000);
              } else {
                location.reload();
              }
              break;
            //断开websocket连接
            case 'closeSocket':
              if (ws) {
                ws.close();
                ws = null;
              }
              break;
            //用户过期
            case 'logout':
              if (data.token && data.token !== token) return location.reload();
              if (ws) {
                ws.close();
                ws = null;
              }
              createMessage.error(data.msg || '登录过期,请重新登录').then(() => {
                userStore.resetToken();
              });
              break;
            default:
              break;
          }
        } catch (err) {
          console.error('[WebSocket] data解析失败：', err);
        }
      }
    }
  }
  /**
   * 添加 WebSocket 消息监听
   * @param callback
   */
  function onWebSocket(callback: (data: object) => any) {
    if (!listeners.has(callback)) {
      if (typeof callback === 'function') {
        listeners.set(callback, null);
      } else {
        console.debug('[WebSocket] 添加 WebSocket 消息监听失败：传入的参数不是一个方法');
      }
    }
  }

  /**
   * 解除 WebSocket 消息监听
   *
   * @param callback
   */
  function offWebSocket(callback: (data: object) => any) {
    listeners.delete(callback);
  }

  function getWebSocket() {
    return ws;
  }

  function sendWsMsg(msg: string) {
    try {
      const msgObj = JSON.parse(msg);
      msgObj.token = token;
      let content = JSON.stringify(msgObj);
      ws.send(content);
    } catch (_) {}
    return;
  }

  function closeWebSocket() {
    if (ws) {
      ws.close();
      ws = null;
    }
  }

  return {
    initWebSocket,
    sendWsMsg,
    onWebSocket,
    offWebSocket,
    getWebSocket,
    closeWebSocket,
  };
}
