<template>
  <a-form-item label="远端数据">
    <interface-modal :value="activeData.interfaceId" :title="activeData.interfaceName" popupTitle="远端数据" @change="onInterfaceIdChange" />
  </a-form-item>
  <a-form-item label="显示字段">
    <a-auto-complete
      v-model:value="activeData.relationField"
      placeholder="请输入"
      :options="options"
      @focus="onFocus(activeData.relationField)"
      @search="debounceOnSearch(activeData.relationField)" />
  </a-form-item>
  <a-form-item label="参数设置" v-if="activeData.templateJson?.length">
    <select-interface-btn :templateJson="activeData.templateJson" :fieldOptions="getFormFieldsOptions" :type="3" @fieldChange="onRelationFieldChange" />
  </a-form-item>
  <a-form-item>
    <template #label>显示条数<BasicHelp text="最大值只能设置为50" /></template>
    <a-input-number placeholder="请输入" v-model:value="activeData.total" :min="1" :max="50" :precision="0" />
  </a-form-item>
  <a-form-item label="能否清空">
    <a-switch v-model:checked="activeData.clearable" />
  </a-form-item>
</template>
<script lang="ts" setup>
  import { computed, unref } from 'vue';
  import { useDynamic } from '../hooks/useDynamic';
  import { InterfaceModal } from '@/components/CommonModal';
  import { useField } from '../hooks/useField';
  import { onMounted } from 'vue';
  import { SelectInterfaceBtn } from '@/components/Interface';

  defineOptions({ inheritAttrs: false });
  const props = defineProps(['activeData', 'dicOptions']);
  const { options, debounceOnSearch, onFocus, initFieldData } = useField(props.activeData);
  const { formFieldsOptions, onRelationFieldChange } = useDynamic(props.activeData);

  const getFormFieldsOptions = computed(() => [{ id: '@keyword', fullName: '@keyword' }, ...unref(formFieldsOptions)]);

  function onInterfaceIdChange(val, row) {
    if (!val) {
      props.activeData.interfaceId = '';
      props.activeData.interfaceName = '';
      props.activeData.templateJson = [];
      props.activeData.__config__.defaultValue = '';
      initFieldData();
      return;
    }
    if (props.activeData.__config__.propsUrl === val) return;
    props.activeData.interfaceId = val;
    props.activeData.interfaceName = row.fullName;
    props.activeData.templateJson = row.parameterJson ? JSON.parse(row.parameterJson).map(o => ({ ...o, relationField: '', sourceType: 1 })) : [];
    props.activeData.__config__.defaultValue = '';
    initFieldData();
  }

  onMounted(() => initFieldData());
</script>
