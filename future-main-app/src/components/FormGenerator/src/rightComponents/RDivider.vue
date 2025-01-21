<template>
  <a-form-item label="展示文本">
    <future-i18n-input v-model:value="activeData.content" v-model:i18n="activeData.contentI18nCode" placeholder="请输入" />
  </a-form-item>
  <a-form-item label="文本位置">
    <future-radio v-model:value="activeData.contentPosition" :options="positionOptions" optionType="button" button-style="solid" class="right-radio" />
  </a-form-item>
</template>
<script lang="ts" setup>
  defineOptions({ inheritAttrs: false });
  defineProps(['activeData']);

  const positionOptions = [
    { id: 'left', fullName: '左边' },
    { id: 'center', fullName: '中间' },
    { id: 'right', fullName: '右边' },
  ];
</script>
