<script setup lang="ts">
import type LogicFlow from '@logicflow/core';
import type { Model } from '@logicflow/core';
import { i18n } from "@/locales/i18n";
const t = i18n.global.t;

import { inject, reactive, type Ref, watch } from 'vue';

import { useHandleFlow } from '../../hook-property';
import CompBaseProperty from '../../internal/comp-base-property.vue';
import CompWidgetLlm, { type ILlm } from '../../internal/comp-widget-llm.vue';
import CompWidgetParameter, { type IParameter } from '../../internal/comp-widget-parameter.vue';
import { nodeDefine } from './index';

interface IInputContent {
  component_id: string;
  content: string;
}

interface IOutputContent {
  content: string;
  reference: string[];
}

interface IParams extends ILlm {
  cite: boolean;
  message_history_window_size: number;
  parameters: IParameter[];
  prompt: string;
}

export interface IGenerateComponent {
  component_name: string;
  inputs: IInputContent[];
  output: IOutputContent;
  params: IParams;
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

const dataProp = defineModel<IGenerateComponent>('data', {
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

const lfInstance = inject<Ref<LogicFlow>>('logicFlowInstance');
const currentNodeModel = inject<Ref<Model.BaseModel>>('currentNodeInfo');
const handleFlowUtils = useHandleFlow(currentNodeModel, lfInstance);
useBaseLogic(props, handleFlowUtils, currentNodeModel, lfInstance);
</script>

<template>
  <CompBaseProperty :close="close" :node-define="nodeDefine">
    <a-form :label-col="Config.form.labelCol" :wrapper-col="Config.form.wrapperCol">
      <CompWidgetLlm v-model:data="dataProp.params" />

      <a-form-item class="mt-6" :label="t('knowledgeConfiguration.prompt')" :tooltips="t('knowledgeConfiguration.promptMessage')">
        <a-textarea v-model:value="dataProp.params.prompt" :rows="4" :placeholder="t('chat.pleaseInput')" />
      </a-form-item>
      <a-form-item :label="t('flow.cite')" :tooltips="t('flow.citeTip')">
        <a-switch v-model:checked="dataProp.params.cite" />
      </a-form-item>
      <a-form-item :label="t('flow.messageHistoryWindowSize')" :tooltips="t('flow.messageHistoryWindowSizeTip')">
        <a-input-number id="inputNumber" v-model:value="dataProp.params.message_history_window_size" :max="100" :min="1" />
      </a-form-item>

      <CompWidgetParameter v-model:data="dataProp.params.parameters" />
    </a-form>
  </CompBaseProperty>
</template>
