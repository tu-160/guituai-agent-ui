<script setup lang="ts">
import type LogicFlow from '@logicflow/core';
import type { Model } from '@logicflow/core';
import { i18n } from "@/locales/i18n";
const t = i18n.global.t;

import { inject, onMounted, reactive, type Ref } from 'vue';

import { Icon } from '@future-core/icons';

import { K0005 } from '@/api/modules/a3';

import { useHandleFlow } from '../hook-property';

export interface ILlm {
  frequency_penalty?: number;
  llm_id: string;
  max_tokens?: number;
  message_history_window_size?: number;
  presence_penalty?: number;
  temperature?: number;
  top_p?: number;
}

const dataProp = defineModel<ILlm>('data', { required: true });

function useBaseLogic(_props: any, _dataProp: any, _useFlow: any, _currentNodeModel?: Ref<Model.BaseModel>, _lfInstance?: Ref<LogicFlow>) {
  const modelRt = reactive({
    activeKey: [],
    llmArr: [
      { value: 'deepseek-chat@DeepSeek', label: 'deepseek-chat' },
      { value: 'deepseek-coder@DeepSeek', label: 'deepseek-coder' },
    ],
  });
  return { modelRt };
}

const lfInstance = inject<Ref<LogicFlow>>('logicFlowInstance');
const currentNodeModel = inject<Ref<Model.BaseModel>>('currentNodeInfo');
const useFlow = useHandleFlow(currentNodeModel, lfInstance);
const { modelRt } = useBaseLogic({}, dataProp, useFlow, currentNodeModel, lfInstance);
interface Model1 {
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

const modelRy = reactive<{ rerankList: Result[] }>({
  rerankList: [],
});
const processData = (data: Record<string, Model1[]>): Result[] => {
  const result: Result[] = [];

  for (const [provider, models] of Object.entries(data)) {
    // 过滤出 model_type 为 "rerank" 的模型
    const rerankModels = models.filter((model) => model.model_type === 'chat' && model.available);

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
const getRerankList = async () => {
  await K0005({}).then((res) => {
    const resData = res.data;
    modelRy.rerankList = processData(resData);
  });
};
onMounted(() => {
  getRerankList();
});
</script>

<template>
  <a-collapse v-model:active-key="modelRt.activeKey" :bordered="false" class="mt-6 w-full rounded-md">
    <template #expandIcon="{ isActive }">
      <Icon :class="{ 'rotate-90': isActive }" class="transition-transform" icon="lucide:chevron-right" />
    </template>
    <a-collapse-panel key="2" :header="`${t('chat.model')}: ${dataProp.llm_id}`">
      <a-form-item :label="t('chat.model')">
        <a-select v-model:value="dataProp.llm_id" :options="modelRy.rerankList" />
      </a-form-item>
      <a-form-item :label="t('chat.temperature')" :tooltip="t('chat.temperatureTip')">
        <a-slider v-model:value="dataProp.temperature" :max="1" :min="0" :step="0.1" />
      </a-form-item>
      <a-form-item :label="t('chat.topP')" :tooltip="t('chat.topPTip')">
        <a-slider v-model:value="dataProp.top_p" :max="1" :min="0" :step="0.1" />
      </a-form-item>
      <a-form-item label="t('chat.presencePenalty')" :tooltip="t('chat.presencePenaltyTip')">
        <a-slider v-model:value="dataProp.presence_penalty" :max="1" :min="0" :step="0.1" />
      </a-form-item>
      <a-form-item :label="t('chat.frequencyPenalty')" :tooltip="t('chat.frequencyPenaltyTip')">
        <a-slider v-model:value="dataProp.frequency_penalty" :max="1" :min="0" :step="0.1" />
      </a-form-item>
      <a-form-item :label="t('chat.maxTokens')" :tooltip="t('chat.maxTokensTip')">
        <a-slider v-model:value="dataProp.max_tokens" :max="100000" :min="0" :step="1" />
      </a-form-item>
    </a-collapse-panel>
  </a-collapse>
</template>
