<template>
  <a-form-item label="链接文本">
    <future-i18n-input v-model:value="activeData.content" v-model:i18n="activeData.contentI18nCode" placeholder="请输入" />
  </a-form-item>
  <a-form-item>
    <template #label>链接地址<BasicHelp text="地址以http://或https://开头" /></template>
    <a-input v-model:value="activeData.href" placeholder="请输入">
      <template #addonAfter>
        <a-select v-model:value="activeData.target" class="!w-85px">
          <a-select-option value="_self">_self</a-select-option>
          <a-select-option value="_blank">_blank</a-select-option>
        </a-select>
      </template>
    </a-input>
  </a-form-item>
  <a-form-item label="对齐方式">
    <future-radio v-model:value="activeData.textStyle['text-align']" :options="alignOptions" optionType="button" button-style="solid" class="right-radio" />
  </a-form-item>
</template>
<script lang="ts" setup>
  defineOptions({ inheritAttrs: false });
  defineProps(['activeData']);
  const alignOptions = [
    { id: 'left', fullName: '左对齐' },
    { id: 'center', fullName: '居中对齐' },
    { id: 'right', fullName: '右对齐' },
  ];
</script>
