<template>
  <a-form-item label="编码格式">
    <future-select v-model:value="activeData.format" :options="barcodeFormatOptions" />
  </a-form-item>
  <a-form-item label="条码颜色">
    <future-color-picker v-model:value="activeData.lineColor" size="small" />
  </a-form-item>
  <a-form-item label="宽度">
    <a-input-number v-model:value="activeData.width" placeholder="请输入" :min="0" :max="100" :precision="0" />
  </a-form-item>
  <a-form-item label="高度">
    <a-input-number v-model:value="activeData.height" placeholder="请输入" :min="0" :precision="0" />
  </a-form-item>
  <a-form-item label="默认值">
    <future-select v-model:value="activeData.dataType" :options="dataTypeOptions" />
  </a-form-item>
  <a-form-item label="固定值" v-if="activeData.dataType === 'static'">
    <future-input v-model:value="activeData.staticText" placeholder="请输入" allowClear @change="onTextChange" />
  </a-form-item>
  <a-form-item label="选择组件" v-if="activeData.dataType === 'relation'">
    <future-select v-model:value="activeData.relationField" :options="drawingOptions" allowClear showSearch />
  </a-form-item>
</template>
<script lang="ts" setup>
  import { useMessage } from '@/hooks/web/useMessage';
  defineOptions({ inheritAttrs: false });
  defineProps(['activeData', 'drawingOptions']);
  const { createMessage } = useMessage();
  const dataTypeOptions = [
    { id: 'static', fullName: '固定值' },
    { id: 'relation', fullName: '组件联动' },
  ];
  const barcodeFormatOptions = [
    { id: 'code128', fullName: 'code128' },
    { id: 'ean13', fullName: 'ean13' },
    { id: 'ean8', fullName: 'ean8' },
    { id: 'ean5', fullName: 'ean5' },
    { id: 'ean2', fullName: 'ean2' },
    { id: 'code39', fullName: 'code39' },
    { id: 'itf14', fullName: 'itf14' },
    { id: 'msi10', fullName: 'msi10' },
    { id: 'msi11', fullName: 'msi11' },
    { id: 'pharmacode', fullName: 'pharmacode' },
    { id: 'upc', fullName: 'upc' },
    { id: 'codabar', fullName: 'codabar' },
  ];

  function onTextChange(val) {
    if (!val) return;
    let reg = /^[A-Za-z0-9]+$/;
    if (!reg.test(val)) {
      createMessage.error('固定值请输入数字或者英文字母');
    }
  }
</script>
