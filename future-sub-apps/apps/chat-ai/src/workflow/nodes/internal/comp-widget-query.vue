<script setup lang="ts">
import type LogicFlow from '@logicflow/core';
import type { Model } from '@logicflow/core';
import { i18n } from "@/locales/i18n";
const t = i18n.global.t;

import { inject, reactive, type Ref } from 'vue';

import { Icon } from '@future-core/icons';

import { useHandleFlow } from '../hook-property';

export interface IQuery {
  type: 'input' | 'reference';
  value?: string;
  component_id?: string;
}

const dataProp = defineModel<IQuery[]>('data');

const queryType = [
  { label: t('flow.input'), value: 'input' },
  { label: t('flow.cite'), value: 'reference' },
];

function useBaseLogic(_props: any, _dataProp: any, _useFlow: any, _currentNodeModel?: Ref<Model.BaseModel>, _lfInstance?: Ref<LogicFlow>) {
  const modelRt = reactive({
    activeKey: [],
  });

  const addQueryItem = () => {
    _dataProp.value.push({
      type: 'reference',
    });
  };

  const removeQueryItem = (index: number) => {
    _dataProp.value.splice(index, 1);
  };

  return { modelRt, addQueryItem, removeQueryItem };
}

const lfInstance = inject<Ref<LogicFlow>>('logicFlowInstance');
const currentNodeModel = inject<Ref<Model.BaseModel>>('currentNodeInfo');
const useFlow = useHandleFlow(currentNodeModel, lfInstance);
const { modelRt, addQueryItem, removeQueryItem } = useBaseLogic({}, dataProp, useFlow, currentNodeModel, lfInstance);
</script>

<template>
  <a-collapse v-model:active-key="modelRt.activeKey" :bordered="false" class="w-full rounded-md">
    <template #expandIcon="{ isActive }">
      <Icon :class="{ 'rotate-90': isActive }" class="transition-transform" icon="lucide:chevron-right" />
    </template>
    <a-collapse-panel key="1" :header="t('flow.input')">
      <template v-for="(item, index) in dataProp" :key="index">
        <div class="mt-2 flex items-center gap-2">
          <a-select
            v-model:value="item.type"
            :options="queryType"
            class="flex-1"
            :placeholder="t('common.pleaseSelect')"
            @change="() => (item.value = '') || (item.component_id = '')"
          />
          <a-input v-if="item.type === 'input'" v-model:value="item.value" class="w-1/2" :placeholder="t('common.pleaseInput')" />
          <a-select v-else v-model:value="item.component_id" :options="useFlow.modelRt.nodesPropertyDataArr" class="w-1/2" :placeholder="t('common.pleaseSelect')" />
          <Icon class="cursor-pointer text-2xl" icon="lucide:circle-minus" @click="removeQueryItem(index)" />
        </div>
      </template>
      <div class="flex w-full cursor-pointer items-center justify-center gap-1">
        <a-button class="mx-auto mt-2 w-1/2" @click="addQueryItem">
          <div class="flex w-full cursor-pointer items-center justify-center gap-1"><Icon class="text-xl" icon="lucide:plus" /> {{t('flow.add')}}</div>
        </a-button>
      </div>
    </a-collapse-panel>
  </a-collapse>
</template>
