<template>
  <a-form-item label="默认值">
    <a-input-number
      v-model:value="activeData.__config__.defaultValue"
      placeholder="请输入"
      :min="activeData.min"
      :max="activeData.max"
      :step="activeData.step" />
  </a-form-item>
  <a-form-item label="最小值">
    <a-input-number v-model:value="activeData.min" placeholder="请输入" />
  </a-form-item>
  <a-form-item label="最大值">
    <a-input-number v-model:value="activeData.max" placeholder="请输入" />
  </a-form-item>
  <a-form-item label="步数">
    <a-input-number v-model:value="activeData.step" placeholder="请输入" :min="0" />
  </a-form-item>
</template>
<script lang="ts" setup>
  defineOptions({ inheritAttrs: false });
  defineProps(['activeData']);
</script>
