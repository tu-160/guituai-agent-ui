<template>
  <a-form-item label="实点颜色">
    <future-color-picker v-model:value="activeData.colorDark" size="small" />
  </a-form-item>
  <a-form-item label="尺寸">
    <a-input-number v-model:value="activeData.width" placeholder="请输入" :min="0" :precision="0" />
  </a-form-item>
  <a-form-item label="默认值">
    <a-select v-model:value="activeData.dataType">
      <a-select-option v-for="item in dataTypeOptions" :key="item.id" :value="item.id">
        {{ item.fullName }}<BasicHelp text="不支持代码生成" v-if="item.id === 'form'" />
      </a-select-option>
    </a-select>
  </a-form-item>
  <a-form-item label="固定值" v-if="activeData.dataType === 'static'">
    <a-input v-model:value="activeData.staticText" placeholder="请输入" allowClear />
  </a-form-item>
  <a-form-item label="选择组件" v-if="activeData.dataType === 'relation'">
    <future-select v-model:value="activeData.relationField" :options="drawingOptions" allowClear showSearch />
  </a-form-item>
</template>
<script lang="ts" setup>
  defineOptions({ inheritAttrs: false });
  defineProps(['activeData', 'drawingOptions', 'formInfo']);

  const dataTypeOptions = [
    { id: 'static', fullName: '固定值' },
    { id: 'relation', fullName: '组件联动' },
    { id: 'form', fullName: '当前表单路径' },
  ];
</script>
