<template>
  <a-collapse-panel>
    <template #header>X轴设置</template>
    <a-form-item label="坐标轴类型" v-show="showType == 'pc'">
      <future-radio v-model:value="activeData.option.category" :options="categoryList" optionType="button" button-style="solid" class="right-radio" />
    </a-form-item>
    <a-form-item label="显示坐标轴">
      <a-switch v-model:checked="activeData.option.xAxisShow" />
    </a-form-item>
    <template v-if="activeData.option.xAxisShow">
      <a-form-item label="坐标轴颜色">
        <future-color-picker v-model:value="activeData.option.xAxisAxisLineLineStyleColor" size="small" />
      </a-form-item>
      <template v-if="showType == 'pc'">
        <a-form-item label="X轴名称">
          <future-i18n-input v-model:value="activeData.option.xAxisName" v-model:i18n="activeData.option.xAxisNameI18nCode" placeholder="请输入" />
        </a-form-item>
        <a-form-item label="字体大小">
          <a-input-number v-model:value="activeData.option.xAxisNameTextStyleFontSize" placeholder="请输入" :min="12" :max="25" />
        </a-form-item>
        <a-form-item label="字体加粗">
          <a-switch v-model:checked="activeData.option.xAxisNameTextStyleFontWeight" />
        </a-form-item>
        <a-form-item label="字体颜色">
          <future-color-picker v-model:value="activeData.option.xAxisNameTextStyleColor" size="small" />
        </a-form-item>
        <a-form-item label="标签大小">
          <a-input-number v-model:value="activeData.option.xAxisAxisLabelTextStyleFontSize" :min="12" :max="25" placeholder="请输入" />
        </a-form-item>
        <a-form-item label="标签加粗">
          <a-switch v-model:checked="activeData.option.xAxisAxisLabelTextFontWeight" />
        </a-form-item>
      </template>
      <a-form-item label="标签颜色">
        <future-color-picker v-model:value="activeData.option.xAxisAxisLabelTextStyleColor" size="small" />
      </a-form-item>
      <a-form-item label="标签角度">
        <a-input-number v-model:value="activeData.option.xAxisAxisLabelRotate" :min="0" :max="100" placeholder="请输入" />
      </a-form-item>
      <a-form-item label="显示网格线">
        <a-switch v-model:checked="activeData.option.xAxisSplitLineShow" />
      </a-form-item>
      <a-form-item label="网格线颜色" v-if="activeData.option.xAxisSplitLineShow">
        <future-color-picker v-model:value="activeData.option.xAxisSplitLineLineStyleColor" size="small" />
      </a-form-item>
    </template>
    <a-form-item label="反转" v-show="showType == 'pc'">
      <a-switch v-model:checked="activeData.option.xAxisInverse" />
    </a-form-item>
  </a-collapse-panel>
</template>
<script lang="ts" setup>
  defineProps(['activeData', 'showType']);
  const categoryList = [
    { fullName: '类型', id: 'category' },
    { fullName: '数值', id: 'value' },
  ];
</script>
