import { defineComponent, computed, unref } from 'vue';
import { BasicDrawer } from '@/components/Drawer/index';
import { TypePicker, ThemeColorPicker, MainThemeColorPicker, SwitchItem, SelectItem, InputNumberItem } from './components';
import { AppDarkModeToggle } from '@/components/Application';
import { TriggerEnum } from '@/enums/menuEnum';
import { useRootSetting } from '@/hooks/setting/useRootSetting';
import { useMenuSetting } from '@/hooks/setting/useMenuSetting';
import { useHeaderSetting } from '@/hooks/setting/useHeaderSetting';
import { useMultipleTabSetting } from '@/hooks/setting/useMultipleTabSetting';
import { useTransitionSetting } from '@/hooks/setting/useTransitionSetting';
import { useLocale } from '@/locales/useLocale';
import { useI18n } from '@/hooks/web/useI18n';

import { baseHandler } from './handler';

import {
  HandlerEnum,
  contentModeOptions,
  topMenuAlignOptions,
  getMenuTriggerOptions,
  routerTransitionOptions,
  menuTypeList,
  sysBgList,
  mixSidebarTriggerOptions,
} from './enum';

import { HEADER_PRESET_BG_COLOR_LIST, SIDE_BAR_BG_COLOR_LIST, APP_PRESET_COLOR_LIST } from '@/settings/designSetting';

const { t } = useI18n();

export default defineComponent({
  name: 'SettingDrawer',
  setup(_, { attrs }) {
    const {
      getContentMode,
      getShowFooter,
      getShowBreadCrumb,
      getShowBreadCrumbIcon,
      getShowLogo,
      getFullContent,
      getColorWeak,
      getGrayMode,
      getLockTime,
      getShowDarkModeToggle,
      getThemeColor,
      getSysBg,
      getOpenKeepAlive,
    } = useRootSetting();

    const { getOpenPageLoading, getBasicTransition, getEnableTransition, getOpenNProgress } = useTransitionSetting();

    const {
      getIsHorizontal,
      getShowMenu,
      getMenuType,
      getTrigger,
      getCollapsedShowTitle,
      getMenuFixed,
      getCollapsed,
      getCanDrag,
      getTopMenuAlign,
      getAccordion,
      getMenuWidth,
      getMenuBgColor,
      getIsTopMenu,
      getSplit,
      getIsMixSidebar,
      getCloseMixSidebarOnChange,
      getMixSideTrigger,
      getMixSideFixed,
    } = useMenuSetting();

    const { getShowHeader, getFixed: getHeaderFixed, getHeaderBgColor, getShowSearch } = useHeaderSetting();

    const { getShowMultipleTab, getShowIcon, getShowQuick, getShowRedo, getShowFold } = useMultipleTabSetting();

    const { getShowLocalePicker } = useLocale();

    const getShowMenuRef = computed(() => {
      return unref(getShowMenu) && !unref(getIsHorizontal);
    });

    function renderSidebar() {
      return (
        <>
          <TypePicker
            typeList={menuTypeList}
            handler={(item: (typeof menuTypeList)[0]) => {
              baseHandler(HandlerEnum.CHANGE_LAYOUT, {
                mode: item.mode,
                type: item.type,
                split: unref(getIsHorizontal) ? false : undefined,
              });
            }}
            def={unref(getMenuType)}
          />
        </>
      );
    }

    function renderSystemBackground() {
      return (
        <>
          <TypePicker
            class="sysBg-type-picker"
            typeList={sysBgList}
            handler={(item: (typeof sysBgList)[0]) => {
              baseHandler(HandlerEnum.CHANGE_SYS_BG, item.type);
            }}
            def={unref(getSysBg)}
          />
        </>
      );
    }

    function renderHeaderTheme() {
      return <ThemeColorPicker colorList={HEADER_PRESET_BG_COLOR_LIST} def={unref(getHeaderBgColor)} event={HandlerEnum.HEADER_THEME} />;
    }

    function renderSiderTheme() {
      return <ThemeColorPicker colorList={SIDE_BAR_BG_COLOR_LIST} def={unref(getMenuBgColor)} event={HandlerEnum.MENU_THEME} />;
    }

    function renderMainTheme() {
      return <MainThemeColorPicker colorList={APP_PRESET_COLOR_LIST} def={unref(getThemeColor)} event={HandlerEnum.CHANGE_THEME_COLOR} />;
    }

    /**
     * @description:
     */
    function renderFeatures() {
      let triggerDef = unref(getTrigger);

      const triggerOptions = getMenuTriggerOptions(unref(getSplit));
      const some = triggerOptions.some(item => item.value === triggerDef);
      if (!some) {
        triggerDef = TriggerEnum.FOOTER;
      }

      return (
        <>
          <SwitchItem title={t('layout.setting.menuSearch')} event={HandlerEnum.HEADER_SEARCH} def={unref(getShowSearch)} disabled={!unref(getShowHeader)} />
          <SwitchItem
            title={t('layout.setting.toggleLocale')}
            event={HandlerEnum.HEADER_LOCALE}
            def={unref(getShowLocalePicker)}
            disabled={!unref(getShowHeader)}
          />
        </>
      );
    }

    function renderContent() {
      return (
        <>
          <SwitchItem title={t('layout.setting.tabs')} event={HandlerEnum.TABS_SHOW} def={unref(getShowMultipleTab)} />
          <SwitchItem title={t('layout.setting.tabsIcon')} event={HandlerEnum.TABS_SHOW_ICON} def={unref(getShowIcon)} />
          <SwitchItem title={t('layout.setting.grayMode')} event={HandlerEnum.GRAY_MODE} def={unref(getGrayMode)} />
          <SwitchItem title={t('layout.setting.colorWeak')} event={HandlerEnum.COLOR_WEAK} def={unref(getColorWeak)} />
          <SwitchItem title={t('layout.setting.cachePage')} event={HandlerEnum.OPEN_KEEP_ALIVE} def={unref(getOpenKeepAlive)} />
        </>
      );
    }

    function renderTransition() {
      return (
        <>
          <SwitchItem title={t('layout.setting.progress')} event={HandlerEnum.OPEN_PROGRESS} def={unref(getOpenNProgress)} />
          <SwitchItem title={t('layout.setting.switchLoading')} event={HandlerEnum.OPEN_PAGE_LOADING} def={unref(getOpenPageLoading)} />
        </>
      );
    }
    function renderDarkMode() {
      if (!unref(getShowDarkModeToggle)) return null;
      return (
        <div class="setting-drawer-item">
          <p class="setting-drawer-cap">{t('layout.setting.darkMode')}</p>
          <div class="setting-drawer-content">
            <AppDarkModeToggle />
          </div>
        </div>
      );
    }

    return () => (
      <BasicDrawer {...attrs} title={t('layout.setting.drawerTitle')} width={400} class="setting-drawer">
        <div class="p-20px">
          {renderDarkMode()}
          <div class="setting-drawer-item">
            <p class="setting-drawer-cap">{t('layout.setting.navMode')}</p>
            <div class="setting-drawer-content">{renderSidebar()}</div>
          </div>
          <div class="setting-drawer-item">
            <p class="setting-drawer-cap">{t('layout.setting.sysTheme')}</p>
            <div class="setting-drawer-content">{renderMainTheme()}</div>
          </div>
          <div class="setting-drawer-item">
            <p class="setting-drawer-cap">{t('layout.setting.systemBackground')}</p>
            <div class="setting-drawer-content">{renderSystemBackground()}</div>
          </div>
          <div class="setting-drawer-item">
            <p class="setting-drawer-cap">{t('layout.setting.interfaceFunction')}</p>
            <div class="setting-drawer-content bg-content">{renderFeatures()}</div>
          </div>
          <div class="setting-drawer-item">
            <p class="setting-drawer-cap">{t('layout.setting.interfaceDisplay')}</p>
            <div class="setting-drawer-content bg-content">{renderContent()}</div>
          </div>
          <div class="setting-drawer-item">
            <p class="setting-drawer-cap">{t('layout.setting.animation')}</p>
            <div class="setting-drawer-content bg-content">{renderTransition()}</div>
          </div>
        </div>
      </BasicDrawer>
    );
  },
});
