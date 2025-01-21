<script lang="tsx">
  import draggable from 'vuedraggable';
  import { defineComponent } from 'vue';
  import { CopyOutlined, DeleteOutlined } from '@ant-design/icons-vue';
  import render from './helper/render';
  import { useI18n } from '@/hooks/web/useI18n';

  interface AttrsType {
    onActiveItem: (element) => void;
    onCopyItem: (element, parent) => void;
    onDeleteItem: (index, parent) => void;
    put: (...args: unknown[]) => void;
    end: (...args: unknown[]) => void;
    onAddRow: (element) => void;
    onAddCol: (element) => void;
  }

  export default defineComponent({
    inheritAttrs: false,
    components: {
      CopyOutlined,
      DeleteOutlined,
      draggable,
      render,
    },
    props: ['element', 'index', 'drawingList', 'activeId', 'formConf', 'showType'],

    setup(props, { attrs }) {
      const { t } = useI18n();
      let activeData = {};
      const useCompList = ['text', 'link', 'alert', 'groupTitle', 'button', 'barcode', 'qrcode'];

      const components = {
        itemBtns(element, index, parent, isTableGrid = false) {
          const gutter = element.__config__?.layout === 'colFormItem' && props.formConf?.gutter ? props.formConf.gutter : 0;
          const rightDistance = gutter;
          const { onCopyItem, onDeleteItem } = attrs as unknown as AttrsType;
          const tableSetting = (element, isTableGrid) => {
            const { onAddRow, onAddCol } = attrs as unknown as AttrsType;
            if (!isTableGrid) return null;
            return [
              <span
                class="drawing-item-action-item drawing-item-add-row"
                title="插入行"
                onClick={event => {
                  onAddRow(element);
                  event.stopPropagation();
                }}>
                <i class="icon-ym icon-ym-generator-insertRow" />
              </span>,
              <span
                class=" drawing-item-action-item drawing-item-add-col"
                title="插入列"
                onClick={event => {
                  onAddCol(element);
                  event.stopPropagation();
                }}>
                <i class="icon-ym icon-ym-generator-insertCol" />
              </span>,
            ];
          };
          return (
            <div class="drawing-item-action" style={{ '--rightDistance': rightDistance + 10 + 'px' }}>
              {tableSetting(element, isTableGrid)}
              <span
                class="drawing-item-action-item drawing-item-copy"
                title={t('common.copyText')}
                onClick={event => {
                  onCopyItem(element, parent);
                  event.stopPropagation();
                }}>
                <copy-outlined />
              </span>
              <a-popconfirm
                title={t('formGenerator.delComponentTip')}
                class="drawing-item-action-item drawing-item-delete"
                onConfirm={_ => {
                  onDeleteItem(index, parent);
                }}>
                <span title={t('common.delText')}>
                  <delete-outlined />
                </span>
              </a-popconfirm>
            </div>
          );
        },
        cellSetting(element, rowIndex, colIndex) {
          const {
            onHandleTableSetting,
            onHandleShowMenu,
            mergeLeftColDisabled,
            mergeRightColDisabled,
            mergeWholeRowDisabled,
            mergeAboveRowDisabled,
            mergeBelowRowDisabled,
            mergeWholeColDisabled,
            undoMergeRowDisabled,
            undoMergeColDisabled,
            deleteWholeColDisabled,
            deleteWholeRowDisabled,
          } = attrs as unknown as any;

          const slots = {
            overlay: () => {
              return (
                <a-menu
                  onClick={({ key }) => {
                    onHandleTableSetting(key, element);
                  }}>
                  <a-menu-item key="1">插入左侧列</a-menu-item>
                  <a-menu-item key="2">插入右侧列</a-menu-item>
                  <a-menu-item key="3">插入上方行</a-menu-item>
                  <a-menu-item key="4">插入下方行</a-menu-item>
                  <a-menu-divider />
                  <a-menu-item key="5" disabled={mergeLeftColDisabled}>
                    向左合并
                  </a-menu-item>
                  <a-menu-item key="6" disabled={mergeRightColDisabled}>
                    向右合并
                  </a-menu-item>
                  <a-menu-item key="7" disabled={mergeWholeRowDisabled}>
                    合并整行
                  </a-menu-item>
                  <a-menu-divider />
                  <a-menu-item key="8" disabled={mergeAboveRowDisabled}>
                    向上合并
                  </a-menu-item>
                  <a-menu-item key="9" disabled={mergeBelowRowDisabled}>
                    向下合并
                  </a-menu-item>
                  <a-menu-item key="10" disabled={mergeWholeColDisabled}>
                    合并整列
                  </a-menu-item>
                  <a-menu-divider />
                  <a-menu-item key="11" disabled={undoMergeRowDisabled}>
                    撤销行合并
                  </a-menu-item>
                  <a-menu-item key="12" disabled={undoMergeColDisabled}>
                    撤销列合并
                  </a-menu-item>
                  <a-menu-divider />
                  <a-menu-item key="13" disabled={deleteWholeColDisabled}>
                    删除整列
                  </a-menu-item>
                  <a-menu-item key="14" disabled={deleteWholeRowDisabled}>
                    删除整行
                  </a-menu-item>
                </a-menu>
              );
            },
          };
          return [
            <span class="drawing-item-cell">
              <a-dropdown
                v-slots={slots}
                trigger="click"
                onOpenChange={visible => {
                  if (visible) onHandleShowMenu(element, rowIndex, colIndex);
                }}>
                <i class="icon-ym icon-ym-generator-TableSettings" />
              </a-dropdown>
            </span>,
          ];
        },
      };
      const layouts = {
        colFormItem(element, index, parent) {
          const { onActiveItem } = attrs as unknown as AttrsType;
          const config = element.__config__;
          const className = props.activeId === config.formId ? 'drawing-item active-from-item' : 'drawing-item';
          const globalLabelWidth = props.formConf.labelWidth;
          let labelCol = {};
          if (props.formConf.labelPosition !== 'top' && config.showLabel) {
            const labelWidth = (config.labelWidth || globalLabelWidth) + 'px';
            labelCol = { style: { width: labelWidth } };
          }
          if (config.futureKey == 'location') element.useAutoLocation = false;
          const Item =
            props.showType === 'app' && !useCompList.includes(config.futureKey) ? (
              <span>{element.__vModel__}</span>
            ) : (
              <render
                key={config.renderKey}
                conf={element}
                size={element.size ? element.size : props.formConf.size}
                onUpdate:value={event => {
                  config.defaultValue = event;
                }}
              />
            );
          let basicHelp: any = null;
          if (config.label && config.tipLabel) basicHelp = <BasicHelp text={config.tipLabel} />;
          const labelSuffix = !config.isSubTable && props.formConf.labelSuffix ? props.formConf.labelSuffix : '';
          const slots = {
            label: () => {
              if (!config.showLabel) return null;
              return (
                <span>
                  {config.label ? config.label + labelSuffix : ''}
                  {basicHelp}
                </span>
              );
            },
          };
          return (
            <a-col
              class={className}
              span={props.showType === 'app' ? 24 : config.span}
              data-draggable={true}
              draggable={false}
              onClick={event => {
                onActiveItem(element);
                event.stopPropagation();
              }}>
              <a-form-item v-slots={slots} required={config.required} labelCol={labelCol}>
                {Item}
              </a-form-item>
              {components.itemBtns(element, index, parent)}
            </a-col>
          );
        },
        rowFormItem(element, index, parent) {
          const { onActiveItem, put, end } = attrs as unknown as AttrsType;
          const config = element.__config__;
          const className = props.activeId === config.formId ? 'drawing-row-item active-from-item' : 'drawing-row-item';

          if (config.futureKey === 'tab') {
            return (
              <a-col
                span={props.showType === 'app' ? 24 : config.span}
                data-draggable={true}
                draggable={false}
                onClick={event => {
                  onActiveItem(element);
                  event.stopPropagation();
                }}>
                <a-row class={className}>
                  <a-tabs
                    type={element.type}
                    size={props.formConf.size}
                    tabPosition={props.showType === 'app' ? 'top' : element.tabPosition}
                    v-model:activeKey={config.active}>
                    {config.children.map(item => {
                      const group = { name: 'componentsGroup', put: (...arg) => put(...arg, item) };
                      const onEnd = (...arg) => end(...arg, activeData, item);
                      const slots = {
                        item: ({ element: childElement, index }) => {
                          return renderChildren(childElement, index, item.__config__.children);
                        },
                      };
                      let tip: JSX.Element | Element | null = null;
                      if (!item.__config__.children.length) {
                        tip = <div class="row-tip">请将组件拖到此区域(可拖多个组件)</div>;
                      }
                      return (
                        <a-tab-pane key={item.name} tab={item.title}>
                          <a-col>
                            {tip}
                            <a-row gutter={props.formConf.gutter || 15}>
                              <draggable
                                v-model={item.__config__.children}
                                v-slots={slots}
                                item-key="renderKey"
                                animation={300}
                                group={group}
                                onEnd={onEnd}
                                class="drag-wrapper"
                                style="padding-top:12px"></draggable>
                            </a-row>
                          </a-col>
                        </a-tab-pane>
                      );
                    })}
                  </a-tabs>
                  {components.itemBtns(element, index, parent)}
                </a-row>
              </a-col>
            );
          }

          if (config.futureKey === 'collapse') {
            return (
              <a-col
                span={props.showType === 'app' ? 24 : config.span}
                data-draggable={true}
                draggable={false}
                onClick={event => {
                  onActiveItem(element);
                  event.stopPropagation();
                }}>
                <a-row class={className}>
                  <a-collapse ghost={true} expandIconPosition="end" accordion={element.accordion} v-model:activeKey={config.active}>
                    {config.children.map(item => {
                      const group = { name: 'componentsGroup', put: (...arg) => put(...arg, item) };
                      const onEnd = (...arg) => end(...arg, activeData, item);
                      const slots = {
                        item: ({ element: childElement, index }) => {
                          return renderChildren(childElement, index, item.__config__.children);
                        },
                      };
                      let tip: JSX.Element | Element | null = null;
                      if (!item.__config__.children.length) {
                        tip = <div class="row-tip">请将组件拖到此区域(可拖多个组件)</div>;
                      }
                      return (
                        <a-collapse-panel key={item.name} header={item.title}>
                          <a-col>
                            {tip}
                            <a-row gutter={props.formConf.gutter || 15}>
                              <draggable
                                v-model={item.__config__.children}
                                v-slots={slots}
                                item-key="renderKey"
                                animation={300}
                                group={group}
                                onEnd={onEnd}
                                class="drag-wrapper"></draggable>
                            </a-row>
                          </a-col>
                        </a-collapse-panel>
                      );
                    })}
                  </a-collapse>
                  {components.itemBtns(element, index, parent)}
                </a-row>
              </a-col>
            );
          }

          if (config.futureKey === 'steps') {
            return (
              <a-col
                span={props.showType === 'app' ? 24 : config.span}
                data-draggable={true}
                draggable={false}
                onClick={event => {
                  onActiveItem(element);
                  event.stopPropagation();
                }}>
                <a-row class={className}>
                  <div class="w-full p-10px">
                    <a-steps
                      size={props.formConf.size}
                      type={element.simple ? 'navigation' : 'default'}
                      status={element.processStatus}
                      v-model:current={config.active}>
                      {config.children.map(item => {
                        const slots: any = {};
                        if (item.icon) slots.icon = () => <span class={item.icon + ' custom-icon'}></span>;
                        return <a-step title={item.title} v-slots={slots} />;
                      })}
                    </a-steps>
                    {config.children.map((item, childIndex) => {
                      const group = { name: 'componentsGroup', put: (...arg) => put(...arg, item) };
                      const onEnd = (...arg) => end(...arg, activeData, item);
                      const slots = {
                        item: ({ element: childElement, index }) => {
                          return renderChildren(childElement, index, item.__config__.children);
                        },
                      };
                      let tip: JSX.Element | Element | null = null;
                      if (!item.__config__.children.length) {
                        tip = <div class="row-tip">请将组件拖到此区域(可拖多个组件)</div>;
                      }
                      if (config.active != childIndex) return null;
                      return (
                        <a-col>
                          {tip}
                          <a-row gutter={props.formConf.gutter || 15}>
                            <draggable
                              v-model={item.__config__.children}
                              v-slots={slots}
                              item-key="renderKey"
                              animation={300}
                              group={group}
                              onEnd={onEnd}
                              class="drag-wrapper"
                              style="padding-top:12px"
                            />
                          </a-row>
                        </a-col>
                      );
                    })}
                  </div>
                  {components.itemBtns(element, index, parent)}
                </a-row>
              </a-col>
            );
          }

          if (element.__config__.futureKey === 'tableGrid') {
            if (props.showType === 'app') {
              return (
                <a-col span={24} data-draggable={true} draggable={false}>
                  <a-row
                    gutter={element.__config__.gutter}
                    class={className + ' pt-30px'}
                    onClick={event => {
                      onActiveItem(element);
                      event.stopPropagation();
                    }}>
                    <span class="component-name">{config.label}</span>
                    <div class="drag-wrapper tableGrid-app-wrapper">
                      <div class="row-tip">请在桌面端设计表格（移动端不支持）</div>
                    </div>
                    {components.itemBtns(element, index, parent)}
                  </a-row>
                </a-col>
              );
            }
            return (
              <a-col span={config.span} data-draggable={true} draggable={false}>
                <a-row
                  class={className + ' drawing-row-item-row drawing-row-item-table-grid'}
                  onClick={event => {
                    onActiveItem(element);
                    event.stopPropagation();
                  }}>
                  <table class="table-grid">
                    <tbody>
                      {element.__config__.children.map((item, rowIndex) => {
                        return (
                          <tr>
                            {item.__config__.children.map((it, colIndex) => {
                              const slots = {
                                item: ({ element: childElement, index }) => {
                                  return renderChildren(childElement, index, it.__config__.children);
                                },
                              };
                              let childGroup = { name: 'componentsGroup', put: (...arg) => put(...arg, it) };
                              const onChildEnd = (...arg) => end(...arg, activeData, it);
                              const childClassName = props.activeId === it.__config__.formId ? 'drawing-row-item active-from-item' : 'drawing-row-item';
                              if (it.__config__.merged) return '';
                              return (
                                <td
                                  class={childClassName}
                                  colspan={it.__config__.colspan || 1}
                                  rowspan={it.__config__.rowspan || 1}
                                  onClick={event => {
                                    onActiveItem(it);
                                    event.stopPropagation();
                                  }}>
                                  <a-col>
                                    <a-row>
                                      <draggable
                                        v-model={it.__config__.children}
                                        v-slots={slots}
                                        item-key="renderKey"
                                        animation={300}
                                        group={childGroup}
                                        onEnd={onChildEnd}
                                        class="drag-wrapper table-cell"></draggable>
                                    </a-row>
                                  </a-col>
                                  {components.cellSetting(element, rowIndex, colIndex)}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {components.itemBtns(element, index, parent, true)}
                </a-row>
              </a-col>
            );
          }

          const group = { name: 'componentsGroup', put: (...arg) => put(...arg, element) };
          const onEnd = (...arg) => end(...arg, activeData, element);
          const slots = {
            item: ({ element: childElement, index }) => {
              return renderChildren(childElement, index, config.children);
            },
          };
          let tip: JSX.Element | Element | null = null;
          if (!config.children.length) {
            tip = <div class="row-tip">请将组件拖到此区域(可拖多个组件)</div>;
          }

          if (config.futureKey === 'row' || (props.showType === 'app' && config.futureKey === 'card')) {
            return (
              <a-col
                span={props.showType === 'app' ? 24 : config.span}
                data-draggable={true}
                draggable={false}
                onClick={event => {
                  onActiveItem(element);
                  event.stopPropagation();
                }}>
                <a-row class={className + ' drawing-row-item-row'}>
                  <span class="component-name">{config.futureKey === 'card' ? config.label : config.componentName}</span>
                  <a-col>
                    <a-row gutter={props.formConf.gutter || 15} class="child-drawing-row">
                      {tip}
                      <draggable
                        v-model={config.children}
                        v-slots={slots}
                        item-key="renderKey"
                        animation={300}
                        group={group}
                        onEnd={onEnd}
                        class="drag-wrapper"
                        style="padding-top:30px"></draggable>
                    </a-row>
                  </a-col>
                  {components.itemBtns(element, index, parent)}
                </a-row>
              </a-col>
            );
          }

          if (config.futureKey === 'table') {
            let basicHelp: any = null;
            if (config.label && config.tipLabel) basicHelp = <BasicHelp text={config.tipLabel} />;
            return (
              <a-col
                span={props.showType === 'app' ? 24 : config.span}
                data-draggable={true}
                draggable={false}
                onClick={event => {
                  onActiveItem(element);
                  event.stopPropagation();
                }}>
                <a-row class={className + ' drawing-row-item-table'}>
                  <span class="component-name">
                    {config.label}
                    {basicHelp}
                  </span>
                  {tip}
                  <a-form
                    colon={false}
                    layout={props.showType === 'app' ? (props.formConf.labelPosition === 'top' ? 'vertical' : 'horizontal') : 'vertical'}
                    labelAlign={props.formConf.labelPosition === 'right' ? 'right' : 'left'}>
                    <draggable
                      v-model={config.children}
                      v-slots={slots}
                      item-key="renderKey"
                      animation={300}
                      group={group}
                      onEnd={onEnd}
                      clone={cloneComponent}
                      class={`drag-wrapper table-wrapper ${props.showType === 'app' ? '' : 'table-wrapper-web'}`}></draggable>
                  </a-form>
                  {components.itemBtns(element, index, parent)}
                </a-row>
              </a-col>
            );
          }

          if (config.futureKey === 'card') {
            let basicHelp: any = null;
            if (config.tipLabel) basicHelp = <BasicHelp text={config.tipLabel} />;
            const cardSlots = {
              title: () => {
                if (!element.header) return null;
                return (
                  <span>
                    {element.header}
                    {basicHelp}
                  </span>
                );
              },
            };
            return (
              <a-col
                span={props.showType === 'app' ? 24 : config.span}
                data-draggable={true}
                draggable={false}
                onClick={event => {
                  onActiveItem(element);
                  event.stopPropagation();
                }}>
                <a-row class={className}>
                  <a-card v-slots={cardSlots} size={props.formConf.size} hoverable={element.shadow === 'hover'}>
                    <a-col>
                      <a-row gutter={props.formConf.gutter || 15} class="child-drawing-row">
                        {tip}
                        <draggable
                          v-model={config.children}
                          v-slots={slots}
                          item-key="renderKey"
                          animation={300}
                          group={group}
                          onEnd={onEnd}
                          class="drag-wrapper"></draggable>
                      </a-row>
                    </a-col>
                  </a-card>
                  {components.itemBtns(element, index, parent)}
                </a-row>
              </a-col>
            );
          }

          return null;
        },
      };

      function cloneComponent(origin) {
        activeData = origin;
        return origin;
      }

      function renderChildren(element, index, parent) {
        const layout = layouts[element.__config__.layout];
        if (layout) {
          return layout(element, index, parent);
        }
        return null;
      }

      return () => {
        const layout = layouts[props.element.__config__.layout];
        if (layout) {
          return layout(props.element, props.index, props.drawingList);
        }
        return null;
      };
    },
  });
</script>
