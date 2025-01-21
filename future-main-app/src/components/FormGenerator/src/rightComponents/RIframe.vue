<template>
  <a-form-item>
    <template #label>链接地址<BasicHelp text="地址以http://或https://开头" /></template>
    <a-input v-model:value="activeData.href" placeholder="请输入" />
  </a-form-item>
  <a-form-item label="高度">
    <a-input-number v-model:value="activeData.height" placeholder="请输入" :min="0" />
  </a-form-item>
  <a-form-item label="边框">
    <future-radio v-model:value="activeData.borderType" :options="borderTypeOptions" optionType="button" button-style="solid" class="right-radio" />
  </a-form-item>
  <template v-if="activeData.borderType != 'none'">
    <a-form-item label="边框颜色">
      <future-color-picker v-model:value="activeData.borderColor" size="small" />
    </a-form-item>
    <a-form-item label="边框宽度">
      <a-input-number v-model:value="activeData.borderWidth" :min="1" :max="10" :precision="0" @change="onBorderWidthChange" />
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
    if (!val) props.activeData.borderWidth = 1;
  }
</script>
