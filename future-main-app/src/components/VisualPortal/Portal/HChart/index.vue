<template>
  <a-card class="portal-card-box">
    <template #title v-if="activeData.title">
      <CardHeader :title="activeData.title" :card="activeData.card" />
    </template>
    <div class="portal-card-body h-full">
      <div ref="chartRef" class="h-full w-full box-inherit p-10px"></div>
    </div>
  </a-card>
</template>
<script lang="ts" setup>
  import { useEChart } from '../../Design/hooks/useEChart';
  import { onMounted, ref, Ref } from 'vue';

  const chartRef = ref<HTMLDivElement | null>(null);
  const props = defineProps(['activeData']);
  const { CardHeader, init } = useEChart(props.activeData, chartRef as Ref<HTMLDivElement>);

  onMounted(() => init());
</script>
