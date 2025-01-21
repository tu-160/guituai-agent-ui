<template>
  <a-form-item label="控件文本">
    <future-i18n-input v-model:value="activeData.buttonText" v-model:i18n="activeData.buttonTextI18nCode" placeholder="请输入" />
  </a-form-item>
  <a-form-item label="对齐方式">
    <future-radio v-model:value="activeData.align" :options="alignOptions" optionType="button" button-style="solid" class="right-radio" />
  </a-form-item>
  <a-form-item label="按钮类型">
    <a-select v-model:value="activeData.type">
      <a-select-option value="">默认按钮</a-select-option>
      <a-select-option value="primary">主要按钮</a-select-option>
      <a-select-option value="success">成功按钮</a-select-option>
      <a-select-option value="info">信息按钮</a-select-option>
      <a-select-option value="warning">警告按钮</a-select-option>
      <a-select-option value="danger">危险按钮</a-select-option>
    </a-select>
  </a-form-item>
</template>
<script lang="ts" setup>
  defineOptions({ inheritAttrs: false });
  defineProps(['activeData']);
  const alignOptions = [
    { id: 'left', fullName: '左对齐' },
    { id: 'center', fullName: '居中对齐' },
    { id: 'right', fullName: '右对齐' },
  ];
</script>
