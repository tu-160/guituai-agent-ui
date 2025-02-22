<script setup lang="ts">
import { nextTick, onMounted, reactive, ref, toRaw, watch } from 'vue';
import { type LocationQueryRaw, type RouteParamsGeneric, useRoute, useRouter } from 'vue-router';

import { ScrollArea } from '@future-core/shadcn-ui';

import { C0001, C0002, C0013, K0001 } from '@/api';
import { D0001, D0002 } from '@/api/modules/a2';
import BaseContainer from '@/components/base-container/index.vue';
import ChatItem from '@/components/chat-item/index.vue';
import FChatInputArae from '@/components/f-chat-Input-area/index.vue';
import { Form, message } from 'ant-design-vue';
import { ArrowLeft, Plus } from 'lucide-vue-next';
import { i18n } from "@/locales/i18n";
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

defineProps<{
  modelValue?: boolean;
}>();

const useForm = Form.useForm;

const labelCol = { span: 4 };
const wrapperCol = { span: 18 };

const fileList = ref<any[]>([]);

const router = useRouter();
const route = useRoute();
const toPage = (name: string, params?: RouteParamsGeneric, query?: LocationQueryRaw) => {
  router.push({ name, params: params || {}, query: query || {} });
};

const modelRef = reactive({
  name: '', // 名称
  description: '', // 简介
  icon: '', // 头像
  prompt_config: {
    refine_multiturn: true, // 多轮对话优化
    empty_response: '', // 空回复
    prologue: t('chat.setAnOpenerInitial'), // 开场白
    system: t('chat.systemInitialValue',{knowledge: '{knowledge}'}), // 提示语
  },
  top_n: 8, // top_n（0-30）
  similarity_threshold: 0.2, // 相似度阈值（0-1）
  vector_similarity_weight: 0.5, // 向量相似度权重（0-1）
  llm_setting: {
    temperature: 0.1, // 温度
    top_p: 0.3, // top_p
    max_tokens: 1024, // 最大token数
    presence_penalty: 0.4, // 重复惩罚
    frequency_penalty: 0.6, // 频率惩罚
    do_sample: true, // 是否采样
    stream: true, // 是否流式输出
  },
  id: '',
  llm_id: 'deepseek-r1-distill-qwen@Xinference',
  default_question: ['', '', '', ''], // 预设问题
  kb_ids: [],
  dialog_id: '',
});

const modelRt = reactive({
  spinning: false,
  kbList: [],
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

const beforeUpload = (file: File) => {
  const isLt500k = file.size / 1024 < 500;
  if (!isLt500k) {
    message.error(t('chat.imageSize'));
  }
  return isLt500k;
};

const customRequest = (options: any) => {
  const file = options.file as File;
  // 创建 FileReader 对象
  const reader = new FileReader();
  // 文件读取完成后的回调函数
  reader.addEventListener('load', (e) => {
    const base64 = e.target?.result as string;
    modelRef.icon = base64;
    fileList.value = [{ url: base64 }];
  });

  reader.readAsDataURL(file);
};

const handleChange = (info: any) => {
  if (info.file.status === 'done') {
    message.success(t('message.uploaded'));
  } else if (info.file.status === 'error') {
    message.error(t('chat.uploadFailed'));
  }
};

const handleRemove = () => {
  // 清空文件列表
  fileList.value = [];
};

const handlePreview = (file: any) => {
  const img = new Image();
  img.src = file.url; // Base64 URL
  const newWin = window.open('', '_blank');
  if (newWin?.document) {
    newWin.document.title = file.url; // 新页面标签顶部的标题
    newWin.document.body.append(img);
  }
};
const { resetFields, validate, validateInfos } = useForm(
  modelRef,
  reactive({
    name: [
      {
        required: true,
        message: t('common.required'),
      },
    ],
    'prompt_config.system': [
      {
        required: true,
        message: t('common.required'),
      },
    ],
    kb_ids: [
      {
        required: true,
        message: t('common.required'),
      },
    ],
  }),
);

const onSubmit = () => {
  validate()
    .then(async (res) => {
      console.log(res, toRaw(modelRef));
      const response = await D0001(modelRef);
      if (response) {
        message.success(route.query?.dialog_id ? t('message.modified') : t('message.created'));
        toPage('Mybot');
      } else {
        message.error(route.query?.dialog_id ? t('message.failed') : t('message.failed'));
      }
    })
    .catch((error) => {
      console.log('error', error);
    });
};
const reset = () => {
  resetFields();
  toPage('Mybot');
};
const getAgentList = async (params: any) => {
  modelRt.spinning = true;
  modelChat.dialog_id = params?.dialog_id;
  modelRef.dialog_id = params?.dialog_id;
  await D0002(params)
    .then(async (res) => {
      Object.assign(modelRef, res.data);
      await C0013({ dialog_id: res.data.id }).then((resp) => {
        debugger
        modelRef.default_question = resp.data;
      });
      fileList.value = [{ url: res.data?.icon }];
      modelRt.spinning = false;
    })
    .catch(() => {
      modelRt.spinning = false;
    });
};

// const backRouter = () => {
//   // if (window.opener && !window.opener.closed) {
//   //   window.close();
//   // } else {
//   //   router.go(-1);
//   // }
//   router.push('Mybot');
// };

const updateModel = async (model: any) => {
  await D0001(model)
    .then((res) => {
      modelRef.id = res.data?.id;
      modelRef.dialog_id = res.data?.id;
      modelChat.dialog_id = res.data?.id;
      // Object.assign(modelRef, res.data);
    })
    .catch(() => {
      message.error(route.query?.dialog_id ? t('message.failed') : t('message.failed'));
    });
};
const handleFormChange = () => {
  updateModel(modelRef);
};

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
  // 然后创建会话
  if (!modelChat.session_id) {
    const res = await C0002({ dialog_id: modelChat.dialog_id || '' }).catch((error: any) => {
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
        const { done, value } = await reader.read();
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
          for(let cont of normalList) {
            // 尝试解析 JSON
            cont = cont.replaceAll('data:', '');
            const jsonData = JSON.parse(cont);
            if(jsonData.data == true) {
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
const getKbList = async () => {
  const params = {
    page: 1,
    page_size: 150,
    orderby: 'create_time',
    desc: 'True',
    keywords: '',
  };
  await K0001(params).then((res) => {
    const resData = res.data?.kbs;
    modelRt.kbList = resData.map((item: any) => ({
      label: item.name,
      value: item.id,
    }));
  });
};
onMounted(() => {
  const params = route.query;
  if (Object.keys(params).length > 0) {
    getAgentList(route.query);
  }
  getKbList();
});
</script>

<template>
  <BaseContainer>
    <div class="panel flex h-full w-full">
      <div class="left-panel h-full overflow-hidden border-r border-solid border-slate-200">
        <ScrollArea class="flex h-full">
          <ASpin :spinning="modelRt.spinning" size="large">
            <div>
              <div class="nav flex items-center gap-2 text-xl font-semibold">
                <ArrowLeft @click="toPage('Mybot')" />{{ route.query?.dialog_id ? t('chat.editingAgent') : t('chat_index.createAgent') }}
              </div>
              <div class="content mt-4">
<!--                <a-form :label-col="labelCol" :wrapper-col="wrapperCol" @change="handleFormChange">-->
                <a-form :label-col="labelCol" :wrapper-col="wrapperCol">
                  <a-form-item> {{ t('chat.basicInformation') }} </a-form-item>
                  <a-row :gutter="2">
                    <a-col :span="16">
                      <a-form-item :label-col="{ span: 6 }" :label="t('chat.assistantName')" v-bind="validateInfos.name">
                        <a-input v-model:value="modelRef.name" :placeholder="t('chat.namePlaceholder')" />
                      </a-form-item>
                      <a-form-item :label-col="{ span: 6 }" :label="t('chat.description')" v-bind="validateInfos.description">
                        <a-textarea v-model:value="modelRef.description" :rows="3" placeholder="" />
                      </a-form-item>
                    </a-col>
                    <a-col :span="8">
                      <a-form-item :colon="false" label=" ">
                        <a-upload
                          :before-upload="beforeUpload"
                          :custom-request="customRequest"
                          :file-list="fileList"
                          accept=".gif,.jpeg,.png,.jpg,.bmp,"
                          list-type="picture-card"
                          @change="handleChange"
                          @preview="handlePreview"
                          @remove="handleRemove"
                        >
                          <div v-if="fileList.length === 0" class="flex flex-col items-center justify-center">
                            <Plus color="#d9d9d9" />
                            <div style="margin-top: 8px">{{ t('chat.assistantAvatar') }}</div>
                          </div>
                        </a-upload>
                      </a-form-item>
                    </a-col>
                  </a-row>
                  <a-form-item :label="t('chat.emptyResponse')" v-bind="validateInfos['prompt_config.empty_response']">
                    <a-input v-model:value="modelRef.prompt_config.empty_response" placeholder="" />
                  </a-form-item>
                  <a-form-item :label="t('chat.setAnOpener')" v-bind="validateInfos['prompt_config.prologue']">
                    <a-textarea v-model:value="modelRef.prompt_config.prologue" :rows="3" placeholder="" />
                  </a-form-item>
                  <!--   <a-form-item label="预设置问题" v-bind="validateInfos['sub.name']">
                <a-textarea v-model:value="modelRef.default_question" :rows="3" />
              </a-form-item> -->

                  <a-form-item
                    v-for="(domain, index) in modelRef.default_question"
                    :key="index"
                    :colon="index === 0"
                    :label="index === 0 ? t('chat.presetQuestions') : ' '"
                    :name="['modelRef.default_question', index]"
                  >
                    <a-input v-model:value="modelRef.default_question[index]" placeholder="" />
                  </a-form-item>

                  <a-form-item> {{ t('chat.instructions') }} </a-form-item>
                  <a-form-item :label="t('chat.system')" v-bind="validateInfos['prompt_config.system']">
                    <a-textarea v-model:value="modelRef.prompt_config.system" :rows="6" placeholder="" />
                  </a-form-item>
                  <a-form-item :label="t('knowledgeDetails.similarityThreshold')" v-bind="validateInfos['sub.name']">
                    <a-row>
                      <a-col :span="18">
                        <a-slider v-model:value="modelRef.similarity_threshold" :max="1" :min="0" :step="0.1" />
                      </a-col>
                      <a-col :span="6">
                        <a-input-number v-model:value="modelRef.similarity_threshold" :max="1" :min="0" :step="0.1" style="margin-left: 16px" />
                      </a-col>
                    </a-row>
                  </a-form-item>
                  <a-form-item :label="t('knowledgeDetails.vectorSimilarityWeight')" v-bind="validateInfos['sub.name']">
                    <a-row>
                      <a-col :span="18">
                        <a-slider v-model:value="modelRef.vector_similarity_weight" :max="1" :min="0" :step="0.1" />
                      </a-col>
                      <a-col :span="6">
                        <a-input-number v-model:value="modelRef.vector_similarity_weight" :max="1" :min="0" :step="0.1" style="margin-left: 16px" />
                      </a-col>
                    </a-row>
                  </a-form-item>
                  <a-form-item :label="t('chat.topP')" v-bind="validateInfos.top_n">
                    <a-row>
                      <a-col :span="18">
                        <a-slider v-model:value="modelRef.top_n" :max="30" :min="1" />
                      </a-col>
                      <a-col :span="6">
                        <a-input-number v-model:value="modelRef.top_n" :max="30" :min="1" style="margin-left: 16px" />
                      </a-col>
                    </a-row>
                  </a-form-item>
                  <a-form-item :label="t('chat.multiTurn')" v-bind="validateInfos.refine_multiturn">
                    <a-switch v-model:checked="modelRef.prompt_config.refine_multiturn" />
                  </a-form-item>

                  <a-form-item> {{t('chat.intelligentParameters')}} </a-form-item>
                  <a-form-item :label="t('chat.temperature')" v-bind="validateInfos['llm_setting.temperature']">
                    <a-row>
                      <a-col :span="18">
                        <a-slider v-model:value="modelRef.llm_setting.temperature" :max="1" :min="0" :step="0.1" />
                      </a-col>
                      <a-col :span="6">
                        <a-input-number v-model:value="modelRef.llm_setting.temperature" :max="1" :min="0" :step="0.1" style="margin-left: 16px" />
                      </a-col>
                    </a-row>
                  </a-form-item>
                  <a-form-item :label="t('chat.topP')" v-bind="validateInfos['llm_setting.top_p']">
                    <a-row>
                      <a-col :span="18">
                        <a-slider v-model:value="modelRef.llm_setting.top_p" :max="1" :min="0" :step="0.1" />
                      </a-col>
                      <a-col :span="6">
                        <a-input-number v-model:value="modelRef.llm_setting.top_p" :max="1" :min="0" :step="0.1" style="margin-left: 16px" />
                      </a-col>
                    </a-row>
                  </a-form-item>
                  <a-form-item :label="t('chat.presencePenalty')" v-bind="validateInfos['llm_setting.presence_penalty']">
                    <a-row>
                      <a-col :span="18">
                        <a-slider v-model:value="modelRef.llm_setting.presence_penalty" :max="1" :min="0" :step="0.1" />
                      </a-col>
                      <a-col :span="6">
                        <a-input-number v-model:value="modelRef.llm_setting.presence_penalty" :max="1" :min="0" :step="0.1" style="margin-left: 16px" />
                      </a-col>
                    </a-row>
                  </a-form-item>
                  <a-form-item :label="t('chat.frequencyPenalty')" v-bind="validateInfos['llm_setting.frequency_penalty']">
                    <a-row>
                      <a-col :span="18">
                        <a-slider v-model:value="modelRef.llm_setting.frequency_penalty" :max="1" :min="0" :step="0.1" />
                      </a-col>
                      <a-col :span="6">
                        <a-input-number v-model:value="modelRef.llm_setting.frequency_penalty" :max="1" :min="0" :step="0.1" style="margin-left: 16px" />
                      </a-col>
                    </a-row>
                  </a-form-item>
                  <a-form-item :label="t('chat.maxTokens')" v-bind="validateInfos['llm_setting.max_tokens']">
                    <a-input-number v-model:value="modelRef.llm_setting.max_tokens" :max="8192" :min="0" style="margin-left: 16px" />
                  </a-form-item>
                  <a-form-item :label="t('chat.knowledgeBases')" v-bind="validateInfos.kb_ids">
                    <a-select v-model:value="modelRef.kb_ids" :options="modelRt.kbList" mode="multiple" />
                  </a-form-item>

                  <a-form-item :wrapper-col="{ span: 24 }" class="flex justify-center">
                    <a-button style="margin-left: 10px" @click="reset">{{t('common.cancel_button')}}</a-button>
                    <a-button style="margin-left: 10px" type="primary" @click.prevent="onSubmit">
<!--                      {{ route.query?.dialog_id ? '修改' : '创建' }}-->
                      {{ t('common.save') }}
                    </a-button>
                  </a-form-item>
                </a-form>
              </div>
            </div>
          </ASpin>
        </ScrollArea>
      </div>
      <div class="right-panel">
        <div class="conversation-container flex h-full flex-col items-center justify-center text-center">
          <div class="nav flex w-full items-center justify-start gap-2 px-4 text-xl font-semibold">{{ t('chat.debugging') }}</div>

          <!-- <div class="flex flex-col px-4"> -->
          <div class="conversation-body no-scrollbar max-h-[872px] min-h-[388px] w-full flex-1 overflow-y-auto px-4">
            <!-- 消息内容 -->
            <div v-if="modelChat.conversationList?.length !== 0" className="flex flex-1 flex-col gap-4 p-4">
              <div v-for="(item, index) in modelChat.conversationList" :key="index" ref="conversationDomRef" className="w-full rounded-lg">
                <ChatItem :content="item.content" :role="item.role" :show-cursor="item.showCursor" :waiting="item.waiting" />
              </div>
            </div>
          </div>
          <div class="conversation-footer mt-auto w-full p-2">
            <FChatInputArae v-model="modelChat.currentQuestion" @send="fetchSendMsg" />
            <div class="policy-tip">
              <span>
                以上内容均由AI生成, 仅供参考和借鉴。 &nbsp;&nbsp;&nbsp;&nbsp;
<!--                <a href="https://beian.miit.gov.cn/" rel="noopener noreferrer" target="_blank"> 粤ICP备2024344803号 </a>
                &nbsp;
                <a href="/agreement" rel="noopener noreferrer" target="_blank"> 用户协议 </a>
                |
                <a href="/privacypolicy" rel="noopener noreferrer" target="_blank"> 隐私政策 </a>-->
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </BaseContainer>
</template>

<style lang="scss" scoped>
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
