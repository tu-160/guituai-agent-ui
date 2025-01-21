<template>
  <section class="common-pane">
    <ScrollContainer class="config-content">
      <a-form :colon="false" layout="vertical" :model="formConf" class="config-form">
        <a-form-item label="选择流程">
          <FlowModal :value="formConf.flowId" :title="formConf.flowName" @change="onFlowIdChange" placeholder="请选择" :allowClear="false" />
        </a-form-item>
        <div class="ant-form-item">
          <div class="ant-form-item-label mt-12px">
            <label class="ant-form-item-no-colon">自动发起审批<BasicHelp text="流程发起的下一节点设置候选人时无法自动发起审批" /></label>
          </div>
        </div>
        <a-form-item label="字段设置" class="!flex-nowrap">
          <div class="condition-main">
            <a-row :gutter="8">
              <a-col :span="7">选择目标表单字段</a-col>
              <a-col :span="3"></a-col>
              <a-col :span="14">设置触发表单字段或自定义值 </a-col>
            </a-row>
            <a-row :gutter="8" v-for="(item, index) in formConf.transferList" :key="index" class="mt-10px">
              <a-col :span="7">
                <future-select
                  v-model:value="item.targetField"
                  :options="getTargetOptions(index)"
                  placeholder="请选择"
                  showSearch
                  allowClear
                  :disabled="item.required"
                  :fieldNames="{ options: 'options1' }" />
              </a-col>
              <a-col :span="3" class="leading-32px">的值设为</a-col>
              <a-col :span="5">
                <future-select v-model:value="item.sourceType" :options="sourceTypeOptions" @change="item.sourceValue = ''" />
              </a-col>
              <a-col :span="8">
                <future-select
                  v-model:value="item.sourceValue"
                  :options="formFieldsOptions"
                  placeholder="请选择"
                  showSearch
                  allowClear
                  :fieldNames="{ options: 'options1' }"
                  v-if="item.sourceType === 1" />
                <a-input v-model:value="item.sourceValue" placeholder="请输入" allowClear v-if="item.sourceType === 2" />
              </a-col>
              <a-col :span="1" class="text-center" v-if="!item.required">
                <i class="icon-ym icon-ym-btn-clearn" @click="delTransferItem(index)" />
              </a-col>
            </a-row>
            <span class="link-text mt-10px inline-block" @click="addTransferItem()"><i class="icon-ym icon-ym-btn-add text-14px mr-4px"></i>添加字段</span>
          </div>
        </a-form-item>
        <a-form-item>
          <template #label>发起人<BasicHelp text="多个审批人时产生多条流程实例" /></template>
          <future-user-select v-model:value="formConf.initiator" multiple placeholder="请选择" />
        </a-form-item>
      </a-form>
    </ScrollContainer>
  </section>
</template>
<script lang="ts" setup>
  import { ScrollContainer } from '@/components/Container';
  import FlowModal from '@/components/FlowProcess/src/propPanel/components/FlowModal.vue';
  import { sourceTypeOptions } from '../helper/define';
  import { cloneDeep } from 'lodash-es';

  defineOptions({ name: 'launchFlowNode', inheritAttrs: false });
  const props = defineProps(['formConf', 'integrateType', 'formFieldsOptions', 'usedFormItems', 'getFlowFormFieldList', 'flowOptions']);
  const emptyChildItem = { field: '', symbol: '==', fieldValueType: 1, fieldValue: undefined, futureKey: '', fieldValueFutureKey: '', cellKey: +new Date() };
  const emptyItem = { logic: 'and', groups: [emptyChildItem] };

  function onFlowIdChange(id, item) {
    props.formConf.ruleList = [cloneDeep(emptyItem)];
    if (!id) return handleNull();
    props.formConf.flowName = item.fullName;
    props.formConf.flowId = id;
    props.formConf.transferList = [];
    props.getFlowFormFieldList(id, 'launchFlow');
  }
  function handleNull() {
    props.formConf.flowName = '';
    props.formConf.flowId = '';
    props.formConf.formFieldList = [];
    props.formConf.transferList = [];
  }
  function addTransferItem() {
    props.formConf.transferList.push({ targetField: '', targetFieldLabel: '', sourceType: 1, sourceValue: '', required: false });
  }
  function delTransferItem(index) {
    props.formConf.transferList.splice(index, 1);
  }
  function getTargetOptions(index: number) {
    let ignoreOptions: any[] = [];
    for (let i = 0; i < props.formConf.transferList.length; i++) {
      const e = props.formConf.transferList[i];
      if (e.targetField && index !== i) ignoreOptions.push(e.targetField);
    }
    const list = props.formConf.formFieldList.filter(o => !ignoreOptions.includes(o.id));
    return list;
  }
</script>
