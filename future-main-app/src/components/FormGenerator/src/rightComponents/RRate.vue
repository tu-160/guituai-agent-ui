<template>
  <a-form-item label="默认值">
    <a-rate v-model:value="activeData.__config__.defaultValue" :count="activeData.count" :allowHalf="activeData.allowHalf" />
  </a-form-item>
  <a-form-item label="最大值">
    <a-input-number v-model:value="activeData.count" placeholder="请输入" :min="1" :max="50" :precision="0" />
  </a-form-item>
  <a-form-item label="允许半选">
    <a-switch v-model:checked="activeData.allowHalf" />
  </a-form-item>
</template>
<script lang="ts" setup>
  defineOptions({ inheritAttrs: false });
  defineProps(['activeData']);
</script>
