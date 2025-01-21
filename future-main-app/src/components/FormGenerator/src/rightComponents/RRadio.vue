<template>
  <a-form-item label="默认值">
    <future-select
      v-model:value="activeData.__config__.defaultValue"
      placeholder="请选择"
      :options="activeData.options"
      :fieldNames="activeData.props"
      allowClear />
  </a-form-item>
  <a-form-item label="排列方式">
    <future-radio v-model:value="activeData.direction" :options="directionOptions" optionType="button" buttonStyle="solid" />
  </a-form-item>
  <data-properties :activeData="activeData" :dicOptions="dicOptions" />
  <template v-if="showType === 'pc'">
    <a-form-item label="选项样式">
      <future-radio v-model:value="activeData.optionType" :options="optionTypeOptions" optionType="button" buttonStyle="solid" />
    </a-form-item>
    <a-form-item v-if="activeData.optionType === 'button'" label="组件尺寸">
      <future-radio v-model:value="activeData.size" :options="sizeOptions" optionType="button" buttonStyle="solid" />
    </a-form-item>
  </template>
</template>
<script lang="ts" setup>
  import { useDynamic } from '../hooks/useDynamic';
  import DataProperties from './components/DataProperties.vue';

  defineOptions({ inheritAttrs: false });
  const props = defineProps(['activeData', 'dicOptions']);
  const { showType, sizeOptions, optionTypeOptions } = useDynamic(props.activeData);
  const directionOptions = [
    { id: 'horizontal', fullName: '水平排列' },
    { id: 'vertical', fullName: '垂直排列' },
  ];
</script>
