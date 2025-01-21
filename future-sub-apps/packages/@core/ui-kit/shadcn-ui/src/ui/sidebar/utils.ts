import type { ComputedRef, Ref } from 'vue';

import { createContext } from 'radix-vue';

export const SIDEBAR_COOKIE_NAME = 'sidebar:state';
export const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
export const SIDEBAR_WIDTH = '16rem';
export const SIDEBAR_WIDTH_MOBILE = '18rem';
export const SIDEBAR_WIDTH_ICON = '3rem';
export const SIDEBAR_KEYBOARD_SHORTCUT = 'b';

export const [useSidebar, provideSidebarContext] = createContext<{
  isMobile: Ref<boolean>;
  open: Ref<boolean>;
  openMobile: Ref<boolean>;
  setOpen: (value: boolean) => void;
  setOpenMobile: (value: boolean) => void;
  state: ComputedRef<'collapsed' | 'expanded'>;
  toggleSidebar: () => void;
}>('Sidebar');
