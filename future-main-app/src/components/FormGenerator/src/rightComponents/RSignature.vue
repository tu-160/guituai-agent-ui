<template>
  <a-form-item label="选择签章">
    <future-select v-model:value="activeData.ableIds" showSearch multiple :options="options" />
  </a-form-item>
</template>
<script lang="ts" setup>
  import { getSignatureSelector } from '@/api/system/signature';
  import { ref, onMounted } from 'vue';

  defineOptions({ inheritAttrs: false });
  defineProps(['activeData']);

  const options = ref([]);

  function getOptions() {
    getSignatureSelector().then(res => {
      options.value = res?.data?.list || [];
    });
  }

  onMounted(() => getOptions());
</script>
