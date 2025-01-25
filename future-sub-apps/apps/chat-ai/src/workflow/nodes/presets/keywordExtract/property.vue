<script setup lang="ts">
import type LogicFlow from '@logicflow/core';
import type { Model } from '@logicflow/core';
import { i18n } from "@/locales/i18n";
const t = i18n.global.t;

import { inject, reactive, type Ref, watch } from 'vue';

import { useHandleFlow } from '../../hook-property';
import CompBaseProperty from '../../internal/comp-base-property.vue';
import CompWidgetLlm, { type ILlm } from '../../internal/comp-widget-llm.vue';
import CompWidgetQuery, { type IQuery } from '../../internal/comp-widget-query.vue';
import { nodeDefine } from './index';

interface IParams extends ILlm {
  top_N: number;
  query: IQuery[];
}

export interface IKeywordComponent {
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

const dataProp = defineModel<IKeywordComponent>('data', {
  default: {
    params: {},
  },
});

function useBaseLogic(
  _props: any,
  _dataProp: Ref<IKeywordComponent>,
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
    <div>
      <p style="left: auto">{{t('flow.keywordDescription')}}</p>
    </div>
    <a-form>
      <CompWidgetQuery v-model:data="dataProp.params.query" />
      <CompWidgetLlm v-model:data="dataProp.params" />
      <a-form-item class="mt-6" :label="t('chat.topN')" :tooltips="t('chat.topNTip')">
        <a-slider v-model:value="dataProp.params.top_N" :max="30" :min="0" :step="1" />
      </a-form-item>
    </a-form>
  </CompBaseProperty>
</template>
