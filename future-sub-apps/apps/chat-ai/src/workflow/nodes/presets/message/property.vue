<script setup lang="ts">
import type LogicFlow from '@logicflow/core';
import type { Model } from '@logicflow/core';
import { i18n } from "@/locales/i18n";
const t = i18n.global.t;

import { inject, reactive, type Ref, watch } from 'vue';

import { Icon } from '@future-core/icons';

import { useHandleFlow } from '../../hook-property';
import CompBaseProperty from '../../internal/comp-base-property.vue';
import { nodeDefine } from './index';

interface IParams {
  messages: string[];
}

export interface IMessageComponent {
  component_name: string;
  params: IParams;
}

withDefaults(
  defineProps<{
    close?: Function;
    lf: LogicFlow;
  }>(),
  {
    close: () => {},
  },
);

const dataProp = defineModel<IMessageComponent>('data', {
  default: {
    params: {},
  },
});

function useBaseLogic(_props: Ref<IMessageComponent>, _handleFlowUtils: any, _currentNodeModel?: Ref<Model.BaseModel>, _lfInstance?: Ref<LogicFlow>) {
  const modelRt = reactive({});

  const addMessage = () => {
    _props.value.params.messages.push('');
  };

  const removeMessage = (index: number) => {
    _props.value.params.messages.splice(index, 1);
  };

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
  return { modelRt, addMessage, removeMessage };
}

const lfInstance = inject<Ref<LogicFlow>>('logicFlowInstance');
const currentNodeModel = inject<Ref<Model.BaseModel>>('currentNodeInfo');
const handleFlowUtils = useHandleFlow(currentNodeModel, lfInstance);
const { addMessage, removeMessage } = useBaseLogic(dataProp, handleFlowUtils, currentNodeModel, lfInstance);
</script>

<template>
  <CompBaseProperty :close="close" :node-define="nodeDefine">
    <a-form>
      <a-form-item :label="t('chat.msg')">
        <template v-for="(item, index) in dataProp.params.messages" :key="index">
          <a-form-item>
            <div class="flex">
              <a-textarea v-model:value="dataProp.params.messages[index]" :rows="4" :placeholder="t('chat.pleaseInput')" />
              <Icon class="ml-1 mt-auto cursor-pointer text-2xl" icon="lucide:circle-minus" @click="removeMessage(index)" />
            </div>
          </a-form-item>
        </template>
      </a-form-item>
      <div class="flex w-full cursor-pointer items-center justify-center gap-1">
        <a-button class="mx-auto mt-2 w-1/2" @click="addMessage">
          <div class="flex w-full cursor-pointer items-center justify-center gap-1"><Icon class="text-xl" icon="lucide:plus" /> {{t('flow.add')}}</div>
        </a-button>
      </div>
    </a-form>
  </CompBaseProperty>
</template>
