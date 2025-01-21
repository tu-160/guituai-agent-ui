<script setup lang="ts">
import type { LogicFlow, Model } from '@logicflow/core';
import { i18n } from "@/locales/i18n";
const t = i18n.global.t;

import type { Ref } from 'vue';
import { inject, reactive, watch, watchEffect } from 'vue';

import { cloneDeep } from 'lodash-es';

import { useHandleFlow } from '../../hook-property';
import CompBaseProperty from '../../internal/comp-base-property.vue';
import CompWidgetParameter, { type IParameter } from '../../internal/comp-widget-parameter.vue';
import { nodeDefine } from './index';

interface IParams {
  content: string;
  parameters: IParameter[];
}

export interface ITemplateComponent {
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

const dataProp = defineModel<ITemplateComponent>('data', {
  default: {
    params: {
      parameters: [{}],
    },
  },
});

const lfInstance = inject<Ref<LogicFlow>>('logicFlowInstance');
const currentNodeModel = inject<Ref<Model.BaseModel>>('currentNodeInfo');

function useBaseLogic(props: any, handleFlowUtils: any, currentNodeInfo?: Ref<Model.BaseModel>, lfInstance?: Ref<LogicFlow>) {
  const modelRt = reactive({
    nodesPropertyArr: [] as any[],
    nodeData: [] as any[],
  });

  const init = () => {
    // 侦听节点数据，同步下拉的节点数据
    watchEffect(() => {
      modelRt.nodeData.length = 0;
      modelRt.nodesPropertyArr = handleFlowUtils.modelRt.nodesPropertyArr
        .map((item: any) => {
          const property = cloneDeep(item);
          if (property.data && property.data.value !== currentNodeModel?.value.id) {
            property.data.component_id = property.component_id;
            modelRt.nodeData.push(property.data);
            return property;
          }
          return null;
        })
        .filter((item: any) => !!item);
    });

    //  侦听页面入参数据,在参数切换时进行一些数据初始化
    watch(
      () => dataProp.value,
      () => {
        if (dataProp.value.params.parameters.length === 0) {
          dataProp.value.params.parameters = [
            {
              component_id: '',
              id: '',
              key: '',
            },
          ];
        }
      },
      { immediate: true },
    );

    //  侦听表单数据变化, 更新节点数据
    watch(
      () => dataProp.value.params,
      () => {
        if (!currentNodeModel?.value.id) return;
        lfInstance?.value.setProperties(currentNodeModel?.value.id, {
          height: (currentNodeModel.value.properties?.rawHeight || 0) + dataProp.value.params.parameters.length * 38,
          data: Object.assign({}, currentNodeModel?.value.properties.data, { form: dataProp.value.params }),
        });
      },
      { deep: true },
    );
  };

  init();
  return { modelRt };
}

const handleFlowUtils = useHandleFlow(currentNodeModel, lfInstance);
useBaseLogic(props, handleFlowUtils, currentNodeModel, lfInstance);
</script>

<template>
  <CompBaseProperty :close="close" :node-define="nodeDefine">
    <a-form layout="vertical">
      <a-form-item :label="t('flow.content')" :tooltips="t('flow.content')">
        <a-textarea v-model:value="dataProp.params.content" :rows="4" :placeholder="t('chat.pleaseInput')" />
      </a-form-item>
      <a-form-item>
        <CompWidgetParameter v-model:data="dataProp.params.parameters" />
      </a-form-item>
    </a-form>
  </CompBaseProperty>
</template>
