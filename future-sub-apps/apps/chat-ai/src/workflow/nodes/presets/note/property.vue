<script setup lang="ts">
import type LogicFlow from '@logicflow/core';
import type { Model } from '@logicflow/core';
import { i18n } from "@/locales/i18n";
const t = i18n.global.t;

import {inject, provide, reactive, type Ref, watch} from 'vue';
import { useHandleFlow } from '../../hook-property';
import CompBaseProperty from '../../internal/comp-base-property.vue';


import { nodeDefine } from './index';
import { Form, message } from 'ant-design-vue';

const useForm = Form.useForm;

export interface INoteedage {
  component_name: string;
  params: {
    note_text: string;
    id: string;
  };
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

const dataProp = defineModel<INoteedage>('data', {
  default: {
    params: {},
  },
});

const Config = {
  form: {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  },
};

function useBaseLogic(_props: any, _useFlow: any, _currentNodeModel?: Ref<Model.BaseModel>, _lfInstance?: Ref<LogicFlow>) {
  const modelRt = reactive({});
  debugger
  console.log(_currentNodeModel);
  // 已经设置过数据，使用grap中的数据进行赋值用于显示。
  dataProp.value.params.note_text = _currentNodeModel.value.properties.data.form.note_text;
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
useBaseLogic(props, handleFlowUtils, currentNodeModel, lfInstance);


</script>

<template>

  <CompBaseProperty :close="close" :node-define="nodeDefine">
    <div>
      <p style="left: auto">{{i18n.global.t('flow.noteDescription2')}}</p>
    </div>
    <a-form :label-col="Config.form.labelCol" :wrapper-col="Config.form.wrapperCol">
      <a-form-item>
        <a-textarea v-model:value="dataProp.params.note_text" :rows="6" :placeholder="t('common.pleaseInput')" />
      </a-form-item>
    </a-form>
  </CompBaseProperty>
</template>
