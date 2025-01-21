<template>
  <a-card class="portal-card-box">
    <template #title v-if="activeData.title">
      <CardHeader :title="activeData.title" :card="activeData.card" />
    </template>
    <div class="portal-card-body h-full">
      <template v-if="chartData">
        <div ref="chartRef" class="h-full w-full box-inherit p-10px"></div>
      </template>
      <div class="portal-common-noData" v-else>
        <future-empty />
      </div>
    </div>
  </a-card>
</template>
<script lang="ts" setup>
  import { onMounted, ref, Ref, toRefs, reactive, nextTick, inject } from 'vue';
  import { getDataInterfaceRes } from '@/api/systemData/dataInterface';
  import { useECharts } from '@/hooks/web/useECharts';
  import CardHeader from '@/components/VisualPortal/Portal/CardHeader/index.vue';
  import { getParamList } from '@/utils/future';
  interface State {
    chart: any;
    currOption: any;
    chartData: any;
  }

  const state = reactive<State>({
    chart: null,
    currOption: {},
    chartData: {},
  });
  const { chartData } = toRefs(state);
  const emitter: any = inject('emitter');
  const chartRef = ref<HTMLDivElement | null>(null);
  const props = defineProps(['activeData']);
  const { setOptions, resize } = useECharts(chartRef as Ref<HTMLDivElement>);

  function init() {
    if (props.activeData.dataType === 'dynamic') {
      if (!props.activeData.propsApi) return;
      const query = { paramList: getParamList(props.activeData.templateJson) };
      getDataInterfaceRes(props.activeData.propsApi, query).then(res => {
        state.chartData = res.data || {};
        setOptions(state.chartData);
      });
    } else {
      state.chartData = props.activeData.option;
      setOptions(state.chartData);
    }
    emitter.on('eChart' + props.activeData.i, () => {
      nextTick(() => resize());
    });
  }

  onMounted(() => init());
</script>
