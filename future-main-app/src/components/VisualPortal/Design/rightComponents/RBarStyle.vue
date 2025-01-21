<template>
  <a-collapse-panel v-if="!(activeData.option.styleType == 6 && showType == 'app')">
    <template #header>柱体设置</template>
    <a-form-item label="宽度">
      <a-input-number v-model:value="activeData.option.seriesBarWidth" :min="0" :max="100" placeholder="请输入" />
    </a-form-item>
    <a-form-item label="弧度" v-if="!(activeData.option.styleType == 2 && showType == 'app')">
      <a-input-number v-model:value="activeData.option.seriesItemStyleBarBorderRadius" :min="0" :max="100" placeholder="请输入" />
    </a-form-item>
  </a-collapse-panel>
</template>
<script lang="ts" setup>
  defineProps(['activeData', 'showType']);
</script>
