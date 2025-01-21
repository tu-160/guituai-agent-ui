<template>
  <a-card class="portal-card-box">
    <template #title v-if="activeData.title">
      <CardHeader :title="activeData.title" :card="activeData.card" />
    </template>
    <div class="portal-card-body">
      <web-link
        class="web-link"
        v-if="getValue"
        :linkType="activeData.option.linkType"
        :urlAddress="activeData.option.urlAddress"
        :linkTarget="activeData.option.linkTarget"
        :type="activeData.option.type"
        :propertyJson="activeData.option.propertyJson">
        <img class="image" :key="key" :style="{ 'object-fit': activeData.option.imageFillStyle }" :src="getValue" />
        <div
          class="text-ellipsis bottom-text"
          v-if="activeData.option.textDefaultValue"
          :style="{
            color: activeData.option.textFontColor,
            'font-size': activeData.option.textFontSize + 'px',
            'text-align': activeData.option.textLeft,
            background: activeData.option.textBgColor,
            'font-weight': activeData.option.textFontWeight ? 'bolder' : 'normal',
            'font-style': activeData.option.textFontStyle ? 'italic' : '',
          }"
          >{{ activeData.option.textDefaultValue }}
        </div>
      </web-link>
      <div class="portal-common-noData" v-else>
        <img src="../../../../assets/images/portal-nodata.png" alt="" class="noData-img" />
        <p class="noData-txt">暂无图片</p>
      </div>
    </div>
  </a-card>
</template>
<script lang="ts" setup>
  import { ref, onMounted, computed } from 'vue';
  import CardHeader from '../CardHeader/index.vue';
  import webLink from '../Link/index.vue';
  import { getDataInterfaceRes } from '@/api/systemData/dataInterface';
  import { useGlobSetting } from '@/hooks/setting';
  import { getParamList } from '@/utils/future';

  const props = defineProps(['activeData']);
  const key = ref<any>();
  const globSetting = useGlobSetting();

  const getValue = computed(() => {
    key.value = +new Date();
    const val = props.activeData.option.defaultValue;
    if (props.activeData.option.styleType == 1 && val) return globSetting.apiUrl + val;
    return val;
  });

  function initData() {
    if (props.activeData.dataType === 'dynamic') {
      props.activeData.option.defaultValue = '';
      const propsApi = props.activeData.propsApi;
      if (!propsApi) return;
      const query = { paramList: getParamList(props.activeData.templateJson) };
      getDataInterfaceRes(propsApi, query).then(res => {
        props.activeData.option.defaultValue = res.data;
      });
    }
  }

  onMounted(() => initData());
</script>
<style lang="less" scoped>
  .portal-card-body {
    height: 100%;
    .web-link,
    .image {
      width: 100%;
      height: 100%;
    }
    .bottom-text {
      position: absolute;
      width: 100%;
      height: 30px;
      line-height: 30px;
      bottom: 0;
      font-size: 14px;
      background: #000;
      color: #fff;
      padding: 0 10px;
    }
  }
</style>
