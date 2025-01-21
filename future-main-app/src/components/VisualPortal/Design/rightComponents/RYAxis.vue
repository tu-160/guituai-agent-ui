<template>
  <a-collapse-panel>
    <template #header>Y轴设置</template>
    <a-form-item label="显示坐标轴">
      <a-switch v-model:checked="activeData.option.yAxisShow" />
    </a-form-item>
    <template v-if="activeData.option.yAxisShow">
      <a-form-item label="坐标轴颜色">
        <future-color-picker v-model:value="activeData.option.yAxisAxisLineLineStyleColor" size="small" />
      </a-form-item>
      <template v-if="showType == 'pc'">
        <a-form-item label="Y轴名称">
          <future-i18n-input v-model:value="activeData.option.yAxisName" v-model:i18n="activeData.option.yAxisNameI18nCode" placeholder="请输入" />
        </a-form-item>
        <a-form-item label="字体大小">
          <a-input-number v-model:value="activeData.option.yAxisNameTextStyleFontSize" placeholder="请输入" :min="12" :max="25" />
        </a-form-item>
        <a-form-item label="字体加粗">
          <a-switch v-model:checked="activeData.option.yAxisNameTextStyleFontWeight" />
        </a-form-item>
        <a-form-item label="字体颜色">
          <future-color-picker v-model:value="activeData.option.yAxisNameTextStyleColor" size="small" />
        </a-form-item>
        <a-form-item label="标签大小">
          <a-input-number v-model:value="activeData.option.yAxisAxisLabelTextStyleFontSize" :min="12" :max="25" placeholder="请输入" />
        </a-form-item>
        <a-form-item label="标签加粗">
          <a-switch v-model:checked="activeData.option.yAxisAxisLabelTextFontWeight" />
        </a-form-item>
      </template>
      <a-form-item label="标签颜色">
        <future-color-picker v-model:value="activeData.option.yAxisAxisLabelTextStyleColor" size="small" />
      </a-form-item>
      <a-form-item label="显示网格线">
        <a-switch v-model:checked="activeData.option.yAxisSplitLineShow" />
      </a-form-item>
      <a-form-item label="网格线颜色" v-if="activeData.option.yAxisSplitLineShow">
        <future-color-picker v-model:value="activeData.option.yAxisSplitLineLineStyleColor" size="small" />
      </a-form-item>
    </template>
    <a-form-item label="反转" v-show="showType == 'pc'">
      <a-switch v-model:checked="activeData.option.yAxisInverse" />
    </a-form-item>
  </a-collapse-panel>
</template>
<script lang="ts" setup>
  defineProps(['activeData', 'showType']);
</script>
