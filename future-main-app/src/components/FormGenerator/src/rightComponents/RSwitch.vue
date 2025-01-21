<template>
  <a-form-item label="开启展示值">
    <a-input v-model:value="activeData.activeTxt" placeholder="请输入" />
  </a-form-item>
  <a-form-item label="关闭展示值">
    <a-input v-model:value="activeData.inactiveTxt" placeholder="请输入" />
  </a-form-item>
  <a-form-item label="默认值">
    <a-switch v-model:checked="activeData.__config__.defaultValue" :checkedValue="activeData.activeValue" :unCheckedValue="activeData.inactiveValue" />
  </a-form-item>
</template>
<script lang="ts" setup>
  defineOptions({ inheritAttrs: false });
  defineProps(['activeData']);
</script>
