<template>
  <div class="md:flex home-grow-card">
    <template v-for="(item, index) in growCardList" :key="item.title">
      <Card
        size="small"
        :loading="loading"
        class="home-grow-card-item md:w-1/4 w-full !md:mt-0"
        :class="{ '!md:mr-10px': index + 1 < 4, '!mt-10px': index > 0 }"
        :style="{ background: !isDark ? item.bg : '' }">
        <div class="home-grow-card-item-main-img">
          <img :src="item.mainImg" />
        </div>
        <img :src="item.icon" class="home-grow-card-item-icon" />
        <div class="home-grow-card-item-content">
          <div class="flex justify-start items-center mb-6px">
            <span>总{{ item.title }}</span>
            <span class="item-tag" :style="{ background: item.tagBg, color: item.color }">{{ item.action }}</span>
          </div>
          <CountTo :startVal="1" :endVal="item.value" class="text-24px font-bold leading-30px" />
          <div class="flex justify-between mt-53px">
            <span>总{{ item.title }}：</span>
            <CountTo :startVal="1" :endVal="item.total" />
          </div>
        </div>
      </Card>
    </template>
  </div>
</template>
<script lang="ts" setup>
  import { computed } from 'vue';
  import { CountTo } from '@/components/CountTo/index';
  import { Card } from 'ant-design-vue';
  import { growCardList } from '../data';
  import { useRootSetting } from '@/hooks/setting/useRootSetting';
  import { ThemeEnum } from '@/enums/appEnum';

  defineProps({
    loading: { type: Boolean },
  });

  const { getDarkMode } = useRootSetting();
  const isDark = computed(() => getDarkMode.value === ThemeEnum.DARK);
</script>
<style lang="less" scoped>
  .home-grow-card {
    .home-grow-card-item {
      border-radius: 10px !important;
      overflow: hidden;
      height: 180px;
      :deep(.ant-card-body) {
        height: 100%;
        padding: 20px 0 0 20px !important;
        position: relative;
        display: flex;
      }
      .home-grow-card-item-icon {
        width: 50px;
        height: 50px;
        flex-shrink: 0;
        margin-right: 13px;
      }
      .home-grow-card-item-main-img {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 163px;
        height: 153px;
        z-index: 0;
      }
      .home-grow-card-item-content {
        position: relative;
        z-index: 1;
        .item-tag {
          display: inline-block;
          width: 32px;
          height: 20px;
          border-radius: 5px;
          font-size: 12px;
          text-align: center;
          line-height: 20px;
          margin-left: 8px;
        }
      }
    }
  }
</style>
