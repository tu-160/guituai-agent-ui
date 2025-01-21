<template>
  <a-collapse-panel>
    <template #header>{{ getTitle() }}</template>
    <template v-if="activeData.futureKey == 'pieChart' || activeData.futureKey == 'mapChart'">
      <a-form-item label="上下边距">
        <a-slider v-model:value="activeData.option.seriesCenterTop" :max="100" />
      </a-form-item>
      <a-form-item label="左右边距">
        <a-slider v-model:value="activeData.option.seriesCenterLeft" :max="100" />
      </a-form-item>
    </template>
    <template v-else-if="activeData.futureKey == 'radarChart'">
      <a-form-item label="上下边距">
        <a-slider v-model:value="activeData.option.radarCenterTop" :max="100" />
      </a-form-item>
      <a-form-item label="左右边距">
        <a-slider v-model:value="activeData.option.radarCenterLeft" :max="100" />
      </a-form-item>
    </template>
    <template v-else>
      <a-form-item label="左边距">
        <a-slider v-model:value="activeData.option.gridLeft" :max="100" />
      </a-form-item>
      <a-form-item label="顶边距">
        <a-slider v-model:value="activeData.option.gridTop" :max="100" />
      </a-form-item>
      <a-form-item label="右边距">
        <a-slider v-model:value="activeData.option.gridRight" :max="100" />
      </a-form-item>
      <a-form-item label="底边距">
        <a-slider v-model:value="activeData.option.gridBottom" :max="100" />
      </a-form-item>
    </template>
  </a-collapse-panel>
</template>
<script lang="ts" setup>
  const props = defineProps(['activeData']);
  function getTitle() {
    const futureKey = props.activeData.futureKey;
    if (futureKey == 'pieChart' || futureKey == 'radarChart' || futureKey == 'mapChart') return '中心坐标设置';
    return '坐标轴边距设置';
  }
</script>
