<script setup lang="ts">
import type LogicFlow from '@logicflow/core';
import type { Model } from '@logicflow/core';
import { i18n } from "@/locales/i18n";
const t = i18n.global.t;

import { inject, reactive, type Ref, watch } from 'vue';

import { useHandleFlow } from '../../hook-property';
import CompBaseProperty from '../../internal/comp-base-property.vue';
import CompWidgetLlm, { type ILlm } from '../../internal/comp-widget-llm.vue';
import { nodeDefine } from './index';

interface IParams extends ILlm {
  frequencyPenaltyEnabled: boolean;
  frequency_penalty: number;
  llm_id: string;
  maxTokensEnabled: boolean;
  max_tokens: number;
  loop: number;
  presencePenaltyEnabled: boolean;
  presence_penalty: number;
  temperature: number;
  temperatureEnabled: boolean;
  topPEnabled: boolean;
  top_p: number;
}

export interface IRewriteComponent {
  component_name: string;
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

const dataProp = defineModel<IRewriteComponent>('data', {
  default: {
    params: {},
  },
});

function useBaseLogic(
  _props: any,
  _dataProp: Ref<IRewriteComponent>,
  _handleFlowUtils: any,
  _currentNodeModel?: Ref<Model.BaseModel>,
  _lfInstance?: Ref<LogicFlow>,
) {
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
useBaseLogic(props, dataProp, handleFlowUtils, currentNodeModel, lfInstance);
</script>

<template>
  <CompBaseProperty :close="close" :node-define="nodeDefine">
    <a-form>
      <CompWidgetLlm v-model:data="dataProp.params" />
      <a-form-item class="mt-6" :label="t('flow.loop')" :tooltip="t('flow.loopTip')">
        <a-input-number v-model:value="dataProp.params.loop" min="0" :placeholder="t('chat.pleaseInput')" />
      </a-form-item>
    </a-form>
  </CompBaseProperty>
</template>
