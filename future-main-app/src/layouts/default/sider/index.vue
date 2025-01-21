<template>
  <Drawer v-if="getIsMobile" placement="left" :class="prefixCls" :width="getMenuWidth" :getContainer="false" :open="!getCollapsed" @close="handleClose">
    <Sider />
  </Drawer>
  <MixSider v-else-if="getIsMixSidebar" />
  <Sider v-else />
</template>
<script lang="ts">
  import { defineComponent } from 'vue';

  import Sider from './LayoutSider.vue';
  import MixSider from './MixSider.vue';
  import { Drawer } from 'ant-design-vue';

  import { useAppInject } from '@/hooks/web/useAppInject';
  import { useMenuSetting } from '@/hooks/setting/useMenuSetting';
  import { useDesign } from '@/hooks/web/useDesign';
  export default defineComponent({
    name: 'SiderWrapper',
    components: { Sider, Drawer, MixSider },
    setup() {
      const { prefixCls } = useDesign('layout-sider-wrapper');
      const { getIsMobile } = useAppInject();
      const { setMenuSetting, getCollapsed, getMenuWidth, getIsMixSidebar } = useMenuSetting();

      function handleClose() {
        setMenuSetting({
          collapsed: true,
        });
      }

      return { prefixCls, getIsMobile, getCollapsed, handleClose, getMenuWidth, getIsMixSidebar };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-layout-sider-wrapper';
  @sideBar-prefix-cls: ~'@{namespace}-layout-sideBar';

  .@{prefix-cls} {
    .ant-drawer-header{
      display: none;
    }
    .ant-drawer-body {
      height: 100vh;
      padding: 0;
       .@{sideBar-prefix-cls}{
        margin-left: 0 !important;
        &--mix {
          top: 0;
          border-radius: 0;
          height: 100% ;
          .scroll-container{
            height: calc(100% - 58px) !important;
          }
        }
       }
    }

    .ant-drawer-header-no-title {
      display: none;
    }
  }
</style>
