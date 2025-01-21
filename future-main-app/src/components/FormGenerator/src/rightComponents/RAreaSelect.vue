<template>
  <a-form-item label="默认值">
    <future-area-select
      v-model:value="activeData.__config__.defaultValue"
      placeholder="选择默认值"
      :multiple="activeData.multiple"
      :level="activeData.level"
      allowClear
      :key="activeData.__config__.renderKey" />
  </a-form-item>
  <a-form-item label="格式">
    <future-radio v-model:value="activeData.level" :options="levelOptions" class="level-radio" @change="onChange" />
  </a-form-item>
  <a-form-item label="能否清空">
    <a-switch v-model:checked="activeData.clearable" />
  </a-form-item>
  <a-form-item label="能否多选">
    <a-switch v-model:checked="activeData.multiple" @change="onChange" />
  </a-form-item>
</template>
<script lang="ts" setup>
  defineOptions({ inheritAttrs: false });
  const props = defineProps(['activeData']);

  const levelOptions = [
    { id: 0, fullName: '省' },
    { id: 1, fullName: '省市' },
    { id: 2, fullName: '省市区' },
    { id: 3, fullName: '省市区-街道' },
  ];

  function onChange() {
    props.activeData.__config__.defaultValue = [];
    props.activeData.__config__.renderKey = +new Date();
  }
</script>
<style lang="less" scoped>
  .level-radio {
    :deep(.ant-radio-wrapper) {
      display: block;
    }
  }
</style>
