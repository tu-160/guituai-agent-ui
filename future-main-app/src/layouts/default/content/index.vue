<template>
  <div :class="[prefixCls, getLayoutContentMode]" :copyright="copyright">
    <div class="app-main h-full" v-loading="getOpenPageLoading && getPageLoading">
      <PageLayout />
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import PageLayout from '@/layouts/page/index.vue';
  import { useDesign } from '@/hooks/web/useDesign';
  import { useRootSetting } from '@/hooks/setting/useRootSetting';
  import { useTransitionSetting } from '@/hooks/setting/useTransitionSetting';
  import { useContentViewHeight } from './useContentViewHeight';
  import { useAppStore } from '@/store/modules/app';

  export default defineComponent({
    name: 'LayoutContent',
    components: { PageLayout },
    setup() {
      const { prefixCls } = useDesign('layout-content');
      const { getOpenPageLoading } = useTransitionSetting();
      const { getLayoutContentMode, getPageLoading } = useRootSetting();
      const appStore = useAppStore();
      const { copyright } = appStore.getSysConfigInfo;

      useContentViewHeight();
      return {
        prefixCls,
        getOpenPageLoading,
        getLayoutContentMode,
        getPageLoading,
        copyright,
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-layout-content';

  html[data-theme='dark'] {
    .@{prefix-cls} {
      background-color: #333333 !important;
    }
  }

  .@{prefix-cls} {
    position: relative;
    flex: 1 1 auto;
    min-height: 0;
    height: calc(100vh - @header-height - @multiple-height);
    overflow: hidden;
    padding: 10px;
    box-sizing: border-box;
    .app-main {
      overflow: hidden auto;
      position: relative;
    }

    &.fixed {
      width: 1200px;
      margin: 0 auto;
    }

    &-loading {
      position: absolute;
      top: 200px;
      z-index: @page-loading-z-index;
    }
  }
</style>
