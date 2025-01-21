<template>
  <div :class="bem('header')">
    <BasicCaption :helpMessage="helpMessage" :content="title" class="px-10px">
      <template #content v-if="slots.headerTitle">
        <slot name="headerTitle"></slot>
      </template>
      <template #action>
        <div class="flex items-center flex-1 cursor-pointer justify-self-stretch" v-if="showToolbar || dropDownActions.length">
          <Dropdown @click.prevent>
            <i class="icon-ym icon-ym-mpMenu"></i>
            <template #overlay>
              <Menu>
                <template v-if="showToolbar">
                  <template v-for="item in toolbarList" :key="item.value">
                    <MenuItem v-bind="{ key: item.value }" @click="handleMenuClick(item)">
                      {{ item.label }}
                    </MenuItem>
                    <MenuDivider v-if="item.divider" />
                  </template>
                </template>
                <template v-if="dropDownActions.length">
                  <MenuItem v-for="(item, i) in dropDownActions" :key="i" @click="handleMenuClick(item)">
                    {{ item.label }}
                  </MenuItem>
                </template>
              </Menu>
            </template>
          </Dropdown>
        </div>
      </template>
    </BasicCaption>
  </div>
</template>
<script lang="ts" setup>
  import { computed, useSlots } from 'vue';
  import { Dropdown, Menu, MenuItem, MenuDivider } from 'ant-design-vue';
  import { BasicCaption } from '@/components/Basic';
  import { useI18n } from '@/hooks/web/useI18n';
  import { createBEM } from '@/utils/bem';
  import { ToolbarEnum, DropDownActionItem } from '../types/tree';

  const [bem] = createBEM('basic-left-tree');

  const props = defineProps({
    helpMessage: {
      type: [String, Array] as PropType<string | string[]>,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    showToolbar: {
      type: Boolean,
      default: false,
    },
    checkable: {
      type: Boolean,
      default: false,
    },
    search: {
      type: Boolean,
      default: false,
    },
    searchText: {
      type: String,
      default: '',
    },
    checkAll: {
      type: Function,
      default: undefined,
    },
    expandAll: {
      type: Function,
      default: undefined,
    },
    dropDownActions: {
      type: Array as PropType<DropDownActionItem[]>,
      default: () => [],
    },
    isAsync: {
      type: Boolean,
      default: false,
    },
  } as const);
  const emit = defineEmits(['strictly-change', 'reload', 'clearSearch']);

  const slots = useSlots();
  const { t } = useI18n();

  const toolbarList = computed(() => {
    const { checkable } = props;
    const defaultToolbarList = [
      { label: t('component.tree.reload'), value: ToolbarEnum.RELOAD },
      { label: t('component.tree.expandAll'), value: ToolbarEnum.EXPAND_ALL },
      {
        label: t('component.tree.unExpandAll'),
        value: ToolbarEnum.UN_EXPAND_ALL,
        divider: checkable,
      },
    ];

    let list = checkable
      ? [
          { label: t('component.tree.selectAll'), value: ToolbarEnum.SELECT_ALL },
          {
            label: t('component.tree.unSelectAll'),
            value: ToolbarEnum.UN_SELECT_ALL,
            divider: checkable,
          },
          ...defaultToolbarList,
          { label: t('component.tree.checkStrictly'), value: ToolbarEnum.CHECK_STRICTLY },
          { label: t('component.tree.checkUnStrictly'), value: ToolbarEnum.CHECK_UN_STRICTLY },
        ]
      : defaultToolbarList;

    // 异步情况下，去掉全部展开和刷新数据
    if (props.isAsync) list = list.filter(o => o.value !== ToolbarEnum.EXPAND_ALL && o.value !== ToolbarEnum.RELOAD);
    return list;
  });

  function handleMenuClick(e) {
    const { value } = e;
    switch (value) {
      case ToolbarEnum.RELOAD:
        emit('reload');
        break;
      case ToolbarEnum.SELECT_ALL:
        props.checkAll?.(true);
        break;
      case ToolbarEnum.UN_SELECT_ALL:
        props.checkAll?.(false);
        break;
      case ToolbarEnum.EXPAND_ALL:
        emit('clearSearch');
        props.expandAll?.(true);
        break;
      case ToolbarEnum.UN_EXPAND_ALL:
        emit('clearSearch');
        props.expandAll?.(false);
        break;
      case ToolbarEnum.CHECK_STRICTLY:
        emit('strictly-change', false);
        break;
      case ToolbarEnum.CHECK_UN_STRICTLY:
        emit('strictly-change', true);
        break;
      default:
        e.onClick?.();
        break;
    }
  }
</script>
