<template>
  <a-card class="portal-card-box">
    <template #title v-if="activeData.title">
      <CardHeader :title="activeData.title" :card="activeData.card" />
    </template>
    <div class="portal-card-body">
      <Carousel
        :autoplaySpeed="activeData.option.carouselInterval"
        :autoplay="activeData.option.carouselAutoplay"
        :dotPosition="getDotPosition"
        :dots="activeData.option.carouselIndicatorPosition !== 'none'"
        :arrows="activeData.option.carouselArrow !== 'never'"
        :class="{ 'carousel-arrows-hover': activeData.option.carouselArrow == 'hover' }">
        <template #prevArrow>
          <div class="custom-slick-arrow" style="left: 10px; z-index: 1">
            <left-circle-outlined />
          </div>
        </template>
        <template #nextArrow>
          <div class="custom-slick-arrow" style="right: 10px">
            <right-circle-outlined />
          </div>
        </template>
        <web-link
          class="web-link"
          :linkType="item.linkType"
          :urlAddress="item.urlAddress"
          :linkTarget="item.linkTarget"
          :type="item.type"
          :propertyJson="item.propertyJson"
          v-for="(item, index) in list"
          :key="index">
          <img :key="key" :style="{ 'object-fit': activeData.option.imageFillStyle }" :src="item.imageUrl" />
          <div
            class="text-ellipsis bottom-text"
            v-if="item.textDefaultValue"
            :style="{
              color: activeData.option.textFontColor,
              'font-size': activeData.option.textFontSize + 'px',
              'text-align': activeData.option.textLeft,
              'font-weight': activeData.option.textFontWeight ? 'bolder' : 'normal',
              background: activeData.option.textBgColor,
              padding: activeData.option.carouselIndicatorPosition == 'bottomRight' && activeData.option.carouselDirection == 'horizontal' ? '0 10px 15px' : '',
            }">
            {{ item.textDefaultValue }}
          </div>
        </web-link>
      </Carousel>
    </div>
  </a-card>
</template>
<script lang="ts" setup>
  import { ref, onMounted, computed } from 'vue';
  import CardHeader from '../CardHeader/index.vue';
  import webLink from '../Link/index.vue';
  import { getDataInterfaceRes } from '@/api/systemData/dataInterface';
  import { useGlobSetting } from '@/hooks/setting';
  import { Carousel } from 'ant-design-vue';
  import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons-vue';

  const props = defineProps(['activeData']);
  const key = ref<any>();
  const list = ref<any[]>([]);
  const globSetting = useGlobSetting();

  const getDotPosition = computed(() => {
    const position = props.activeData.option.carouselIndicatorPosition;
    const direction = props.activeData.option.carouselDirection;
    if (direction == 'horizontal') return position == 'topLeft' ? 'top' : 'bottom';
    return position == 'topLeft' ? 'left' : 'right';
  });

  async function initData() {
    let val = JSON.parse(JSON.stringify(props.activeData.option.defaultValue));
    for (let i = 0; i < val.length; i++) {
      const ele = val[i];
      if (ele.dataType == 1) ele.imageUrl = globSetting.apiUrl + ele.imageUrl;
      if (ele.dataType == 3) {
        const res = await getDataInterfaceRes(ele.propsApi);
        ele.imageUrl = res?.data ? res.data : [];
      }
    }
    list.value = val;
  }

  onMounted(() => initData());
</script>
<style lang="less" scoped>
  .ant-carousel {
    height: 100%;
    :deep(.slick-slider) {
      height: 100% !important;
      .slick-list,
      .slick-track {
        height: 100% !important;
      }
      .slick-slide {
        height: 100% !important;
        > div {
          height: 100% !important;
        }
      }
      ul {
        margin-bottom: unset;
      }
    }
    :deep(.slick-arrow.custom-slick-arrow) {
      width: 25px;
      height: 25px;
      font-size: 25px;
      color: #fff;
      background-color: rgba(31, 45, 61, 0.11);
      opacity: 0.3;
      z-index: 1;
    }
    :deep(.custom-slick-arrow:before) {
      display: none;
    }
    :deep(.custom-slick-arrow:hover) {
      opacity: 0.5;
    }
  }
  .carousel-arrows-hover {
    :deep(.slick-arrow.custom-slick-arrow) {
      display: none !important;
    }
    &:hover {
      :deep(.slick-arrow.custom-slick-arrow) {
        display: block !important;
      }
    }
  }

  .portal-card-body {
    height: 100%;
    .web-link {
      position: relative;
    }
    .web-link,
    img {
      width: 100%;
      height: 100%;
    }
    .bottom-text {
      position: absolute;
      width: calc(100% - 20px);
      height: 30px;
      line-height: 30px;
      bottom: 0;
      font-size: 14px;
      background: #000;
      color: #fff;
      padding: 0 10px;
      box-sizing: content-box;
    }
  }
</style>
