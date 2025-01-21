<template>
  <Layout :class="getClass" v-bind="lockEvents">
    <LayoutFeatures />
    <LayoutHeader fixed v-if="getShowFullHeaderRef" />
    <Layout :class="[layoutClass]">
      <LayoutSideBar v-if="getShowSidebar || getIsMobile" />
      <Layout :class="`${prefixCls}-main`">
        <LayoutMultipleHeader />
        <LayoutContent />
      </Layout>
    </Layout>
  </Layout>
</template>

<script lang="ts">
  import { defineComponent, computed, unref, onMounted } from 'vue';
  import { Layout } from 'ant-design-vue';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';

  import LayoutHeader from './header/index.vue';
  import LayoutContent from './content/index.vue';
  import LayoutSideBar from './sider/index.vue';
  import LayoutMultipleHeader from './header/MultipleHeader.vue';

  import { useHeaderSetting } from '@/hooks/setting/useHeaderSetting';
  import { useMenuSetting } from '@/hooks/setting/useMenuSetting';
  import { useDesign } from '@/hooks/web/useDesign';
  import { useLockPage } from '@/hooks/web/useLockPage';
  import { useRootSetting } from '@/hooks/setting/useRootSetting';
  import { useAppInject } from '@/hooks/web/useAppInject';
  import { useWebSocket } from '@/hooks/web/useWebSocket';
  import { useAppStore } from '@/store/modules/app';
  import { ThemeEnum } from '@/enums/appEnum';
  import { useRouter } from 'vue-router';
  import { useUserStore } from '@/store/modules/user';
  import { useMessage } from '@/hooks/web/useMessage';
  import { formatToDateTime } from '@/utils/dateUtil';
  import { h } from 'vue';
  import { useI18n } from '@/hooks/web/useI18n';

  export default defineComponent({
    name: 'DefaultLayout',
    components: {
      LayoutFeatures: createAsyncComponent(() => import('@/layouts/default/feature/index.vue')),
      LayoutHeader,
      LayoutContent,
      LayoutSideBar,
      LayoutMultipleHeader,
      Layout,
    },
    setup() {
      const { prefixCls } = useDesign('default-layout');
      const { getIsMobile } = useAppInject();
      const { getShowFullHeaderRef } = useHeaderSetting();
      const { getShowSidebar, getIsMixSidebar, getShowMenu } = useMenuSetting();
      const { getDarkMode } = useRootSetting();
      const appStore = useAppStore();
      // Create a lock screen monitor
      const lockEvents = useLockPage();

      const getSysBg = computed(() => appStore.getProjectConfig.sysBg);
      const layoutClass = computed(() => {
        let cls: string[] = ['ant-layout'];
        if (unref(getIsMixSidebar) || unref(getShowMenu)) {
          cls.push('ant-layout-has-sider');
        }
        return cls;
      });
      const getClass = computed(() => [prefixCls, { [`${unref(getSysBg)}-bg`]: unref(getSysBg) && getDarkMode.value === ThemeEnum.LIGHT }]);

      const { initWebSocket } = useWebSocket();
      const router = useRouter();
      const userStore = useUserStore();
      const { notification } = useMessage();
      const { t } = useI18n();

      function initPrevLogin() {
        router.beforeEach(async (_to, from, next) => {
          const userInfo = userStore.getUserInfo;
          if (userInfo.prevLogin == 1 && from.path == '/login') {
            notification?.destroy();
            notification.open({
              message: t('sys.login.lastLoginInfo'),
              description: () =>
                h('div', { class: 'pt-10px' }, [
                  h('p', null, `时间： ${formatToDateTime(userInfo.prevLoginTime)}`),
                  h('p', null, `地点： ${userInfo.prevLoginIPAddressName || ''}`),
                  h('p', null, `IP： ${userInfo.prevLoginIPAddress || ''}`),
                ]),
              placement: 'bottomRight',
              style: { width: '300px' },
            });
          }
          next();
        });
      }

      onMounted(() => {
        initWebSocket();
        initPrevLogin();
      });

      return {
        getClass,
        getShowFullHeaderRef,
        getShowSidebar,
        prefixCls,
        getIsMobile,
        getIsMixSidebar,
        layoutClass,
        lockEvents,
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-default-layout';

  .@{prefix-cls} {
    display: flex;
    width: 100%;
    min-height: 100%;
    background-color: @app-base-background;
    flex-direction: column;
    background-position: top center;
    background-repeat: no-repeat;
    background-size: cover;
    &.blue-bg {
      background-image: url('../../assets/images/bg/blueBg.png');
    }
    &.purple-bg {
      background-image: url('../../assets/images/bg/purpleBg.png');
    }
    &.green-bg {
      background-image: url('../../assets/images/bg/greenBg.png');
    }

    > .ant-layout {
      min-height: 100%;
      background: transparent !important;
    }

    &-main {
      width: 100%;
      background: transparent !important;
    }
  }
</style>
