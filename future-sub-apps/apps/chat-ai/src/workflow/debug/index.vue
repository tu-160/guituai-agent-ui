<template>
  <a-drawer
      v-model:open="showDebugPanel"
      width="650"
      :closable="false"
      :footer-style="{ textAlign: 'right' }"
      @close="onClose"
  >
    <template #title>
      <span class="custom-title">{{ t('chat.debugging') }}</span>
    </template>
    <div class="conversation-container flex h-full flex-col items-center justify-center text-center">
<!--      <div class="nav flex w-full items-center justify-start gap-2 px-4 text-xl font-semibold">{{
          t('chat.debugging')
        }}
      </div>-->

      <!-- <div class="flex flex-col px-4"> -->
      <div class="conversation-body no-scrollbar max-h-[872px] min-h-[388px] w-full flex-1 overflow-y-auto px-4">
        <!-- 消息内容 -->
        <div v-if="modelChat.conversationList?.length !== 0" className="flex flex-1 flex-col gap-4 p-4">
          <div v-for="(item, index) in modelChat.conversationList" :key="index" ref="conversationDomRef"
               className="w-full rounded-lg">
            <ChatItem v-if="item.content!=''" :content="item.content" :role="item.role" :show-cursor="item.showCursor" :waiting="item.waiting"/>
          </div>
        </div>
      </div>
      <div class="conversation-footer mt-auto w-full p-2">
        <FChatInputArae v-model="modelChat.currentQuestion" @send="fetchSendMsg"/>
      </div>
    </div>
  </a-drawer>
</template>

<script lang="ts" setup>
import {nextTick, onMounted, reactive, ref, toRaw, watch} from 'vue';
import {Form, message} from 'ant-design-vue';
import {ArrowLeft, Plus} from 'lucide-vue-next';
import {C0001, C0002, C0013, K0001} from '@/api';
import BaseContainer from '@/components/base-container/index.vue';
import FChatInputArae from '@/components/f-chat-Input-area/index.vue';
import ChatItem from '@/components/chat-item/index.vue';

import {i18n} from "@/locales/i18n";

const t = i18n.global.t;

const showDebugPanel = ref<boolean>(false);

defineProps<{
  modelValue?: boolean;
}>();

const useForm = Form.useForm;

let canvasData: any = reactive({
  id: '',
  title: '',
});

const conversationDomRef = ref<HTMLElement[] | null>(null);

interface ImodelChat {
  dialog_id?: any;
  session_id?: any;
  conversationList?: any[];
  currentQuestion?: string;
  currentAnswer?: string;
  loadingStatus?: {
    send: boolean;
  };
}

interface Message {
  content: string;
  role: 'assistant' | 'user';
  showCursor?: boolean;
  waiting?: boolean;
}

const modelChat: ImodelChat = reactive({
  dialog_id: '', // 当前智能体id
  session_id: '', // 会话id
  conversationList: [], // 对话历史
  currentQuestion: '', // 当前对话提问
  currentAnswer: '', // 当前对话回答
  loadingStatus: {
    send: false,
  },
});

const fetchSendMsg = async (message?: string) => {
  const answerInfo = reactive({
    content: '',
    role: 'assistant',
    showCursor: false,
    waiting: true,
  } as Message);

  const message1 = {
    content: message,
    role: 'user',
  };
  modelChat.conversationList?.push(message1);
  const messages = modelChat.conversationList?.slice(); // 浅拷贝
  modelChat.conversationList?.push(answerInfo);
  modelChat.loadingStatus!.send = true;
  debugger
  // 然后创建会话
  if (!modelChat.session_id) {
    const res = await C0002({dialog_id: modelChat.dialog_id || ''}).catch((error: any) => {
      modelChat.loadingStatus!.send = false;
      throw error;
    });
    modelChat.session_id = res.data?.conversation_id;
  }
  const params = {
    dialog_id: modelChat.dialog_id || '',
    conversation_id: modelChat.session_id || '',
    messages: messages as any,
  };
  C0001(params)
      .then((response) => {
        modelChat.loadingStatus!.send = false;
        answerInfo.showCursor = true;
        answerInfo.waiting = false;
        if (!response || !response.ok) {
          throw new Error(t('message.networkError'));
        }

        const reader = response?.body?.getReader();
        if (!reader) {
          throw new Error(t('message.noReader'));
        }
        const textDecoder = new TextDecoder();

        const renderHandle = async () => {
          const {done, value} = await reader.read();
          if (done) {
            answerInfo.showCursor = false;
            return;
          } else {
            requestAnimationFrame(renderHandle);
          }

          const chunkText = textDecoder.decode(value);

          try {
            // sss = replaceStartOfString(chunkText, "", 5)
            // sss = chunkText.replaceAll('data:', '');
            const normalizedString = chunkText.replace(/\r\n|\r/g, '\n');
            const normalList = normalizedString.split('\n').map(line => line.trim()).filter(line => line.length > 0);
            for (let cont of normalList) {
              // 尝试解析 JSON
              cont = cont.replaceAll('data:', '');
              const jsonData = JSON.parse(cont);
              if (jsonData.data == true) {
                break;
              }
              modelChat.currentAnswer = jsonData.data.answer;
              answerInfo.content = modelChat.currentAnswer as string;
            }

          } catch (error) {
            console.error('Failed to parse JSON:', error);
            const answerMatch = chunkText.match(/"answer":\s*"([^"]+)"/);
            if (answerMatch && answerMatch[1]) {
              modelChat.currentAnswer = answerMatch[1]; // 提取 "answer" 字段的值
              // modelChat.currentAnswer = modelChat.currentAnswer.replace(/\n\n/g, '<br><br>');
              // modelChat.currentAnswer = modelChat.currentAnswer.replace(/\n/g, '<br>');

              answerInfo.content = modelChat.currentAnswer as string;
            }
          }
        };

        requestAnimationFrame(renderHandle);

        return response;
      })
      .finally(() => {
        modelChat.loadingStatus!.send = false;
      });
};

function replaceStartOfString(str: string, replacement: string, count: number): string {
  if (count < 0) {
    throw new Error("Count cannot be negative");
  }
  if (count === 0 || str.length === 0) {
    return str;
  }

  // 取得字符串的前count个字符
  const start = str.slice(0, count);
  // 取得字符串的剩余部分
  const rest = str.slice(count);

  // 返回被替换后的字符串
  return replacement + rest;
}

const init = () => {
  // 聊天始终滚动到最底部
  watch(
      () => [modelChat.currentAnswer, modelChat.conversationList],
      () => {
        nextTick(() => {
          if (conversationDomRef.value) {
            conversationDomRef.value[conversationDomRef.value.length - 1]?.scrollIntoView();
          }
        });
      },
      {
        deep: true,
      },
  );
};

init();

const setDebugInitParam = (params: any) => {
  canvasData = params;
  modelChat.dialog_id = params.id;
  // 调试窗口打开即建立对话连接，这时向后台请求发送的消息为空。
  fetchSendMsg("");
};

const showDrawer = () => {
  showDebugPanel.value = true;
};

const onClose = () => {
  showDebugPanel.value = false;
};


// 导出函数，调用此页面的位置使用
defineExpose({showDrawer, canvasData, setDebugInitParam})
</script>

<style lang="scss" scoped>

.ant-drawer-title .custom-title {
  font-weight: bold;
  font-size: 20px; /* 根据需要调整大小 */
}

.left-panel {
  @apply min-h-full;

  width: calc(50% - 2px);
}

.right-panel {
  @apply min-h-full;

  width: calc(50% - 2px);
}

/* stylelint-disable-next-line rule-empty-line-before */
.conversation-container {
  width: 100%;
  height: calc(100vh - var(--chat-nav-height) - 25px);
}

/* stylelint-disable-next-line rule-empty-line-before */
.policy-tip {
  margin-top: 8px;
  font-size: 12px;
  color: hsl(var(--input-placeholder));
  text-align: center;
}
</style>
