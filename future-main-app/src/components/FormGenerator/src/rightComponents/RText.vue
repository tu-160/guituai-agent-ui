<template>
  <a-form-item label="文本内容">
    <future-i18n-input v-model:value="activeData.content" v-model:i18n="activeData.contentI18nCode" placeholder="请输入" />
  </a-form-item>
  <a-form-item label="行高">
    <a-input-number v-model:value="activeData.textStyle['line-height']" :min="12" placeholder="请输入" :precision="0" />
  </a-form-item>
  <a-form-item label="字体大小">
    <a-input-number v-model:value="activeData.textStyle['font-size']" :min="12" placeholder="请输入" :precision="0" />
  </a-form-item>
  <a-form-item label="对齐方式">
    <future-radio v-model:value="activeData.textStyle['text-align']" :options="alignOptions" optionType="button" button-style="solid" class="right-radio" />
  </a-form-item>
  <a-form-item label="字体颜色">
    <future-color-picker v-model:value="activeData.textStyle['color']" size="small" />
  </a-form-item>
  <a-form-item label="是否加粗">
    <a-switch v-model:checked="activeData.textStyle['font-weight']" checkedValue="bold" unCheckedValue="normal" />
  </a-form-item>
  <a-form-item label="是否斜体">
    <a-switch v-model:checked="activeData.textStyle['font-style']" checkedValue="italic" unCheckedValue="normal" />
  </a-form-item>
  <a-form-item label="下划线样式">
    <future-radio
      v-model:value="activeData.textStyle['text-decoration']"
      :options="decorationOptions"
      optionType="button"
      button-style="solid"
      class="right-radio" />
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
  const decorationOptions = [
    { id: 'none', fullName: '无样式' },
    { id: 'underline', fullName: '下划线' },
    { id: 'line-through', fullName: '删除线' },
  ];
</script>
