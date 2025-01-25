<script setup lang="ts">
import type LogicFlow from '@logicflow/core';
import type { Model } from '@logicflow/core';
import { i18n } from "@/locales/i18n";
const t = i18n.global.t;

import { inject, reactive, type Ref, watchEffect } from 'vue';

import { Icon } from '@future-core/icons';

import { cloneDeep } from 'lodash-es';

import { useHandleFlow } from '../hook-property';

export interface IParameter {
  component_id: string;
  id: string;
  key: string;
  label?: string;
}
const dataProp = defineModel<IParameter[]>('data');

function useBaseLogic(_props: any, _dataProp: any, _useFlow: any, _currentNodeModel?: Ref<Model.BaseModel>, _lfInstance?: Ref<LogicFlow>) {
  const modelRt = reactive({
    activeKey: [],
    nodesPropertyArr: [] as any[],
    nodeData: [] as any[],
  });

  const addParameter = () => {
    _dataProp.value.push({
      component_id: '',
      id: '',
      key: '',
      label: '',
    });
  };

  const removeParameter = (index: number) => {
    _dataProp.value.splice(index, 1);
  };

  const init = () => {
    // 侦听节点数据，同步下拉的节点数据
    watchEffect(() => {
      modelRt.nodeData.length = 0;
      modelRt.nodesPropertyArr = _useFlow.modelRt.nodesPropertyArr
        .map((item: any) => {
          const property = cloneDeep(item);
          if (property.data && property.data.value !== _currentNodeModel?.value.id) {
            property.data.component_id = property.component_id;
            modelRt.nodeData.push(property.data);
            return property;
          }
          return null;
        })
        .filter((item: any) => !!item);
    });
  };

  const initDataProp = () => {
    if(_dataProp.value === undefined) {
      _dataProp.value = [];
    }
  };

  init();
  initDataProp();
  return { modelRt, addParameter, removeParameter };
}

const lfInstance = inject<Ref<LogicFlow>>('logicFlowInstance');
const currentNodeModel = inject<Ref<Model.BaseModel>>('currentNodeInfo');
const useFlow = useHandleFlow(currentNodeModel, lfInstance);
const { modelRt, addParameter, removeParameter } = useBaseLogic({}, dataProp, useFlow, currentNodeModel, lfInstance);
</script>

<template>
  <a-collapse v-model:active-key="modelRt.activeKey" :bordered="false" class="w-full rounded-md">
    <template #expandIcon="{ isActive }">
      <Icon :class="{ 'rotate-90': isActive }" class="transition-transform" icon="lucide:chevron-right" />
    </template>
    <a-collapse-panel key="1" :header="t('flow.input')">
      <div class="flex items-center gap-2">
        <div class="w-1/3 pl-2">{{ t('flow.key') }}</div>
        <div class="flex-1 pl-2">{{ t('flow.componentId') }}</div>
      </div>
      <template v-for="(item, index) in dataProp" :key="index">
        <div class="mt-2 flex items-center gap-2">
          <a-input v-model:value="item.key" class="w-1/3" :placeholder="t('common.pleaseInput')" />
          <a-select
            v-model:value="item.id"
            :options="modelRt.nodeData"
            class="flex-1"
            :placeholder="t('common.pleaseSelect')"
            @change="(value: any, option: any) => ((item.label = option.label), (item.component_id = option.component_id))"
          />
          <Icon class="cursor-pointer text-2xl" icon="lucide:circle-minus" @click="removeParameter(index)" />
        </div>
      </template>
      <div class="flex w-16 cursor-pointer items-center gap-1 pt-2" @click="addParameter"><Icon class="text-xl" icon="lucide:plus" /> {{t('setting.add')}}</div>
    </a-collapse-panel>
  </a-collapse>
</template>
