import { HandlerEnum } from './enum';
import { MenuTypeEnum } from '@/enums/menuEnum';
import { updateHeaderBgColor, updateSidebarBgColor } from '@/logics/theme/updateBackground';
import { updateColorWeak } from '@/logics/theme/updateColorWeak';
import { updateGrayMode } from '@/logics/theme/updateGrayMode';

import { useAppStore } from '@/store/modules/app';
import { useLocaleStore } from '@/store/modules/locale';
import { ProjectConfig } from '#/config';
import { changeTheme } from '@/logics/theme';
import { updateDarkTheme } from '@/logics/theme/dark';
import { useRootSetting } from '@/hooks/setting/useRootSetting';

export function baseHandler(event: HandlerEnum, value: any) {
  const appStore = useAppStore();
  const config = handler(event, value);
  appStore.setProjectConfig(config);
  if (event === HandlerEnum.CHANGE_THEME) {
    updateHeaderBgColor();
    updateSidebarBgColor();
  }
  // 多语言切换开关
  if (event === HandlerEnum.HEADER_LOCALE) {
    const localeStore = useLocaleStore();
    localeStore.setLocaleInfo({ showPicker: value });
  }
}

export function handler(event: HandlerEnum, value: any): DeepPartial<ProjectConfig> {
  const appStore = useAppStore();

  const { getThemeColor, getDarkMode } = useRootSetting();
  switch (event) {
    case HandlerEnum.CHANGE_LAYOUT:
      const { mode, type, split } = value;
      let splitOpt = split === undefined ? { split } : {};
      if (type === MenuTypeEnum.MIX) {
        splitOpt = { split: true };
      } else {
        splitOpt = { split: false };
      }

      return {
        menuSetting: {
          mode,
          type,
          collapsed: false,
          show: true,
          hidden: false,
          ...splitOpt,
        },
      };

    case HandlerEnum.CHANGE_THEME_COLOR:
      if (getThemeColor.value === value) {
        return {};
      }
      changeTheme(value);

      return { themeColor: value };

    case HandlerEnum.CHANGE_THEME:
      if (getDarkMode.value === value) {
        return {};
      }
      updateDarkTheme(value);

      return {};

    case HandlerEnum.CHANGE_SYS_BG:
      return { sysBg: value };

    case HandlerEnum.MENU_HAS_DRAG:
      return { menuSetting: { canDrag: value } };

    case HandlerEnum.MENU_ACCORDION:
      return { menuSetting: { accordion: value } };

    case HandlerEnum.MENU_TRIGGER:
      return { menuSetting: { trigger: value } };

    case HandlerEnum.MENU_TOP_ALIGN:
      return { menuSetting: { topMenuAlign: value } };

    case HandlerEnum.MENU_COLLAPSED:
      return { menuSetting: { collapsed: value } };

    case HandlerEnum.MENU_WIDTH:
      return { menuSetting: { menuWidth: value } };

    case HandlerEnum.MENU_SHOW_SIDEBAR:
      return { menuSetting: { show: value } };

    case HandlerEnum.MENU_COLLAPSED_SHOW_TITLE:
      return { menuSetting: { collapsedShowTitle: value } };

    case HandlerEnum.MENU_THEME:
      updateSidebarBgColor(value);
      return { menuSetting: { bgColor: value } };

    case HandlerEnum.MENU_SPLIT:
      return { menuSetting: { split: value } };

    case HandlerEnum.MENU_CLOSE_MIX_SIDEBAR_ON_CHANGE:
      return { menuSetting: { closeMixSidebarOnChange: value } };

    case HandlerEnum.MENU_FIXED:
      return { menuSetting: { fixed: value } };

    case HandlerEnum.MENU_TRIGGER_MIX_SIDEBAR:
      return { menuSetting: { mixSideTrigger: value } };

    case HandlerEnum.MENU_FIXED_MIX_SIDEBAR:
      return { menuSetting: { mixSideFixed: value } };

    // ============transition==================
    case HandlerEnum.OPEN_PAGE_LOADING:
      appStore.setPageLoading(false);
      return { transitionSetting: { openPageLoading: value } };

    case HandlerEnum.ROUTER_TRANSITION:
      return { transitionSetting: { basicTransition: value } };

    case HandlerEnum.OPEN_ROUTE_TRANSITION:
      return { transitionSetting: { enable: value } };

    case HandlerEnum.OPEN_PROGRESS:
      return { transitionSetting: { openNProgress: value } };
    // ============root==================

    case HandlerEnum.LOCK_TIME:
      return { lockTime: value };

    case HandlerEnum.FULL_CONTENT:
      return { fullContent: value };

    case HandlerEnum.CONTENT_MODE:
      return { contentMode: value };

    case HandlerEnum.SHOW_BREADCRUMB:
      return { showBreadCrumb: value };

    case HandlerEnum.SHOW_BREADCRUMB_ICON:
      return { showBreadCrumbIcon: value };

    case HandlerEnum.GRAY_MODE:
      updateGrayMode(value);
      return { grayMode: value };

    case HandlerEnum.SHOW_FOOTER:
      return { showFooter: value };

    case HandlerEnum.COLOR_WEAK:
      updateColorWeak(value);
      return { colorWeak: value };
    // 页面缓存
    case HandlerEnum.OPEN_KEEP_ALIVE:
      return { openKeepAlive: value };

    case HandlerEnum.SHOW_LOGO:
      return { showLogo: value };

    // ============tabs==================
    case HandlerEnum.TABS_SHOW_QUICK:
      return { multiTabsSetting: { showQuick: value } };

    case HandlerEnum.TABS_SHOW:
      return { multiTabsSetting: { show: value } };
    case HandlerEnum.TABS_SHOW_ICON:
      return { multiTabsSetting: { showIcon: value } };

    case HandlerEnum.TABS_SHOW_REDO:
      return { multiTabsSetting: { showRedo: value } };

    case HandlerEnum.TABS_SHOW_FOLD:
      return { multiTabsSetting: { showFold: value } };

    // ============header==================
    case HandlerEnum.HEADER_THEME:
      updateHeaderBgColor(value);
      return { headerSetting: { bgColor: value } };

    case HandlerEnum.HEADER_SEARCH:
      return { headerSetting: { showSearch: value } };

    case HandlerEnum.HEADER_FIXED:
      return { headerSetting: { fixed: value } };

    case HandlerEnum.HEADER_SHOW:
      return { headerSetting: { show: value } };
    default:
      return {};
  }
}
