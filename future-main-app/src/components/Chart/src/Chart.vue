<template>
  <div :loading="loading">
    <div ref="chartRef" :style="{ width, height }"></div>
  </div>
</template>
<script lang="ts" setup>
  import { Ref, ref, watch } from 'vue';
  import { useECharts } from '@/hooks/web/useECharts';

  const props = defineProps({
    loading: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    width: {
      type: String as PropType<string>,
      default: '100%',
    },
    height: {
      type: String as PropType<string>,
      default: '300px',
    },
    options: {
      type: Object as PropType<any>,
      default: {},
    },
  });
  const chartRef = ref<HTMLDivElement | null>(null);
  const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);

  watch(
    () => props.options,
    () => {
      setOptions(props.options, false);
    },
    { immediate: true, deep: true },
  );
</script>
