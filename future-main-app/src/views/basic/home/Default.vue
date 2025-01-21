<template>
  <div class="home-default-v">
    <GrowCard :loading="loading" class="enter-y" />
    <SiteAnalysis class="!my-10px enter-y" :loading="loading" />
    <div class="md:flex enter-y">
      <VisitRadar class="md:w-1/3 w-full" :loading="loading" />
      <VisitSource class="md:w-1/3 !md:mx-10px !md:my-0 !my-10px w-full" :loading="loading" />
      <SalesProductPie class="md:w-1/3 w-full" :loading="loading" />
    </div>
    <p class="copyright enter-y">{{ copyright }}</p>
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import GrowCard from './components/GrowCard.vue';
  import SiteAnalysis from './components/SiteAnalysis.vue';
  import VisitSource from './components/VisitSource.vue';
  import VisitRadar from './components/VisitRadar.vue';
  import SalesProductPie from './components/SalesProductPie.vue';
  import { useAppStore } from '@/store/modules/app';

  const appStore = useAppStore();
  const { copyright } = appStore.getSysConfigInfo;
  const loading = ref(true);

  console.log("默认首页");
  setTimeout(() => {
    loading.value = false;
  }, 500);
</script>
<style lang="less">
  .home-default-v {
    .ant-card {
      border-radius: 10px;
      overflow: hidden;
    }
    .ant-card-contain-tabs {
      z-index: 0 !important;
    }
    .copyright {
      font-size: 14px;
      text-align: center;
      padding: 20px 0 10px;
      color: #999;
    }
  }
</style>
