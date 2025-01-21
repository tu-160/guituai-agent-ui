import sidebarImg from '@/assets/images/settings/sidebar.png';
import topMenuImg from '@/assets/images/settings/topMenu.png';
import mixSidebarImg from '@/assets/images/settings/mixSidebar.png';
import sidebarHLImg from '@/assets/images/settings/sidebarHL.png';
import topMenuHLImg from '@/assets/images/settings/topMenuHL.png';
import mixSidebarHLImg from '@/assets/images/settings/mixSidebarHL.png';
import defaultBg from '@/assets/images/settings/defaultBg.png';
import blueBg from '@/assets/images/settings/blueBg.png';
import purpleBg from '@/assets/images/settings/purpleBg.png';
import greenBg from '@/assets/images/settings/greenBg.png';
import { ContentEnum, RouterTransitionEnum } from '@/enums/appEnum';
import { MenuModeEnum, MenuTypeEnum, TopMenuAlignEnum, TriggerEnum, MixSidebarTriggerEnum, SysBgEnum } from '@/enums/menuEnum';

import { useI18n } from '@/hooks/web/useI18n';

const { t } = useI18n();

export enum HandlerEnum {
  CHANGE_LAYOUT,
  CHANGE_THEME_COLOR,
  CHANGE_THEME,
  CHANGE_SYS_BG,
  // menu
  MENU_HAS_DRAG,
  MENU_ACCORDION,
  MENU_TRIGGER,
  MENU_TOP_ALIGN,
  MENU_COLLAPSED,
  MENU_COLLAPSED_SHOW_TITLE,
  MENU_WIDTH,
  MENU_SHOW_SIDEBAR,
  MENU_THEME,
  MENU_SPLIT,
  MENU_FIXED,
  MENU_CLOSE_MIX_SIDEBAR_ON_CHANGE,
  MENU_TRIGGER_MIX_SIDEBAR,
  MENU_FIXED_MIX_SIDEBAR,

  // header
  HEADER_SHOW,
  HEADER_THEME,
  HEADER_FIXED,

  HEADER_SEARCH,
  HEADER_LOCALE,

  TABS_SHOW_QUICK,
  TABS_SHOW_REDO,
  TABS_SHOW,
  TABS_SHOW_ICON,
  TABS_SHOW_FOLD,

  LOCK_TIME,
  FULL_CONTENT,
  CONTENT_MODE,
  SHOW_BREADCRUMB,
  SHOW_BREADCRUMB_ICON,
  GRAY_MODE,
  COLOR_WEAK,
  SHOW_LOGO,
  SHOW_FOOTER,

  ROUTER_TRANSITION,
  OPEN_PROGRESS,
  OPEN_PAGE_LOADING,
  OPEN_ROUTE_TRANSITION,
  OPEN_KEEP_ALIVE,
}

export const contentModeOptions = [
  {
    value: ContentEnum.FULL,
    label: t('layout.setting.contentModeFull'),
  },
  {
    value: ContentEnum.FIXED,
    label: t('layout.setting.contentModeFixed'),
  },
];

export const topMenuAlignOptions = [
  {
    value: TopMenuAlignEnum.CENTER,
    label: t('layout.setting.topMenuAlignRight'),
  },
  {
    value: TopMenuAlignEnum.START,
    label: t('layout.setting.topMenuAlignLeft'),
  },
  {
    value: TopMenuAlignEnum.END,
    label: t('layout.setting.topMenuAlignCenter'),
  },
];

export const getMenuTriggerOptions = (hideTop: boolean) => {
  return [
    {
      value: TriggerEnum.NONE,
      label: t('layout.setting.menuTriggerNone'),
    },
    {
      value: TriggerEnum.FOOTER,
      label: t('layout.setting.menuTriggerBottom'),
    },
    ...(hideTop
      ? []
      : [
          {
            value: TriggerEnum.HEADER,
            label: t('layout.setting.menuTriggerTop'),
          },
        ]),
  ];
};

export const routerTransitionOptions = [
  RouterTransitionEnum.ZOOM_FADE,
  RouterTransitionEnum.FADE,
  RouterTransitionEnum.ZOOM_OUT,
  RouterTransitionEnum.FADE_SIDE,
  RouterTransitionEnum.FADE_BOTTOM,
  RouterTransitionEnum.FADE_SCALE,
].map(item => {
  return {
    label: item,
    value: item,
  };
});

export const menuTypeList = [
  {
    title: t('layout.setting.menuTypeSidebar'),
    mode: MenuModeEnum.INLINE,
    type: MenuTypeEnum.SIDEBAR,
    img: sidebarImg,
    activeImg: sidebarHLImg,
  },
  {
    title: t('layout.setting.menuTypeTopMenu'),
    mode: MenuModeEnum.HORIZONTAL,
    type: MenuTypeEnum.TOP_MENU,
    img: topMenuImg,
    activeImg: topMenuHLImg,
  },
  {
    title: t('layout.setting.menuTypeMixSidebar'),
    mode: MenuModeEnum.INLINE,
    type: MenuTypeEnum.MIX_SIDEBAR,
    img: mixSidebarImg,
    activeImg: mixSidebarHLImg,
  },
];

export const sysBgList = [
  {
    title: t('layout.setting.defaultBg'),
    type: SysBgEnum.DEFAULT,
    img: defaultBg,
    activeImg: defaultBg,
  },
  {
    title: t('layout.setting.blueBg'),
    type: SysBgEnum.BLUE,
    img: blueBg,
    activeImg: blueBg,
  },
  {
    title: t('layout.setting.purpleBg'),
    type: SysBgEnum.PURPLE,
    img: purpleBg,
    activeImg: purpleBg,
  },
  {
    title: t('layout.setting.greenBg'),
    type: SysBgEnum.GREEN,
    img: greenBg,
    activeImg: greenBg,
  },
];

export const mixSidebarTriggerOptions = [
  {
    value: MixSidebarTriggerEnum.HOVER,
    label: t('layout.setting.triggerHover'),
  },
  {
    value: MixSidebarTriggerEnum.CLICK,
    label: t('layout.setting.triggerClick'),
  },
];
