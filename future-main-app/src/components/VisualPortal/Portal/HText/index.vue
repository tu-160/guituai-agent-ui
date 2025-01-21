<template>
  <a-card class="portal-card-box">
    <template #title v-if="activeData.title">
      <CardHeader :title="activeData.title" :card="activeData.card" />
    </template>
    <div class="portal-card-body" :style="{ background: activeData.option.textBgColor }">
      <web-link
        :linkType="activeData.option.linkType"
        :urlAddress="urlAddress"
        :linkTarget="activeData.option.linkTarget"
        :type="activeData.option.type"
        :propertyJson="activeData.option.propertyJson"
        :key="activeData.renderKey">
        <div
          class="text"
          v-if="activeData.option.styleType == 1"
          :style="{
            color: activeData.option.textFontColor,
            'font-size': activeData.option.textFontSize + 'px',
            'text-align': activeData.option.textLeft,
            'font-weight': activeData.option.textFontWeight ? 'bolder' : 'normal',
            'font-style': activeData.option.textFontStyle ? 'italic' : '',
            'text-decoration': activeData.option.textUnderLine,
            cursor: activeData.option.linkType ? 'pointer' : '',
          }">
          <marquee
            :style="{ 'text-decoration': activeData.option.textUnderLine }"
            :key="activeData.renderKey"
            :direction="activeData.option.textAutoplayMode"
            :scrollamount="activeData.option.textAutoplaySpeed / 10"
            v-if="activeData.option.textAutoplay && getValue">
            {{ getValue }}
          </marquee>
          <span v-else>{{ getValue }}</span>
        </div>
        <div class="text" v-else v-html="getValue"></div>
      </web-link>
    </div>
  </a-card>
</template>
<script lang="ts" setup>
  import { onMounted, computed, reactive, toRefs } from 'vue';
  import CardHeader from '../CardHeader/index.vue';
  import webLink from '../Link/index.vue';
  import { getDataInterfaceRes } from '@/api/systemData/dataInterface';
  import { getParamList } from '@/utils/future';

  interface State {
    urlAddress: string;
  }

  const state = reactive<State>({
    urlAddress: '',
  });
  const { urlAddress } = toRefs(state);
  const props = defineProps(['activeData']);
  const getValue = computed(() => props.activeData.option.defaultValue);

  function initData() {
    if (props.activeData.dataType === 'dynamic') {
      props.activeData.option.defaultValue = '';
      const propsApi = props.activeData.propsApi;
      if (!propsApi) return;
      const query = { paramList: getParamList(props.activeData.templateJson) };
      getDataInterfaceRes(propsApi, query).then(res => {
        props.activeData.option.defaultValue = res.data;
        resolvedURL();
      });
    } else {
      resolvedURL();
    }
  }
  function resolvedURL() {
    let urlAddress = JSON.parse(JSON.stringify(props.activeData.option.urlAddress));
    state.urlAddress = urlAddress.replace('${field}', props.activeData.option.defaultValue);
  }

  onMounted(() => {
    initData();
  });
</script>
<style lang="less" scoped>
  .text {
    margin: 15px;
    line-height: 1.5;
  }
</style>
