<template>
  <Dropdown placement="bottom" :overlayClassName="`${prefixCls}-dropdown-overlay`">
    <span :class="[prefixCls, `${prefixCls}--${theme}`]" class="flex">
      <Avatar :class="`${prefixCls}__header`" :src="apiUrl + getUserInfo.headIcon" :size="30" />
    </span>
    <template #overlay>
      <Menu @click="handleMenuClick">
        <div class="dropdown-user-info">
          <Avatar :class="`${prefixCls}__header`" :src="apiUrl + getUserInfo.headIcon" :size="30" />
          <span :class="`${prefixCls}__info block`">
            <span :class="`${prefixCls}__name truncate`">{{ getUserInfo.userName }}</span>
          </span>
        </div>
        <MenuDivider />
        <MenuItem key="profile" itemKey="profile" :text="t('layout.header.profile')" icon="icon-ym icon-ym-header-userInfo" />
        <a-sub-menu key="system" v-if="getUserInfo.standingList?.length > 1" class="standing-menu-item" popupClassName="standing-menu-list">
          <template #title>
            <span class="flex items-center">
              <i class="icon-ym icon-ym-header-role-toggle mr-1" />
              <span>{{ t('layout.header.standingChange') }}</span>
            </span>
          </template>
          <a-menu-item
            v-for="item in getUserInfo.standingList"
            :key="item.id"
            @click.stop="toggleStanding(item.id, 'Standing')"
            :disabled="!!item.currentStanding">
            <span class="flex items-center">
              <span>{{ item.name }}</span>
            </span>
          </a-menu-item>
        </a-sub-menu>
        <MenuItem key="feedBack" itemKey="feedBack" :text="t('layout.header.feedback')" icon="icon-ym icon-ym-header-feedBack" />
        <MenuItem key="about" itemKey="about" :text="t('layout.header.about')" icon="icon-ym icon-ym-header-about" />
        <MenuItem key="statement" itemKey="statement" :text="t('layout.header.statement')" icon="icon-ym icon-ym-generator-card" />
        <MenuItem key="lock" itemKey="lock" :text="t('layout.header.tooltipLock')" icon="icon-ym icon-ym-header-lockScreen" v-if="getUseLockPage" />
        <MenuDivider />
        <MenuItem key="logout" itemKey="logout" :text="t('layout.header.dropdownItemLoginOut')" icon="icon-ym icon-ym-header-loginOut" />
      </Menu>
    </template>
  </Dropdown>
  <AboutModal @register="registerAboutModal" />
  <StatementModal @register="registerStatementModal" />
</template>
<script lang="ts">
  import { Dropdown, Menu, Avatar } from 'ant-design-vue';
  import type { MenuInfo } from 'ant-design-vue/lib/menu/src/interface';
  import { defineComponent, computed } from 'vue';
  import { DOC_URL } from '@/settings/siteSetting';
  import { useGlobSetting } from '@/hooks/setting';
  import { useUserStore } from '@/store/modules/user';
  import { useLockStore } from '@/store/modules/lock';
  import { useHeaderSetting } from '@/hooks/setting/useHeaderSetting';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useDesign } from '@/hooks/web/useDesign';
  import { propTypes } from '@/utils/propTypes';
  import { openWindow } from '@/utils';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';
  import { useModal } from '@/components/Modal';
  import AboutModal from '../AboutModal.vue';
  import StatementModal from '../StatementModal.vue';
  import { useGo } from '@/hooks/web/usePage';
  // import { setMajor } from '@/api/permission/userSetting';

  export default defineComponent({
    name: 'UserDropdown',
    components: {
      Dropdown,
      Menu,
      Avatar,
      MenuItem: createAsyncComponent(() => import('./DropMenuItem.vue')),
      MenuDivider: Menu.Divider,
      AboutModal,
      StatementModal,
    },
    props: {
      theme: propTypes.oneOf(['dark', 'light']),
    },
    setup() {
      const globSetting = useGlobSetting();
      const apiUrl = globSetting.apiUrl;
      const { prefixCls } = useDesign('header-user-dropdown');
      const { t } = useI18n();
      const { createMessage } = useMessage();
      const go = useGo();
      const { getUseLockPage } = useHeaderSetting();
      const userStore = useUserStore();
      const lockStore = useLockStore();
      const [registerAboutModal, { openModal: openAboutModal }] = useModal();
      const [registerStatementModal, { openModal: openStatementModal }] = useModal();

      const getUserInfo = computed(() => userStore.getUserInfo || {});

      function handleMenuClick(e: MenuInfo) {
        if (e.key === 'logout') return handleLoginOut();
        if (e.key === 'doc') return openDoc();
        if (e.key === 'lock') return handleLock();
        if (e.key === 'profile') return go('/profile');
        if (e.key === 'feedBack') return openFeedBack();
        if (e.key === 'statement') return openStatementModal(true);
        if (e.key === 'about') return openAboutModal(true);
      }
      function handleLock() {
        lockStore.setLockInfo({
          isLock: true,
        });
      }
      function handleLoginOut() {
        userStore.confirmLoginOut();
      }
      function openDoc() {
        openWindow(DOC_URL);
      }
      function openFeedBack() {
        openWindow('http://mail.qq.com/cgi-bin/qm_share?t=qm_mailme&email=dA0dGhkVHQcbEgA0BQVaFxsZ');
      }
      function toggleStanding(majorId, majorType) {
        const query = { majorId, majorType };
        // setMajor(query).then(res => {
        //   createMessage.success(res.msg).then(() => {
        //     location.reload();
        //   });
        // });
      }

      return {
        apiUrl,
        prefixCls,
        t,
        getUserInfo,
        handleMenuClick,
        getUseLockPage,
        registerAboutModal,
        registerStatementModal,
        toggleStanding,
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-header-user-dropdown';

  .@{prefix-cls} {
    height: 36px;
    padding: 0 10px;
    overflow: hidden;
    font-size: 12px;
    cursor: pointer;
    align-items: center;
    border-radius: var(--border-radius);
    &:hover {
      background: rgba(247, 247, 247, 0.4);
    }

    &__info {
      margin-left: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &__name {
      display: inline-block;
      font-size: 14px;
      max-width: 100px;
    }

    &--light {
      .@{prefix-cls}__name {
        color: @text-color-base;
      }

      .@{prefix-cls}__desc {
        color: @header-light-desc-color;
      }
    }
  }
  .standing-menu-item {
    .ant-dropdown-menu-submenu-title {
      padding-inline-end: 0 !important;
    }
    .ant-dropdown-menu-submenu-arrow {
      display: none !important;
    }
  }
  .standing-menu-list {
    .ant-dropdown-menu {
      max-height: 80vh;
      overflow: auto;
    }
  }
  .dropdown-user-info {
    padding: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>
