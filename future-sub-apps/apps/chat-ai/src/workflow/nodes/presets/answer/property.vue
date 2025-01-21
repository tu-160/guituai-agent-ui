<script setup lang="ts">
import type LogicFlow from '@logicflow/core';
import type { Model } from '@logicflow/core';

import { inject, reactive, type Ref } from 'vue';

import { useHandleFlow } from '../../hook-property';
import CompBaseProperty from '../../internal/comp-base-property.vue';
import { nodeDefine } from './index';

interface IParams {}

export interface IAnswerComponent {
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

const dataProp = defineModel<IAnswerComponent>('data', {
  default: {
    params: {},
  },
});

function useBaseLogic(_props: any, _dataProp: Ref<IAnswerComponent>, _useFlow: any, _currentNodeModel?: Ref<Model.BaseModel>, _lfInstance?: Ref<LogicFlow>) {
  const modelRt = reactive({});
  const init = () => {};
  init();
  return { modelRt };
}

const lfInstance = inject<Ref<LogicFlow>>('logicFlowInstance');
const currentNodeModel = inject<Ref<Model.BaseModel>>('currentNodeInfo');
const useFlow = useHandleFlow(currentNodeModel, lfInstance);
useBaseLogic(props, dataProp, useFlow, currentNodeModel, lfInstance);
</script>

<template>
  <CompBaseProperty :close="close" :node-define="nodeDefine" />
</template>
