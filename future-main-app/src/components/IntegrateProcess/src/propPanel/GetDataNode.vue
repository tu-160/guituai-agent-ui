<template>
  <section class="common-pane">
    <ScrollContainer class="config-content">
      <a-form :colon="false" layout="vertical" :model="formConf" class="config-form">
        <a-form-item label="获取方式">
          <a-radio-group v-model:value="formConf.formType" class="common-radio formType-radio" @change="onFormTypeChange">
            <a-radio :value="1">从菜单中获取<BasicHelp text="获取流程数据时：只获取已完成的流程数据" /></a-radio>
            <a-radio :value="3">从数据接口中获取</a-radio>
          </a-radio-group>
          <MenuListModal
            :value="formConf.id"
            :title="formConf.formName"
            :allowClear="false"
            @change="onFormIdChange"
            placeholder="请选择"
            v-if="formConf.formType == 1" />
          <template v-if="formConf.formType == 3">
            <select-interface
              :value="formConf.formId"
              :title="formConf.formName"
              :templateJson="formConf.interfaceTemplateJson"
              :type="2"
              :showSystemFormId="false"
              :allowClear="false"
              @change="onInterfaceChange" />
          </template>
        </a-form-item>
        <a-form-item class="!flex-nowrap" v-if="formConf.formType == 1">
          <template #label>获取条件<BasicHelp text="满足以下条件，触发执行动作。" /></template>
          <ConditionMain ref="conditionMainRef" bordered />
        </a-form-item>
      </a-form>
    </ScrollContainer>
  </section>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { ScrollContainer } from '@/components/Container';
  import MenuListModal from './modal/MenuListModal.vue';
  import { SelectInterface } from '@/components/Interface';
  import ConditionMain from '@/components/ColumnDesign/src/components/ConditionMain.vue';

  defineOptions({ name: 'addDataNode', inheritAttrs: false });
  defineExpose({ initCondition, submitCondition });
  const props = defineProps(['formConf', 'integrateType', 'formFieldsOptions', 'getFormFieldList']);
  const conditionMainRef = ref();

  function onFormTypeChange() {
    handleNull();
    initCondition();
  }
  function onFormIdChange(id, item) {
    if (id && props.formConf.id === item.id) return;
    if (!id) return onFormTypeChange();
    props.formConf.formName = item.fullName;
    props.formConf.id = id;
    props.formConf.formId = item.formId;
    props.formConf.flowId = item.flowId;
    props.formConf.ruleList = [];
    props.getFormFieldList(item.formId, 'getData');
  }
  function onInterfaceChange(id, item) {
    if (!id) return handleNull();
    if (props.formConf.formId === id) return;
    props.formConf.formName = item.fullName;
    props.formConf.formId = id;
    props.formConf.ruleList = [];
    const formFieldList = item.fieldJson ? JSON.parse(item.fieldJson) : [];
    props.formConf.formFieldList = formFieldList.map(o => ({
      ...o,
      id: o.defaultValue,
      fullName: o.field,
      label: o.field ? o.defaultValue + '(' + o.field + ')' : o.defaultValue,
    }));
    props.formConf.interfaceTemplateJson = (item.templateJson || []).map(o => ({ ...o, sourceType: 2, relationField: '' }));
  }
  function handleNull() {
    props.formConf.formName = '';
    props.formConf.id = '';
    props.formConf.formId = '';
    props.formConf.flowId = '';
    props.formConf.formFieldList = [];
    props.formConf.ruleList = [];
    props.formConf.interfaceTemplateJson = [];
  }
  function initCondition() {
    if (props.formConf.formType != 1) return;
    conditionMainRef.value?.init({
      conditionList: props.formConf.ruleList || [],
      matchLogic: props.formConf.ruleMatchLogic,
      fieldOptions: props.formConf.formFieldList,
    });
  }
  function submitCondition() {
    const values = conditionMainRef.value?.confirm();
    if (!values) return false;
    return values;
  }
</script>
