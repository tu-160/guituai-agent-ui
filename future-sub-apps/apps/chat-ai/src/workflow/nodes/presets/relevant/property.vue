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
  no: string;
  noLabel?: string;
  presencePenaltyEnabled: boolean;
  presence_penalty: number;
  temperature: number;
  temperatureEnabled: boolean;
  topPEnabled: boolean;
  top_p: number;
  yes: string;
  yesLabel?: string;
}

export interface IRelevantComponent {
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

const dataProp = defineModel<IRelevantComponent>('data', {
  default: {
    params: {},
  },
});

function useBaseLogic(
  _props: any,
  _dataProp: Ref<IRelevantComponent>,
  _handleFlowUtils: any,
  _currentNodeModel?: Ref<Model.BaseModel>,
  _lfInstance?: Ref<LogicFlow>,
) {
  const modelRt = reactive({});

  const getNodeDataArr = (excludeValue: string) => {
    return (_handleFlowUtils.modelRt.nodesPropertyDataArr as []).filter(
      (item: any) => item.value !== _currentNodeModel?.value.id && item.value !== excludeValue,
    );
  };

  const addEdge = (targetNodeId: string, tag: string) => {
    const nodeID = _currentNodeModel?.value.id;
    if (!nodeID) return;
    const startPoint = (_lfInstance?.value.getModelById(nodeID || '') as any).getDefaultAnchor().find((item: any) => item.tag === tag);
    const endPoint = (_lfInstance?.value.getModelById(targetNodeId || '') as any).getDefaultAnchor()[0];
    if (!startPoint || !endPoint) {
      console.error("can't find startPoint or endPoint");
      return;
    }
    _handleFlowUtils.addEdge({
      sourceNodeId: nodeID,
      targetNodeId,
      startPoint,
      endPoint,
    });
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

    //  连接时删除旧的边
    watch(
      () => dataProp.value.params.yes,
      (_yes, _prevYes) => {
        const nodeID = _currentNodeModel?.value.id;
        if (!nodeID) return;
        const oldEdgeArr = _handleFlowUtils.getEdgeModels(nodeID, _prevYes);
        if (oldEdgeArr && oldEdgeArr.length > 0) {
          // 移除旧边
          for (const oldEdge of oldEdgeArr) {
            _handleFlowUtils.deleteEdge(oldEdge.id);
          }
        }
        addEdge(_yes as string, 'yes');
      },
      { deep: true },
    );
    watch(
      () => dataProp.value.params.no,
      (_no, _prevNo) => {
        const nodeID = _currentNodeModel?.value.id;
        if (!nodeID) return;
        const oldEdgeArr = _handleFlowUtils.getEdgeModels(nodeID, _prevNo);
        if (oldEdgeArr && oldEdgeArr.length > 0) {
          // 移除旧边
          for (const oldEdge of oldEdgeArr) {
            _handleFlowUtils.deleteEdge(oldEdge.id);
          }
        }
        addEdge(_no as string, 'no');
      },
      { deep: true },
    );
  };

  init();

  return { modelRt, addEdge, getNodeDataArr };
}

const lfInstance = inject<Ref<LogicFlow>>('logicFlowInstance');
const currentNodeModel = inject<Ref<Model.BaseModel>>('currentNodeInfo');
const handleFlowUtils = useHandleFlow(currentNodeModel, lfInstance);
const { getNodeDataArr } = useBaseLogic(props, dataProp, handleFlowUtils, currentNodeModel, lfInstance);
</script>

<template>
  <CompBaseProperty :close="close" :node-define="nodeDefine">
    <a-form>
      <CompWidgetLlm v-model:data="dataProp.params" />

      <a-form-item class="mt-6" :label="t('flow.yes')">
        <a-select
          v-model:value="dataProp.params.yes"
          :options="getNodeDataArr(dataProp.params.no)"
          @change="
            (_value: string, option: any) => {
              dataProp.params.yesLabel = option.label;
            }
          "
        />
      </a-form-item>
      <a-form-item class="mt-6" :label="t('flow.no')">
        <a-select
          v-model:value="dataProp.params.no"
          :options="getNodeDataArr(dataProp.params.yes)"
          @change="
            (_value: string, option: any) => {
              dataProp.params.noLabel = option.label;
            }
          "
        />
      </a-form-item>
    </a-form>
  </CompBaseProperty>
</template>
