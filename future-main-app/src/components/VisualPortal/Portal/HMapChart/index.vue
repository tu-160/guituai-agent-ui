<template>
  <a-card class="portal-card-box">
    <template #title v-if="activeData.title">
      <CardHeader :title="activeData.title" :card="activeData.card" />
    </template>
    <div class="portal-card-body h-full">
      <breadcrumb class="breadcrumb" v-if="state.hashMap.size > 1">
        <template #separator>
          <i class="icon-ym icon-ym-right text-14px"></i>
        </template>
        <breadcrumb-item v-for="[key, value] in state.hashMap" :key="key" @click="readyMap(key, value)">
          <span
            :style="{
              color: activeData.option.drillDownColor,
              'font-size': activeData.option.drillDownFontSize + 'px',
              'font-weight': activeData.option.drillDownFontWeight ? 'bolder' : 'normal',
            }">
            {{ value.name }}
          </span>
        </breadcrumb-item>
      </breadcrumb>
      <div ref="chartRef" class="h-full w-full box-inherit p-10px" :style="{ background: activeData.option.bgColor }"></div>
      <div
        class="bar-title-text"
        v-if="activeData.option.styleType == 4 && state.showBarTitle"
        :style="{
          color: activeData.option.barTitleTextStyleColor,
          'font-size': activeData.option.barTitleTextStyleFontSize + 'px',
          'font-weight': activeData.option.barTitleTextStyleFontWeight ? 'bolder' : 'normal',
        }">
        {{ activeData.option.barTitleText }}
      </div>
    </div>
  </a-card>
</template>
<script lang="ts" setup>
  import { onMounted, ref, reactive, watch, inject, nextTick } from 'vue';
  import { getAtlas, getMapData } from '@/api/onlineDev/portal';
  import CardHeader from '../CardHeader/index.vue';
  import * as echarts from 'echarts';
  import { useDebounceFn } from '@vueuse/core';
  import { getDataInterfaceRes } from '@/api/systemData/dataInterface';
  import { mapChartData } from '../../Design/helper/dataMap';
  import { Breadcrumb, BreadcrumbItem } from 'ant-design-vue';
  import { getParamList } from '@/utils/future';
  import { useGo } from '@/hooks/web/usePage';
  import { encryptByBase64 } from '@/utils/cipher';

  interface State {
    chart: any;
    currMapCode: any;
    geoJson: any;
    code: string;
    currOption: any;
    allAtlasList: any[];
    zoom: number;
    timeTicket: any;
    isEmpty: boolean;
    chartData: any[];
    mapData: any[];
    count: number;
    hashMap: any;
    showBarTitle: boolean;
    chartMapData: any[];
  }

  const state = reactive<State>({
    chart: null,
    currMapCode: null,
    geoJson: null,
    code: '',
    currOption: {},
    allAtlasList: [],
    zoom: 1,
    timeTicket: null,
    isEmpty: false,
    chartData: [],
    mapData: [],
    count: 0,
    hashMap: new Map(),
    showBarTitle: false,
    chartMapData: [],
  });
  const updateMapChart = useDebounceFn(resetChart, 200);
  const updateBarChart = useDebounceFn(setBarMapChart, 200);
  const updateResetChart = useDebounceFn(resetChart, 500);
  const chartRef = ref<any>();
  const props = defineProps(['activeData']);
  const emitter: any = inject('emitter');
  const go = useGo();

  watch(
    () => props.activeData.option,
    () => {
      nextTick(() => {
        clearHashMap();
        updateMapChart();
      });
    },
    { deep: true },
  );
  watch(
    () => props.activeData.option.defaultValue,
    val => {
      setTimeout(() => {
        state.chartData = val;
        updateResetChart();
      }, 0);
    },
  );
  watch(
    () => props.activeData.option.updateMapType,
    () => {
      const option = props.activeData.option;
      const code = Array.isArray(option.mapType) ? option.mapType[option.mapType.length - 1] : option.mapType;
      if (state.currMapCode != code) initMap();
    },
  );
  watch(
    () => props.activeData.dataType,
    val => {
      const option = props.activeData.option;
      option.defaultValue = [];
      state.chartData = [];
      if (val == 'static') option.defaultValue = mapChartData;
    },
  );
  watch(
    () => props.activeData.propsApi,
    val => {
      if (props.activeData.dataType === 'static' || !val) return;
      const query = { paramList: getParamList(props.activeData.templateJson) };
      getDataInterfaceRes(val, query).then(res => {
        state.chartMapData = JSON.parse(JSON.stringify(res.data));
        state.chartData = mappingConfig(res.data);
        updateResetChart();
      });
    },
  );
  watch(
    () => props.activeData.mappingConfig,
    () => {
      state.chartData = mappingConfig(state.chartMapData);
      updateResetChart();
    },
    { deep: true },
  );

  function initMap() {
    const option = props.activeData.option;
    const code = Array.isArray(option.mapType) ? option.mapType[option.mapType.length - 1] : option.mapType;
    if (!code) return;
    state.chart?.dispose();
    state.chart = null;
    state.chart = echarts.init(chartRef.value);
    state.chart.showLoading();
    state.currMapCode = code;
    getMapData({ code }).then(res => {
      state.chart.hideLoading();
      state.geoJson = res.data;
      state.code = code;
      initCurrOption();
      echarts.registerMap(code, state.geoJson);
      state.chart.setOption(state.currOption, true);
      setScatterMapChart();
      setBarMapChart();
      if (option.autoCarousel) handleDispatchAction();
      clearHashMap();
      state.chart.on('click', param => {
        if (!option.drillDown) return handleClick(param);
        if (!state.allAtlasList.length) return;
        const item = state.allAtlasList.find(i => i.fullName === param.name);
        if (item) {
          if (state.currMapCode == item.enCode) return handleClick(param);
          state.currMapCode = item.enCode;
          getMapData({ code: item.enCode }).then(res => {
            state.code = item.enCode;
            initCurrOption();
            echarts.registerMap(item.enCode, res.data);
            state.chart.setOption(state.currOption, true);
            setScatterMapChart();
            setBarMapChart();
            state.zoom += 1;
            setHashMap(param.name, item.enCode, res.data);
          });
        }
      });
      state.chart.on('mouseover', params => {
        if (!option.autoCarousel) return;
        clearInterval(state.timeTicket);
        state.chart.dispatchAction({
          type: 'showTip',
          seriesIndex: 0,
          dataIndex: params.dataIndex,
        });
      });
      state.chart.on('mouseout', () => {
        if (option.autoCarousel) handleDispatchAction();
      });
      state.chart.on('georoam', () => {
        updateBarChart();
      });
    });
  }
  function handleClick(item) {
    if (!props.activeData.option?.urlAddress) return;
    let urlAddress = JSON.parse(JSON.stringify(props.activeData.option.urlAddress));
    const regex = /\${[^{}]+}/g;
    urlAddress = urlAddress.replace(regex, match => {
      const key = match.slice(2, -1);
      let value = '';
      if (key === 'name') value = item.name;
      if (!item.value) return value;
      if (key === 'value') value = item.value[2];
      if (key === 'long') value = item.value[0];
      if (key === 'lat') value = item.value[1];
      return value || match;
    });
    if (props.activeData.option.target == '_self') {
      go(`/externalLink?href=${encodeURIComponent(encryptByBase64(urlAddress))}`);
    } else {
      window.open(urlAddress, props.activeData.option.target);
    }
  }
  function resetChart() {
    if (!state.geoJson) return;
    state.isEmpty = JSON.stringify(state.currOption) === '{}';
    if (!state.isEmpty) {
      initCurrOption();
      echarts.registerMap(state.code, state.geoJson);
      state.chart.setOption(state.currOption, true);
      setScatterMapChart();
      setBarMapChart();
      if (props.activeData.option.autoCarousel) handleDispatchAction();
    }
  }
  function mappingConfig(chartData: any[]) {
    let optionData = JSON.parse(JSON.stringify(chartData)) || [];
    if (!props.activeData.mappingConfig || props.activeData.dataType === 'static') return optionData;
    let mappingName = props.activeData.mappingConfig[0].value ? props.activeData.mappingConfig[0].value : 'name';
    let mappingValue = props.activeData.mappingConfig[1].value ? props.activeData.mappingConfig[1].value : 'value';
    let mappingLong = props.activeData.mappingConfig[2].value ? props.activeData.mappingConfig[2].value : 'long';
    let mappingLat = props.activeData.mappingConfig[3].value ? props.activeData.mappingConfig[3].value : 'lat';
    return optionData.map(o => ({
      name: o[mappingName],
      value: o[mappingValue],
      long: o[mappingLong],
      lat: o[mappingLat],
    }));
  }
  function initCurrOption() {
    const option = props.activeData.option;
    let title = {
      show: option.titleText || option.titleSubtext,
      text: option.titleText,
      textStyle: {
        color: option.titleTextStyleColor,
        fontSize: option.titleTextStyleFontSize,
        fontWeight: option.titleTextStyleFontWeight ? 'bolder' : '',
      },
      subtext: option.titleSubtext,
      subtextStyle: {
        color: option.titleSubtextStyleColor,
        fontSize: option.titleSubtextStyleFontSize,
        fontWeight: option.titleSubtextStyleFontWeight ? 'bolder' : '',
      },
      left: option.titleLeft,
      backgroundColor: option.titleText || option.titleSubtext ? option.titleBgColor || '#fff' : '#fff',
    };
    let tooltip = {
      show: option.tooltipShow,
      backgroundColor: option.tooltipBgColor,
      textStyle: {
        color: option.tooltipTextStyleColor,
        fontSize: option.tooltipTextStyleFontSize,
        fontWeight: option.tooltipTextStyleFontWeight ? 'bolder' : '',
      },
    };
    let geo = {
      id: 'china',
      map: state.code,
      show: true,
      roam: option.geoRoam,
      aspectScale: option.geoAspectScale || 0.75,
      layoutCenter: [option.seriesCenterLeft + '%', option.seriesCenterTop + '%'],
      layoutSize: '85%',
      itemStyle: {
        areaColor: option.geoAreaColor,
        borderWidth: option.geoBorderWidth / 2,
        borderColor: option.geoBorderColor,
        shadowOffsetX: option.geoShadowOffset,
        shadowOffsetY: option.geoShadowOffset,
        shadowColor: option.geoShadowColor,
      },
      zoom: option.mspScale,
      label: {
        show: option.geoLabelShow,
        color: option.geoLabelColor,
        fontWeight: option.geoLabelFontWeight ? 'bolder' : 'normal',
        fontSize: option.geoLabelFontSize,
      },
    };
    let visualMap = {
      min: option.visualMapMin,
      max: option.visualMapMax,
      type: option.visualMapType,
      showLabel: true,
      realtime: false,
      calculable: true,
      inRange: {
        color: ['#3BD9FF', '#0246FF'],
      },
    };
    state.currOption = {
      title: title,
      tooltip: tooltip,
      geo: geo,
      visualMap: visualMap,
    };
  }
  function setScatterMapChart() {
    const option = props.activeData.option;
    if (option.styleType == 3) return;
    state.mapData = [];
    if (state.chartData && state.chartData.length) {
      state.chartData.map(ele => {
        const coord = state.chart.convertToPixel('geo', [ele.long, ele.lat]) || [];
        const flag = state.chart.containPixel('geo', coord);
        if (flag) state.mapData.push({ name: ele.name, value: [ele.long, ele.lat, ele.value] });
      });
    }
    if (option.showNumber == null) {
      state.mapData = state.mapData;
    } else {
      state.mapData = state.mapData.slice(0, option.showNumber);
    }
    state.currOption.series = [
      {
        type: option.styleType == 1 || option.styleType == 4 ? option.seriesType : 'heatmap',
        rippleEffect: {
          brushType: 'stroke',
        },
        coordinateSystem: 'geo',
        itemStyle: {
          color: '#1890FF',
          opacity: option.seriesItemStyleOpacity,
        },
        pointSize: option.seriesPointSize,
        blurSize: option.seriesBlurSize,
        maxOpacity: option.seriesMaxOpacity,
        tooltip: {
          show: option.tooltipShow,
          formatter: function (params) {
            if (params.value.length < 3) return params.name;
            let str = params.name + '&nbsp&nbsp' + params.value[2];
            return str;
          },
        },
        symbolSize: val => {
          if (option.visualMapMax) {
            let num = Number(option.visualMapMax);
            let num1 = Number(val[2]);
            let res = (num1 / num) * 15;
            return res;
          }
          return 10;
        },
        clip: true,
        data: state.mapData,
      },
    ];
    setBarRankMapChart();
    state.chart.setOption(state.currOption);
    if (state.timeTicket) clearInterval(state.timeTicket);
  }
  function setBarMapChart() {
    const option = props.activeData.option;
    if (option.styleType != 3) return;
    const data = state.chartData;
    if (data && data.length) {
      data.map((ele, idx) => {
        if (!ele.long || !ele.lat) return;
        var coord = state.chart.convertToPixel('geo', [ele.long, ele.lat]) || [];
        const flag = state.chart.containPixel('geo', coord);
        if (!flag) return;
        var curOption: any = {
          xAxis: [],
          yAxis: [],
          grid: [],
          series: [],
          tooltip: { trigger: 'item', axisPointer: { type: 'none' } },
        };
        curOption.xAxis.push({
          id: idx,
          gridId: idx,
          show: false,
          splitLine: { show: false },
          axisTick: { show: false },
          axisLabel: { show: false },
          data: [ele.name],
          z: 100,
        });
        curOption.yAxis.push({
          id: idx,
          gridId: idx,
          show: false,
          splitLine: { show: false },
          axisTick: { show: false },
          axisLabel: { show: false },
          z: 100,
        });
        // 配置柱状图绘制大小、位置
        curOption.grid.push({
          id: idx,
          width: option.seriesBarWidth,
          height: 70,
          left: coord && coord[0],
          top: coord && coord[1] - 70,
          z: 100,
        });
        // 生成柱状图数据
        curOption.series.push({
          id: idx,
          type: 'bar',
          xAxisId: idx,
          yAxisId: idx,
          barGap: 0,
          barCategoryGap: 0,
          data: [ele.value],
          z: 100,
          itemStyle: {
            normal: {
              borderRadius: option.seriesItemStyleBarBorderRadius,
              label: {
                show: true,
                position: 'insideBottom',
                textStyle: {
                  color: '#fff',
                  fontSize: 10,
                },
              },
            },
          },
        });
        state.chart.setOption(curOption);
      });
    }
  }
  function setBarRankMapChart() {
    const option = props.activeData.option;
    if (option.styleType != 4) return;
    let myData: any = [];
    if (!props.activeData.mappingConfig || props.activeData.dataType === 'static') {
      myData = [['value', 'name']];
    } else {
      let mappingName = props.activeData.mappingConfig[0].value ? props.activeData.mappingConfig[0].value : 'name';
      let mappingValue = props.activeData.mappingConfig[1].value ? props.activeData.mappingConfig[1].value : 'value';
      myData = [[mappingValue, mappingName]];
    }
    let mapData = state.chartData;
    if (option.showNumber) {
      mapData = mapData.slice(0, option.showNumber);
    }
    var barData = mapData.sort(function (a, b) {
      return b.value - a.value;
    });
    for (var i = 0; i < barData.length; i++) {
      const ele = barData[i];
      myData.push([ele.value, ele.name]);
    }
    state.currOption.grid = {
      right: option.berGridRight,
      top: option.berGridTop,
      bottom: option.berGridBottom,
      width: '200',
    };
    state.currOption.xAxis = {
      name: 'value',
      show: false,
    };
    state.currOption.yAxis = {
      type: 'category',
      inverse: true,
      nameGap: 16,
      axisLine: {
        show: false,
        lineStyle: {
          color: '#303133',
        },
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        interval: 0,
        margin: 10,
        textStyle: {
          fontSize: 14,
        },
      },
    };
    let series = {
      name: '柱状图',
      type: 'bar',
      roam: false,
      zlevel: 2,
      barGap: 0,
      encode: {
        x: 'value',
        y: 'name',
      },
      label: {
        normal: {
          show: true,
          position: 'right',
          textBorderWidth: 0,
        },
      },
      itemStyle: {
        normal: {
          borderRadius: 2,
        },
      },
    };
    state.currOption.dataset = {
      source: myData,
    };
    state.currOption.visualMap.dimension = 0;
    state.currOption.series.push(series);
    state.showBarTitle = true;
  }
  function setHashMap(name, value, geoJson) {
    state.hashMap.set(1, getDefaultHashMap());
    state.hashMap.set(state.zoom, {
      name: name,
      value: value,
      geoJson: geoJson,
    });
    state.hashMap.forEach((_value, key) => {
      if (key > state.zoom) state.hashMap.delete(key);
    });
    state.hashMap.delete(state.zoom + 1);
    state.hashMap = new Map(state.hashMap);
  }
  function clearHashMap() {
    state.hashMap.clear();
    state.hashMap.set(1, { name: '中国', value: '10000', geoJson: state.geoJson });
    state.hashMap = new Map(state.hashMap);
  }
  function getDefaultHashMap() {
    const option = props.activeData.option;
    const code = Array.isArray(option.mapType) ? option.mapType[option.mapType.length - 1] : option.mapType;
    const item = state.allAtlasList.find(i => i.enCode === code);
    if (item) return { name: item.fullName, value: item.enCode, geoJson: state.geoJson };
    return { name: '中国', value: '10000', geoJson: state.geoJson };
  }
  function readyMap(key, { name, value, geoJson }) {
    if (value == state.currMapCode) return;
    state.code = value;
    state.currMapCode = '';
    if (key == 1) {
      state.geoJson ? resetChart() : initMap();
      clearHashMap();
    } else {
      initCurrOption();
      echarts.registerMap(state.code, geoJson);
      state.chart.setOption(state.currOption, true);
      state.zoom = key;
      setHashMap(name, value, geoJson);
    }
  }
  function handleDispatchAction() {
    clearInterval(state.timeTicket);
    state.timeTicket = setInterval(() => {
      let total = state.mapData.length;
      let curr = state.count % total;
      state.chart.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: curr,
      });
      state.count += 1;
    }, props.activeData.option.autoCarouselTime || 3000);
  }
  function getAtlasList() {
    state.allAtlasList = [];
    getAtlas().then(res => {
      const loop = data => {
        if (Array.isArray(data)) {
          for (let i = 0; i < data.length; i++) {
            const ele = data[i];
            state.allAtlasList.push(ele);
            if (ele.children && ele.children.length) loop(ele.children);
          }
        }
      };
      loop(res.data);
    });
  }
  function init() {
    const option = props.activeData.option;
    if (props.activeData.dataType === 'dynamic') {
      if (!props.activeData.propsApi) return initMap();
      const query = { paramList: getParamList(props.activeData.templateJson) };
      getDataInterfaceRes(props.activeData.propsApi, query).then(res => {
        state.chartMapData = JSON.parse(JSON.stringify(res.data));
        state.chartData = mappingConfig(res.data);
        initMap();
      });
    } else {
      setTimeout(() => {
        state.chartData = option.defaultValue;
        initMap();
      }, 0);
    }
    emitter.on('eChart' + props.activeData.i, () => {
      nextTick(() => {
        state.chart?.resize();
        nextTick(() => {
          setBarMapChart();
        });
      });
    });
    getAtlasList();
  }

  onMounted(() => init());
</script>
<style lang="less" scoped>
  .breadcrumb {
    position: absolute;
    z-index: 9999;
    padding: 20px;
    cursor: pointer;
  }
  .bar-title-text {
    position: absolute;
    top: 74px;
    right: 100px;
    color: #000;
    z-index: 500;
  }
</style>
