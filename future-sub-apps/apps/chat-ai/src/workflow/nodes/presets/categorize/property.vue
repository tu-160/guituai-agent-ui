<script setup lang="ts">
import type LogicFlow from '@logicflow/core';
import type { Model } from '@logicflow/core';
import { i18n } from "@/locales/i18n";
const t = i18n.global.t;

import { inject, reactive, type Ref, watch } from 'vue';

import { Icon } from '@future-core/icons';

import { random } from 'lodash-es';

import { useHandleFlow } from '../../hook-property';
import CompBaseProperty from '../../internal/comp-base-property.vue';
import CompWidgetLlm, { type ILlm } from '../../internal/comp-widget-llm.vue';
import CompWidgetQuery, { type IQuery } from '../../internal/comp-widget-query.vue';
import { nodeDefine } from './index';

interface ICategoryDescription {
  [key: string]: {
    description?: string;
    examples?: string;
    index?: number;
    key: string;
    to?: string;
    comp_id?: string;
  };
}

interface IParams extends ILlm {
  message_history_window_size: number;
  query: IQuery[];
  category_description: ICategoryDescription;
}

export interface ICategorizeComponent {
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

const dataProp = defineModel<ICategorizeComponent>('data', {
  default: {
    params: {},
  },
});

function useBaseLogic(_props: any, _handleFlowUtils: any, _currentNodeModel?: Ref<Model.BaseModel>, _lfInstance?: Ref<LogicFlow>) {
  const modelRt = reactive({});

  const addCategoryDescription = () => {
    const _getKey = () => {
      const key = `category_Description_${random(0, 10_000)}`;
      if (dataProp.value.params.category_description[key]) {
        return _getKey();
      }
      return key;
    };

    const key = _getKey();
    dataProp.value.params.category_description[key] = {
      description: undefined,
      examples: undefined,
      key,
      comp_id: undefined,
      to: undefined,
    };
  };

  const removeCategoryDescription = (key: string) => {
    delete dataProp.value.params.category_description[key];
  };

  const addEdge = (value: any, options: any, node: any) => {
    // console.log(value);
    // console.log(options)
    for(let i=0; i < options.length; i++) {
      let option = options[i].value;
      if(value === option) {
        node.to = options[i].key + ":" + options[i].value;
      }
    }
    // console.log('addEdge');
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

  return { modelRt, addCategoryDescription, removeCategoryDescription, addEdge };
}

const lfInstance = inject<Ref<LogicFlow>>('logicFlowInstance');
const currentNodeModel = inject<Ref<Model.BaseModel>>('currentNodeInfo');
const handleFlowUtils = useHandleFlow(currentNodeModel, lfInstance);
const { addCategoryDescription, removeCategoryDescription, addEdge } = useBaseLogic(props, handleFlowUtils, currentNodeModel, lfInstance);
</script>

<template>
  <CompBaseProperty :close="close" :node-define="nodeDefine">
    <div>
      <p style="left: auto">{{i18n.global.t('flow.categorizeDescription')}}</p>
    </div>
    <a-form>
      <CompWidgetQuery v-model:data="dataProp.params.query" />
      <CompWidgetLlm v-model:data="dataProp.params" />

      <a-form-item class="mt-6" :label="t('flow.messageHistoryWindowSize')" :tooltips="t('flow.messageHistoryWindowSizeTip')">
        <a-input-number id="inputNumber" v-model:value="dataProp.params.message_history_window_size" :max="100" :min="1" />
      </a-form-item>

      <template v-for="(item, key, index) in dataProp.params.category_description" :key="`${key}-${index}`">
        <a-card class="mt-2 bg-slate-100" size="small">
          <template #extra><Icon class="cursor-pointer text-2xl" icon="lucide:circle-minus" @click="removeCategoryDescription(key as string)" /></template>
          <a-form-item :label="i18n.global.t('flow.name')">
            <a-input
              v-model:value="item.key"
              :placeholder="i18n.global.t('common.pleaseInput')"
              @change="
                () => {
                  delete dataProp.params.category_description[key];
                  dataProp.params.category_description[item.key] = item;
                }
              "
            />
          </a-form-item>
          <a-form-item :label="t('flow.description')">
            <a-textarea v-model:value="item.description" :placeholder="i18n.global.t('common.pleaseInput')" />
          </a-form-item>
          <a-form-item :label="t('flow.examples')">
            <a-textarea v-model:value="item.examples" :placeholder="i18n.global.t('common.pleaseInput')" />
          </a-form-item>
          <a-form-item :label="t('flow.to')">
            <a-select v-model:value="item.comp_id" :options="handleFlowUtils.modelRt.nodesPropertyDataArr" @change="(value) => addEdge(value, handleFlowUtils.modelRt.nodesPropertyDataArr, item)" />
          </a-form-item>
        </a-card>
      </template>

      <div class="flex w-full cursor-pointer items-center justify-center gap-1">
        <a-button class="mx-auto mt-2 w-1/2" @click="addCategoryDescription">
          <div class="flex w-full cursor-pointer items-center justify-center gap-1">
            <Icon class="text-xl" icon="lucide:plus" /> {{t('flow.add')}}</div>
        </a-button>
      </div>
    </a-form>
  </CompBaseProperty>
</template>
