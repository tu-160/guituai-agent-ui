import { withInstall } from '@/utils';
import basicPopup from './src/BasicPopup.vue';

export const BasicPopup = withInstall(basicPopup);
export * from './src/typing';
export { usePopup, usePopupInner } from './src/usePopup';
