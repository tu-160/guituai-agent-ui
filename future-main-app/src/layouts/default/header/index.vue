<template>
  <Header :class="getHeaderClass">
    <!-- left start -->
    <div :class="`${prefixCls}-left`">
      <!-- logo -->
      <AppLogo :class="`${prefixCls}-logo`" :theme="getHeaderTheme" :style="getLogoWidth" />
      <LayoutTrigger v-if="(getShowContent && getShowHeaderTrigger && !getSplit && !getIsMixSidebar) || getIsMobile" :theme="getHeaderTheme" :sider="false" />
    </div>
    <!-- left end -->

    <!-- menu start -->
    <div :class="`${prefixCls}-menu`" v-if="getShowTopMenu && !getIsMobile">
      <LayoutMenu :isHorizontal="true" :theme="getHeaderTheme" :splitType="getSplitType" :menuMode="getMenuMode" />
    </div>
    <!-- menu-end -->

    <!-- action  -->
    <div :class="`${prefixCls}-action`">
      <AppSearch :class="`${prefixCls}-action__item search-item`" v-if="getShowSearch" />

      <a-tooltip :title="t('layout.header.commonMenus')" :mouseEnterDelay="0.5">
        <div :class="`${prefixCls}-action__item`" @click="openCommonMenusDrawer(true, {})">
          <i class="icon-ym icon-ym-header-star"></i>
        </div>
      </a-tooltip>

      <ErrorAction v-if="getUseErrorHandle" :class="`${prefixCls}-action__item error-action`" />

      <a-tooltip :title="t('layout.header.tooltipChat')" placement="bottom" :mouseEnterDelay="0.5">
        <div :class="`${prefixCls}-action__item`" @click="openChatDrawer(true, {})">
          <i class="icon-ym icon-ym-header-chat" :class="{ twinkle: isTwinkle }"></i>
        </div>
      </a-tooltip>

      <Notify v-if="getShowNotice" :count="messageCount" :class="`${prefixCls}-action__item notify-item`" @click="openMessageDrawer(true, {})" />

      <a-tooltip
        :title="t('layout.header.systemChange')"
        placement="bottom"
        :mouseEnterDelay="0.5"
        v-if="getUserInfo.systemIds && getUserInfo.systemIds.length > 1 && !getFutureAppId()">
        <div :class="`${prefixCls}-action__item`" @click="openSystemTriggerDrawer(true, { list: getUserInfo.systemIds })">
          <i class="icon-ym icon-ym-header-sys-toggle"></i>
        </div>
      </a-tooltip>

      <FullScreen v-if="getShowFullScreen" :class="`${prefixCls}-action__item fullscreen-item`" />

      <AppLocalePicker v-if="getShowLocalePicker" :showText="false" :class="`${prefixCls}-action__item`" />

      <SettingDrawer v-if="getShowSetting" :class="`${prefixCls}-action__item`" />

      <UserDropDown :theme="getHeaderTheme" />
      <ChatDrawer @register="registerChatDrawer" @toggleTwinkle="toggleTwinkle" />
      <SystemTriggerDrawer @register="registerSystemTriggerDrawer" />
      <CommonMenusDrawer @register="registerCommonMenusDrawer" />
      <MessageDrawer @register="registerMessageDrawer" @readMsg="readMsg" />
      <ResetPwdForm @register="registerForm" />
    </div>
  </Header>
</template>
<script lang="ts">
  import { defineComponent, unref, computed, reactive, toRefs, onMounted } from 'vue';

  import { propTypes } from '@/utils/propTypes';

  import { Layout } from 'ant-design-vue';
  import { MessageOutlined } from '@ant-design/icons-vue';
  import { AppLogo, AppSearch, AppLocalePicker } from '@/components/Application';
  import LayoutMenu from '../menu/index.vue';
  import LayoutTrigger from '../trigger/index.vue';

  import { useHeaderSetting } from '@/hooks/setting/useHeaderSetting';
  import { useMenuSetting } from '@/hooks/setting/useMenuSetting';
  import { useRootSetting } from '@/hooks/setting/useRootSetting';

  import { MenuModeEnum, MenuSplitTyeEnum } from '@/enums/menuEnum';
  import { SettingButtonPositionEnum } from '@/enums/appEnum';

  import { UserDropDown, LayoutBreadcrumb, FullScreen, Notify, ErrorAction } from './components';
  import { useAppInject } from '@/hooks/web/useAppInject';
  import { useDesign } from '@/hooks/web/useDesign';

  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';
  import { useLocale } from '@/locales/useLocale';
  import { useI18n } from '@/hooks/web/useI18n';

  import { useDrawer } from '@/components/Drawer';
  import ChatDrawer from './components/chat/ChatDrawer.vue';
  import SystemTriggerDrawer from './components/SystemTriggerDrawer.vue';
  import CommonMenusDrawer from './components/CommonMenusDrawer.vue';
  import MessageDrawer from './components/MessageDrawer.vue';
  import { useWebSocket } from '@/hooks/web/useWebSocket';

  import { useModal } from '@/components/Modal';
  import ResetPwdForm from './components/ResetPwdForm.vue';
  import { updatePasswordMessage } from '@/api/basic/user';
  import { useUserStore } from '@/store/modules/user';
  import { getFutureAppId } from '@/utils/future';

  interface State {
    isTwinkle: boolean;
    messageCount: number;
  }

  export default defineComponent({
    name: 'LayoutHeader',
    components: {
      Header: Layout.Header,
      AppLogo,
      LayoutTrigger,
      LayoutBreadcrumb,
      LayoutMenu,
      UserDropDown,
      AppLocalePicker,
      FullScreen,
      Notify,
      AppSearch,
      ErrorAction,
      SettingDrawer: createAsyncComponent(() => import('@/layouts/default/setting/index.vue'), {
        loading: true,
      }),
      ChatDrawer,
      SystemTriggerDrawer,
      CommonMenusDrawer,
      MessageDrawer,
      MessageOutlined,
      ResetPwdForm,
    },
    props: {
      fixed: propTypes.bool,
    },
    setup(props) {
      const { t } = useI18n();
      const { prefixCls } = useDesign('layout-header');
      const [registerChatDrawer, { openDrawer: openChatDrawer }] = useDrawer();
      const [registerSystemTriggerDrawer, { openDrawer: openSystemTriggerDrawer }] = useDrawer();
      const [registerCommonMenusDrawer, { openDrawer: openCommonMenusDrawer }] = useDrawer();
      const [registerMessageDrawer, { openDrawer: openMessageDrawer }] = useDrawer();
      const { getShowTopMenu, getShowHeaderTrigger, getSplit, getIsMixMode, getMenuWidth, getIsMixSidebar } = useMenuSetting();
      const { getUseErrorHandle, getShowSettingButton, getSettingButtonPosition } = useRootSetting();

      const { getHeaderTheme, getShowFullScreen, getShowNotice, getShowContent, getShowBread, getShowHeaderLogo, getShowHeader, getShowSearch } =
        useHeaderSetting();

      const { getShowLocalePicker } = useLocale();

      const { getIsMobile } = useAppInject();

      const state = reactive<State>({
        isTwinkle: false,
        messageCount: 0,
      });

      const { onWebSocket } = useWebSocket();

      const userStore = useUserStore();
      const [registerForm, { openModal: openFormModal }] = useModal();

      onWebSocket((data: any) => {
        // 初始化
        if (data.method == 'initMessage') {
          state.messageCount = data.unreadTotalCount || 0;
          state.isTwinkle = !!data.unreadNums.length;
        }
        // 消息推送（消息公告用的）
        if (data.method == 'messagePush') {
          state.messageCount += data.unreadNoticeCount;
        }
      });

      const getHeaderClass = computed(() => {
        const theme = unref(getHeaderTheme);
        return [
          prefixCls,
          {
            [`${prefixCls}--fixed`]: props.fixed,
            [`${prefixCls}--mobile`]: unref(getIsMobile),
            [`${prefixCls}--${theme}`]: theme,
          },
        ];
      });

      const getShowSetting = computed(() => {
        if (!unref(getShowSettingButton)) {
          return false;
        }
        const settingButtonPosition = unref(getSettingButtonPosition);

        if (settingButtonPosition === SettingButtonPositionEnum.AUTO) {
          return unref(getShowHeader);
        }
        return settingButtonPosition === SettingButtonPositionEnum.HEADER;
      });

      const getLogoWidth = computed(() => {
        if (!unref(getIsMixMode) || unref(getIsMobile)) {
          return {};
        }
        const width = unref(getMenuWidth) < 180 ? 180 : unref(getMenuWidth);
        return { width: `${width}px` };
      });

      const getSplitType = computed(() => {
        return unref(getSplit) ? MenuSplitTyeEnum.TOP : MenuSplitTyeEnum.NONE;
      });

      const getMenuMode = computed(() => {
        return unref(getSplit) ? MenuModeEnum.HORIZONTAL : null;
      });
      const getUserInfo = computed(() => userStore.getUserInfo || {});

      function toggleTwinkle(boo = false) {
        state.isTwinkle = boo;
      }
      function readMsg(isAll = false) {
        if (isAll) {
          state.messageCount = 0;
        } else {
          state.messageCount -= 1;
          state.messageCount = state.messageCount >= 0 ? state.messageCount : 0;
        }
      }
      function initData() {
        updatePasswordMessage();
        // getSysConfig()
        //   .then(res => {
        //     if (!(unref(getUserInfo) as any)?.changePasswordDate && res.data.mandatoryModificationOfInitialPassword == 1)
        //       openFormModal(true, { id: (unref(getUserInfo) as any)?.userId, account: (unref(getUserInfo) as any)?.userAccount });
        //   })
        //   .catch(() => {});
      }

      onMounted(() => {
        initData();
      });

      return {
        t,
        ...toRefs(state),
        prefixCls,
        getHeaderClass,
        getShowHeaderLogo,
        getHeaderTheme,
        getShowHeaderTrigger,
        getIsMobile,
        getShowBread,
        getShowContent,
        getSplitType,
        getSplit,
        getMenuMode,
        getShowTopMenu,
        getShowLocalePicker,
        getShowFullScreen,
        getShowNotice,
        getUseErrorHandle,
        getLogoWidth,
        getIsMixSidebar,
        getShowSettingButton,
        getShowSetting,
        getShowSearch,
        registerChatDrawer,
        openChatDrawer,
        registerSystemTriggerDrawer,
        openSystemTriggerDrawer,
        registerCommonMenusDrawer,
        openCommonMenusDrawer,
        registerMessageDrawer,
        openMessageDrawer,
        toggleTwinkle,
        registerForm,
        readMsg,
        initData,
        getUserInfo,
        getFutureAppId: getFutureAppId,
      };
    },
  });
</script>
<style lang="less">
  @import './index.less';
</style>
