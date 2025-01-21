<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from 'vue';
import { type LocationQueryRaw, type RouteParamsGeneric, useRoute, useRouter } from 'vue-router';

import { K0003, K0005, K0014 } from '@/api/modules/a3';
import { useUserStore } from '@/store/modules/useUserStore';
import {
  DictItems,
  parser_configCommon,
  parserComponentShow,
  default_raptor_value,
  type ParserConfig,
  type ParserConfigCommon,
  parserDescriptions,
  type RaptorConfig,
} from '@/utils/Dictionary';
import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons-vue';
import { Form, message } from 'ant-design-vue';
import { i18n } from "@/locales/i18n";
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

defineProps<{
  modelValue?: boolean;
}>();
const userStore = useUserStore();
const useForm = Form.useForm;
const labelCol = { span: 24 };
const wrapperCol = { span: 24 };
const fileList = ref<any[]>([]);
const router = useRouter();
const route = useRoute();
// 当前窗口跳转
const toPage = (name: string, params?: RouteParamsGeneric, query?: LocationQueryRaw) => {
  router.push({ name, params: params || {}, query: query || {} });
};
interface ModelRef {
  id: string;
  kb_id: string;
  name: string;
  avatar: string;
  description: string;
  language: string;
  permission: string;
  embd_id: string;
  doc_num: number;
  parser_id: keyof ParserConfigCommon; // 限制 parser_id 为 ParserConfigCommon 的键
  parser_config: ParserConfig; // 使用 ParserConfig 类型
  pagerank: number; // 页面排名
}

const modelRef = reactive<ModelRef>({
  id: '',
  kb_id: '',
  name: '',
  avatar: '',
  description: '',
  language: '',
  permission: '',
  embd_id: '',
  doc_num: 0,
  pagerank: 0,
  parser_id: 'naive',
  parser_config: {
    auto_keywords: 0,
    auto_questions: 0,
    chunk_token_num: 128,
    delimiter: '\\n!?;。；！？',
    html4excel: false,
    layout_recognize: false,
    entity_types: null,
    raptor: {
      use_raptor: false,
      max_cluster: 64,
      max_token: 256,
      prompt: '',
      random_seed: 0,
      threshold: 0,
    },
  },
});
interface Model {
  available: boolean;
  create_date: string;
  create_time: number;
  fid: string;
  llm_name: string;
  max_tokens: number;
  model_type: string;
  status: string;
  tags: string;
  update_date: string;
  update_time: number;
}

interface Option {
  value: string;
  label: string;
  available: boolean;
  create_date?: string;
  create_time?: number;
  fid?: string;
  llm_name?: string;
  max_tokens?: number;
  model_type?: string;
  status?: string;
  tags?: string;
  update_date?: string;
  update_time?: number;
}

interface Result {
  label: string;
  options: Option[];
}

const modelRy = reactive<{
  rerankList: Result[] }>({
  rerankList: [],
});
const processData = (data: Record<string, Model[]>): Result[] => {
  const result: Result[] = [];

  for (const [provider, models] of Object.entries(data)) {
    // 过滤出 model_type 为 "rerank" 的模型
    const rerankModels = models.filter((model) => model.model_type === 'embedding' && model.available);
    if (rerankModels.length > 0) {
      const options: Option[] = rerankModels.map((model) => ({
        value: model.llm_name,
        label: model.llm_name,
        available: model.available,
        create_date: model.create_date,
        create_time: model.create_time,
        fid: model.fid,
        llm_name: model.llm_name,
        max_tokens: model.max_tokens,
        model_type: model.model_type,
        status: model.status,
        tags: model.tags,
        update_date: model.update_date,
        update_time: model.update_time,
      }));

      result.push({
        label: provider,
        options,
      });
    }
  }

  return result;
};
const modelRt = reactive({
  languageList: [
    {
      value: 'English',
      label: '英语',
    },
    {
      value: 'Chinese',
      label: '中文',
    },
  ],
  rerankList: [],
  spinning: false,
  currentDescription: parserDescriptions.naive,
  inputVisible: false,
  inputValue: '',
});

const { validate, validateInfos } = useForm(
  modelRef,
  reactive({
    name: [
      {
        required: true,
        message: t('common.required'),
      },
    ],
    language: [
      {
        required: true,
        message: t('common.required'),
      },
    ],
    'parser_config.delimiter': [
      {
        required: true,
        message: t('common.required'),
      },
    ],
    'parser_config.raptor.use_raptor': [
      {
        required: true,
        message: t('common.required'),
      },
    ],
  }),
);

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
    if (e.target?.result) {
      const base64 = e.target?.result as string;
      modelRef.avatar = base64;
      fileList.value = [{ url: base64 }];
    }
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
  modelRef.avatar = '';
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

const getRerankList = async () => {
  await K0005({}).then((res) => {
    const resData = res.data;
    modelRy.rerankList = processData(resData);
  });
};

const randomSeed = () => {
  const randomNumber = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
  (modelRef.parser_config.raptor as RaptorConfig).random_seed = randomNumber;
};
const defaultParserConfig: ParserConfig = {
  auto_keywords: null,
  auto_questions: null,
  chunk_token_num: null,
  delimiter: null,
  layout_recognize: null,
  html4excel: null,
  raptor: {},
  pages: null,
  entity_types: null,
};

const searshDataList = async () => {
  modelRt.spinning = true;
  const query = route.query;
  await K0003({ id: query.id })
    .then((res) => {
      Object.assign(modelRef, res.data);
      if (res.data.parser_config.pages) {
        const key = res.data.parser_id;
        modelRef.parser_config = { ...parser_configCommon[key as keyof typeof parser_configCommon] };
        modelRef.parser_config.pages = res.data.parser_config.pages;
      } else {
        const mergedParserConfig: ParserConfig = { ...defaultParserConfig, ...res.data.parser_config };
        modelRef.parser_config = { ...mergedParserConfig };
      }
      fileList.value = [{ url: res.data?.avatar }];
      modelRt.spinning = false;
    })
    .catch(() => {
      modelRt.spinning = false;
    });
};

const handleCancel = () => {
  const query = route.query;
  toPage('Dataset', { id: query.id as string }, { id: query.id });
};

const handleOk = () => {
  validate()
    .then(async () => {
      modelRef.kb_id = modelRef.id;
      await K0014(modelRef)
        .then(() => {
          message.success(t('message.operated'));
          const query = route.query;
          userStore.selectedKeys = ['1'];
          toPage('Dataset', { id: query.id as string }, { id: query.id });
        })
        .catch(() => {
          message.error(t('message.failed'));
        });
    })
    .catch((error) => {
      console.log('error', error);
    });
};

const parserChange = (value: string, option: any) => {
  console.log('value', value);
  console.log('option', option);
  modelRt.currentDescription = parserDescriptions[value as keyof typeof parserDescriptions];
  const pages = modelRef.parser_config.pages;
  modelRef.parser_config = { ...parser_configCommon[value as keyof typeof parser_configCommon] };
  if (pages) {
    modelRef.parser_config.pages = pages;
  }
};

const useRaptorChange = (checked: boolean) => {
  const key = modelRef.parser_id;
  if (checked && !(modelRef.parser_config.raptor as RaptorConfig).prompt) {
    modelRef.parser_config.raptor = parser_configCommon[key as keyof typeof parser_configCommon].raptor;
    (modelRef.parser_config.raptor as RaptorConfig).use_raptor = checked;
  }
};

const checkValueInKey = (value: string): boolean => {
  // 获取对应 key 的数组
  const values = parserComponentShow[modelRef.parser_id as keyof typeof parserComponentShow] as string[];
  // 检查 value 是否存在于数组中
  return values.includes(value);
};
const inputRef = ref();

const handleClose = (removedTag: string) => {
  const tags = modelRef.parser_config.entity_types.filter((tag: string) => tag !== removedTag);
  modelRef.parser_config.entity_types = tags;
};

const showInput = () => {
  modelRt.inputVisible = true;
  nextTick(() => {
    inputRef.value.focus();
  });
};

const handleInputConfirm = () => {
  const inputValue = modelRt.inputValue;
  let tags = modelRef.parser_config.entity_types;
  if (inputValue && !tags.includes(inputValue)) {
    tags = [...tags, inputValue];
  }
  modelRef.parser_config.entity_types = tags;
  modelRt.inputVisible = false;
  modelRt.inputValue = '';
};

onMounted(() => {
  getRerankList();
  searshDataList();
});
</script>

<template>
  <div class="content___kPak3">
    <div class="configurationWrapper___I5Kdy">
      <p style="font-size: 16px; font-weight: bold; font-family: Inter">{{t('knowledgeDetails.configuration')}}</p>
      <p>{{t('knowledgeConfiguration.titleDescription')}}</p>
      <a-divider dashed style="margin: 24px 0; border-block-start: 1px solid rgba(5, 5, 5, 0.06)" />
      <div>
        <div class="ant-spin-container">
          <a-row style="margin-left: -16px; margin-right: -16px">
            <a-col :span="8" style="padding-left: 16px; padding-right: 16px">
              <ASpin :spinning="modelRt.spinning" size="large">
                <a-form :label-col="labelCol" :wrapper-col="wrapperCol">
                  <a-form-item :label="t('knowledgeConfiguration.name')" v-bind="validateInfos.name">
                    <a-input v-model:value="modelRef.name" :placeholder="t('common.pleaseInput')" />
                  </a-form-item>
                  <a-form-item :label="t('knowledgeConfiguration.photo')">
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
                        <PlusOutlined color="#d9d9d9" />
                        <div style="margin-top: 8px">{{t('knowledgeConfiguration.upload')}}</div>
                      </div>
                    </a-upload>
                  </a-form-item>
                  <a-form-item :label="t('knowledgeConfiguration.description')">
                    <a-input v-model:value="modelRef.description" />
                  </a-form-item>
                  <a-form-item :label="t('knowledgeConfiguration.language')" v-bind="validateInfos.language">
                    <a-select v-model:value="modelRef.language" :options="modelRt.languageList" />
                  </a-form-item>
                  <a-form-item>
                    <template #label>
                      {{t('knowledgeConfiguration.permissions')}}
                      <a-tooltip placement="top">
                        <template #title>
                          <span> {{t('knowledgeConfiguration.permissionsTip')}} </span>
                        </template>
                        <QuestionCircleOutlined style="margin-left: 8px" />
                      </a-tooltip>
                    </template>
                    <a-radio-group v-model:value="modelRef.permission">
                      <a-radio value="me">{{t('knowledgeConfiguration.me')}}</a-radio>
                      <a-radio value="team">{{t('knowledgeConfiguration.team')}}</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item>
                    <template #label>
                      {{t('knowledgeConfiguration.embeddingModel')}}
                      <a-tooltip placement="top">
                        <template #title>
                          <span> {{t('knowledgeConfiguration.embeddingModelTip')}} </span>
                        </template>
                        <QuestionCircleOutlined style="margin-left: 8px" />
                      </a-tooltip>
                    </template>
                    <a-select v-model:value="modelRef.embd_id" :disabled="modelRef.doc_num !== 0" :options="modelRy.rerankList" />
                  </a-form-item>
                  <a-form-item>
                    <template #label>
                      {{t('knowledgeConfiguration.chunkMethod')}}
                      <a-tooltip placement="top">
                        <template #title>
                          <span> {{t('knowledgeConfiguration.chunkMethodTip')}}</span>
                        </template>
                        <QuestionCircleOutlined style="margin-left: 8px" />
                      </a-tooltip>
                    </template>
                    <a-select v-model:value="modelRef.parser_id" :disabled="modelRef.doc_num !== 0" :options="DictItems" @change="parserChange" />
                  </a-form-item>
                  <a-form-item v-if="checkValueInKey('entity_types')">
                    <template #label> {{t('knowledgeConfiguration.entityTypes')}} </template>
                    <template v-for="tag in modelRef.parser_config.entity_types || []" :key="tag">
                      <a-tag closable @close="handleClose(tag)">
                        {{ tag }}
                      </a-tag>
                    </template>
                    <a-input
                      v-if="modelRt.inputVisible"
                      ref="inputRef"
                      v-model:value="modelRt.inputValue"
                      :style="{ width: '78px' }"
                      size="small"
                      type="text"
                      @blur="handleInputConfirm"
                      @keyup.enter="handleInputConfirm"
                    />
                    <a-tag v-else style="background: #fff; border-style: dashed" @click="showInput">
                      <PlusOutlined />
                    </a-tag>
                  </a-form-item>
                  <a-form-item v-if="checkValueInKey('pagerank')">
                    <template #label>
                      {{t('knowledgeConfiguration.pageRank')}}
                      <a-tooltip placement="top">
                        <template #title>
                          <span>
                            {{t('knowledgeConfiguration.pageRankTip')}}
                          </span>
                        </template>
                        <QuestionCircleOutlined style="margin-left: 8px" />
                      </a-tooltip>
                    </template>
                    <a-row>
                      <a-col :span="18">
                        <a-slider v-model:value="modelRef.pagerank" :max="100" :min="0" :step="0.1" />
                      </a-col>
                      <a-col :span="6">
                        <a-input-number v-model:value="modelRef.pagerank" :max="100" :min="0" style="margin-left: 16px" />
                      </a-col>
                    </a-row>
                  </a-form-item>
                  <a-form-item v-if="checkValueInKey('auto_keywords')">
                    <template #label>
                      {{t('knowledgeDetails.autoKeywords')}}
                      <a-tooltip placement="top">
                        <template #title>
                          <span>
                            {{t('knowledgeDetails.autoKeywordsTip')}}
                          </span>
                        </template>
                        <QuestionCircleOutlined style="margin-left: 8px" />
                      </a-tooltip>
                    </template>
                    <a-row>
                      <a-col :span="18">
                        <a-slider v-model:value="modelRef.parser_config.auto_keywords" :max="30" :min="0" :step="0.1" />
                      </a-col>
                      <a-col :span="6">
                        <a-input-number v-model:value="modelRef.parser_config.auto_keywords" :max="30" :min="0" style="margin-left: 16px" />
                      </a-col>
                    </a-row>
                  </a-form-item>
                  <a-form-item v-if="checkValueInKey('auto_questions')">
                    <template #label>
                      {{t('knowledgeDetails.autoQuestions')}}
                      <a-tooltip placement="top">
                        <template #title>
                          <span>
                            {{t('knowledgeDetails.autoQuestionsTip')}}
                          </span>
                        </template>
                        <QuestionCircleOutlined style="margin-left: 8px" />
                      </a-tooltip>
                    </template>
                    <a-row>
                      <a-col :span="18">
                        <a-slider v-model:value="modelRef.parser_config.auto_questions" :max="10" :min="0" :step="0.1" />
                      </a-col>
                      <a-col :span="6">
                        <a-input-number v-model:value="modelRef.parser_config.auto_questions" :max="10" :min="0" style="margin-left: 16px" />
                      </a-col>
                    </a-row>
                  </a-form-item>
                  <a-form-item v-if="checkValueInKey('chunk_token_num')">
                    <template #label>
                      {{t('knowledgeConfiguration.chunkTokenNumber')}}
                      <a-tooltip placement="top">
                        <template #title>
                          <span> {{t('knowledgeConfiguration.chunkTokenNumberTip')}} </span>
                        </template>
                        <QuestionCircleOutlined style="margin-left: 8px" />
                      </a-tooltip>
                    </template>
                    <a-row>
                      <a-col :span="18">
                        <a-slider
                          v-model:value="modelRef.parser_config.chunk_token_num"
                          :max="modelRef.parser_id === 'naive' ? 2048 : 8192"
                          :min="0"
                          :step="1"
                        />
                      </a-col>
                      <a-col :span="6">
                        <a-input-number v-model:value="modelRef.parser_config.chunk_token_num" :max="2048" :min="0" style="margin-left: 16px" />
                      </a-col>
                    </a-row>
                  </a-form-item>
                  <a-form-item :label="t('knowledgeDetails.delimiter')" v-bind="validateInfos['parser_config.delimiter']" v-if="checkValueInKey('delimiter')">
                    <a-input v-model:value="modelRef.parser_config.delimiter" placeholder="请录入" />
                  </a-form-item>
                  <a-form-item v-if="checkValueInKey('layout_recognize')">
                    <template #label>
                      {{t('knowledgeDetails.layoutRecognize')}}
                      <a-tooltip placement="top">
                        <template #title>
                          <span>
                            {{t('knowledgeDetails.layoutRecognizeTip')}}
                          </span>
                        </template>
                        <QuestionCircleOutlined style="margin-left: 8px" />
                      </a-tooltip>
                    </template>
                    <a-switch v-model:checked="modelRef.parser_config.layout_recognize" />
                  </a-form-item>
                  <a-form-item v-if="checkValueInKey('html4excel')">
                    <template #label>
                      {{t('knowledgeDetails.html4excel')}}
                      <a-tooltip placement="top">
                        <template #title>
                          <span> {{t('knowledgeDetails.html4excelTip')}} </span>
                        </template>
                        <QuestionCircleOutlined style="margin-left: 8px" />
                      </a-tooltip>
                    </template>
                    <a-switch v-model:checked="modelRef.parser_config.html4excel" />
                  </a-form-item>
                  <a-form-item v-if="checkValueInKey('use_raptor')" >
                    <template #label>
                      {{t('knowledgeConfiguration.useRaptor')}}
                      <a-tooltip placement="top">
                        <template #title>
                          <span> {{t('knowledgeConfiguration.useRaptorTip')}} </span>
                        </template>
                        <QuestionCircleOutlined style="margin-left: 8px" />
                      </a-tooltip>
                    </template>
                    <a-switch v-model:checked="(modelRef.parser_config.raptor as RaptorConfig).use_raptor" @change="useRaptorChange" />
                  </a-form-item>
                  <a-form-item v-if="modelRef.parser_config?.raptor?.use_raptor || false" v-bind="validateInfos['parser_config.raptor.use_raptor']">
                    <template #label>
                      {{t('knowledgeConfiguration.prompt')}}
                      <a-tooltip placement="top">
                        <template #title>
                          <span> {{t('knowledgeConfiguration.promptTip')}} </span>
                        </template>
                        <QuestionCircleOutlined style="margin-left: 8px" />
                      </a-tooltip>
                    </template>
                    <a-textarea v-model:value="modelRef.parser_config.raptor.prompt" :rows="4" />
                  </a-form-item>
                  <a-form-item v-if="modelRef.parser_config?.raptor?.use_raptor || false">
                    <template #label>
                      {{t('knowledgeConfiguration.maxToken')}}
                      <a-tooltip placement="top">
                        <template #title>
                          <span> {{t('knowledgeConfiguration.maxTokenTip')}}</span>
                        </template>
                        <QuestionCircleOutlined style="margin-left: 8px" />
                      </a-tooltip>
                    </template>
                    <a-row>
                      <a-col :span="18">
                        <a-slider v-model:value="modelRef.parser_config.raptor.max_token" :max="2048" :min="0" :step="1" />
                      </a-col>
                      <a-col :span="6">
                        <a-input-number v-model:value="modelRef.parser_config.raptor.max_token" :max="2048" :min="0" style="margin-left: 16px" />
                      </a-col>
                    </a-row>
                  </a-form-item>
                  <a-form-item v-if="modelRef.parser_config?.raptor?.use_raptor || false">
                    <template #label>
                      {{t('knowledgeConfiguration.threshold')}}
                      <a-tooltip placement="top">
                        <template #title>
                          <span> {{t('knowledgeConfiguration.thresholdTip')}} </span>
                        </template>
                        <QuestionCircleOutlined style="margin-left: 8px" />
                      </a-tooltip>
                    </template>
                    <a-row>
                      <a-col :span="18">
                        <a-slider v-model:value="modelRef.parser_config.raptor.threshold" :max="1" :min="0" :step="0.1" />
                      </a-col>
                      <a-col :span="6">
                        <a-input-number v-model:value="modelRef.parser_config.raptor.threshold" :max="1" :min="0" :step="0.1" style="margin-left: 16px" />
                      </a-col>
                    </a-row>
                  </a-form-item>
                  <a-form-item v-if="modelRef.parser_config?.raptor?.use_raptor || false">
                    <template #label>
                      {{t('knowledgeConfiguration.maxCluster')}}
                      <a-tooltip placement="top">
                        <template #title>
                          <span> {{t('knowledgeConfiguration.maxClusterTip')}} </span>
                        </template>
                        <QuestionCircleOutlined style="margin-left: 8px" />
                      </a-tooltip>
                    </template>
                    <a-row>
                      <a-col :span="18">
                        <a-slider v-model:value="modelRef.parser_config.raptor.max_cluster" :max="1024" :min="0" :step="1" />
                      </a-col>
                      <a-col :span="6">
                        <a-input-number v-model:value="modelRef.parser_config.raptor.max_cluster" :max="1024" :min="0" style="margin-left: 16px" />
                      </a-col>
                    </a-row>
                  </a-form-item>
                  <a-form-item v-if="modelRef.parser_config?.raptor?.use_raptor || false" :label="t('knowledgeConfiguration.randomSeed')">
                    <a-row>
                      <a-col :span="18">
                        <a-input-number v-model:value="modelRef.parser_config.raptor.random_seed" :min="0" style="width: 100%" />
                      </a-col>
                      <a-col :span="6">
                        <a-button style="margin-left: 16px" type="primary" @click="randomSeed">
                          <template #icon>
                            <PlusOutlined />
                          </template>
                        </a-button>
                      </a-col>
                    </a-row>
                  </a-form-item>
                  <a-form-item>
                    <div style="display: flex; justify-content: end">
                      <a-space>
                        <a-button @click="handleCancel">{{ t('common.cancel_button') }}</a-button>
                        <a-button type="primary" @click="handleOk">{{ t('common.save') }}</a-button>
                      </a-space>
                    </div>
                  </a-form-item>
                </a-form>
              </ASpin>
            </a-col>
            <a-col :span="16" style="padding-left: 16px; padding-right: 16px">
              <div v-if="modelRt.currentDescription" v-html="modelRt.currentDescription"></div>
            </a-col>
          </a-row>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
.content___kPak3 {
  background-color: #fff;
  margin-top: 16px;
  flex: 1 1;
}
.configurationWrapper___I5Kdy {
  padding: 0 52px;
}
.ant-spin-container {
  position: relative;
  transition: opacity 0.3s;
}
</style>
