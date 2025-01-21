/**
 * Global authority directive
 * Used for fine-grained control of component permissions
 * @Example v-auth="'btn-edit'"
 */
import type { App, Directive, DirectiveBinding } from 'vue';
import { useUserStoreWithOut } from '@/store/modules/user';

function hasBtnP(modelId, value?: string): boolean {
  if (!value) return true;
  if (!modelId) return false;
  const userStore = useUserStoreWithOut();
  const permissionList = userStore.getPermissionList;
  const list = permissionList.filter(o => o.modelId === modelId);
  if (!list.length) return false;
  const btnList = list[0] && list[0].button ? list[0].button : [];
  if (!btnList.length) return false;
  const hasPermission = btnList.some(btn => btn.enCode === value);
  if (hasPermission) return true;
  return false;
}

function isAuth(el: Element, binding: any, VNode) {
  const value = binding.value;
  const modelId = VNode.ctx.proxy.$route.meta.modelId || '';
  if (!value) return;
  if (!hasBtnP(modelId, value)) {
    el.parentNode?.removeChild(el);
  }
}

const mounted = (el: Element, binding: DirectiveBinding<any>, VNode) => {
  isAuth(el, binding, VNode);
};

const authDirective: Directive = {
  mounted,
};

export function setupPermissionDirective(app: App) {
  app.directive('auth', authDirective);
}

export default authDirective;
