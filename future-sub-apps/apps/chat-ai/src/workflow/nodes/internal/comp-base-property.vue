<script setup lang="ts">
import type LogicFlow from '@logicflow/core';
import type { Model } from '@logicflow/core';
import { i18n } from "@/locales/i18n";
const t = i18n.global.t;

import { inject, reactive, type Ref, watchEffect } from 'vue';

import { Icon } from '@future-core/icons';

import { useHandleFlow } from '../hook-property';

const props = withDefaults(
  defineProps<{
    close?: Function;
    nodeDefine: any;
  }>(),
  {
    close: () => {},
  },
);

function useBaseLogic(_props: any, _useFlow: any, _currentNodeModel?: Ref<Model.BaseModel>, _lfInstance?: Ref<LogicFlow>) {
  const modelRt = reactive({
    label: '',
  });

  const updateNodeDataLabel = (label?: string) => {
    const nodeID = _currentNodeModel?.value.id;
    if (!nodeID) return;
    const data = Object.assign({}, _currentNodeModel?.value.properties.data);
    data.label = label;
    _lfInstance?.value.setProperties(nodeID, {
      data,
    });
  };

  const init = () => {
    // 侦听节点数据，同步ID名称
    watchEffect(() => {
      modelRt.label = _currentNodeModel?.value.properties.data.label;
    });
  };

  init();
  return { modelRt, updateNodeDataLabel };
}

const lfInstance = inject<Ref<LogicFlow>>('logicFlowInstance');
const currentNodeModel = inject<Ref<Model.BaseModel>>('currentNodeInfo');
const useFlow = useHandleFlow(currentNodeModel, lfInstance);
const { modelRt, updateNodeDataLabel } = useBaseLogic(props, useFlow, currentNodeModel, lfInstance);
</script>

<template>
  <div class="content mt-4">
    <div class="hearder flex h-14 w-full items-center justify-between border-b border-solid">
      <div class="flex items-center justify-start gap-2">
        <div><Icon :icon="nodeDefine.icon" class="mr-2 text-lg" /></div>
        <div class="flex flex-1 items-center">
          <a-form-item class="m-0" label="ID">
            <a-input v-model:value="modelRt.label" :placeholder="t('common.pleaseInput')" @change="() => updateNodeDataLabel(modelRt.label)" />
          </a-form-item>
        </div>
      </div>
      <div class="cursor-pointer" @click="props.close()"><Icon class="mr-2 text-lg" icon="lucide:x" /></div>
    </div>

    <div class="body mt-2">
      <slot :close="props.close"> </slot>
    </div>
  </div>
</template>
