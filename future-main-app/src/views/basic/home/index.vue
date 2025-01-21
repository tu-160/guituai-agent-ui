<template>
  <div class="dashboard-container" v-loading="loading">
    <ScrollContainer class="dashboard-container">
      <Default />
    </ScrollContainer>
  </div>
</template>
<script lang="ts" setup>
  import { toRefs, computed, onMounted, onUnmounted, unref } from 'vue';
  import { ScrollContainer } from '@/components/Container';
  import { useUserStore } from '@/store/modules/user';
  import Default from './Default.vue';
  import { usePortal } from '@/views/basic/home/hooks/usePortal';

  const { state, initData, clearAutoRefresh } = usePortal();
  const { loading } = toRefs(state);
  const userStore = useUserStore();

  const getUserInfo = computed(() => userStore.getUserInfo || {});

  function init() {
    state.systemId = unref(getUserInfo)?.systemId;
    state.portalId = unref(getUserInfo)?.portalId as string;
    initData();
  }

  onMounted(() => init());
  onUnmounted(() => clearAutoRefresh());
</script>
<style lang="less" scoped>
  .dashboard-container {
    width: 100%;
    height: 100%;
    position: relative;
    border-radius: 8px;
    .custom-page {
      width: 100%;
      height: 100%;
    }
    :deep(.layout-area) {
      width: 100%;
      border-radius: 4px;
      overflow: hidden;
    }
    .setting-btn {
      position: fixed;
      top: 300px;
      right: 0px;
      height: 40px;
      width: 40px;
      text-align: center;
      padding: 0;
      border-radius: 20px 0 0 20px;
      z-index: 100;
      :deep(i) {
        font-size: 20px;
        font-weight: 580;
      }
    }
    :deep(.vue-grid-layout) {
      margin: -10px;
    }
    :deep(.scrollbar__view) {
      overflow: hidden;
    }
    :deep(.ant-card) {
      border: unset;
    }
  }
</style>
<style lang="less">
  @import '@/components/VisualPortal/style/index.less';
</style>
