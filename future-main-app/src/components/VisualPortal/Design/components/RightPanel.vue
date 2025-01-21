<template>
  <div class="right-box">
    <a-tabs v-model:activeKey="activeKey" :tabBarGutter="10" class="average-tabs">
      <a-tab-pane :key="1" tab="控件属性"></a-tab-pane>
      <a-tab-pane :key="2" tab="门户属性"></a-tab-pane>
    </a-tabs>
    <div class="filed-box">
      <ScrollContainer class="p-15px !pt-0px">
        <a-form :colon="false" layout="vertical" v-if="activeKey === 1 && activeData && activeData.futureKey">
          <a-collapse v-model:activeKey="activeName" accordion ghost expandIconPosition="end">
            <Card
              :key="1"
              :activeData="activeData"
              :showType="showType"
              :menuList="menuList"
              :appMenuList="appMenuList"
              v-if="activeData.futureKey != 'tab' && activeData.futureKey != 'collapse'" />
            <Common
              :key="2"
              :activeData="activeData"
              :showType="showType"
              :menuList="menuList"
              :appMenuList="appMenuList"
              v-if="!noNeedTypeSetList.includes(activeData.futureKey)" />
            <template v-if="chartList.includes(activeData.futureKey) || activeData.futureKey == 'mapChart'">
              <MainTitle :key="3" :activeData="activeData" :showType="showType" />
              <SubTitle :key="4" :activeData="activeData" :showType="showType" />
              <BarStyle :key="5" :activeData="activeData" :showType="showType" v-if="activeData.futureKey == 'barChart'" />
            </template>
            <XAxis :key="6" :activeData="activeData" :showType="showType" v-if="activeData.futureKey == 'barChart' || activeData.futureKey == 'lineChart'" />
            <YAxis :key="7" :activeData="activeData" :showType="showType" v-if="activeData.futureKey == 'barChart' || activeData.futureKey == 'lineChart'" />
            <Label :key="8" :activeData="activeData" :showType="showType" v-if="chartList.includes(activeData.futureKey)" />
            <template v-if="chartList.includes(activeData.futureKey) || activeData.futureKey == 'mapChart'">
              <Tooltip :key="9" :activeData="activeData" :showType="showType" />
              <Margin :key="10" :activeData="activeData" :showType="showType" v-if="showType == 'pc'" />
            </template>
            <template v-if="chartList.includes(activeData.futureKey)">
              <Legend :key="11" :activeData="activeData" :showType="showType" />
              <Color :key="12" :activeData="activeData" :showType="showType" />
            </template>
            <Data :key="13" :activeData="activeData" :showType="showType" v-if="needDataSetList.includes(activeData.futureKey)" />
            <TableSet :key="14" :activeData="activeData" :showType="showType" v-if="activeData.futureKey == 'tableList'" />
            <Jump :key="19" :activeData="activeData" :showType="showType" v-if="needJumpSetList.includes(activeData.futureKey)" />
            <TabSet :key="15" :activeData="activeData" :showType="showType" v-if="activeData.futureKey == 'tab'" />
            <NoticeSet :key="17" :activeData="activeData" :showType="showType" v-if="activeData.futureKey == 'notice'" />
            <CustomEcharts :key="18" :activeData="activeData" :showType="showType" v-if="activeData.futureKey == 'customEcharts'" />
          </a-collapse>
          <a-form-item label="多端显示" class="!mt-10px">
            <future-checkbox v-model:value="activeData.visibility" :options="getVisibilityOptions" />
          </a-form-item>
        </a-form>
        <a-form :colon="false" labelAlign="left" layout="vertical" v-if="activeKey === 2">
          <Refresh class="pt-15px" :refresh="refresh" />
        </a-form>
      </ScrollContainer>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { reactive, toRefs, onMounted, computed } from 'vue';
  import { ScrollContainer } from '@/components/Container';
  import { getSelectorAll } from '@/api/system/menu';
  import { chartList, needDataSetList, needJumpSetList, systemList, layoutList } from '../helper/dataMap';
  import Refresh from '../rightComponents/RRefresh.vue';
  import Card from '../rightComponents/RCard.vue';
  import Common from '../rightComponents/RCommon.vue';
  import Data from '../rightComponents/RData.vue';
  import Jump from '../rightComponents/RJump.vue';
  import MainTitle from '../rightComponents/RMainTitle.vue';
  import SubTitle from '../rightComponents/RSubTitle.vue';
  import BarStyle from '../rightComponents/RBarStyle.vue';
  import XAxis from '../rightComponents/RXAxis.vue';
  import YAxis from '../rightComponents/RYAxis.vue';
  import Label from '../rightComponents/RLabel.vue';
  import Tooltip from '../rightComponents/RTooltip.vue';
  import Margin from '../rightComponents/RMargin.vue';
  import Legend from '../rightComponents/RLegend.vue';
  import Color from '../rightComponents/RColor.vue';
  import TableSet from '../rightComponents/RTableSet.vue';
  import TabSet from '../rightComponents/RTabSet.vue';
  import NoticeSet from '../rightComponents/RNoticeSet.vue';
  import CustomEcharts from '../rightComponents/RCustomEcharts.vue';

  interface State {
    activeKey: number;
    activeName: number;
    menuList: any[];
    appMenuList: any[];
  }

  const state = reactive<State>({
    activeKey: 1,
    activeName: 0,
    menuList: [],
    appMenuList: [],
  });
  const { activeKey, activeName, menuList, appMenuList } = toRefs(state);
  const props = defineProps(['activeData', 'showType', 'refresh']);
  const noNeedTypeSetList = [...layoutList, ...systemList, 'tableList', 'customEcharts'];

  const getVisibilityOptions = computed(() => {
    return [
      { id: 'pc', fullName: 'Web' },
      { id: 'app', fullName: 'App', disabled: props.activeData?.futureKey === 'iframe' },
    ];
  });

  function init() {
    getSelectorAll({ category: 'Web' }).then(res => {
      state.menuList = (res.data.list || []).filter(o => o.children && o.children.length);
    });
    getSelectorAll({ category: 'App' }).then(res => {
      state.appMenuList = (res.data.list || []).filter(o => o.children && o.children.length);
    });
  }

  onMounted(() => init());
</script>
