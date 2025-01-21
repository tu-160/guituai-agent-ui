<script lang="tsx">
  import { defineComponent, computed, unref, reactive, ref, nextTick, provide, getCurrentInstance, onMounted, onUnmounted } from 'vue';
  import { cloneDeep, upperFirst } from 'lodash-es';
  import { buildUUID } from '@/utils/uuid';
  import { getScriptFunc, onlineUtils, getDateTimeUnit, getTimeUnit, getParamList } from '@/utils/future';
  import { dyOptionsList } from '../helper/config';
  import render from '../helper/render';
  import { useGeneratorStore } from '@/store/modules/generator';
  import { useBaseStore } from '@/store/modules/base';
  import type { FormInstance } from 'ant-design-vue';
  import { getDataInterfaceRes } from '@/api/systemData/dataInterface';
  import dayjs from 'dayjs';
  import { useI18n } from '@/hooks/web/useI18n';
  import { BasicHelp } from '@/components/Basic';

  interface State {
    formData: any;
    formRules: any;
    relations: any;
    tableRefs: any;
    options: any;
    formConfCopy: any;
  }

  export default defineComponent({
    name: 'parser',
    inheritAttrs: false,
    props: ['formConf', 'isShortLink'],
    emits: ['submit'],
    components: {
      render,
    },

    setup(props, { expose, emit }) {
      const { t } = useI18n();
      const generatorStore = useGeneratorStore();
      const state = reactive<State>({
        formData: {},
        formRules: {},
        relations: {},
        tableRefs: {},
        options: {},
        formConfCopy: {},
      });
      const isTableValid = ref(false);
      const formElRef = ref<FormInstance>();

      const baseStore = useBaseStore();
      state.formConfCopy = cloneDeep(props.formConf);
      const layouts = {
        colFormItem(element) {
          // 多语言替换占位提示
          if (element.placeholderI18nCode) element.placeholder = t(element.placeholderI18nCode, element.placeholder);

          const config = element.__config__;
          const listeners = buildListeners(element);
          const globalLabelWidth = props.formConf.labelWidth;
          let labelCol = {};
          if (props.formConf.labelPosition !== 'top' && config.showLabel) {
            let labelWidth = (config.labelWidth || globalLabelWidth) + 'px';
            if (!config.showLabel) labelWidth = '0px';
            labelCol = { style: { width: labelWidth } };
          }
          if (['groupTitle', 'divider', 'link', 'text'].includes(config.futureKey)) {
            if (element.contentI18nCode) element.content = t(element.contentI18nCode, element.content);
            if (element.helpMessageI18nCode) element.helpMessage = t(element.helpMessageI18nCode, element.helpMessage);
          }
          if (config.futureKey === 'button') {
            if (element.buttonTextI18nCode) element.buttonText = t(element.buttonTextI18nCode, element.buttonText);
          }
          if (config.futureKey === 'alert') {
            if (element.titleI18nCode) element.title = t(element.titleI18nCode, element.title);
            if (element.descriptionI18nCode) element.description = t(element.descriptionI18nCode, element.description);
            if (element.closeTextI18nCode) element.closeText = t(element.closeTextI18nCode, element.closeText);
          }
          const Item = (
            <render
              key={config.renderKey}
              formData={state.formData}
              conf={element}
              size={element.size ? element.size : props.formConf.size}
              {...listeners}
              ref={config.futureKey === 'table' ? element.__vModel__ : undefined}
              relations={config.futureKey === 'table' ? state.relations : undefined}
            />
          );
          let basicHelp: any = null;
          const label = config.labelI18nCode ? t(config.labelI18nCode, config.label) : config.label;
          const tipLabel = config.tipLabelI18nCode ? t(config.tipLabelI18nCode, config.tipLabel) : config.tipLabel;

          if (config.showLabel && label && tipLabel) basicHelp = <BasicHelp text={tipLabel} />;
          let slots: any = {
            label: () => {
              if (!config.showLabel) return null;
              return (
                <span>
                  {label ? label + (props.formConf.labelSuffix || '') : ''}
                  {basicHelp}
                </span>
              );
            },
          };
          if (!config.showLabel) slots = {};
          const visibility = !config.visibility || (Array.isArray(config.visibility) && config.visibility.includes('pc'));
          if (visibility && !config.noShow) {
            return (
              <a-col span={config.span} class={[...(config.className || []), 'ant-col-item']}>
                <a-form-item v-slots={slots} name={element.__vModel__} required={config.required} labelCol={labelCol} key={config.renderKey}>
                  {Item}
                </a-form-item>
              </a-col>
            );
          }
        },
        rowFormItem(element) {
          const config = element.__config__;
          const listeners = buildListeners(element);
          const visibility = !config.visibility || (Array.isArray(config.visibility) && config.visibility.includes('pc'));
          if (!visibility || config.noShow) return;

          if (config.futureKey === 'tab') {
            return (
              <a-col span={config.span} class={props.formConf.formStyle ? '' : 'mb-10px'}>
                <a-tabs type={element.type} size={props.formConf.size} tabPosition={element.tabPosition} v-model:activeKey={config.active} {...listeners}>
                  {config.children.map(item => {
                    const child = renderChildren(item);
                    if (item.titleI18nCode) item.title = t(item.titleI18nCode, item.title);
                    return (
                      <a-tab-pane forceRender key={item.name} tab={item.title}>
                        <a-row gutter={props.formConf.formStyle ? 0 : state.formConfCopy.gutter || 15}>{child}</a-row>
                      </a-tab-pane>
                    );
                  })}
                </a-tabs>
              </a-col>
            );
          }

          if (config.futureKey === 'collapse') {
            return (
              <a-col span={config.span} class={props.formConf.formStyle ? '' : 'mb-20px'}>
                <a-collapse ghost={true} expandIconPosition="end" accordion={element.accordion} v-model:activeKey={config.active} {...listeners}>
                  {config.children.map(item => {
                    const child = renderChildren(item);
                    if (item.titleI18nCode) item.title = t(item.titleI18nCode, item.title);
                    return (
                      <a-collapse-panel key={item.name} header={item.title} forceRender>
                        <a-row gutter={props.formConf.formStyle ? 0 : state.formConfCopy.gutter || 15}>{child}</a-row>
                      </a-collapse-panel>
                    );
                  })}
                </a-collapse>
              </a-col>
            );
          }

          if (config.futureKey === 'steps') {
            return (
              <a-col span={config.span} class={props.formConf.formStyle ? '' : 'mb-10px'}>
                <a-row>
                  <a-steps
                    size={props.formConf.size}
                    type={element.simple ? 'navigation' : 'default'}
                    status={element.processStatus}
                    v-model:current={config.active}
                    {...listeners}>
                    {config.children.map(item => {
                      const slots: any = {};
                      if (item.icon) slots.icon = () => <span class={item.icon + ' custom-icon'}></span>;
                      if (item.titleI18nCode) item.title = t(item.titleI18nCode, item.title);
                      return <a-step title={item.title} v-slots={slots} />;
                    })}
                  </a-steps>
                  {config.children.map((item, childIndex) => {
                    const child = renderChildren(item);
                    return (
                      <a-row
                        gutter={props.formConf.formStyle ? 0 : state.formConfCopy.gutter || 15}
                        class="!pt-12px w-full"
                        v-show={config.active === childIndex}>
                        {child}
                      </a-row>
                    );
                  })}
                </a-row>
              </a-col>
            );
          }

          if (config.futureKey === 'tableGrid') {
            return (
              <a-col span={config.span}>
                <table
                  class="table-grid-box"
                  style={{ '--borderType': config.borderType, '--borderColor': config.borderColor, '--borderWidth': config.borderWidth + 'px' }}>
                  <tbody>
                    {config.children.map(item => {
                      return (
                        <tr>
                          {item.__config__.children.map(it => {
                            const child = renderChildren(it);
                            if (it.__config__.merged) return '';
                            return (
                              <td
                                colspan={it.__config__.colspan || 1}
                                rowspan={it.__config__.rowspan || 1}
                                style={{ '--backgroundColor': it.__config__.backgroundColor }}>
                                <a-col>
                                  <a-row gutter={state.formConfCopy.gutter || 15}>{child}</a-row>
                                </a-col>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </a-col>
            );
          }

          if (config.futureKey === 'table') {
            if (!element.__config__.noShow) state.tableRefs[element.__vModel__] = null;
            const param = { ...element, config: element };
            return layouts.colFormItem(param);
          }

          const child = renderChildren(element);

          if (config.futureKey === 'row') {
            return (
              <a-col span={config.span}>
                <a-row gutter={props.formConf.formStyle ? 0 : state.formConfCopy.gutter || 15}>{child}</a-row>
              </a-col>
            );
          }

          if (config.futureKey === 'card') {
            let basicHelp: any = null;
            const header = element.headerI18nCode ? t(element.headerI18nCode, element.header) : element.header;
            const tipLabel = config.tipLabelI18nCode ? t(config.tipLabelI18nCode, config.tipLabel) : config.tipLabel;
            if (tipLabel) basicHelp = <BasicHelp text={tipLabel} />;
            const cardSlots = {
              title: () => {
                if (!header) return null;
                return (
                  <span>
                    {header}
                    {basicHelp}
                  </span>
                );
              },
            };
            return (
              <a-col span={config.span}>
                <a-card class="!mb-20px" v-slots={cardSlots} size={props.formConf.size} hoverable={element.shadow === 'hover'}>
                  <a-row gutter={props.formConf.formStyle ? 0 : state.formConfCopy.gutter || 15}>{child}</a-row>
                </a-card>
              </a-col>
            );
          }

          return null;
        },
      };

      const getParameter = computed(() => {
        const oldFormData = state.formConfCopy.formData || {};
        (state.formData as any).id = oldFormData.id || '';
        (state.formData as any).flowId = oldFormData.flowId || '';
        return { formData: unref(state.formData), setFormData, setShowOrHide, setRequired, setDisabled, onlineUtils };
      });
      const getFormClass = computed(() => {
        let className: string[] = ['dynamic-form', unref(getFormName)];
        if (props.formConf.formStyle) className.push(props.formConf.formStyle);
        if (props.formConf.className) className = [...className, ...props.formConf.className];
        return className;
      });
      // 每个表单生成不同name保证id不重复
      const getFormName = computed((): string => {
        return `form-${buildUUID()}`;
      });

      expose({ handleSubmit, handleReset });

      provide('parameter', unref(getParameter));
      provide('formConf', props.formConf);
      provide('formStyle', props.formConf.formStyle);
      provide('isShortLink', props.isShortLink || false);

      function renderFrom() {
        let labelCol = { style: { width: state.formConfCopy.labelWidth + 'px' } };
        return (
          <a-row class={unref(getFormClass)}>
            <a-form
              class={props.formConf.className}
              ref={formElRef}
              model={state.formData}
              rules={state.formRules}
              name={unref(getFormName)}
              colon={false}
              size={state.formConfCopy.size}
              disabled={state.formConfCopy.disabled}
              labelCol={labelCol}
              layout={state.formConfCopy.labelPosition === 'top' ? 'vertical' : 'horizontal'}
              labelAlign={state.formConfCopy.labelPosition === 'right' ? 'right' : 'left'}>
              <a-row gutter={props.formConf.formStyle ? 0 : state.formConfCopy.gutter || 15}>{renderFormItem(state.formConfCopy.fields)}</a-row>
            </a-form>
          </a-row>
        );
      }
      function renderFormItem(elementList) {
        return elementList.map(scheme => {
          const config = scheme.__config__;
          const layout = layouts[config.layout];
          if (layout) return layout(scheme);
          return null;
        });
      }
      function renderChildren(scheme) {
        const config = scheme.__config__;
        if (!Array.isArray(config.children)) return null;
        return renderFormItem(config.children);
      }

      function buildListeners(scheme) {
        const config = scheme.__config__;
        const listeners: any = {};
        if (scheme.on) {
          // 响应 组件事件
          Object.keys(scheme.on).forEach(key => {
            const str = scheme.on[key];
            const func: any = getScriptFunc(str);
            if (!func) return;
            listeners['on' + upperFirst(key)] = (...arg) => {
              if (key === 'change') {
                const data = arg.length > 1 ? arg[1] : arg[0];
                if (['popupSelect', 'relationForm'].includes(config.futureKey)) setTransferFormData(data, config);
                func({ data, ...unref(getParameter) });
                handleRelation(scheme.__vModel__);
              } else {
                func({ data: arg[0], ...unref(getParameter) });
              }
            };
          });
        }
        // 响应 render.ts 中的 buildVModel 中 emit('update:value', val);
        listeners['onUpdate:value'] = event => {
          config.defaultValue = event;
          state.formData[scheme.__vModel__] = event;
        };
        return listeners;
      }

      function setTransferFormData(data, config) {
        if (!config?.transferList?.length) return;
        for (let index = 0; index < config.transferList.length; index++) {
          const element = config.transferList[index];
          setFormData(element.sourceValue, data[element.targetField]);
        }
      }

      function handleRelation(field) {
        if (!field) return;
        const currRelations = state.relations;
        for (let key in currRelations) {
          if (key === field) {
            for (let i = 0; i < currRelations[key].length; i++) {
              const e = currRelations[key][i];
              let vModel = e.realVModel || e.__vModel__;
              const config = e.__config__;
              const futureKey = config.futureKey;
              let defaultValue: any = null;
              if (
                ['checkbox', 'cascader', 'organizeSelect'].includes(futureKey) ||
                (['select', 'treeSelect', 'popupSelect', 'popupTableSelect', 'userSelect'].includes(futureKey) && e.multiple)
              ) {
                defaultValue = [];
              }
              if (vModel.includes('-')) {
                // 子表字段
                const tableVModel = vModel.split('-')[0];
                unref(state.tableRefs[tableVModel])?.tableRef && unref(state.tableRefs[tableVModel]).tableRef.handleRelationForParent(e, defaultValue);
              } else {
                setFormData(e.__vModel__, defaultValue);
                if (e.opType === 'setOptions') {
                  const query = { paramList: getParamList(config.templateJson, state.formData) };
                  getDataInterfaceRes(config.propsUrl, query)
                    .then(res => {
                      const realData = res.data;
                      setFieldOptions(e.__vModel__, realData);
                    })
                    .catch(() => {
                      setFieldOptions(e.__vModel__, []);
                    });
                }
                if (e.opType === 'setUserOptions') {
                  const value = state.formData[e.relationField] || [];
                  comSet('ableRelationIds', e.__vModel__, Array.isArray(value) ? value : [value]);
                }
                if (e.opType === 'setStartTime') {
                  const value = state.formData[e.__config__.startRelationField] || null;
                  comSet('startTime', e.__vModel__, value);
                }
                if (e.opType === 'setEndTime') {
                  const value = state.formData[e.__config__.endRelationField] || null;
                  comSet('endTime', e.__vModel__, value);
                }
              }
            }
          }
        }
      }

      function handleDefaultRelation(field) {
        if (!field) return;
        const currRelations = state.relations;
        for (let key in currRelations) {
          if (key === field) {
            for (let i = 0; i < currRelations[key].length; i++) {
              const e = currRelations[key][i];
              let vModel = e.realVModel || e.__vModel__;
              if (vModel.includes('-')) {
                const tableVModel = vModel.split('-')[0];
                unref(state.tableRefs[tableVModel])?.tableRef && unref(state.tableRefs[tableVModel]).tableRef.handleRelationForParent(e, '', true);
              } else {
                if (e.opType === 'setUserOptions') {
                  const value = state.formData[e.relationField] || [];
                  comSet('ableRelationIds', e.__vModel__, Array.isArray(value) ? value : [value]);
                }
                if (e.opType === 'setStartTime') {
                  const value = state.formData[e.__config__.startRelationField] || null;
                  comSet('startTime', e.__vModel__, value);
                }
                if (e.opType === 'setEndTime') {
                  const value = state.formData[e.__config__.endRelationField] || null;
                  comSet('endTime', e.__vModel__, value);
                }
              }
            }
          }
        }
      }
      function setFormData(prop, value) {
        if (!prop || state.formData[prop] === value) return;
        const isChildTable = prop.indexOf('.') > -1;
        if (isChildTable) {
          const list = prop.split('.');
          unref(state.tableRefs[list[0]]).tableRef && unref(state.tableRefs[list[0]]).tableRef.setTableFormData(list[1], value);
        } else {
          comSet('defaultValue', prop, value);
          state.formData[prop] = value;
        }
        nextTick(() => {
          handleRelation(prop);
        });
      }
      function setShowOrHide(prop, value) {
        const newVal = !!value;
        const isChildTable = prop.indexOf('.') > -1;
        if (!isChildTable) {
          comSet('noShow', prop, !newVal);
        } else {
          const list = prop.split('.');
          unref(state.tableRefs[list[0]]).tableRef && unref(state.tableRefs[list[0]]).tableRef.setTableShowOrHide(list[1], !newVal);
        }
      }
      function setRequired(prop, value) {
        const newVal = !!value;
        const isChildTable = prop.indexOf('.') > -1;
        if (!isChildTable) {
          comSet('required', prop, newVal);
          buildRules(state.formConfCopy.fields);
        }
      }
      function setDisabled(prop, value) {
        const newVal = !!value;
        const isChildTable = prop.indexOf('.') > -1;
        if (!isChildTable) {
          comSet('disabled', prop, newVal);
        }
      }
      function setFieldOptions(prop, value) {
        const newVal = Array.isArray(value) ? value : [];
        const isChildTable = prop.indexOf('.') > -1;
        if (!isChildTable) {
          comSet('options', prop, newVal);
        }
      }
      function comSet(field, prop, value) {
        if (!prop) return;
        const loop = list => {
          for (let i = 0; i < list.length; i++) {
            let item = list[i];
            if (item.__vModel__ && item.__vModel__ === prop) {
              switch (field) {
                case 'disabled':
                  item[field] = value;
                  break;
                case 'ableRelationIds':
                  item[field] = value;
                  break;
                case 'startTime':
                  item[field] = value;
                  break;
                case 'endTime':
                  item[field] = value;
                  break;
                case 'options':
                  if (dyOptionsList.indexOf(item.__config__.futureKey) > -1) item.options = value;
                  break;
                default:
                  item.__config__[field] = value;
                  break;
              }
              item.__config__.renderKey = +new Date() + item.__vModel__;
              break;
            }
            if (item.__config__ && item.__config__.futureKey !== 'table' && item.__config__.children && Array.isArray(item.__config__.children)) {
              loop(item.__config__.children);
            }
          }
        };
        loop(state.formConfCopy.fields);
      }

      function initCss() {
        if (document.getElementById('customStyle')) document.getElementById('customStyle')?.remove();
        const head = document.getElementsByTagName('head')[0];
        const style = document.createElement('style');
        style.type = 'text/css';
        style.id = 'customStyle';
        style.innerText = buildCSS(props.formConf.classJson);
        head.appendChild(style);
      }
      function buildCSS(str) {
        str = str.trim();
        let newStr = '';
        let cut = str.split('}');
        cut.forEach(item => {
          if (item) {
            item = '.' + unref(getFormName) + ' ' + item + '}';
            newStr += item;
          }
        });
        return newStr;
      }
      function initFormData(componentList) {
        generatorStore.setRelationData({});
        componentList.forEach(cur => {
          const config = cur.__config__;
          if (cur.__vModel__) state.formData[cur.__vModel__] = config.defaultValue;
          if (cur.__config__.futureKey == 'table') return;
          if (config.children) initFormData(config.children);
        });
      }
      function initRelationForm(componentList) {
        componentList.forEach(cur => {
          const config = cur.__config__;
          if (config.futureKey == 'relationFormAttr' || config.futureKey == 'popupAttr') {
            const relationKey = cur.relationField.split('_futureTable_')[0];
            componentList.forEach(item => {
              const noVisibility = Array.isArray(item.__config__.visibility) && !item.__config__.visibility.includes('pc');
              if (relationKey == item.__vModel__ && (noVisibility || !!item.__config__.noShow) && !cur.__vModel__) {
                cur.__config__.noShow = true;
              }
            });
          }
          if (cur.__config__.children && cur.__config__.children.length) initRelationForm(cur.__config__.children);
        });
      }
      function buildRules(componentList) {
        componentList.forEach(cur => {
          const config = JSON.parse(JSON.stringify(cur.__config__));
          if (!Array.isArray(config.regList)) config.regList = [];
          if (config.required) {
            const label = config.labelI18nCode ? t(config.labelI18nCode, config.label) : config.label;
            const placeholder = cur.placeholderI18nCode ? t(cur.placeholderI18nCode, cur.placeholder) : cur.placeholder;
            const required: any = { required: config.required, message: placeholder };
            if (Array.isArray(config.defaultValue)) {
              required.type = 'array';
              required.message = `${t('sys.validate.arrayRequiredPrefix')}${label}`;
            }
            !required.message && (required.message = `${label}${t('sys.validate.textRequiredSuffix')}`);
            config.regList.push(required);
          }
          state.formRules[cur.__vModel__] = config.regList.map(item => {
            item.pattern && isRegExp(item.pattern) && (item.pattern = eval(item.pattern));
            item.trigger = config.trigger || 'blur';
            if (item.messageI18nCode) item.message = t(item.messageI18nCode, item.message);
            return item;
          });
          if (config.children && config.futureKey !== 'table') buildRules(config.children);
        });
      }
      function isRegExp(val) {
        try {
          return Object.prototype.toString.call(eval(val)) === '[object RegExp]';
        } catch {
          return false;
        }
      }
      function buildOptions(componentList) {
        componentList.forEach(cur => {
          const config = cur.__config__;
          if (dyOptionsList.includes(config.futureKey)) {
            if (config.dataType === 'dictionary' && config.dictionaryType) {
              cur.options = [];
              baseStore.getDicDataSelector(config.dictionaryType).then(res => {
                cur.options = res;
                state.options[cur.__vModel__ + 'Options'] = cur.options;
              });
            } else if (config.dataType === 'dynamic' && config.propsUrl) {
              cur.options = [];
              const query = { paramList: getParamList(config.templateJson, state.formData) };
              getDataInterfaceRes(config.propsUrl, query)
                .then(res => {
                  cur.options = Array.isArray(res.data) ? res.data : [];
                  state.options[cur.__vModel__ + 'Options'] = cur.options;
                })
                .catch(() => {
                  cur.options = [];
                  state.options[cur.__vModel__ + 'Options'] = [];
                });
            } else {
              state.options[cur.__vModel__ + 'Options'] = cur.options;
            }
          }
          if (config.children && config.futureKey !== 'table') buildOptions(config.children);
        });
      }
      function buildRelations(componentList, relations) {
        componentList.forEach(cur => {
          const config = cur.__config__;
          if (dyOptionsList.indexOf(config.futureKey) > -1) {
            if (config.dataType === 'dynamic') {
              if (config.templateJson && config.templateJson.length) {
                for (let i = 0; i < config.templateJson.length; i++) {
                  const e = config.templateJson[i];
                  if (e.relationField && e.sourceType == 1) {
                    let item = {
                      ...cur,
                      realVModel: cur.__config__.isSubTable ? cur.__config__.parentVModel + '-' + cur.__vModel__ : cur.__vModel__,
                      opType: 'setOptions',
                    };
                    if (relations.hasOwnProperty(e.relationField)) {
                      let boo = relations[e.relationField].some(o => o.realVModel === cur.realVModel);
                      if (!boo) {
                        relations[e.relationField].push(item);
                      }
                    } else {
                      relations[e.relationField] = [item];
                    }
                  }
                }
              }
            }
          }
          if (config.futureKey === 'userSelect' && ['dep', 'pos', 'role', 'group'].includes(cur.selectType)) {
            if (cur.relationField) {
              let item = {
                ...cur,
                realVModel: cur.__config__.isSubTable ? cur.__config__.parentVModel + '-' + cur.__vModel__ : cur.__vModel__,
                opType: 'setUserOptions',
              };
              if (relations.hasOwnProperty(cur.relationField)) {
                let boo = relations[cur.relationField].some(o => o.realVModel === cur.realVModel);
                if (!boo) relations[cur.relationField].push(item);
              } else {
                relations[cur.relationField] = [item];
              }
            }
          }
          if (config.futureKey === 'popupSelect') {
            if (cur.templateJson && cur.templateJson.length) {
              for (let i = 0; i < cur.templateJson.length; i++) {
                const e = cur.templateJson[i];
                if (e.relationField && e.sourceType == 1) {
                  let item = {
                    ...cur,
                    realVModel: cur.__config__.isSubTable ? cur.__config__.parentVModel + '-' + cur.__vModel__ : cur.__vModel__,
                    opType: 'setPopupOptions',
                  };
                  if (relations.hasOwnProperty(e.relationField)) {
                    let boo = relations[e.relationField].some(o => o.realVModel === cur.realVModel);
                    if (!boo) {
                      relations[e.relationField].push(item);
                    }
                  } else {
                    relations[e.relationField] = [item];
                  }
                }
              }
            }
          }
          if (config.futureKey === 'datePicker') {
            const currDate = cur.__config__.defaultCurrent && cur.__config__.defaultValue ? cur.__config__.defaultValue : new Date().getTime();
            if (config.startTimeRule) {
              if (config.startTimeType == 1) cur.startTime = config.startTimeValue;
              if (config.startTimeType == 2 && config.startRelationField) {
                const item = {
                  ...cur,
                  realVModel: cur.__config__.isSubTable ? cur.__config__.parentVModel + '-' + cur.__vModel__ : cur.__vModel__,
                  opType: 'setStartTime',
                };
                if (relations.hasOwnProperty(cur.__config__.startRelationField)) {
                  let boo = relations[cur.__config__.startRelationField].some(o => o.realVModel === cur.realVModel);
                  if (!boo) relations[cur.__config__.startRelationField].push(item);
                } else {
                  relations[cur.__config__.startRelationField] = [item];
                }
              }
              if (config.startTimeType == 3) cur.startTime = currDate;
              if (config.startTimeType == 4 || config.startTimeType == 5) {
                const type = getTimeUnit(config.startTimeTarget);
                const method = config.startTimeType == 4 ? 'subtract' : 'add';
                const startTime = dayjs()[method](config.startTimeValue, type);
                let realStartTime = startTime.startOf(getDateTimeUnit(cur.format)).valueOf();
                if (config.startTimeTarget == 4) realStartTime = startTime.startOf('minute').valueOf();
                if (config.startTimeTarget == 5) realStartTime = startTime.startOf('second').valueOf();
                if (config.startTimeTarget == 6) realStartTime = startTime.valueOf();
                cur.startTime = realStartTime;
              }
            }
            if (config.endTimeRule) {
              if (config.endTimeType == 1) cur.endTime = config.endTimeValue;
              if (config.endTimeType == 2 && config.endRelationField) {
                const item = {
                  ...cur,
                  realVModel: cur.__config__.isSubTable ? cur.__config__.parentVModel + '-' + cur.__vModel__ : cur.__vModel__,
                  opType: 'setEndTime',
                };
                if (relations.hasOwnProperty(cur.__config__.endRelationField)) {
                  let boo = relations[cur.__config__.endRelationField].some(o => o.realVModel === cur.realVModel);
                  if (!boo) relations[cur.__config__.endRelationField].push(item);
                } else {
                  relations[cur.__config__.endRelationField] = [item];
                }
              }
              if (config.endTimeType == 3) cur.endTime = currDate;
              if (config.endTimeType == 4 || config.endTimeType == 5) {
                const type = getTimeUnit(config.endTimeTarget);
                const method = config.endTimeType == 4 ? 'subtract' : 'add';
                const endTime = dayjs()[method](config.endTimeValue, type);
                let realEndTime = endTime.endOf(getDateTimeUnit(cur.format)).valueOf();
                if (config.endTimeTarget == 4) realEndTime = endTime.endOf('minute').valueOf();
                if (config.endTimeTarget == 5) realEndTime = endTime.endOf('second').valueOf();
                if (config.endTimeTarget == 6) realEndTime = endTime.valueOf();
                cur.endTime = realEndTime;
              }
            }
          }
          if (config.futureKey === 'timePicker') {
            const currTime = cur.__config__.defaultCurrent && cur.__config__.defaultValue ? cur.__config__.defaultValue : dayjs().format(cur.format);
            if (config.startTimeRule) {
              if (config.startTimeType == 1) cur.startTime = config.startTimeValue || null;
              if (config.startTimeType == 2 && config.startRelationField) {
                const item = {
                  ...cur,
                  realVModel: cur.__config__.isSubTable ? cur.__config__.parentVModel + '-' + cur.__vModel__ : cur.__vModel__,
                  opType: 'setStartTime',
                };
                if (relations.hasOwnProperty(cur.__config__.startRelationField)) {
                  let boo = relations[cur.__config__.startRelationField].some(o => o.realVModel === cur.realVModel);
                  if (!boo) relations[cur.__config__.startRelationField].push(item);
                } else {
                  relations[cur.__config__.startRelationField] = [item];
                }
              }
              if (config.startTimeType == 3) cur.startTime = currTime;
              if (config.startTimeType == 4 || config.startTimeType == 5) {
                const type = getTimeUnit(config.startTimeTarget + 3);
                const method = config.startTimeType == 4 ? 'subtract' : 'add';
                const startTime = dayjs()[method](config.startTimeValue, type).format(cur.format);
                cur.startTime = startTime;
              }
            }
            if (config.endTimeRule) {
              if (config.endTimeType == 1) cur.endTime = config.endTimeValue || null;
              if (config.endTimeType == 2 && config.endRelationField) {
                const item = {
                  ...cur,
                  realVModel: cur.__config__.isSubTable ? cur.__config__.parentVModel + '-' + cur.__vModel__ : cur.__vModel__,
                  opType: 'setEndTime',
                };
                if (relations.hasOwnProperty(cur.__config__.endRelationField)) {
                  let boo = relations[cur.__config__.endRelationField].some(o => o.realVModel === cur.realVModel);
                  if (!boo) relations[cur.__config__.endRelationField].push(item);
                } else {
                  relations[cur.__config__.endRelationField] = [item];
                }
              }
              if (config.endTimeType == 3) cur.endTime = currTime;
              if (config.endTimeType == 4 || config.endTimeType == 5) {
                const type = getTimeUnit(config.endTimeTarget + 3);
                const method = config.endTimeType == 4 ? 'subtract' : 'add';
                const endTime = dayjs()[method](config.endTimeValue, type).format(cur.format);
                cur.endTime = endTime;
              }
            }
          }
          if (config.children) buildRelations(config.children, relations);
        });
      }
      function initDefaultRelationData(componentList) {
        componentList.forEach(cur => {
          handleDefaultRelation(cur.__vModel__);
          if (cur.__config__.children) initDefaultRelationData(cur.__config__.children);
        });
      }
      function onLoad() {
        if (!state.formConfCopy || !state.formConfCopy.funcs || !state.formConfCopy.funcs.onLoad) return;
        const onLoadFunc: any = getScriptFunc(state.formConfCopy.funcs.onLoad);
        if (!onLoadFunc) return;
        onLoadFunc(unref(getParameter));
      }

      function beforeSubmit() {
        if (!state.formConfCopy || !state.formConfCopy.funcs || !state.formConfCopy.funcs.beforeSubmit) return Promise.resolve();
        const func: any = getScriptFunc(state.formConfCopy.funcs.beforeSubmit);
        if (!func) return Promise.resolve();
        return func(unref(getParameter));
      }
      function afterSubmit() {
        if (!state.formConfCopy || !state.formConfCopy.funcs || !state.formConfCopy.funcs.afterSubmit) return;
        const func: any = getScriptFunc(state.formConfCopy.funcs.afterSubmit);
        if (!func) return;
        func(unref(getParameter));
      }
      async function handleReset() {
        generatorStore.setRelationData({});
        state.formConfCopy = cloneDeep(props.formConf);
        Object.keys(state.tableRefs).forEach(vModel => {
          unref(state.tableRefs[vModel]).tableRef && unref(state.tableRefs[vModel]).tableRef.resetTable();
        });
        nextTick(() => {
          formElRef.value?.resetFields();
          init();
        });
      }
      function checkTableData() {
        let valid = true;
        Object.keys(state.tableRefs).forEach(vModel => {
          if (unref(state.tableRefs[vModel])?.tableRef) {
            const res = unref(state.tableRefs[vModel]).tableRef.submit(); // 返回false或表单数据
            res ? (state.formData[vModel] = res) : (valid = false);
          }
        });
        return valid;
      }
      function handleSubmit() {
        isTableValid.value = checkTableData();
        try {
          beforeSubmit().then(() => {
            submit();
          });
        } catch (e) {
          submit();
        }
      }
      async function submit() {
        if (!isTableValid.value) return false;
        const values = await formElRef.value?.validate();
        if (!values) return;
        emit('submit', state.formData, afterSubmit);
      }
      function init() {
        initCss();
        initFormData(state.formConfCopy.fields);
        initRelationForm(state.formConfCopy.fields);
        buildRules(state.formConfCopy.fields);
        buildOptions(state.formConfCopy.fields);
        buildRelations(state.formConfCopy.fields, state.relations);
        initDefaultRelationData(state.formConfCopy.fields);
        nextTick(() => {
          onLoad();
        });
      }

      onMounted(() => {
        const instance = getCurrentInstance();
        state.tableRefs = instance?.refs;
      });
      onUnmounted(() => {
        if (document.getElementById('customStyle')) document.getElementById('customStyle')?.remove();
      });

      init();

      return () => {
        return renderFrom();
      };
    },
  });
</script>
