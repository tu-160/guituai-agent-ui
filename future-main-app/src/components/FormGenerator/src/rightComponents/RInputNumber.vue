<template>
  <a-form-item label="默认值">
    <a-input-number
      v-model:value="activeData.__config__.defaultValue"
      placeholder="请输入"
      :min="activeData.min"
      :max="activeData.max"
      :controls="activeData.controls"
      :step="activeData.step"
      :precision="activeData.precision || activeData.precision === 0 ? activeData.precision : undefined" />
  </a-form-item>
  <a-form-item label="最小值">
    <a-input-number v-model:value="activeData.min" placeholder="请输入" />
  </a-form-item>
  <a-form-item label="最大值">
    <a-input-number v-model:value="activeData.max" placeholder="请输入" />
  </a-form-item>
  <a-form-item label="精度">
    <a-input-number v-model:value="activeData.precision" placeholder="请输入" :precision="0" :min="0" :max="15" />
  </a-form-item>
  <a-form-item label="按钮">
    <a-switch v-model:checked="activeData.controls" @change="onControlsChange" />
  </a-form-item>
  <a-form-item label="步数" v-if="activeData.controls">
    <a-input-number
      v-model:value="activeData.step"
      placeholder="请输入"
      :precision="activeData.precision || activeData.precision === 0 ? activeData.precision : undefined" />
  </a-form-item>
  <template v-if="!activeData.controls">
    <a-form-item label="前缀">
      <a-input v-model:value="activeData.addonBefore" placeholder="请输入" />
    </a-form-item>
    <a-form-item label="后缀">
      <a-input v-model:value="activeData.addonAfter" placeholder="请输入" />
    </a-form-item>
    <a-form-item label="千位分隔">
      <a-switch v-model:checked="activeData.thousands" @change="activeData.__config__.renderKey = +new Date()" />
    </a-form-item>
  </template>
  <a-form-item label="大写金额">
    <a-switch v-model:checked="activeData.isAmountChinese" />
  </a-form-item>
</template>
<script lang="ts" setup>
  defineOptions({ inheritAttrs: false });
  const props = defineProps(['activeData']);

  function onControlsChange() {
    props.activeData.addonBefore = '';
    props.activeData.addonAfter = '';
    props.activeData.thousands = false;
    props.activeData.__config__.renderKey = +new Date();
  }
</script>
