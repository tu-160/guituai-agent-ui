<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue';
import { type LocationQueryRaw, type RouteParamsGeneric, useRouter } from 'vue-router';

import { C0001, C0002 } from '@/api';
import ChatGuide from '@/components/chat-guide/index.vue';
import ChatItem from '@/components/chat-item/index.vue';
import FChatInputArea from '@/components/f-chat-Input-area/index.vue';
import { type IDialog, useDialogAsideStore } from '@/store/modules/useDialogAsideStore';

interface message {
  content: string;
  role: 'assistant' | 'user';
  showCursor?: boolean;
  waiting?: boolean;
}

const dialogAsideStore = useDialogAsideStore();
const conversationDomRef = ref<HTMLElement[] | null>(null);

function useBaseLogic() {
  const state = ref({
    // 当前智能体id
    dialog_id: computed(() => dialogAsideStore.currentDialog?.id),
    // 会话id
    session_id: computed(() => dialogAsideStore.currentSession?.id),
    // 对话历史
    conversationList: computed(() => dialogAsideStore.conversationList),
    // 当前对话提问
    currentQuestion: ref(''),
    // 当前对话回答
    currentAnswer: ref(''),
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
    } as message);
    // 首先将问话放到对话列表中
    dialogAsideStore.addConversation({
      content: message,
      role: 'user',
    });
    const messages = dialogAsideStore.conversationList?.slice(); // 浅拷贝
    dialogAsideStore.addConversation(answerInfo);

    state.value.loadingStatus.send = true;
    // 然后创建会话
    if (!state.value.session_id) {
      const res = await C0002({ dialog_id: state.value.dialog_id || '' }).catch((error: any) => {
        state.value.loadingStatus.send = false;
        throw error;
      });
      dialogAsideStore.openSession({
        id: res.data.conversation_id,
        name: message || '',
        isActive: true,
        create_date: Date.now(),
      });
      // 如果最近智能体列表中没有，则追加进去
      dialogAsideStore.addRecentDialog(dialogAsideStore.currentDialog);
    }

    // 流式对话
    C0001({
      dialog_id: state.value.dialog_id || '',
      conversation_id: state.value.session_id || '',
      messages: messages as any,
    })
      .then(async (response) => {
        state.value.loadingStatus.send = false;
        answerInfo.showCursor = true;
        answerInfo.waiting = false;
        if (!response || !response.ok) {
          throw new Error('Network response was not ok');
        }

        const reader = response?.body?.getReader();
        if (!reader) {
          throw new Error('No reader');
        }
        const textDecoder = new TextDecoder();

        const renderHandle = async () => {
          const { done, value } = await reader.read();

          if (done) {
            answerInfo.showCursor = false;
            return;
          } else {
            requestAnimationFrame(renderHandle);
          }

          const chunkText = textDecoder.decode(value);
          try {
            // 尝试解析 JSON
            // const jsonData = JSON.parse(chunkText);
            // state.value.currentAnswer = jsonData.data?.answer;
            // answerInfo.content = state.value.currentAnswer;
            const normalizedString = chunkText.replace(/\r\n|\r/g, '\n');
            const normalList = normalizedString.split('\n').map(line => line.trim()).filter(line => line.length > 0);
            for(let cont of normalList) {
              // 尝试解析 JSON
              cont = cont.replaceAll('data:', '');
              const jsonData = JSON.parse(cont);
              if(jsonData.data == true) {
                break;
              }
              state.value.currentAnswer = jsonData.data?.answer;
              answerInfo.content = state.value.currentAnswer;
            }

          } catch (error) {
            console.error('Failed to parse JSON:', error);
            // 如果 JSON 解析失败，尝试提取错误信息中的 "answer" 字段
            const answerMatch = chunkText.match(/"answer":\s*"([^"]+)"/);
            if (answerMatch && answerMatch[1]) {
              state.value.currentAnswer = answerMatch[1]; // 提取 "answer" 字段的值
              answerInfo.content = state.value.currentAnswer as string;
            }
          }
          // state.value.currentAnswer = JSON.parse(chunkText).data?.answer;
          // answerInfo.content = state.value.currentAnswer;
        };

        requestAnimationFrame(renderHandle);

        return response;
      })
      .finally(() => {
        state.value.loadingStatus.send = false;
      });
  };

  const init = () => {
    // 聊天始终滚动到最底部
    watch(
      () => [state.value.currentAnswer, state.value.conversationList],
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
  return {
    state,
    fetchSendMsg,
  };
}

const { state, fetchSendMsg } = useBaseLogic();

/**
 * 页面跳转处理
 */
function useToPage() {
  const router = useRouter();

  // 当前窗口跳转
  const toPage = (name?: string, params?: RouteParamsGeneric, query?: LocationQueryRaw) => {
    if (!name) return;
    router.push({ name, params: params || {}, query: query || {} });
  };

  // 打开窗口
  const openPage = (name: string, params?: RouteParamsGeneric, query?: LocationQueryRaw) => {
    const href = router.resolve({ name, params: params || {}, query: query || {} });
    window.open(href.href, '_blank');
  };

  // 智能体对话跳转
  const toDialogPage = (dialog: IDialog) => {
    dialog.url = 'Chat';
    dialogAsideStore.setCurrentDialog(dialog);
    toPage(dialog.url, { id: dialog.id });
  };

  return {
    toPage,
    toDialogPage,
    openPage,
  };
}

const { openPage } = useToPage();
</script>

<template>
  <div class="conversation-container flex h-full flex-col items-center justify-center text-center">
    <div class="conversation-body no-scrollbar w-full min-w-[388px] max-w-[872px] flex-1 overflow-y-auto">
      <!-- 推荐引导 chatguide-->
      <div v-if="state.conversationList?.length === 0" className="flex flex-1 flex-col gap-4 p-4">
        <!-- :questions="dialogAsideStore.currentDialog?.default_question" -->
        <ChatGuide
          :desc="dialogAsideStore.currentDialog?.description"
          :dialog-id="dialogAsideStore.currentDialog?.id"
          :icon="dialogAsideStore.currentDialog?.icon"
          :loading="!dialogAsideStore.currentDialog || dialogAsideStore.loadingStatus.sessionLoading"
          :recommend="dialogAsideStore.currentDialog?.recommend"
          @add="openPage('Createbot')"
          @select-dialog="(dialog: any) => dialogAsideStore.setCurrentDialog(dialog)"
          @select-question="(question: string) => (state.currentQuestion = question)"
        />
      </div>
      <!-- 消息内容 -->
      <div v-else className="flex flex-1 flex-col gap-4 p-4">
        <div v-for="(item, index) in state.conversationList" :key="index" ref="conversationDomRef" className="w-full rounded-lg">
          <ChatItem :content="item.content" :role="item.role" :show-cursor="item.showCursor" :waiting="item.waiting" />
        </div>
      </div>
    </div>
    <div class="conversation-footer w-full min-w-[388px] max-w-[872px] p-2">
      <FChatInputArea v-model="state.currentQuestion" @send="fetchSendMsg" />
      <div class="policy-tip">
        <span>
          以上内容均由AI生成, 仅供参考和借鉴。 &nbsp;&nbsp;&nbsp;&nbsp;
          <a href="https://beian.miit.gov.cn/" rel="noopener noreferrer" target="_blank"> 粤ICP备2024344803号 </a>
          &nbsp;
          <a href="/agreement" rel="noopener noreferrer" target="_blank"> 用户协议 </a>
          |
          <a href="/privacypolicy" rel="noopener noreferrer" target="_blank"> 隐私政策 </a>
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.conversation-container {
  width: 100%;
  height: calc(100vh - var(--chat-nav-height) - 24px);
}

.policy-tip {
  margin-top: 8px;
  font-size: 12px;
  color: hsl(var(--input-placeholder));
  text-align: center;
}
</style>
