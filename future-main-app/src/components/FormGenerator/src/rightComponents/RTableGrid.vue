<template>
  <a-form-item label="表格边框">
    <future-radio v-model:value="activeData.__config__.borderType" :options="borderTypeOptions" optionType="button" button-style="solid" class="right-radio" />
  </a-form-item>
  <template v-if="activeData.__config__.borderType != 'none'">
    <a-form-item label="边框颜色">
      <future-color-picker v-model:value="activeData.__config__.borderColor" size="small" />
    </a-form-item>
    <a-form-item label="边框宽度">
      <a-input-number v-model:value="activeData.__config__.borderWidth" :min="1" :max="10" :precision="0" @change="onBorderWidthChange" />
    </a-form-item>
  </template>
</template>
<script lang="ts" setup>
  defineOptions({ inheritAttrs: false });
  const props = defineProps(['activeData']);

  const borderTypeOptions = [
    { id: 'none', fullName: '无' },
    { id: 'solid', fullName: '实线' },
    { id: 'dashed', fullName: '虚线' },
    { id: 'dotted', fullName: '点状' },
  ];

  function onBorderWidthChange(val) {
    if (!val) props.activeData.__config__.borderWidth = 1;
  }
</script>
