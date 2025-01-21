<template>
  <a-collapse-panel>
    <template #header>图表副标题设置</template>
    <a-form-item label="副标题名称">
      <future-i18n-input v-model:value="activeData.option.titleSubtext" v-model:i18n="activeData.option.titleSubtextI18nCode" placeholder="请输入" />
    </a-form-item>
    <a-form-item label="字体大小">
      <a-input-number v-model:value="activeData.option.titleSubtextStyleFontSize" placeholder="请输入" :min="12" :max="25" />
    </a-form-item>
    <a-form-item label="字体加粗">
      <a-switch v-model:checked="activeData.option.titleSubtextStyleFontWeight" />
    </a-form-item>
    <a-form-item label="字体颜色">
      <future-color-picker v-model:value="activeData.option.titleSubtextStyleColor" size="small" />
    </a-form-item>
  </a-collapse-panel>
</template>
<script lang="ts" setup>
  defineProps(['activeData', 'showType']);
</script>
