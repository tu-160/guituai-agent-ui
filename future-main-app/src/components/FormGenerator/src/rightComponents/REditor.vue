<template>
  <a-form-item label="默认值">
    <a-input v-model:value="activeData.__config__.defaultValue" placeholder="请输入" />
  </a-form-item>
</template>
<script lang="ts" setup>
  defineOptions({ inheritAttrs: false });
  defineProps(['activeData']);
</script>
