<template>
  <MenuItem :name="item.path" v-if="!menuHasChildren(item) && getShowMenu" v-bind="$props" :class="getLevelClass">
    <span :class="getIcon" v-if="getIcon"></span>
    <div v-if="collapsedShowTitle && getIsCollapseParent" class="mt-1 collapse-title">{{ getI18nName }} </div>
    <template #title>
      <span :class="['ml-2', `${prefixCls}-sub-title`]">{{ getI18nName }} </span>
      <SimpleMenuTag :item="item" :collapseParent="getIsCollapseParent" />
    </template>
  </MenuItem>
  <SubMenu :name="item.path" v-if="menuHasChildren(item) && getShowMenu" :class="[getLevelClass, theme]" :collapsedShowTitle="collapsedShowTitle">
    <template #title>
      <span :class="getIcon" v-if="getIcon"></span>
      <div v-if="collapsedShowTitle && getIsCollapseParent" class="mt-2 collapse-title">{{ getI18nName }} </div>
      <span v-show="getShowSubTitle" :class="['ml-2', `${prefixCls}-sub-title`]"> {{ getI18nName }} </span>
      <SimpleMenuTag :item="item" :collapseParent="!!collapse && !!parent" />
    </template>
    <template v-for="childrenItem in item.children || []" :key="childrenItem.path">
      <SimpleSubMenu v-bind="$props" :item="childrenItem" :parent="false" />
    </template>
  </SubMenu>
</template>
<script lang="ts">
  import type { PropType } from 'vue';
  import type { Menu } from '@/router/types';

  import { defineComponent, computed } from 'vue';
  import { useDesign } from '@/hooks/web/useDesign';
  import Icon from '@/components/Icon/index';

  import MenuItem from './components/MenuItem.vue';
  import SubMenu from './components/SubMenuItem.vue';
  import { propTypes } from '@/utils/propTypes';
  import { useI18n } from '@/hooks/web/useI18n';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';

  export default defineComponent({
    name: 'SimpleSubMenu',
    components: {
      SubMenu,
      MenuItem,
      SimpleMenuTag: createAsyncComponent(() => import('./SimpleMenuTag.vue')),
      Icon,
    },
    props: {
      item: {
        type: Object as PropType<Menu>,
        default: () => ({}),
      },
      parent: propTypes.bool,
      collapsedShowTitle: propTypes.bool,
      collapse: propTypes.bool,
      theme: propTypes.oneOf(['dark', 'light']),
    },
    setup(props) {
      const { t } = useI18n();
      const { prefixCls } = useDesign('simple-menu');

      const getShowMenu = computed(() => true);
      const getIcon = computed(() => props.item?.icon);
      const getI18nName = computed(() => t('routes.' + props.item?.enCode.replace(/\./g, '-'), props.item?.fullName));
      const getShowSubTitle = computed(() => !props.collapse || !props.parent);
      const getIsCollapseParent = computed(() => !!props.collapse && !!props.parent);
      const getLevelClass = computed(() => {
        return [
          {
            [`${prefixCls}__parent`]: props.parent,
            [`${prefixCls}__children`]: !props.parent,
          },
        ];
      });

      function menuHasChildren(menuTreeItem: Menu): boolean {
        return Reflect.has(menuTreeItem, 'children') && !!menuTreeItem.children && menuTreeItem.children.length > 0;
      }

      return {
        prefixCls,
        menuHasChildren,
        getShowMenu,
        getIcon,
        getI18nName,
        getShowSubTitle,
        getLevelClass,
        getIsCollapseParent,
      };
    },
  });
</script>
