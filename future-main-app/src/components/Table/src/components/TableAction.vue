<template>
  <a-space :class="[prefixCls, getAlign]" @click="onCellClick">
    <template v-for="(action, index) in getActions">
      <Tooltip v-if="action.tooltip" v-bind="getTooltip(action.tooltip)" :key="`${index}-${action.label}`">
        <template v-if="action.modelConfirm">
          <ModelConfirmButton v-bind="action">
            <i :class="[action.icon, { 'mr-5px': !!action.label }]" v-if="action.icon"></i>
            <template v-if="action.label">{{ action.label }}</template>
          </ModelConfirmButton>
        </template>
        <template v-else>
          <PopConfirmButton v-bind="action">
            <i :class="[action.icon, { 'mr-5px': !!action.label }]" v-if="action.icon"></i>
            <template v-if="action.label">{{ action.label }}</template>
          </PopConfirmButton>
        </template>
      </Tooltip>
      <template v-else>
        <template v-if="action.modelConfirm">
          <ModelConfirmButton v-bind="action" :key="`${index}-${action.label}`">
            <i :class="[action.icon, { 'mr-5px': !!action.label }]" v-if="action.icon"></i>
            <template v-if="action.label">{{ action.label }}</template>
          </ModelConfirmButton>
        </template>
        <template v-else>
          <PopConfirmButton v-bind="action" :key="`${index}-${action.label}`">
            <i :class="[action.icon, { 'mr-5px': !!action.label }]" v-if="action.icon"></i>
            <template v-if="action.label">{{ action.label }}</template>
          </PopConfirmButton>
        </template>
      </template>
      <!-- <Divider type="vertical" class="action-divider" v-if="divider && index < getActions.length - 1" /> -->
    </template>
    <Dropdown :trigger="['hover']" :dropMenuList="getDropdownList" v-if="dropDownActions && getDropdownList.length > 0">
      <slot name="more"></slot>
      <a-button type="link" size="small" v-if="!$slots.more">
        {{ t('common.moreText') }}
        <DownOutlined class="icon-more" />
      </a-button>
    </Dropdown>
  </a-space>
</template>
<script lang="ts">
  import { defineComponent, PropType, computed, toRaw, unref } from 'vue';
  import { DownOutlined } from '@ant-design/icons-vue';
  import { Divider, Tooltip, TooltipProps, Space } from 'ant-design-vue';
  import { ActionItem, TableActionType } from '@/components/Table';
  import { PopConfirmButton, ModelConfirmButton } from '@/components/Button';
  import { Dropdown } from '@/components/Dropdown';
  import { useDesign } from '@/hooks/web/useDesign';
  import { useTableContext } from '../hooks/useTableContext';
  import { usePermission } from '@/hooks/web/usePermission';
  import { isBoolean, isFunction, isString } from '@/utils/is';
  import { propTypes } from '@/utils/propTypes';
  import { ACTION_COLUMN_FLAG } from '../const';
  import { useI18n } from '@/hooks/web/useI18n';

  export default defineComponent({
    name: 'TableAction',
    components: { PopConfirmButton, ModelConfirmButton, Divider, Dropdown, DownOutlined, Tooltip, ASpace: Space },
    props: {
      actions: {
        type: Array as PropType<ActionItem[]>,
        default: null,
      },
      dropDownActions: {
        type: Array as PropType<ActionItem[]>,
        default: null,
      },
      divider: propTypes.bool.def(true),
      outside: propTypes.bool,
      stopButtonPropagation: propTypes.bool.def(false),
    },
    setup(props) {
      const { prefixCls } = useDesign('basic-table-action');
      const { t } = useI18n();
      let table: Partial<TableActionType> = {};
      if (!props.outside) {
        table = useTableContext();
      }

      const { hasBtnP } = usePermission();
      function isIfShow(action: ActionItem): boolean {
        const ifShow = action.ifShow;

        let isIfShow = true;

        if (isBoolean(ifShow)) {
          isIfShow = ifShow;
        }
        if (isFunction(ifShow)) {
          isIfShow = ifShow(action);
        }
        return isIfShow;
      }

      const getActions = computed(() => {
        return (toRaw(props.actions) || [])
          .filter(action => {
            return hasBtnP(action.auth) && isIfShow(action);
          })
          .map(action => {
            const { popConfirm } = action;
            return {
              getPopupContainer: () => unref((table as any)?.wrapRef) ?? document.body,
              type: 'link',
              size: 'small',
              ...action,
              ...(popConfirm || {}),
              onConfirm: popConfirm?.confirm,
              onCancel: popConfirm?.cancel,
              enable: !!popConfirm,
            };
          });
      });
      const getDropdownList = computed((): any[] => {
        const list = (toRaw(props.dropDownActions) || []).filter(action => {
          return hasBtnP(action.auth) && isIfShow(action);
        });
        return list.map((action, index) => {
          const { label, popConfirm } = action;
          return {
            ...action,
            ...popConfirm,
            onConfirm: popConfirm?.confirm,
            onCancel: popConfirm?.cancel,
            text: label,
            divider: index < list.length - 1 ? props.divider : false,
          };
        });
      });

      const getAlign = computed(() => {
        const columns = (table as TableActionType)?.getColumns?.() || [];
        const actionColumn = columns.find(item => item.flag === ACTION_COLUMN_FLAG);
        return actionColumn?.align ?? 'left';
      });

      function getTooltip(data: string | TooltipProps): TooltipProps {
        return {
          getPopupContainer: () => unref((table as any)?.wrapRef) ?? document.body,
          placement: 'bottom',
          ...(isString(data) ? { title: data } : data),
        };
      }

      function onCellClick(e: MouseEvent) {
        if (!props.stopButtonPropagation) return;
        const path = e.composedPath() as HTMLElement[];
        const isInButton = path.find(ele => {
          return ele.tagName?.toUpperCase() === 'BUTTON';
        });
        isInButton && e.stopPropagation();
      }

      return { t, prefixCls, getActions, getDropdownList, getAlign, onCellClick, getTooltip };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-basic-table-action';

  .@{prefix-cls} {
    display: flex;
    align-items: center;

    .action-divider {
      display: table;
    }

    &.left {
      justify-content: flex-start;
    }

    &.center {
      justify-content: center;
    }

    &.right {
      justify-content: flex-end;
    }
    .ant-btn {
      padding: 0;
    }

    button {
      display: flex;
      align-items: center;

      span {
        margin-left: 0 !important;
      }
      i {
        font-size: 14px;
      }
    }

    button.ant-btn-circle {
      span {
        margin: auto !important;
      }
    }

    .ant-divider,
    .ant-divider-vertical {
      margin: 0 2px;
    }

    .icon-more {
      margin-left: 5px !important;
    }
  }
</style>
