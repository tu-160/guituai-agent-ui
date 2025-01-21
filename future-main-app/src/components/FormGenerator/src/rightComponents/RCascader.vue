<template>
  <a-form-item label="默认值">
    <future-cascader
      placeholder="请选择"
      v-model:value="activeData.__config__.defaultValue"
      :options="activeData.options"
      :fieldNames="activeData.props"
      :multiple="activeData.multiple"
      allowClear
      showSearch />
  </a-form-item>
  <data-properties :activeData="activeData" :dicOptions="dicOptions" @propsChildrenChange="onChange" />
  <a-form-item label="能否清空">
    <a-switch v-model:checked="activeData.clearable" />
  </a-form-item>
  <a-form-item label="能否搜索">
    <a-switch v-model:checked="activeData.filterable" />
  </a-form-item>
  <a-form-item label="能否多选">
    <a-switch v-model:checked="activeData.multiple" @change="onChange" />
  </a-form-item>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import DataProperties from './components/DataProperties.vue';

  defineOptions({ inheritAttrs: false });
  const props = defineProps(['activeData', 'dicOptions']);
  const cascaderKey = ref(+new Date());

  function onChange() {
    cascaderKey.value = +new Date();
    props.activeData.__config__.renderKey = +new Date();
    props.activeData.__config__.defaultValue = [];
  }
</script>
