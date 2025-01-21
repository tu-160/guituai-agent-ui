<template>
  <a-collapse-panel>
    <template #header>图表标题设置</template>
    <a-form-item label="标题名称">
      <future-i18n-input v-model:value="activeData.option.titleText" v-model:i18n="activeData.option.titleTextI18nCode" placeholder="请输入" />
    </a-form-item>
    <a-form-item label="字体大小">
      <a-input-number v-model:value="activeData.option.titleTextStyleFontSize" placeholder="请输入" :min="12" :max="25" />
    </a-form-item>
    <a-form-item label="字体加粗">
      <a-switch v-model:checked="activeData.option.titleTextStyleFontWeight" />
    </a-form-item>
    <a-form-item label="字体颜色">
      <future-color-picker v-model:value="activeData.option.titleTextStyleColor" size="small" />
    </a-form-item>
    <a-form-item label="字体位置">
      <future-radio v-model:value="activeData.option.titleLeft" :options="alignList" optionType="button" button-style="solid" class="right-radio" />
    </a-form-item>
    <a-form-item label="背景色">
      <future-color-picker v-model:value="activeData.option.titleBgColor" size="small" />
    </a-form-item>
  </a-collapse-panel>
</template>
<script lang="ts" setup>
  import { alignList } from '../helper/dataMap';

  defineProps(['activeData', 'showType']);
</script>
