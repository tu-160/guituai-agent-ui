<script setup lang="ts">
import type { LogicFlow, Model } from '@logicflow/core';
import { i18n } from "@/locales/i18n";

import type { Ref } from 'vue';
import { inject, reactive, watch, watchEffect } from 'vue';

import { Icon } from '@future-core/icons';

import { cloneDeep } from 'lodash-es';

import { useHandleFlow } from '../../hook-property';
import CompBaseProperty from '../../internal/comp-base-property.vue';
import { nodeDefine } from './index';

const props = withDefaults(
  defineProps<{
    close?: Function;
    lf: LogicFlow;
  }>(),
  {
    close: () => {},
  },
);

const compareList = [
  { value: 'empty', label: i18n.global.t('flow.switchOperatorOptions.empty')},
  { value: 'not empty', label: i18n.global.t('flow.switchOperatorOptions.notEmpty') },
  { value: 'contains', label: i18n.global.t('flow.switchOperatorOptions.contains') },
  { value: 'not contains', label: i18n.global.t('flow.switchOperatorOptions.notContains') },
  { value: '=', label: i18n.global.t('flow.switchOperatorOptions.equal') },
  { value: '≠', label: i18n.global.t('flow.switchOperatorOptions.notEqual') },
  { value: '≥', label: i18n.global.t('flow.switchOperatorOptions.ge') },
  { value: '>', label: i18n.global.t('flow.switchOperatorOptions.gt') },
  { value: '≤', label: i18n.global.t('flow.switchOperatorOptions.le') },
  { value: '<', label: i18n.global.t('flow.switchOperatorOptions.lt') },
  { value: 'start with', label: i18n.global.t('flow.switchOperatorOptions.startWith') },
  { value: 'end with', label: i18n.global.t('flow.switchOperatorOptions.endWith') },
] as const;

const operatorList = [
  { value: 'and', label: i18n.global.t('flow.switchLogicOperatorOptions.and') },
  { value: 'or', label: i18n.global.t('flow.switchLogicOperatorOptions.or') },
];

interface IItem {
  cpn_id: string;
  operator: '' | (typeof compareList)[number]['value'];
  value: string;
}

interface ICondition {
  items: IItem[];
  logical_operator: string;
  to: string;
}

interface IParams {
  conditions: ICondition[];
  end_cpn_id: string;
}

export interface ISwitchComponent {
  component_name: string;
  params: IParams;
}

defineModel<ISwitchComponent>('data', {
  default: {
    params: {},
  },
});

function useBaseLogic(_props: any, _handleFlowUtils: any, _currentNodeInfo?: Ref<Model.BaseModel>, _lfInstance?: Ref<LogicFlow>) {
  const modelRt = reactive({
    params: {
      conditions: [] as ICondition[],
      end_cpn_id: '',
    } as IParams,
    nodesPropertyArr: [] as any[],
    nodeData: [] as any[],
  });

  const addCondition = () => {
    modelRt.params.conditions.push({
      items: [],
      logical_operator: '',
      to: '',
    });
  };

  const removeCondition = (index: number) => {
    modelRt.params.conditions.splice(index, 1);
  };

  const addConditionItem = (index: number) => {
    modelRt.params.conditions[index]?.items.push({
      cpn_id: '',
      operator: '',
      value: '',
    });
  };

  const removeConditionItem = (index: number, itemIndex: number) => {
    modelRt.params.conditions[index]?.items.splice(itemIndex, 1);
  };

  // 排除已经选中的节点
  const excludeNode = () => {
    return modelRt.nodeData.filter((item: any) => !modelRt.params?.conditions.some((i: any) => i.to === item.value));
  };

  const init = () => {
    // 侦听节点数据，同步下拉的节点数据
    watchEffect(() => {
      modelRt.nodeData.length = 0;
      modelRt.nodesPropertyArr = _handleFlowUtils.modelRt.nodesPropertyArr
        .map((item: any) => {
          const property = cloneDeep(item);
          if (property.data && property.data.value !== _currentNodeInfo?.value.id) {
            property.data.component_id = property.component_id;
            modelRt.nodeData.push(property.data);
            return property;
          }
          return null;
        })
        .filter((item: any) => !!item);
    });

    //  侦听表单数据变化, 更新节点数据
    watch(
      () => modelRt.params,
      () => {
        if (!_currentNodeInfo?.value.id) return;
        _lfInstance?.value.setProperties(_currentNodeInfo?.value.id, {
          // height: (currentNodeModel.value.properties?.rawHeight || 0) + dataProp.value.params.parameters.length * 38,
          data: Object.assign({}, _currentNodeInfo?.value.properties.data, { form: modelRt.params }),
        });
      },
      { deep: true },
    );
  };

  init();
  return { modelRt, addCondition, removeCondition, addConditionItem, removeConditionItem, excludeNode };
}

const lfInstance = inject<Ref<LogicFlow>>('logicFlowInstance');
const currentNodeModel = inject<Ref<Model.BaseModel>>('currentNodeInfo');
const handleFlowUtils = useHandleFlow(currentNodeModel, lfInstance);
const { modelRt, addCondition, removeCondition, addConditionItem, removeConditionItem } = useBaseLogic(props, handleFlowUtils, currentNodeModel, lfInstance);
</script>

<template>
  <CompBaseProperty :close="close" :node-define="nodeDefine">
    <div>
      <p style="left: auto">{{ i18n.global.t('flow.switchDescription') }}</p>
    </div>
    <a-form layout="vertical">
      <template v-for="(item, index) in modelRt.params.conditions" :key="item">
        <a-card class="mt-2" size="small" :title="`case ${index + 1}`">
          <template #extra>
            <div class="cursor-pointer"><Icon class="mr-2 text-lg" icon="lucide:x" @click="removeCondition(index)"/></div>
          </template>
          <a-form-item :label="i18n.global.t('flow.operator')">
            <a-select v-model:value="item.logical_operator" :options="operatorList" class="flex-1" :placeholder="i18n.global.t('common.pleaseSelect')" />
          </a-form-item>
          <a-form-item :label="i18n.global.t('flow.to')">
            <a-select v-model:value="item.to" :options="modelRt.nodeData" class="flex-1" :placeholder="i18n.global.t('common.pleaseSelect')" />
          </a-form-item>

          <a-form-item :label="i18n.global.t('flow.switch')">
            <template v-for="(item2, idx) in item.items" :key="item2">
              <a-card class="mt-2 bg-slate-100" size="small">
                <template #extra><Icon class="cursor-pointer text-2xl" icon="lucide:circle-minus" @click="removeConditionItem(index, idx)" /></template>
                <a-form-item :label="i18n.global.t('flow.componentId')">
                  <a-select v-model:value="item2.cpn_id" :options="modelRt.nodeData" class="flex-1" :placeholder="i18n.global.t('common.pleaseSelect')" />
                </a-form-item>
                <a-form-item :label="i18n.global.t('flow.operator')">
                  <a-select v-model:value="item2.operator" :options="compareList" class="flex-1" :placeholder="i18n.global.t('common.pleaseSelect')" />
                </a-form-item>
                <a-form-item :label="i18n.global.t('flow.value')">
                  <a-input v-model:value="item2.value" :placeholder="i18n.global.t('common.pleaseInput')" />
                </a-form-item>
              </a-card>
            </template>

            <div class="mt-2 flex items-center justify-center">
              <a-button type="link" @click="addConditionItem(index)"> {{ i18n.global.t('flow.addCondition') }} </a-button>
            </div>
          </a-form-item>
        </a-card>
      </template>
    </a-form>

    <div class="mt-2 flex items-center justify-center">
      <a-button type="link" @click="addCondition"> {{ i18n.global.t('flow.addCase') }} </a-button>
    </div>

    <a-card class="bg-slate-100" size="small">
      <a-form-item label="ELSE">
        <a-select v-model:value="modelRt.params.end_cpn_id" :options="modelRt.nodeData" class="flex-1" :placeholder="i18n.global.t('common.pleaseSelect')" />
      </a-form-item>
    </a-card>
  </CompBaseProperty>
</template>
