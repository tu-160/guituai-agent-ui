<script setup lang="ts">
import type LogicFlow from '@logicflow/core';
import type { Model } from '@logicflow/core';
import { i18n } from "@/locales/i18n";
const t = i18n.global.t;

import {inject, provide, reactive, type Ref, watch} from 'vue';

import { K0005 } from '@/api/modules/a3';
import { useHandleFlow } from '../../hook-property';
import CompBaseProperty from '../../internal/comp-base-property.vue';

import { getModelList, modelRy as modelList } from '../../../common/llm';
import { getKbList, kbRt } from '../../../common/data';

import CompWidgetQuery, { type IQuery } from '../../internal/comp-widget-query.vue';
import { nodeDefine } from './index';
import { Form, message } from 'ant-design-vue';

const useForm = Form.useForm;

export interface IKnowledage {
  component_name: string;
  params: {
    empty_response: string;
    id: string;
    kb_ids: string[];
    keywords_similarity_weight: number;
    query: IQuery[];
    rerank_id: string;
    rerank_name: string;
    similarity_threshold: number;
    top_k: number;
    top_n: number;
  };
}

const props = withDefaults(
  defineProps<{
    close?: Function;
    lf: LogicFlow;
  }>(),
  {
    close: () => {},
  },
);

const dataProp = defineModel<IKnowledage>('data', {
  default: {
    params: {},
  },
});

const Config = {
  form: {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  },
};

function useBaseLogic(_props: any, _useFlow: any, _currentNodeModel?: Ref<Model.BaseModel>, _lfInstance?: Ref<LogicFlow>) {
  const modelRt = reactive({});

  const init = () => {
    //  侦听表单数据变化, 更新节点数据
    watch(
      () => dataProp.value.params,
      () => {
        if (!_currentNodeModel?.value.id) return;
        _lfInstance?.value.setProperties(_currentNodeModel?.value.id, {
          data: Object.assign({}, _currentNodeModel?.value.properties.data, { form: dataProp.value.params }),
        });
      },
      { deep: true },
    );
  };

  init();
  return { modelRt };
}

// const { validateInfos } = useForm(
//     dataProp,
//     reactive({
//       kb_ids: [
//         {
//           required: true,
//           message: t('common.required'),
//         },
//       ],
//     }),
// );

const rerankModelChange = (value, options) => {
  dataProp.value.params.rerank_id = value + '@' + options.fid;
}

// 注入来自子组件的 modelRy 和 getRerankList
const llms = getModelList();

// const kbRt = reactive({
//   kbList: [],
// });

getKbList();

const lfInstance = inject<Ref<LogicFlow>>('logicFlowInstance');
const currentNodeModel = inject<Ref<Model.BaseModel>>('currentNodeInfo');
const handleFlowUtils = useHandleFlow(currentNodeModel, lfInstance);
useBaseLogic(props, handleFlowUtils, currentNodeModel, lfInstance);


</script>

<template>

  <CompBaseProperty :close="close" :node-define="nodeDefine">
    <div>
      <p style="left: auto">{{i18n.global.t('flow.retrievalDescription')}}</p>
    </div>
    <a-form :label-col="Config.form.labelCol" :wrapper-col="Config.form.wrapperCol">
      <CompWidgetQuery v-model:data="dataProp.params.query" />

      <a-form-item :label="t('knowledgeDetails.similarityThreshold')" :tooltips="t('knowledgeDetails.similarityThresholdTip')">
        <a-slider v-model:value="dataProp.params.similarity_threshold" :max="1" :min="0" :step="0.1" />
      </a-form-item>
      <a-form-item :label="t('knowledgeDetails.vectorSimilarityWeight')" :tooltips="t('knowledgeDetails.vectorSimilarityWeightTip')">
        <a-slider v-model:value="dataProp.params.keywords_similarity_weight" :max="1" :min="0" :step="0.1" />
      </a-form-item>
      <a-form-item :label="t('chat.topN')" :tooltips="t('chat.topNTip')">
        <a-slider v-model:value="dataProp.params.top_n" :max="30" :min="0" :step="1" />
      </a-form-item>
      <a-form-item :label="t('setting.rerankModel')" :tooltips="t('setting.rerankModelTip')">
        <a-select v-model:value="dataProp.params.rerank_name" :options="modelList.rerankList" @change="(value, options) => rerankModelChange(value, options)" />
      </a-form-item>
      <a-form-item :label="t('knowledgeDetails.topK')" :tooltips="t('knowledgeDetails.topKTip')">
        <a-slider v-model:value="dataProp.params.top_k" :max="2048" :min="0" :step="1" />
      </a-form-item>
      <a-form-item :label="t('chat.knowledgeBases')" :tooltips="t('chat.knowledgeBasesTip')">
        <a-select v-model:value="dataProp.params.kb_ids" :options="kbRt.kbList" mode="multiple"/>
      </a-form-item>
      <a-form-item :label="t('chat.emptyResponse')" :tooltips="t('chat.emptyResponseTip')">
        <a-textarea v-model:value="dataProp.params.empty_response" :rows="4" :placeholder="t('common.pleaseInput')" />
      </a-form-item>
    </a-form>
  </CompBaseProperty>
</template>
