<script lang="tsx">
  import type { ContextMenuItem, ItemContentProps, Axis } from './typing';
  import type { FunctionalComponent, CSSProperties, PropType } from 'vue';
  import { defineComponent, nextTick, onMounted, computed, ref, unref, onUnmounted } from 'vue';
  import Icon from '@/components/Icon';
  import { Menu, Divider } from 'ant-design-vue';

  const prefixCls = 'context-menu';

  const props = {
    width: { type: Number, default: 120 },
    customEvent: { type: Object as PropType<Event>, default: null },
    styles: { type: Object as PropType<CSSProperties> },
    showIcon: { type: Boolean, default: true },
    axis: {
      // The position of the right mouse button click
      type: Object as PropType<Axis>,
      default() {
        return { x: 0, y: 0 };
      },
    },
    items: {
      // The most important list, if not, will not be displayed
      type: Array as PropType<ContextMenuItem[]>,
      default() {
        return [];
      },
    },
  };

  const ItemContent: FunctionalComponent<ItemContentProps> = props => {
    const { item } = props;
    return (
      <span style="display: inline-block; width: 100%; " class="px-4" onClick={props.handler.bind(null, item)}>
        {props.showIcon && item.icon && <Icon class="mr-2" icon={item.icon} />}
        <span>{item.label}</span>
      </span>
    );
  };

  export default defineComponent({
    name: 'ContextMenu',
    props,
    setup(props) {
      const wrapRef = ref(null);
      const showRef = ref(false);

      const getStyle = computed((): CSSProperties => {
        const { axis, items, styles, width } = props;
        const { x, y } = axis || { x: 0, y: 0 };
        const menuHeight = (items || []).length * 40;
        const menuWidth = width;
        const body = document.body;

        const left = body.clientWidth < x + menuWidth ? x - menuWidth : x;
        const top = body.clientHeight < y + menuHeight ? y - menuHeight : y;
        return {
          ...styles,
          position: 'absolute',
          width: `${width}px`,
          left: `${left + 1}px`,
          top: `${top + 1}px`,
          zIndex: 9999,
        };
      });

      onMounted(() => {
        nextTick(() => (showRef.value = true));
      });

      onUnmounted(() => {
        const el = unref(wrapRef);
        el && document.body.removeChild(el);
      });

      function handleAction(item: ContextMenuItem, e: MouseEvent) {
        const { handler, disabled } = item;
        if (disabled) {
          return;
        }
        showRef.value = false;
        e?.stopPropagation();
        e?.preventDefault();
        handler?.();
      }

      function renderMenuItem(items: ContextMenuItem[]) {
        const visibleItems = items.filter(item => !item.hidden);
        return visibleItems.map(item => {
          const { disabled, label, children, divider = false } = item;

          const contentProps = {
            item,
            handler: handleAction,
            showIcon: props.showIcon,
          };

          if (!children || children.length === 0) {
            return (
              <>
                <Menu.Item disabled={disabled} class={`${prefixCls}__item`} key={label}>
                  <ItemContent {...contentProps} />
                </Menu.Item>
                {divider ? <Divider key={`d-${label}`} /> : null}
              </>
            );
          }
          if (!unref(showRef)) return null;

          return (
            <Menu.SubMenu key={label} disabled={disabled} popupClassName={`${prefixCls}__popup`}>
              {{
                title: () => <ItemContent {...contentProps} />,
                default: () => renderMenuItem(children),
              }}
            </Menu.SubMenu>
          );
        });
      }
      return () => {
        if (!unref(showRef)) {
          return null;
        }
        const { items } = props;
        return (
          <div class={prefixCls}>
            <Menu inlineIndent={12} mode="vertical" ref={wrapRef} style={unref(getStyle)} class="context-menu-main">
              {renderMenuItem(items)}
            </Menu>
          </div>
        );
      };
    },
  });
</script>
<style lang="less">
  @default-height: 30px !important;

  @small-height: 30px !important;

  @large-height: 30px !important;

  .item-style() {
    li {
      display: inline-block;
      width: 100%;
      height: @default-height;
      margin: 0 !important;
      line-height: @default-height;

      span {
        line-height: @default-height;
        font-size: 12px;
      }

      > div {
        margin: 0 !important;
      }

      &:not(.ant-menu-item-disabled):hover {
        color: @text-color-base;
        background-color: @item-hover-bg;
      }
    }
  }

  .context-menu {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1001;
    display: block;
    width: 120px;
    margin: 0;
    list-style: none;
    background-color: @component-background;
    border: 1px solid rgb(0 0 0 / 8%);
    border-radius: 0.25rem;
    box-shadow: 0 2px 2px 0 rgb(0 0 0 / 14%), 0 3px 1px -2px rgb(0 0 0 / 10%), 0 1px 5px 0 rgb(0 0 0 / 6%);
    background-clip: padding-box;
    user-select: none;

    &__item {
      margin: 0 !important;
    }
    .item-style();

    .ant-divider {
      margin: 0;
    }

    &__popup {
      .ant-divider {
        margin: 0;
      }

      .item-style();
    }

    .ant-menu-submenu-title,
    .ant-menu-item {
      padding: 0 !important;
    }
    .context-menu-main {
      box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05) !important;
    }
  }
</style>
