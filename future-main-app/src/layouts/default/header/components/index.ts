import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';
import FullScreen from './FullScreen.vue';
import Notify from './Notify.vue';

export const UserDropDown = createAsyncComponent(() => import('./user-dropdown/index.vue'), {
  loading: true,
});

export const LayoutBreadcrumb = createAsyncComponent(() => import('./Breadcrumb.vue'));

export const ErrorAction = createAsyncComponent(() => import('./ErrorAction.vue'));

export { FullScreen, Notify };
