<template>
  <a-form-item label="默认值">
    <future-color-picker
      v-model:value="activeData.__config__.defaultValue"
      :color-format="activeData.colorFormat"
      :key="renderKey"
      :show-alpha="activeData.showAlpha" />
  </a-form-item>
  <a-form-item label="颜色格式">
    <future-select v-model:value="activeData.colorFormat" placeholder="请选择" allowClear :options="colorFormatOptions" @change="onColorFormatChange" />
  </a-form-item>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  defineOptions({ inheritAttrs: false });
  const props = defineProps(['activeData']);
  const colorFormatOptions = [
    { id: 'hex', fullName: 'hex' },
    { id: 'rgb', fullName: 'rgb' },
    { id: 'rgba', fullName: 'rgba' },
    { id: 'hsv', fullName: 'hsv' },
    { id: 'hsl', fullName: 'hsl' },
  ];
  const renderKey = ref(+new Date());

  function onColorFormatChange(val) {
    props.activeData.__config__.defaultValue = null;
    props.activeData.showAlpha = val && val.indexOf('a') > -1;
    props.activeData.__config__.renderKey = +new Date();
    renderKey.value = +new Date();
  }
</script>
