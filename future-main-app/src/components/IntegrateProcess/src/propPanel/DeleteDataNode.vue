<template>
  <section class="common-pane">
    <ScrollContainer class="config-content">
      <a-form :colon="false" layout="vertical" :model="formConf" class="config-form">
        <a-form-item label="目标表单">
          <MenuListModal :value="formConf.id" :title="formConf.formName" :allowClear="false" @change="onFormIdChange" placeholder="请选择" />
        </a-form-item>
        <a-form-item label="删除条件" class="!flex-nowrap" v-if="integrateType == 1">
          <ConditionMain ref="conditionMainRef" bordered showFieldValueType :valueFieldOptions="usedFormItems" />
        </a-form-item>
        <a-form-item class="!flex-nowrap" v-if="integrateType != 1">
          <template #label>唯一性验证<BasicHelp text="判断目标表单与触发表单是否同一条数据" /></template>
          <div class="condition-main condition-main-bordered">
            <div class="mb-10px" v-if="formConf.ruleList?.length">
              <future-radio v-model:value="formConf.ruleMatchLogic" :options="logicOptions" optionType="button" button-style="solid" />
            </div>
            <div class="condition-item" v-for="(item, index) in formConf.ruleList" :key="index">
              <div class="condition-item-title">
                <div>条件组</div>
                <i class="icon-ym icon-ym-nav-close" @click="delGroup(index)"></i>
              </div>
              <div class="condition-item-content">
                <div class="condition-item-cap">
                  以下条件全部执行：
                  <future-radio v-model:value="item.logic" :options="logicOptions" optionType="button" button-style="solid" size="small" />
                </div>
                <a-row :gutter="8" v-for="(child, childIndex) in item.groups" :key="index + childIndex" class="mb-10px">
                  <a-col :span="8">
                    <future-select
                      v-model:value="child.field"
                      :options="getRuleOptions"
                      placeholder="请选择目标表单字段"
                      showSearch
                      allowClear
                      :fieldNames="{ options: 'options1' }"
                      @change="(val, data) => onFieldChange(child, val, data, index, childIndex)" />
                  </a-col>
                  <a-col :span="5">
                    <future-select class="w-full" v-model:value="child.symbol" placeholder="运算符号" :options="symbolOptions" disabled />
                  </a-col>
                  <a-col :span="10">
                    <future-select
                      v-model:value="child.fieldValue"
                      :options="usedFormItems"
                      placeholder="请选择触发表单字段"
                      showSearch
                      allowClear
                      :fieldNames="{ options: 'options1' }" />
                  </a-col>
                  <a-col :span="1" class="text-center">
                    <i class="icon-ym icon-ym-btn-clearn" @click="delItem(index, childIndex)" />
                  </a-col>
                </a-row>
                <span class="link-text inline-block" @click="addItem(index)"><i class="icon-ym icon-ym-btn-add text-14px mr-4px"></i>添加条件</span>
              </div>
            </div>
            <span class="link-text inline-block" @click="addGroup()"><i class="icon-ym icon-ym-btn-add text-14px mr-4px"></i>添加条件组</span>
          </div>
        </a-form-item>
        <a-form-item label="删除内容" v-if="integrateType != 1">
          <future-radio v-model:value="formConf.deleteRule" :options="deleteRuleOptions" />
        </a-form-item>
      </a-form>
    </ScrollContainer>
  </section>
</template>
<script lang="ts" setup>
  import { computed, ref, unref } from 'vue';
  import { ScrollContainer } from '@/components/Container';
  import MenuListModal from './modal/MenuListModal.vue';
  import { logicOptions, symbolOptions, notSupportList } from '../helper/define';
  import { cloneDeep } from 'lodash-es';
  import { useMessage } from '@/hooks/web/useMessage';
  import ConditionMain from '@/components/ColumnDesign/src/components/ConditionMain.vue';

  defineOptions({ name: 'deleteDataNode', inheritAttrs: false });
  defineExpose({ initCondition, submitCondition });
  const props = defineProps(['formConf', 'integrateType', 'formFieldsOptions', 'usedFormItems', 'getFormFieldList']);
  const conditionMainRef = ref();
  const { createMessage } = useMessage();
  const deleteRuleOptions = [
    { id: 0, fullName: '删除未找到的数据' },
    { id: 1, fullName: '删除已找到的数据' },
  ];
  const emptyChildItem = { field: '', symbol: '==', fieldValueType: 1, fieldValue: undefined, futureKey: '', fieldValueFutureKey: '', cellKey: +new Date() };
  const emptyItem = { logic: 'and', groups: [emptyChildItem] };

  const getRuleOptions = computed(() => props.formConf.formFieldList.filter(o => o.id.indexOf('-') < 0 && !notSupportList.includes(o.__config__.futureKey)));

  function onFormIdChange(id, item) {
    if (id && props.formConf.id === id) return;
    props.formConf.transferList = [];
    props.integrateType != 1 ? (props.formConf.ruleList = [cloneDeep(emptyItem)]) : (props.formConf.ruleList = []);
    if (!id) return handleNull();
    props.formConf.formName = item.fullName;
    props.formConf.id = id;
    props.formConf.formId = item.formId;
    props.formConf.flowId = item.flowId;
    props.getFormFieldList(item.formId, 'deleteData');
  }
  function handleNull() {
    props.formConf.formName = '';
    props.formConf.id = '';
    props.formConf.formId = '';
    props.formConf.flowId = '';
    props.formConf.formFieldList = [];
  }
  function addItem(index) {
    props.formConf.ruleList[index].groups.push(cloneDeep(emptyChildItem));
  }
  function delItem(index, childIndex) {
    if (props.integrateType != 1 && props.formConf.ruleList.length <= 1 && props.formConf.ruleList[0].groups.length <= 1) {
      createMessage.error('必须保留一个条件');
      return;
    }
    props.formConf.ruleList[index].groups.splice(childIndex, 1);
    if (!props.formConf.ruleList[index].groups.length) delGroup(index);
  }
  function addGroup() {
    props.formConf.ruleList.push(cloneDeep(emptyItem));
  }
  function delGroup(index) {
    if (props.integrateType != 1 && props.formConf.ruleList.length <= 1) return createMessage.error('必须保留一个条件');
    props.formConf.ruleList.splice(index, 1);
  }
  function onFieldChange(item, val, data, index, childIndex) {
    if (!val) {
      item.futureKey = '';
      if (item.fieldValueType == 2) {
        item.fieldValue = undefined;
        item.fieldValueFutureKey = '';
      }
      return;
    }
    item.futureKey = data.__config__.futureKey;
    const newItem = cloneDeep(emptyChildItem);
    for (let key of Object.keys(newItem)) {
      newItem[key] = item[key];
    }
    item = { ...newItem, ...data };
    if (item.fieldValueType == 2) {
      item.fieldValue = undefined;
      item.fieldValueFutureKey = '';
    }
    props.formConf.ruleList[index].groups[childIndex] = item;
  }
  function initCondition() {
    if (props.integrateType != 1) return;
    conditionMainRef.value?.init({
      conditionList: props.formConf.ruleList || [],
      matchLogic: props.formConf.ruleMatchLogic,
      fieldOptions: unref(getRuleOptions),
    });
  }
  function submitCondition() {
    const values = conditionMainRef.value?.confirm();
    if (!values) return false;
    return values;
  }
</script>
