<template>
  <a-form-item label="默认值">
    <future-checkbox v-model:value="activeData.__config__.defaultValue" :options="activeData.options" :fieldNames="activeData.props" />
  </a-form-item>
  <a-form-item label="排列方式">
    <future-radio v-model:value="activeData.direction" :options="directionOptions" optionType="button" buttonStyle="solid" />
  </a-form-item>
  <data-properties :activeData="activeData" :dicOptions="dicOptions" />
</template>
<script lang="ts" setup>
  import DataProperties from './components/DataProperties.vue';

  defineOptions({ inheritAttrs: false });
  defineProps(['activeData', 'dicOptions']);
  const directionOptions = [
    { id: 'horizontal', fullName: '水平排列' },
    { id: 'vertical', fullName: '垂直排列' },
  ];
</script>
