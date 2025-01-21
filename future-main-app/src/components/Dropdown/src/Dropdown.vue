<template>
  <a-dropdown :trigger="trigger" v-bind="$attrs">
    <span>
      <slot></slot>
    </span>
    <template #overlay>
      <a-menu :selectedKeys="selectedKeys">
        <template v-for="item in dropMenuList" :key="`${item.event}`">
          <a-menu-item v-bind="getAttr(item.event)" @click="handleClickMenu(item)" :disabled="item.disabled">
            <a-popconfirm v-if="popconfirm && item.popConfirm" v-bind="getPopConfirmAttrs(item.popConfirm)">
              <template #icon v-if="item.popConfirm.icon">
                <i :class="item.popConfirm.icon"></i>
              </template>
              <div>
                <i :class="item.icon" v-if="item.icon"></i>
                <span class="ml-1">{{ item.text }}</span>
              </div>
            </a-popconfirm>
            <template v-else>
              <i :class="item.icon" v-if="item.icon"></i>
              <span class="ml-1">{{ item.text }}</span>
            </template>
          </a-menu-item>
          <a-menu-divider v-if="item.divider" :key="`d-${item.event}`" />
        </template>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script lang="ts" setup>
  import { computed, PropType } from 'vue';
  import type { DropMenu } from './typing';
  import { Dropdown, Menu, Popconfirm } from 'ant-design-vue';
  import { omit } from 'lodash-es';
  import { isFunction } from '@/utils/is';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useI18n } from '@/hooks/web/useI18n';

  const ADropdown = Dropdown;
  const AMenu = Menu;
  const AMenuItem = Menu.Item;
  const AMenuDivider = Menu.Divider;
  const APopconfirm = Popconfirm;
  const { createConfirm } = useMessage();
  const { t } = useI18n();

  const props = defineProps({
    popconfirm: Boolean,
    /**
     * the trigger mode which executes the drop-down action
     * @default ['hover']
     * @type string[]
     */
    trigger: {
      type: Array as PropType<('contextmenu' | 'click' | 'hover')[]>,
      default: () => {
        return ['contextmenu'];
      },
    },
    dropMenuList: {
      type: Array as PropType<(DropMenu & Recordable)[]>,
      default: () => [],
    },
    selectedKeys: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
  });

  const emit = defineEmits(['menuEvent']);

  function handleClickMenu(item) {
    const { event } = item;
    const menu = props.dropMenuList.find(item => `${item.event}` === `${event}`);
    emit('menuEvent', menu);
    if (item.modelConfirm) {
      createConfirm({
        iconType: item.modelConfirm?.iconType || 'warning',
        title: item.modelConfirm?.title || t('common.tipTitle'),
        content: item.modelConfirm?.content || t('common.delTip'),
        onOk: item.modelConfirm?.onOk,
      });
    } else {
      !props.popconfirm && item.onClick?.();
    }
  }

  const getPopConfirmAttrs = computed(() => {
    return attrs => {
      const originAttrs = omit(attrs, ['confirm', 'cancel', 'icon']);
      if (!attrs.onConfirm && attrs.confirm && isFunction(attrs.confirm)) originAttrs['onConfirm'] = attrs.confirm;
      if (!attrs.onCancel && attrs.cancel && isFunction(attrs.cancel)) originAttrs['onCancel'] = attrs.cancel;
      return originAttrs;
    };
  });

  const getAttr = (key: string | number) => ({ key });
</script>
