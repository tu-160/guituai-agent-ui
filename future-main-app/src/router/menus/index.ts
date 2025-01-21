import type { Menu } from '@/router/types';
import { usePermissionStore } from '@/store/modules/permission';
import { getAllParentPath } from '@/router/helper/menuHelper';

async function getAsyncMenus() {
  const permissionStore = usePermissionStore();
  //递归过滤所有隐藏的菜单
  const menuFilter = items => {
    return items.filter(item => {
      const show = !item.meta?.hideMenu && !item.hideMenu;
      if (show && item.children) {
        item.children = menuFilter(item.children);
      }
      return show;
    });
  };
  return menuFilter(permissionStore.getMenuList);
}

export const getMenus = async (): Promise<Menu[]> => {
  const menus = await getAsyncMenus();
  return menus;
};

export async function getCurrentParentPath(currentPath: string) {
  const menus = await getAsyncMenus();
  const allParentPath = await getAllParentPath(menus, currentPath);
  return allParentPath?.[0];
}

// Get the level 1 menu, delete children
export async function getShallowMenus(): Promise<Menu[]> {
  const menus = await getAsyncMenus();
  const shallowMenuList = menus.map(item => ({ ...item, children: undefined }));
  return shallowMenuList;
}

// Get the children of the menu
export async function getChildrenMenus(parentPath: string) {
  const menus = await getMenus();
  const parent = menus.find(item => item.path === parentPath);
  if (!parent || !parent.children) {
    return [] as Menu[];
  }
  return parent.children;
}
