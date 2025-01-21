<template>
  <a-form-item label="关联功能">
    <future-select
      v-model:value="activeData.relationField"
      placeholder="请选择"
      :options="formFieldsOptions"
      allowClear
      showSearch
      @change="onRelationFieldChange" />
  </a-form-item>
  <a-form-item label="关联字段">
    <future-select
      v-model:value="activeData.showField"
      placeholder="请选择"
      :options="fieldOptions"
      clearable
      showSearch
      @dropdownVisibleChange="visibleChange" />
  </a-form-item>
</template>
<script lang="ts" setup>
  import { getFormDataFields } from '@/api/onlineDev/visualDev';
  import { computed, ref, onMounted, unref } from 'vue';
  import { useMessage } from '@/hooks/web/useMessage';

  defineOptions({ inheritAttrs: false });
  const props = defineProps(['activeData', 'drawingList']);
  const { createMessage } = useMessage();
  const fieldOptions = ref<any[]>([]);

  const formFieldsOptions = computed(() => {
    let list: any[] = [];
    const loop = (data, parent?) => {
      if (!data) return;
      if (data.__config__ && data.__config__.children && Array.isArray(data.__config__.children)) {
        loop(data.__config__.children, data);
      }
      if (Array.isArray(data)) data.forEach(d => loop(d, parent));
      if (data.__config__ && data.__config__.futureKey) {
        if (data.__config__.futureKey === 'relationForm' && data.__vModel__ && isSameSource(data)) {
          list.push({
            fullName: data.__config__.label,
            id:
              data.__config__ && data.__config__.tableName
                ? data.__vModel__ + '_futureTable_' + data.__config__.tableName + (data.__config__.isSubTable ? '0' : '1')
                : data.__vModel__,
            ...data,
            disabled: false,
          });
        }
      }
    };
    loop(props.drawingList);
    return list;
  });

  function isSameSource(data) {
    const isSubTable = props.activeData.__config__.isSubTable;
    if (isSubTable) return data.__config__.isSubTable && props.activeData.__config__.parentVModel === data.__config__.parentVModel;
    return !data.__config__.isSubTable;
  }
  function onRelationFieldChange(val) {
    props.activeData.showField = '';
    if (!val) return (fieldOptions.value = []);
    getFieldOptions();
  }
  function getFieldOptions() {
    if (!props.activeData.relationField || !unref(formFieldsOptions).length) return;
    let list = unref(formFieldsOptions).filter(o => o.id === props.activeData.relationField);
    if (!list.length) return;
    let item = list[0];
    if (!item.modelId) return;
    getFormDataFields(item.modelId).then(res => {
      fieldOptions.value = res.data.list.map(o => ({
        ...o,
        id: o.vmodel,
        fullName: o.label,
      }));
    });
  }
  function visibleChange(val) {
    if (!val) return;
    if (!props.activeData.relationField) createMessage.warning('请先选择关联功能');
  }

  onMounted(() => {
    getFieldOptions();
  });
</script>
