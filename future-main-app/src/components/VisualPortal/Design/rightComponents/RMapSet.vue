<template>
  <div>
    <a-form-item label="地图选择">
      <future-cascader
        :changeOnSelect="true"
        v-model:value="activeData.option.mapType"
        :options="mapOptions"
        showSearch
        allowClear
        placeholder="请选择"
        :fieldNames="{ label: 'fullName', value: 'enCode' }"
        @change="cascaderChange" />
    </a-form-item>
    <a-form-item label="背景色">
      <future-color-picker v-model:value="activeData.option.bgColor" size="small" />
    </a-form-item>
    <a-form-item label="区域颜色">
      <future-color-picker v-model:value="activeData.option.geoAreaColor" size="small" />
    </a-form-item>
    <a-form-item label="区域名称">
      <a-switch v-model:checked="activeData.option.geoLabelShow" />
    </a-form-item>
    <template v-if="activeData.option.geoLabelShow">
      <a-form-item label="字体大小">
        <a-input-number v-model:value="activeData.option.geoLabelFontSize" placeholder="请输入" :min="12" :max="25" />
      </a-form-item>
      <a-form-item label="字体加粗" v-if="showType == 'pc'">
        <a-switch v-model:checked="activeData.option.geoLabelFontWeight" />
      </a-form-item>
      <a-form-item label="字体颜色">
        <future-color-picker v-model:value="activeData.option.geoLabelColor" size="small" />
      </a-form-item>
    </template>
    <a-form-item label="区域线">
      <a-slider v-model:value="activeData.option.geoBorderWidth" :min="0" :max="10" :step="1" />
    </a-form-item>
    <a-form-item label="区域线颜色">
      <future-color-picker v-model:value="activeData.option.geoBorderColor" size="small" />
    </a-form-item>
    <template v-if="showType == 'pc'">
      <a-form-item label="阴影大小">
        <a-slider v-model:value="activeData.option.geoShadowOffset" :min="0" :max="5" :step="1" />
      </a-form-item>
      <a-form-item label="阴影颜色">
        <future-color-picker v-model:value="activeData.option.geoShadowColor" size="small" />
      </a-form-item>
      <a-form-item label="鼠标缩放">
        <a-switch v-model:checked="activeData.option.geoRoam" />
      </a-form-item>
      <a-form-item label="缩放比例">
        <a-slider v-model:value="activeData.option.mspScale" :min="0.5" :max="5" :step="0.1" />
      </a-form-item>
      <a-form-item label="地图长宽比">
        <a-slider v-model:value="activeData.option.geoAspectScale" :min="0.25" :max="1.5" :step="0.05" />
      </a-form-item>
    </template>
    <a-form-item label="钻取">
      <a-switch v-model:checked="activeData.option.drillDown" />
    </a-form-item>
    <template v-if="activeData.option.drillDown">
      <a-form-item label="字体大小">
        <a-input-number v-model:value="activeData.option.drillDownFontSize" placeholder="请输入" :min="12" :max="25" />
      </a-form-item>
      <a-form-item label="字体加粗">
        <a-switch v-model:checked="activeData.option.drillDownFontWeight" />
      </a-form-item>
      <a-form-item label="字体颜色">
        <future-color-picker v-model:value="activeData.option.drillDownColor" size="small" />
      </a-form-item>
    </template>
    <template v-if="showType == 'pc'">
      <a-divider>视觉设置</a-divider>
      <a-form-item label="视觉类型">
        <future-radio v-model:value="activeData.option.visualMapType" :options="visualMapTypeList" optionType="button" button-style="solid" class="right-radio" />
      </a-form-item>
      <a-form-item label="最小值">
        <a-input-number v-model:value="activeData.option.visualMapMin" :min="0" @change="onVisualMapMinChange" />
      </a-form-item>
      <a-form-item label="最大值">
        <a-input-number v-model:value="activeData.option.visualMapMax" :min="0" @change="onVisualMapMaxChange" />
      </a-form-item>
    </template>
    <template v-if="activeData.option.styleType == 1 || activeData.option.styleType == 4">
      <a-divider>散点设置</a-divider>
      <a-form-item label="散点类型" v-show="showType == 'pc'">
        <future-radio v-model:value="activeData.option.seriesType" :options="seriesTypeList" optionType="button" button-style="solid" class="right-radio" />
      </a-form-item>
      <a-form-item>
        <template #label>显示数量<BasicHelp text="置空时，则显示全部数据" /></template>
        <a-input-number v-model:value="activeData.option.showNumber" :min="0" :max="2000" v-if="showType == 'pc'" />
        <a-input-number v-model:value="activeData.option.appShowNumber" :min="0" :max="2000" v-else />
      </a-form-item>
      <a-form-item label="透明度" v-show="showType == 'pc'">
        <a-slider v-model:value="activeData.option.seriesItemStyleOpacity" :min="0" :max="1" :step="0.1" />
      </a-form-item>
    </template>
    <template v-if="activeData.option.styleType == 4 && showType == 'pc'">
      <a-divider>柱形排名设置</a-divider>
      <a-form-item label="标题名称">
        <a-input v-model:value="activeData.option.barTitleText" placeholder="请输入" />
      </a-form-item>
      <a-form-item label="字体大小">
        <a-input-number v-model:value="activeData.option.barTitleTextStyleFontSize" placeholder="请输入" :min="12" :max="25" />
      </a-form-item>
      <a-form-item label="字体加粗">
        <a-switch v-model:checked="activeData.option.barTitleTextStyleFontWeight" />
      </a-form-item>
      <a-form-item label="字体颜色">
        <future-color-picker v-model:value="activeData.option.barTitleTextStyleColor" size="small" />
      </a-form-item>
      <a-form-item label="底边距">
        <a-slider v-model:value="activeData.option.berGridBottom" :min="0" :max="600" :step="1" />
      </a-form-item>
      <a-form-item label="右边距">
        <a-slider v-model:value="activeData.option.berGridRight" :min="0" :max="100" :step="1" />
      </a-form-item>
      <a-form-item label="顶边距">
        <a-slider v-model:value="activeData.option.berGridTop" :min="0" :max="100" :step="1" />
      </a-form-item>
    </template>
    <template v-if="(activeData.option.styleType == 1 || activeData.option.styleType == 4) && showType == 'pc'">
      <a-divider>轮播设置</a-divider>
      <a-form-item label="开启轮播">
        <a-switch v-model:checked="activeData.option.autoCarousel" />
      </a-form-item>
      <a-form-item label="轮播间隔" v-if="activeData.option.autoCarousel">
        <a-input-number v-model:value="activeData.option.autoCarouselTime" placeholder="请输入" :min="100" :max="500000" addon-after="ms" />
      </a-form-item>
    </template>
    <template v-if="activeData.option.styleType == 2 && showType == 'pc'">
      <a-divider>热力设置</a-divider>
      <a-form-item label=" 点大小">
        <a-input-number v-model:value="activeData.option.seriesPointSize" :min="0" />
      </a-form-item>
      <a-form-item label="点模糊大小">
        <a-input-number v-model:value="activeData.option.seriesBlurSize" :min="0" />
      </a-form-item>
      <a-form-item label="透明度">
        <a-slider v-model:value="activeData.option.seriesMaxOpacity" :min="0" :max="5" :step="0.1" />
      </a-form-item>
    </template>
    <template v-if="activeData.option.styleType == 3 && showType == 'pc'">
      <a-divider>柱形设置</a-divider>
      <a-form-item label="宽度">
        <a-input-number v-model:value="activeData.option.seriesBarWidth" :min="0" :max="100" placeholder="请输入" />
      </a-form-item>
      <a-form-item label="弧度">
        <a-input-number v-model:value="activeData.option.seriesItemStyleBarBorderRadius" :min="0" :max="100" placeholder="请输入" />
      </a-form-item>
    </template>
  </div>
</template>
<script lang="ts" setup>
  import { useMessage } from '@/hooks/web/useMessage';

  const props = defineProps(['activeData', 'showType', 'mapOptions']);
  const { createMessage } = useMessage();
  const visualMapTypeList = [
    { fullName: '连续', id: 'continuous' },
    { fullName: '分段', id: 'piecewise' },
  ];
  const seriesTypeList = [
    { fullName: '散点', id: 'scatter' },
    { fullName: '涟漪散点', id: 'effectScatter' },
  ];

  function cascaderChange() {
    props.activeData.option.updateMapType = +new Date();
  }
  function onVisualMapMinChange(val) {
    if (val > props.activeData.option.visualMapMax) createMessage.warning('最小值不能超过最大值，请重新输入');
  }
  function onVisualMapMaxChange(val) {
    if (val < props.activeData.option.visualMapMin) createMessage.warning('最大值不能小于最小值，请重新输入');
  }
</script>
