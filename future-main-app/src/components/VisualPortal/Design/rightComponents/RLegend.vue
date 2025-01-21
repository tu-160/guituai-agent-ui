<template>
  <a-collapse-panel>
    <template #header>图例设置</template>
    <a-form-item label="显示">
      <a-switch v-model:checked="activeData.option.legendShow" />
    </a-form-item>
    <template v-if="activeData.option.legendShow && showType == 'pc'">
      <a-form-item label="字体大小">
        <a-input-number v-model:value="activeData.option.legendTextStyleFontSize" placeholder="请输入" :min="12" :max="25" />
      </a-form-item>
      <a-form-item label="布局">
        <future-radio v-model:value="activeData.option.legendOrient" :options="layoutList" optionType="button" button-style="solid" class="right-radio" />
      </a-form-item>
      <a-form-item label="上下边距">
        <a-slider v-model:value="activeData.option.legendTop" :max="100" />
      </a-form-item>
      <a-form-item label="左右边距">
        <a-slider v-model:value="activeData.option.legendLeft" :max="100" />
      </a-form-item>
    </template>
  </a-collapse-panel>
</template>
<script lang="ts" setup>
  defineProps(['activeData', 'showType']);
  const layoutList = [
    { fullName: '横排', id: 'horizontal' },
    { fullName: '竖排', id: 'vertical' },
  ];
</script>
