<template>
  <a-collapse-panel>
    <template #header>跳转设置</template>
    <a-form-item>
      <template #label>跳转地址<BasicHelp :text="getText" /></template>
      <a-input v-model:value="activeData.option.urlAddress" placeholder="请输入" v-if="showType == 'pc'">
        <template #addonAfter>
          <a-select v-model:value="activeData.option.target" class="!w-85px">
            <a-select-option value="_self">_self</a-select-option>
            <a-select-option value="_blank">_blank</a-select-option>
          </a-select>
        </template>
      </a-input>
      <a-input v-model:value="activeData.option.appUrlAddress" placeholder="请输入" v-else />
    </a-form-item>
  </a-collapse-panel>
</template>
<script lang="ts" setup>
  import { computed } from 'vue';

  const props = defineProps(['activeData', 'showType']);
  const getText = computed(() => {
    const text = ['tableList', 'rankList'].includes(props.activeData.futureKey) ? '动态参数可选值(field1,field2)' : '参数可选';
    return '地址以http://或https://开头，例:https://xxx.com?xxx1=${field1}&xxx2=${field2}，' + text;
  });
</script>
