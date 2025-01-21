<template>
  <div :class="`${prefixCls}`">
    <div class="left-board common-board">
      <ScrollContainer>
        <a-collapse v-model:activeKey="leftActiveKey" expandIconPosition="end" ghost>
          <a-collapse-panel :header="item.title" :key="item.id" v-for="item in leftComponents" class="components-list">
            <draggable
              class="components-draggable"
              v-model="item.list"
              item-key="__config__.futureKey"
              filter=".disabled"
              :sort="false"
              draggable=".components-item"
              :clone="cloneComponent"
              :group="{ name: 'componentsGroup', pull: 'clone', put: false }"
              @end="onLeftEnd">
              <template #item="{ element }">
                <div class="components-item" :class="{ disabled: element.__config__.dragDisabled }" @click="addComponent(element)">
                  <div class="components-body">
                    <i :class="element.__config__.tagIcon" />
                    {{ element.__config__.label }}
                    <BasicHelp text="不支持代码生成" v-if="element.__config__.futureKey === 'calculate'" />
                  </div>
                </div>
              </template>
            </draggable>
          </a-collapse-panel>
        </a-collapse>
      </ScrollContainer>
    </div>
    <div class="center-board common-board">
      <div class="action-bar">
        <div class="action-bar-left">
          <div class="future-device-switch">
            <div class="future-device-switch-item" :class="{ 'future-device-switch-item--active': showType === 'pc' }" @click="state.showType = 'pc'">
              <a-tooltip title="PC">
                <i class="icon-ym icon-ym-pc" />
              </a-tooltip>
            </div>
            <div class="future-device-switch-item" :class="{ 'future-device-switch-item--active': showType === 'app' }" @click="state.showType = 'app'">
              <a-tooltip title="APP">
                <i class="icon-ym icon-ym-mobile" />
              </a-tooltip>
            </div>
          </div>
        </div>
        <div class="action-bar-right">
          <a-tooltip :title="t('common.undoText')">
            <a-button type="text" class="action-bar-btn" :disabled="!getCanUndo" @click="handleUndo(replaceDrawingList)">
              <i class="icon-ym icon-ym-undo" />
            </a-button>
          </a-tooltip>
          <a-tooltip :title="t('common.redoText')">
            <a-button type="text" class="action-bar-btn" :disabled="!getCanRedo" @click="handleRedo(replaceDrawingList)">
              <i class="icon-ym icon-ym-redo" />
            </a-button>
          </a-tooltip>
          <a-divider type="vertical" class="action-bar-divider" />
          <a-tooltip :title="t('common.cleanText')">
            <a-button type="text" class="action-bar-btn" @click="handleClear">
              <i class="icon-ym icon-ym-clean" />
            </a-button>
          </a-tooltip>
          <a-tooltip :title="t('common.previewText')">
            <a-button type="text" class="action-bar-btn" @click="handlePreview">
              <i class="icon-ym icon-ym-video-play" />
            </a-button>
          </a-tooltip>
        </div>
      </div>
      <div class="center-board-main">
        <ScrollContainer v-show="showType === 'pc'">
          <a-row class="center-board-row" :gutter="formConf.gutter || 15">
            <a-form
              :colon="formConf.colon"
              :size="formConf.size"
              :layout="formConf.labelPosition === 'top' ? 'vertical' : 'horizontal'"
              :labelAlign="formConf.labelPosition === 'right' ? 'right' : 'left'">
              <draggable class="drawing-board" v-model="drawingList" :animation="300" group="componentsGroup" item-key="renderKey" @end="onCenterEnd">
                <template #item="{ element, index }">
                  <draggable-item
                    :key="element.renderKey"
                    :drawing-list="drawingList"
                    :element="element"
                    :index="index"
                    :active-id="activeId"
                    :form-conf="formConf"
                    @activeItem="activeFormItem"
                    @copyItem="drawingItemCopy"
                    @deleteItem="drawingItemDelete"
                    :mergeLeftColDisabled="mergeLeftColDisabled"
                    :mergeRightColDisabled="mergeRightColDisabled"
                    :mergeWholeRowDisabled="mergeWholeRowDisabled"
                    :mergeAboveRowDisabled="mergeAboveRowDisabled"
                    :mergeBelowRowDisabled="mergeBelowRowDisabled"
                    :mergeWholeColDisabled="mergeWholeColDisabled"
                    :undoMergeRowDisabled="undoMergeRowDisabled"
                    :undoMergeColDisabled="undoMergeColDisabled"
                    :deleteWholeColDisabled="deleteWholeColDisabled"
                    :deleteWholeRowDisabled="deleteWholeRowDisabled"
                    @addRow="handleTableAddRow"
                    @addCol="handleTableAddCol"
                    @handleTableSetting="handleTableSetting"
                    @handleShowMenu="handleShowMenu"
                    :put="shouldClone"
                    :end="onTableEnd" />
                </template>
              </draggable>
              <div v-show="!drawingList.length" class="empty-info">
                <img src="../../../assets/images/emptyElement.png" class="empty-img" />
              </div>
            </a-form>
          </a-row>
        </ScrollContainer>
        <div class="ipad" v-show="showType === 'app'">
          <div class="outerIpad">
            <div class="ipadBody">
              <ScrollContainer>
                <a-row class="center-board-row">
                  <a-form
                    :colon="false"
                    :size="formConf.size"
                    :layout="formConf.labelPosition === 'top' ? 'vertical' : 'horizontal'"
                    :labelAlign="formConf.labelPosition === 'right' ? 'right' : 'left'">
                    <draggable class="drawing-board" v-model="drawingList" :animation="300" group="componentsGroup" item-key="renderKey" @end="onCenterEnd">
                      <template #item="{ element, index }">
                        <draggable-item
                          showType="app"
                          :key="element.renderKey"
                          :drawing-list="drawingList"
                          :element="element"
                          :index="index"
                          :active-id="activeId"
                          :form-conf="formConf"
                          @activeItem="activeFormItem"
                          @copyItem="drawingItemCopy"
                          @deleteItem="drawingItemDelete"
                          :put="debounceShouldClone"
                          :end="onTableEnd" />
                      </template>
                    </draggable>
                    <div v-show="!drawingList.length" class="empty-info app-empty-info">
                      <img src="../../../assets/images/emptyElement.png" class="empty-img" />
                    </div>
                  </a-form>
                </a-row>
              </ScrollContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
    <RightPanel v-bind="getRightPanelBind" @relationChange="onRelationChange" @addTableComponent="handleAddTableComponent" @activeFormItem="activeFormItem" />
    <PreviewModal @register="registerPreviewModal" :formConf="formConf" />
  </div>
</template>
<script lang="ts" setup>
  import draggable from 'vuedraggable';
  import { reactive, toRefs, nextTick, watch, onMounted, provide, computed, unref } from 'vue';
  import type { GenItem } from './types/genItem';
  import { inputComponents, selectComponents, systemComponents, layoutComponents, formConf as defaultFormConf } from './helper/componentMap';
  import { noVModelList, noTableAllowList } from './helper/config';
  import { ScrollContainer } from '@/components/Container';
  import DraggableItem from './DraggableItem.vue';
  import RightPanel from './RightPanel.vue';
  import PreviewModal from './components/PreviewModal.vue';
  import { useModal } from '@/components/Modal';
  import { useDesign } from '@/hooks/web/useDesign';
  import { cloneDeep } from 'lodash-es';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useDebounceFn } from '@vueuse/core';
  import { useGeneratorStore } from '@/store/modules/generator';
  import { useRedo } from '@/components/FormGenerator/src/hooks/useRedo';
  import { isUrl } from '@/utils/is';

  interface State {
    leftComponents: any[];
    showType: string;
    idGlobal: number;
    formConf: any;
    drawingList: any[];
    copyDrawingList: string;
    activeId: any;
    activeData: any;
    activeItem: any;
    activeTableItem: any;
    showTip: boolean;
    rowIndex: number;
    colIndex: number;
    rowData: any[];
    colData: any[];
    selectCell: any;
    leftActiveKey: string[];
  }

  const props = defineProps(['conf', 'formInfo', 'dbType']);
  defineExpose({ getData });
  const { createMessage, createConfirm } = useMessage();
  const { t } = useI18n();
  const [registerPreviewModal, { openModal: openPreviewModal }] = useModal();
  const generatorStore = useGeneratorStore();
  const { prefixCls } = useDesign('basic-generator');
  const debounceShouldClone = useDebounceFn(shouldClone, 200);
  let tempActiveData;
  const state = reactive<State>({
    leftComponents: [
      { id: '1', title: '基础控件', list: inputComponents },
      { id: '2', title: '高级控件', list: selectComponents },
      { id: '3', title: '系统控件', list: systemComponents },
      { id: '4', title: '布局控件', list: layoutComponents },
    ],
    showType: 'pc',
    idGlobal: 100,
    formConf: cloneDeep(defaultFormConf),
    drawingList: [],
    copyDrawingList: '',
    activeId: null,
    activeData: {},
    activeItem: {},
    activeTableItem: {},
    showTip: true,
    rowIndex: 0,
    colIndex: 0,
    rowData: [],
    colData: [],
    selectCell: {
      __config__: {
        rowspan: 1,
        colspan: 1,
      },
    },
    leftActiveKey: ['1', '2', '3', '4'],
  });
  const { leftComponents, leftActiveKey, showType, drawingList, formConf, activeId } = toRefs(state);
  const { initRedo, addRecord, handleUndo, handleRedo, getCanUndo, getCanRedo } = useRedo();

  const getRightPanelBind = computed(() => {
    return {
      activeData: state.activeData,
      formConf: state.formConf,
      drawingList: state.drawingList,
      formInfo: props.formInfo,
      dbType: props.dbType,
    };
  });
  const mergeLeftColDisabled = computed(() => {
    if (!state.colData.length) return true;
    return state.colIndex <= 0 || state.colData[state.colIndex - 1].__config__.rowspan !== state.selectCell.__config__.rowspan;
  });
  const mergeRightColDisabled = computed(() => {
    if (!state.colData.length) return true;
    let rightColIndex = state.colIndex + state.selectCell.__config__.colspan;
    return (
      state.colIndex >= state.colData.length - 1 ||
      rightColIndex > state.colData.length - 1 ||
      state.colData[rightColIndex].__config__.rowspan !== state.selectCell.__config__.rowspan
    );
  });
  const mergeWholeRowDisabled = computed(() => {
    if (!state.selectCell.__config__ || !state.rowData.length) return true;
    let rowDataChildren = state.rowData[state.rowIndex].__config__.children;
    let startRowspan = rowDataChildren[0].__config__.rowspan;
    let unmatchedFlag = false;
    for (let i = 1; i < rowDataChildren.length; i++) {
      if (rowDataChildren[i].__config__.rowspan !== startRowspan) {
        unmatchedFlag = true;
        break;
      }
    }
    if (unmatchedFlag) return true;
    return state.colData.length <= 1 || state.colData.length === state.selectCell.__config__.colspan;
  });
  const mergeAboveRowDisabled = computed(() => {
    if (!state.rowData.length || state.rowIndex <= 0) return true;
    return (
      state.rowData[state.rowIndex - 1].__config__.children[state.colIndex].__config__.colspan !== state.selectCell.__config__.colspan ||
      state.rowData[state.rowIndex - 1].__config__.children[state.colIndex].__config__.merged
    );
  });
  const mergeBelowRowDisabled = computed(() => {
    if (!state.rowData.length || state.rowIndex == state.rowData.length) return true;
    let belowRowIndex = state.rowIndex + state.selectCell.__config__.rowspan;
    return (
      state.rowIndex >= state.rowData.length - 1 ||
      belowRowIndex > state.rowData.length - 1 ||
      state.rowData[belowRowIndex].__config__.children[state.colIndex].__config__.colspan !== state.selectCell.__config__.colspan ||
      state.rowData[belowRowIndex].__config__.children[state.colIndex].__config__.merged
    );
  });
  const mergeWholeColDisabled = computed(() => {
    if (!state.rowData.length) return true;
    let startColspan = state.rowData[0].__config__.children[state.colIndex].__config__.colspan;
    let unmatchedFlag = false;
    for (let i = 1; i < state.rowData.length; i++) {
      if (state.rowData[i].__config__.children[state.colIndex].__config__.colspan !== startColspan) {
        unmatchedFlag = true;
        break;
      }
    }
    if (unmatchedFlag) return true;
    return state.rowData.length <= 1 || state.rowData.length === state.selectCell.__config__.rowspan;
  });
  const undoMergeRowDisabled = computed(() => {
    return state.selectCell.__config__.merged || state.selectCell.__config__.colspan <= 1;
  });
  const undoMergeColDisabled = computed(() => {
    return state.selectCell.__config__.merged || state.selectCell.__config__.rowspan <= 1;
  });
  const deleteWholeColDisabled = computed(() => {
    if (!state.rowData.length) return true;
    if (state.rowData[0].__config__.children[0].__config__.colspan === state.rowData[0].__config__.children.length) return true;
    let startColspan = state.rowData[0].__config__.children[state.colIndex].__config__.colspan;
    let unmatchedFlag = false;
    for (let i = 1; i < state.rowData.length; i++) {
      if (state.rowData[i].__config__.children[state.colIndex].__config__.colspan !== startColspan) {
        unmatchedFlag = true;
        break;
      }
    }
    if (unmatchedFlag) return true;
    return state.selectCell.__config__.colspan === state.colData.length;
  });
  const deleteWholeRowDisabled = computed(() => {
    if (!state.rowData.length || state.rowData.length <= state.rowIndex) return true;
    if (state.rowData[0].__config__.children[0].__config__.rowspan === state.rowData.length) return true;
    //整行所有单元格行高不一致不可删除！！
    let startRowspan = state.rowData[state.rowIndex].__config__.children[0].__config__.rowspan;
    let unmatchedFlag = false;
    for (let i = 1; i < state.rowData[state.rowIndex].__config__.children.length; i++) {
      if (state.rowData[state.rowIndex].__config__.children[i].__config__.rowspan !== startRowspan) {
        unmatchedFlag = true;
        break;
      }
    }
    if (unmatchedFlag) return true;
    return state.rowData.length === 1 || state.selectCell.__config__.rowspan === state.rowData.length;
  });

  provide('getShowType', () => state.showType);
  provide('getDrawingList', () => state.drawingList);

  watch(
    () => state.drawingList,
    val => {
      if (val.length) return;
      state.idGlobal = 100;
      state.activeData = {};
      state.activeId = null;
    },
    { deep: true },
  );
  watch(
    () => state.idGlobal,
    val => {
      state.formConf.idGlobal = val;
    },
    { immediate: true },
  );

  // 供父组件使用 获取表单JSON
  function getData() {
    return new Promise((resolve, reject) => {
      if (!state.drawingList.length) {
        reject({ msg: '表单不允许为空', target: 1 });
        return;
      }
      const loop = list => {
        for (let i = 0; i < list.length; i++) {
          const e = list[i];
          const config = e.__config__;
          if (config.layout === 'colFormItem' && (!noVModelList.includes(config.futureKey) || e.isStorage)) {
            if (!e.__vModel__) {
              reject({ msg: `${config.label}的控件字段不能为空`, target: 1 });
              break;
            }
            const RegExp = /(^_([a-zA-Z0-9]_?)*$)|(^[a-zA-Z](_?[a-zA-Z0-9])*_?$)/;
            if (!RegExp.test(e.__vModel__)) {
              reject({ msg: `${config.label}的控件字段不规范`, target: 1 });
              break;
            }
          }
          if (config.futureKey === 'billRule') {
            if (!config.rule) {
              reject({ msg: '单据组件“单据模板”属性为必填项', target: 1 });
              break;
            }
          }
          if (config.futureKey === 'relationForm') {
            if (!e.modelId) {
              reject({ msg: '关联表单控件“关联功能”属性为必填项', target: 1 });
              break;
            }
            if (!e.relationField) {
              reject({ msg: '关联表单控件“显示字段”属性为必填项', target: 1 });
              break;
            }
          }
          if (config.futureKey === 'popupSelect') {
            if (!e.interfaceId) {
              reject({ msg: '弹窗选择控件“远端数据”属性为必填项', target: 1 });
              break;
            }
            if (!e.propsValue) {
              reject({ msg: '弹窗选择控件“存储字段”属性为必填项', target: 1 });
              break;
            }
            if (!e.relationField) {
              reject({ msg: '弹窗选择控件“显示字段”属性为必填项', target: 1 });
              break;
            }
          }
          if (config.futureKey === 'popupTableSelect') {
            if (!e.interfaceId) {
              reject({ msg: '下拉表格控件“远端数据”属性为必填项', target: 1 });
              break;
            }
            if (!e.propsValue) {
              reject({ msg: '下拉表格控件“存储字段”属性为必填项', target: 1 });
              break;
            }
            if (!e.relationField) {
              reject({ msg: '下拉表格控件“显示字段”属性为必填项', target: 1 });
              break;
            }
          }
          if (config.futureKey === 'autoComplete') {
            if (!e.interfaceId) {
              reject({ msg: '下拉补全控件“远端数据”属性为必填项', target: 1 });
              break;
            }
            if (!e.relationField) {
              reject({ msg: '下拉补全控件“显示字段”属性为必填项', target: 1 });
              break;
            }
          }
          if (config.layout === 'rowFormItem' && !config.children.length) {
            reject({ msg: `您的${config.label}控件中没有组件`, target: 1 });
            break;
          }
          if (config.futureKey === 'uploadFile' || config.futureKey === 'uploadImg') {
            if (e.pathType === 'selfPath') {
              if (!e.sortRule || !e.sortRule.length) {
                reject({ msg: `请设置自定义路径`, target: 1 });
                break;
              }
              if (e.sortRule?.includes('3')) {
                if (!e.folder) {
                  reject({ msg: `文件夹名不能为空`, target: 1 });
                  break;
                } else {
                  const regex = /^[a-zA-Z0-9][a-zA-Z0-9\-_]{0,99}$/;
                  let flag = false;
                  const folderList = e.folder.split('/');
                  folder: for (let i = 0; i < folderList.length; i++) {
                    if (!folderList[i] || !regex.test(folderList[i])) {
                      flag = true;
                      break folder;
                    }
                  }
                  if (flag) {
                    reject({ msg: `文件夹名不正确`, target: 1 });
                    break;
                  }
                }
              }
            }
          }
          if (config.futureKey === 'link' || config.futureKey === 'iframe') {
            if (e.href && !isUrl(e.href)) {
              reject({ msg: '请输入正确的链接地址', target: 1 });
              break;
            }
          }
          if (config && config.children && Array.isArray(config.children)) {
            loop(config.children);
          }
        }
      };
      loop(state.drawingList);
      assembleFormData();
      if (state.formConf.hasPrintBtn && !state.formConf.printId?.length) {
        reject({ msg: `请选择打印模板`, target: 1 });
      }
      resolve({ formData: state.formConf, target: 1 });
    });
  }
  function addComponent(item) {
    if (item.__config__.dragDisabled) return;
    const clone = cloneComponent(item);
    (state.drawingList as any[]).push(clone);
    activeFormItem(clone);
    addLocalRecord(state.drawingList);
  }
  function cloneComponent(origin) {
    const clone = cloneDeep(origin);
    const config = clone.__config__;
    config.span = state.formConf.span; // 生成代码时，会根据span做精简判断
    createIdAndKey(clone);
    tempActiveData = clone;
    return tempActiveData;
  }
  function createIdAndKey(item, parent: Nullable<GenItem> = null) {
    const config = item.__config__;
    config.formId = ++state.idGlobal;
    config.renderKey = +new Date(); // 改变renderKey后可以实现强制更新组件
    if (config.layout === 'colFormItem') {
      if (noVModelList.indexOf(config.futureKey) < 0 || item.isStorage) {
        item.__vModel__ = !generatorStore.getHasTable ? toggleVmodelCase(`${config.futureKey}Field${state.idGlobal}`) : '';
      }
      if (parent?.__vModel__ && parent?.__config__.futureKey === 'table') {
        item.__config__.parentVModel = parent.__vModel__;
      }
    } else if (config.layout === 'rowFormItem') {
      if (config.futureKey === 'table') {
        item.__vModel__ = toggleVmodelCase(`${config.futureKey}Field${state.idGlobal}`);
      }
      config.componentName = `${config.futureKey}${state.idGlobal}`;
      !Array.isArray(config.children) && (config.children = []);
    }
    if (Array.isArray(config.children)) {
      config.children = config.children.map(childItem => createIdAndKey(childItem, item));
    }
    return item;
  }
  function toggleVmodelCase(str) {
    const dbType = props.dbType || '';
    if (dbType.toLowerCase() === 'Oracle'.toLowerCase() || dbType.toLowerCase() === 'DM'.toLowerCase()) {
      return str.toUpperCase();
    }
    if (dbType.toLowerCase() === 'PostgreSQL'.toLowerCase() || dbType.toLowerCase() === 'KingBaseES'.toLowerCase()) {
      return str.toLowerCase();
    }
    return str;
  }
  function activeFormItem(element) {
    state.activeData = element;
    state.activeId = element.__config__.formId;
  }
  function drawingItemCopy(item, parent, isActiveFormItem = true) {
    let clone = cloneDeep(item);
    clone = createIdAndKey(clone);
    parent.push(clone);
    isActiveFormItem && activeFormItem(clone);
    addLocalRecord(state.drawingList);
  }
  function drawingItemDelete(index, parent) {
    parent.splice(index, 1);
    nextTick(() => {
      const len = state.drawingList.length;
      if (len) activeFormItem(state.drawingList[len - 1]);
      addLocalRecord(state.drawingList);
    });
  }
  function assembleFormData() {
    state.formConf = {
      ...state.formConf,
      fields: cloneDeep(state.drawingList),
    };
  }
  function replaceDrawingList(data) {
    state.drawingList = cloneDeep(data);
    state.copyDrawingList = JSON.stringify(state.drawingList);
    let boo = false;
    const loop = list => {
      for (let i = 0; i < list.length; i++) {
        const e = list[i];
        if (e.__config__.formId === state.activeId) {
          state.activeData = e;
          state.activeId = e.__config__.formId;
          boo = true;
        }
        const config = e.__config__;
        if (config && config.children && Array.isArray(config.children)) {
          loop(config.children);
        }
      }
    };
    loop(state.drawingList);
    if (!boo) {
      state.activeData = {};
      state.activeId = null;
    }
  }
  function onLeftEnd(obj) {
    state.showTip = true;
    if (obj.from !== obj.to) {
      state.activeData = tempActiveData;
      state.activeId = tempActiveData.__config__.formId;
    }
    if (obj.to.className.indexOf('table-wrapper') > -1) {
      (state.activeItem as GenItem).__config__.isSubTable = true;
      (state.activeItem as GenItem).__config__.parentVModel = (state.activeTableItem as GenItem).__vModel__;
      if (generatorStore.getHasTable) {
        (state.activeItem as GenItem).__config__.relationTable = (state.activeTableItem as GenItem).__config__.tableName;
        (state.activeItem as GenItem).__vModel__ = '';
      }
    }
    addLocalRecord(state.drawingList);
  }
  function onCenterEnd(obj) {
    state.showTip = true;
    if (obj.from === obj.to) return addLocalRecord(state.drawingList);
    if (obj.to.className.indexOf('table-wrapper') > -1) {
      (state.activeItem as GenItem).__config__.isSubTable = true;
      (state.activeItem as GenItem).__config__.parentVModel = (state.activeTableItem as GenItem).__vModel__;
      if (generatorStore.getHasTable) {
        (state.activeItem as GenItem).__config__.relationTable = (state.activeTableItem as GenItem).__config__.tableName;
        (state.activeItem as GenItem).__vModel__ = '';
      }
    }
    addLocalRecord(state.drawingList);
  }
  function onTableEnd(obj) {
    if (obj.from == obj.to) return addLocalRecord(state.drawingList);
    if (obj.to.className.indexOf('table-wrapper') < 0) {
      if ((state.activeItem as GenItem).__config__) {
        (state.activeItem as GenItem).__config__.isSubTable = false;
        (state.activeItem as GenItem).__config__.parentVModel = '';
        if (generatorStore.getHasTable) (state.activeItem as GenItem).__vModel__ = '';
      }
    } else {
      (state.activeItem as GenItem).__config__.isSubTable = true;
      (state.activeItem as GenItem).__config__.parentVModel = (state.activeTableItem as GenItem).__vModel__;
      if (generatorStore.getHasTable) {
        (state.activeItem as GenItem).__config__.relationTable = (state.activeTableItem as GenItem).__config__.tableName;
        (state.activeItem as GenItem).__vModel__ = '';
      }
    }
    addLocalRecord(state.drawingList);
  }
  //  阻止表格中嵌套行容器
  function shouldClone(_to, _from, target, _event, conf) {
    const targetConf = target._underlying_vm_;
    if (conf.__config__.futureKey === 'table') {
      if (noTableAllowList.includes(targetConf.__config__.futureKey)) {
        return false;
      }
      if (targetConf.__config__.layout === 'rowFormItem') return false;
      if (generatorStore.getHasTable) {
        if (!conf.__config__.tableName) {
          if (state.showTip) {
            createMessage.warning(`子表请先关联数据表`);
            state.showTip = false;
          }
          return false;
        }
      }
      state.activeItem = targetConf;
      state.activeTableItem = conf;
    }
    if (conf.__config__.futureKey === 'tableGridTd' && targetConf.__config__.futureKey === 'tableGrid') return false;
    return true;
  }
  // 预览表单
  function handlePreview() {
    assembleFormData();
    openPreviewModal(true, { formConf: unref(state.formConf) });
  }
  // 清空
  function handleClear() {
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('formGenerator.cleanComponentTip'),
      onOk: () => {
        state.drawingList = [];
        addLocalRecord(state.drawingList);
      },
    });
  }
  function addLocalRecord(val) {
    if (JSON.stringify(val) != state.copyDrawingList) {
      state.copyDrawingList = JSON.stringify(val);
      addRecord(val);
    }
  }
  function onRelationChange() {
    const loop = list => {
      for (let i = 0; i < list.length; i++) {
        const config = list[i].__config__;
        if (list[i].relationField && list[i].relationField === list[i].__vModel__) {
          list[i].showField = '';
        }
        if (config?.children && Array.isArray(config.children)) {
          loop(config.children);
        }
      }
    };
    loop(state.drawingList);
  }
  function handleTableAddRow(element, insertPos, cloneRowIdx) {
    const row = element.__config__.children;
    let rowIdx = insertPos === undefined ? row.length : insertPos + row[cloneRowIdx].__config__.children[state.colIndex].__config__.rowspan - 1;
    let newRow = cloneRowIdx === undefined ? cloneDeep(row[row.length - 1]) : cloneDeep(row[cloneRowIdx]);
    newRow.__config__.children.forEach(col => {
      col.__config__.formId = ++state.idGlobal;
      col.__config__.merged = false;
      col.__config__.colspan = 1;
      col.__config__.rowspan = 1;
      col.__config__.children = [];
    });
    newRow.__config__.formId = ++state.idGlobal;
    newRow.__config__.futureKey = 'tableGridTr';
    element.__config__.children.splice(rowIdx, 0, newRow);
  }
  function handleTableAddCol(element, insertPos) {
    const row = element.__config__.children;
    let colIdx = insertPos === undefined ? row[0].__config__.children.length : insertPos; //确定插入列位置
    row.forEach(item => {
      let newCol = {
        __config__: {
          futureKey: 'tableGridTd',
          merged: false,
          colspan: 1,
          rowspan: 1,
          formId: ++state.idGlobal,
          children: [],
          backgroundColor: '',
        },
      };
      item.__config__.children.splice(colIdx, 0, newCol);
    });
  }
  function mergeTableCol(_element, type = 0) {
    let mergedColIndex = type == 1 ? state.colIndex : state.colIndex + state.colData[state.colIndex].__config__.colspan;
    let remainedColIndex = type == 1 ? state.colIndex - state.colData[state.colIndex - 1].__config__.colspan : state.colIndex;
    const colChildren = state.colData[mergedColIndex].__config__.children;
    const colChildren_ = state.colData[remainedColIndex].__config__.children;
    state.colData[remainedColIndex].__config__.children = [...colChildren_, ...cloneDeep(colChildren)];
    let newColspan = state.colData[mergedColIndex].__config__.colspan * 1 + state.colData[remainedColIndex].__config__.colspan * 1;
    setPropsOfMergedCols(remainedColIndex, newColspan, state.selectCell.__config__.rowspan);
  }
  function mergeWholeCol() {
    let childrenData = state.colData.filter(colItem => {
      return !colItem.merged && colItem.__config__.children?.length;
    });
    if (childrenData?.length) {
      childrenData.map((o, i) => {
        if (i == 0) state.colData[0].__config__.children = cloneDeep(o.__config__.children);
        if (i != 0) state.colData[0].__config__.children.push(...cloneDeep(o.__config__.children));
      });
    }
    setPropsOfMergedCols(0, state.colData.length, state.colData[state.colIndex].__config__.rowspan);
  }
  function mergeTableRow(type = 0) {
    let mergedRowIndex = type == 1 ? state.rowIndex : state.rowIndex + state.selectCell.__config__.rowspan;
    let remainedRowIndex = type == 1 ? state.rowIndex - 1 : state.rowIndex;
    let childrenData = state.rowData[mergedRowIndex].__config__.children[state.colIndex].__config__.children;
    let childrenData_ = state.rowData[remainedRowIndex].__config__.children[state.colIndex].__config__.children;
    state.rowData[remainedRowIndex].__config__.children[state.colIndex].__config__.children = [...childrenData_, ...cloneDeep(childrenData)];
    let newRowspan =
      state.rowData[mergedRowIndex].__config__.children[state.colIndex].__config__.rowspan * 1 +
      state.rowData[remainedRowIndex].__config__.children[state.colIndex].__config__.rowspan * 1;
    setPropsOfMergedRows(remainedRowIndex, state.selectCell.__config__.colspan, newRowspan);
  }
  function mergeWholeRow() {
    let childrenData: any[] = [];
    state.rowData.forEach(o => {
      let tempCell = o.__config__.children[state.colIndex];
      if (!o.__config__.merged && !!o.__config__.children && o.__config__.children.length) {
        childrenData.push(tempCell);
      }
    });
    let firstCellOfCol = state.rowData[0].__config__.children[state.colIndex];
    if (childrenData && childrenData.length) {
      childrenData.map((o, i) => {
        if (i != 0) firstCellOfCol.__config__.children.push(...cloneDeep(o.__config__.children));
      });
    }
    setPropsOfMergedRows(0, firstCellOfCol.__config__.colspan, state.rowData.length);
  }
  function undoMergeCol() {
    setPropsOfSplitCol(state.colIndex, state.selectCell.__config__.colspan, state.selectCell.__config__.rowspan);
  }
  function undoMergeRow() {
    setPropsOfSplitRow(state.colIndex, state.selectCell.__config__.colspan, state.selectCell.__config__.rowspan);
  }
  function deleteWholeCol() {
    let startColspan = state.rowData[0].__config__.children[state.colIndex].__config__.colspan;
    state.rowData.forEach(rItem => {
      rItem.__config__.children.splice(state.colIndex, startColspan);
    });
  }
  function deleteWholeRow() {
    let startRowspan = state.rowData[state.rowIndex].__config__.children[0].__config__.rowspan;
    state.rowData.splice(state.rowIndex, startRowspan);
  }
  function setPropsOfMergedCols(startColIndex, newColspan, rowspan) {
    for (let i = state.rowIndex; i < state.rowIndex + rowspan; i++) {
      for (let j = startColIndex; j < startColIndex + newColspan; j++) {
        if (i === state.rowIndex && j === startColIndex) {
          state.rowData[i].__config__.children[j].__config__.colspan = newColspan;
          continue;
        }
        state.rowData[i].__config__.children[j].__config__.merged = true;
        state.rowData[i].__config__.children[j].__config__.colspan = newColspan;
        state.rowData[i].__config__.children[j].__config__.children = [];
      }
    }
  }
  function setPropsOfMergedRows(startRowIndex, colspan, newRowspan, colIndex = 0) {
    if (!colIndex) colIndex = state.colIndex;
    for (let i = startRowIndex; i < startRowIndex + newRowspan; i++) {
      for (let j = colIndex; j < colIndex + colspan; j++) {
        if (i === startRowIndex && j === colIndex) {
          state.rowData[i].__config__.children[j].__config__.rowspan = newRowspan;
          continue;
        }
        state.rowData[i].__config__.children[j].__config__.merged = true;
        state.rowData[i].__config__.children[j].__config__.rowspan = newRowspan;
        state.rowData[i].__config__.children[j].__config__.children = [];
      }
    }
  }
  function setPropsOfSplitCol(startColIndex, colspan, rowspan) {
    for (let i = state.rowIndex; i < state.rowIndex + rowspan; i++) {
      for (let j = startColIndex; j < startColIndex + colspan; j++) {
        state.rowData[i].__config__.children[j].__config__.merged = false;
        state.rowData[i].__config__.children[j].__config__.rowspan = 1;
        state.rowData[i].__config__.children[j].__config__.colspan = 1;
      }
    }
  }
  function setPropsOfSplitRow(startColIndex, colspan, rowspan) {
    for (let i = state.rowIndex; i < state.rowIndex + rowspan; i++) {
      for (let j = startColIndex; j < startColIndex + colspan; j++) {
        state.rowData[i].__config__.children[j].__config__.merged = false;
        state.rowData[i].__config__.children[j].__config__.rowspan = 1;
        state.rowData[i].__config__.children[j].__config__.colspan = 1;
      }
    }
  }
  function handleTableSetting(e, element) {
    switch (e) {
      case '1':
        //插入左侧列
        handleTableAddCol(element, state.colIndex);
        break;
      case '2':
        //插入右侧列
        handleTableAddCol(element, state.colIndex + 1);
        break;
      case '3':
        //插入上方行
        handleTableAddRow(element, state.rowIndex, state.rowIndex);
        break;
      case '4':
        //插入下方行
        handleTableAddRow(element, state.rowIndex + 1, state.rowIndex);
        break;
      case '5':
        //向左合并
        mergeTableCol(element, 1);
        break;
      case '6':
        //向右合并
        mergeTableCol(element);
        break;
      case '7':
        //合并整行
        mergeWholeCol();
        break;
      case '8':
        //向上合并
        mergeTableRow(1);
        break;
      case '9':
        //向下合并
        mergeTableRow();
        break;
      case '10':
        //合并整列
        mergeWholeRow();
        break;
      case '11':
        //撤销行合并
        undoMergeCol();
        break;
      case '12':
        //撤销列合并
        undoMergeRow();
        break;
      case '13':
        //删除整列
        deleteWholeCol();
        break;
      case '14':
        //删除整行
        deleteWholeRow();
        break;
      default:
        break;
    }
    resetData();
  }
  function resetData() {
    state.rowIndex = 0;
    state.colIndex = 0;
    state.rowData = [];
    state.colData = [];
    state.selectCell = {
      __config__: {
        rowspan: 1,
        colspan: 1,
      },
    };
  }
  function handleShowMenu(element, rowIndex, colIndex) {
    state.rowIndex = rowIndex;
    state.colIndex = colIndex;
    state.rowData = element.__config__.children;
    state.colData = state.rowData[rowIndex].__config__.children;
    state.selectCell = state.colData[colIndex];
  }
  function initData() {
    if (typeof props.conf === 'object' && props.conf !== null) {
      state.drawingList = cloneDeep(props.conf.fields);
      Object.assign(state.formConf, props.conf);
      state.idGlobal = state.formConf?.idGlobal;
      if (state.drawingList.length) activeFormItem(state.drawingList[0]);
    } else {
      state.drawingList = [];
      state.idGlobal = 100;
    }
    addLocalRecord(state.drawingList);
  }
  function handleAddTableComponent(item, parent) {
    drawingItemCopy(item, parent, false);
  }

  onMounted(() => {
    state.leftActiveKey = ['1', '2', '3', '4'];
    initRedo();
    initData();
  });
</script>
