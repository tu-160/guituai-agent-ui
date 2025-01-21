<template>
  <a-collapse-panel>
    <template #header>提示语设置</template>
    <a-form-item label="显示">
      <a-switch v-model:checked="activeData.option.tooltipShow" />
    </a-form-item>
    <template v-if="activeData.option.tooltipShow">
      <template v-if="showType == 'pc'">
        <a-form-item label="字体大小">
          <a-input-number v-model:value="activeData.option.tooltipTextStyleFontSize" placeholder="请输入" :min="12" :max="25" />
        </a-form-item>
        <a-form-item label="字体加粗">
          <a-switch v-model:checked="activeData.option.tooltipTextStyleFontWeight" />
        </a-form-item>
      </template>
      <a-form-item label="字体颜色">
        <future-color-picker v-model:value="activeData.option.tooltipTextStyleColor" size="small" />
      </a-form-item>
      <a-form-item label="背景色">
        <future-color-picker v-model:value="activeData.option.tooltipBgColor" size="small" />
      </a-form-item>
    </template>
  </a-collapse-panel>
</template>
<script lang="ts" setup>
  defineProps(['activeData', 'showType']);
</script>
