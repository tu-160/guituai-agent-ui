<template>
  <a-form-item label="显示阴影" v-if="showType === 'pc'">
    <future-radio v-model:value="activeData.shadow" :options="typeOptions" optionType="button" button-style="solid" class="right-radio" />
  </a-form-item>
</template>
<script lang="ts" setup>
  import { inject, computed } from 'vue';
  defineOptions({ inheritAttrs: false });
  defineProps(['activeData']);

  const typeOptions = [
    { id: 'never', fullName: '永不显示' },
    { id: 'hover', fullName: '移入显示' },
  ];

  const getShowType: (() => string | undefined) | undefined = inject('getShowType');
  const showType = computed(() => (getShowType as () => string | undefined)());
</script>
