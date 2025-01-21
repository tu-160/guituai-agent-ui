<template>
  <a-form-item label="关联弹窗">
    <future-select v-model:value="activeData.relationField" placeholder="请选择" :options="formFieldsOptions" allowClear showSearch />
  </a-form-item>
  <a-form-item label="关联字段">
    <A-input v-model:value="activeData.showField" placeholder="请输入" />
  </a-form-item>
</template>
<script lang="ts" setup>
  import { computed } from 'vue';

  defineOptions({ inheritAttrs: false });
  const props = defineProps(['activeData', 'drawingList']);

  const formFieldsOptions = computed(() => {
    let list: any[] = [];
    const loop = (data, parent?) => {
      if (!data) return;
      if (data.__config__ && data.__config__.children && Array.isArray(data.__config__.children)) {
        loop(data.__config__.children, data);
      }
      if (Array.isArray(data)) data.forEach(d => loop(d, parent));
      if (data.__config__ && data.__config__.futureKey) {
        if (data.__config__.futureKey === 'popupSelect' && data.__vModel__ && isSameSource(data)) {
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
</script>
