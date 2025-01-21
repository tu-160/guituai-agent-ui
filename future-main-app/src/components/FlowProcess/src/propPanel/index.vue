<template>
  <section class="common-pane">
    <template v-if="element">
      <StartNode
        v-bind="getBindValue"
        ref="startRef"
        :formConf="startForm"
        v-if="isStartNode()"
        @updateBpmn="updateBpmnProperties"
        @updateGlobalFormId="updateGlobalFormId"
        @updateFormFieldList="updateFormFieldList" />
      <ApproverNode
        ref="approverRef"
        v-bind="getBindValue"
        :formConf="approverForm"
        v-else-if="isApproverNode()"
        @updateBpmn="updateBpmnProperties"
        @updateFormFieldList="updateFormFieldList" />
      <SubFlowNode ref="subFlowRef" v-bind="getBindValue" :formConf="subFlowForm" v-else-if="isSubFlowNode()" @updateBpmn="updateBpmnProperties" />
      <ConnectNode ref="connectRef" v-bind="getBindValue" :formConf="connectForm" v-else-if="isConnectNode()" />
      <EndNode v-else />
    </template>
    <GlobalProperties v-bind="getBindValue" :formConf="globalForm" v-else />
  </section>
</template>
<script lang="ts" setup>
  import { computed, reactive, toRefs, onMounted, watch, unref, toRaw, ref, nextTick } from 'vue';
  import { getConfigData } from '@/api/onlineDev/visualDev';
  import { cloneDeep, omit } from 'lodash-es';
  import { NodeUtils } from '../bpmn/utils/nodeUtil';
  import { getPrintDevSelector } from '@/api/system/printDev';
  import { systemFieldOptions } from '../helper/define';
  import { useDebounceFn } from '@vueuse/core';
  import GlobalProperties from './GlobalProperties.vue';
  import StartNode from './StartNode.vue';
  import ApproverNode from './ApproverNode.vue';
  import SubFlowNode from './SubFlowNode.vue';
  import EndNode from './EndNode.vue';
  import ConnectNode from './ConnectNode.vue';
  import nodeConfig from '../helper/config';

  interface state {
    activeKey: number;
    startForm: any;
    approverForm: any;
    subFlowForm: any;
    connectForm: any;
    globalForm: any;
    formFieldList: any[];
    printTplOptions: any[];
    prevNodeList: any[];
    beforeNodeOptions: any[];
    oldFormId: string;
    sourceIsStart: boolean;
  }
  interface ComType {
    getContent: () => any;
  }
  interface OperateNodeType extends ComType {
    updateCheckStatus: () => any;
  }

  const state = reactive<state>({
    activeKey: 1,
    startForm: cloneDeep(nodeConfig.defaultStartForm),
    approverForm: cloneDeep(nodeConfig.defaultApproverForm),
    subFlowForm: cloneDeep(nodeConfig.defaultSubFlowForm),
    connectForm: cloneDeep(nodeConfig.defaultConnectForm),
    globalForm: cloneDeep(nodeConfig.defaultGlobalForm),
    formFieldList: [],
    printTplOptions: [],
    prevNodeList: [],
    beforeNodeOptions: [],
    oldFormId: '',
    sourceIsStart: false,
  });
  const { startForm, approverForm, subFlowForm, connectForm, globalForm } = toRefs(state);
  const updateFutureData = useDebounceFn(handleSetFutureData, 200);
  const props = defineProps(['element', 'bpmn', 'flowState', 'versionList', 'type']);
  const startRef = ref<Nullable<OperateNodeType>>(null);
  const approverRef = ref<Nullable<OperateNodeType>>(null);
  const requiredDisabled = futureKey => {
    return ['billRule', 'createUser', 'createTime', 'modifyTime', 'modifyUser', 'currPosition', 'currOrganize', 'table'].includes(futureKey);
  };
  const getDataType = data => {
    if (!data.__config__ || !data.__config__.futureKey) return '';
    const futureKey = data.__config__.futureKey;
    if (['inputNumber', 'datePicker', 'rate', 'slider'].includes(futureKey)) {
      return 'number';
    } else if (['checkbox', 'uploadFile', 'uploadImg', 'cascader', 'organizeSelect', 'areaSelect'].includes(futureKey)) {
      return 'array';
    } else if (
      ['select', 'treeSelect', 'depSelect', 'posSelect', 'userSelect', 'usersSelect', 'roleSelect', 'groupSelect', 'popupSelect', 'popupTableSelect'].includes(
        futureKey,
      )
    ) {
      if (data.multiple) return 'array';
    }
    return '';
  };

  const getBindValue = computed(() => ({
    ...props,
    printTplOptions: state.printTplOptions,
    prevNodeList: state.prevNodeList,
    beforeNodeOptions: state.beforeNodeOptions,
    sourceIsStart: state.sourceIsStart,
    formFieldsOptions: unref(formFieldsOptions),
    usedFormItems: unref(usedFormItems),
    funcOptions: unref(funcOptions),
    nodeOptions: unref(getApproverNodeOptions),
    getFormFieldList,
    initFormOperates,
    updateFutureData,
    updateAllNodeFormOperates,
    transformFormJson,
    transformFieldList,
  }));

  // 所有表单字段
  const formFieldsOptions = computed(() => state.formFieldList.filter(o => o.__config__.futureKey !== 'table').map(o => ({ ...o, disabled: false })));
  // 不包含子表的表单字段
  const usedFormItems = computed(() => unref(formFieldsOptions).filter(o => o.id.indexOf('-') < 0));
  // 流程时间及通知等用到表单字段
  const funcOptions = computed(() => unref(formFieldsOptions).map(o => ({ ...o, label: o.fullName ? o.id + '(' + o.fullName + ')' : o.id })));
  // 审批节点字段
  const getApproverNodeOptions = computed(() => {
    const futureData: any = props.bpmn?.get('futureData');
    if (!props.element) return [];
    const list: any = [];
    for (const key in futureData?.data) {
      const item = futureData?.data[key];
      if (NodeUtils.isApproverNode(item) && key != props.element?.id) {
        list.push({ fullName: `${item.nodeName}(${item.nodeId})`, id: item.nodeId });
      }
    }
    return list;
  });

  watch(
    () => props.element,
    () => {
      init();
    },
  );

  function init() {
    isStartNode() && initStartNodeData();
    isApproverNode() && initApproverNodeData();
    isSubFlowNode() && initSubFlowNodeData();
    isConnectNode() && initConnectNodeData();
    !props.element && initGlobalNodeData();
  }
  //初始化全局属性
  function initGlobalNodeData() {
    state.globalForm = cloneDeep(nodeConfig.defaultGlobalForm);
    const properties = cloneDeep(getFutureData('global') || {});
    Object.assign(state.globalForm, properties);
    if (!state.globalForm.formId) return;
    let formFieldList: any[] = [];
    const futureData: any = props.bpmn.get('futureData');
    const global = futureData.getValue('global');
    if (global.allFormMap && global.allFormMap['form_' + state.globalForm.formId]) {
      formFieldList = global.allFormMap['form_' + state.globalForm.formId] || [];
    }
    state.formFieldList = formFieldList;
  }
  //初始化发起人节点数据
  function initStartNodeData() {
    state.startForm = cloneDeep(nodeConfig.defaultStartForm);
    const properties = cloneDeep(getFutureData(props.element.id) || {});
    Object.assign(state.startForm, properties);
    state.oldFormId = state.startForm.formId;
    if (!state.oldFormId) return;
    let formFieldList: any[] = [];
    const futureData: any = props.bpmn.get('futureData');
    const global = futureData.getValue('global');
    if (global.allFormMap && global.allFormMap['form_' + state.oldFormId]) {
      formFieldList = global.allFormMap['form_' + state.oldFormId] || [];
    }
    state.formFieldList = formFieldList;
    nextTick(() => unref(startRef)?.updateCheckStatus());
  }
  // 初始化审批节点数据
  function initApproverNodeData() {
    state.approverForm = cloneDeep(nodeConfig.defaultApproverForm);
    const properties = cloneDeep(getFutureData(props.element.id) || {});
    let formFieldList: any[] = [];
    const futureData: any = props.bpmn.get('futureData');
    const global = futureData.getValue('global');
    const formId = properties.formId || global.formId;
    state.oldFormId = formId;
    if (formId && global.allFormMap && global.allFormMap['form_' + formId]) {
      formFieldList = global.allFormMap['form_' + formId] || [];
    }
    state.formFieldList = formFieldList;
    properties.formOperates = initFormOperates(properties);
    Object.assign(state.approverForm, properties);
    nextTick(() => unref(approverRef)?.updateCheckStatus());
    getBeforeNodeOptions();
    getPrevNodeOptions();
  }
  //初始化子流程
  function initSubFlowNodeData() {
    state.subFlowForm = cloneDeep(nodeConfig.defaultSubFlowForm);
    const properties = cloneDeep(getFutureData(props.element.id) || {});
    Object.assign(state.subFlowForm, properties);
    getBeforeNodeOptions();
    getPrevNodeOptions();
    let formFieldList: any[] = [];
    const futureData: any = props.bpmn.get('futureData');
    const global = futureData.getValue('global');
    const formId = properties.formId || global.formId;
    if (formId && global.allFormMap && global.allFormMap['form_' + formId]) {
      formFieldList = global.allFormMap['form_' + formId] || [];
    }
    state.formFieldList = formFieldList;
  }
  //初始化连接线
  function initConnectNodeData() {
    getConnectNodeFieldList();
    state.connectForm = cloneDeep(nodeConfig.defaultConnectForm);
    const properties = cloneDeep(getFutureData(props.element.id) || { nodeId: props.element.id });
    Object.assign(state.connectForm, properties);
    // 初始化条件表单数据
    let nodeConditions = properties.conditions || [];
    for (let i = 0; i < nodeConditions.length; i++) {
      for (let j = 0; j < unref(usedFormItems).length; j++) {
        if (nodeConditions[i].id === unref(usedFormItems)[j].id) {
          nodeConditions[i] = { ...nodeConditions[i], ...unref(usedFormItems)[j] };
        }
      }
    }
    state.connectForm.conditions = cloneDeep(nodeConditions || []);
    state.connectForm.matchLogic = properties.matchLogic || 'and';
    // 连接线来源是否是开始节点
    let elementRegistry: any = props.bpmn.get('elementRegistry');
    let connectElement = elementRegistry.get(props.element.id);
    state.sourceIsStart = connectElement?.source?.wnType == 'start';
  }
  // 判断是否是发起节点
  function isStartNode() {
    return props.element?.wnType ? NodeUtils.isStartNode({ type: props.element.wnType }) : false;
  }
  // 判断是否是审批节点
  function isApproverNode() {
    return props.element?.wnType ? NodeUtils.isApproverNode({ type: props.element.wnType }) : false;
  }
  //  判断是否是子流程节点
  function isSubFlowNode() {
    return props.element?.wnType ? NodeUtils.isSubFlowNode({ type: props.element.wnType }) : false;
  }
  //  判断是否是连接线
  function isConnectNode() {
    return props.element?.type ? NodeUtils.isConnectNode({ type: props.element.type }) : false;
  }
  function getFutureData(key) {
    const futureData: any = props.bpmn?.get('futureData');
    return futureData?.data[key];
  }
  function getFormConf() {
    if (isStartNode()) return state.startForm;
    if (isApproverNode()) return state.approverForm;
    if (isSubFlowNode()) return state.subFlowForm;
    if (isConnectNode()) return state.connectForm;
    return state.globalForm;
  }
  function getPrintTplList() {
    getPrintDevSelector().then(res => {
      state.printTplOptions = res.data.list.filter(o => o.children && o.children.length).map(o => ({ ...o, hasChildren: true }));
    });
  }
  /**
   * 获取连接线的表单字段
   */
  function getConnectNodeFieldList() {
    //获取当前选中节点的来源节点（上一节点）
    const prevNodeId = toRaw(props.element).source.id;
    if (!prevNodeId) {
      state.formFieldList = [];
    } else {
      let formFieldList: any[] = [];
      const futureData: any = props.bpmn.get('futureData');
      const global = futureData.getValue('global');
      const formId = futureData.getValue(prevNodeId, 'formId') || global.formId;
      if (formId && global.allFormMap && global.allFormMap['form_' + formId]) {
        formFieldList = global.allFormMap['form_' + formId] || [];
      }
      state.formFieldList = formFieldList.filter(o => o.__config__.futureKey !== 'table');
    }
  }
  /**
   * 更新bpmn中属性和展示
   * @param key  更新的key
   * @param value  更新的value
   */
  function updateBpmnProperties(key, value) {
    if (!props.element) return;
    const modeling: any = props.bpmn.get('modeling');
    const element = props.bpmn.get('elementRegistry').get(props.element.id);
    element[key] = value;
    modeling.updateProperties(element, {});
  }
  /**
   * 往global节点设置发起节点的表单id（方便allFormMap）
   */
  function updateGlobalFormId(id) {
    const futureData: any = props.bpmn.get('futureData');
    futureData.setValue('global', { formId: id });
  }
  function getFormFieldList(id, form, isSameForm = false) {
    getConfigData(id).then(res => {
      const { type = 1, formData } = res.data;
      let formJson: any = {},
        fieldList: any = [];
      if (formData) formJson = JSON.parse(formData);
      fieldList = type == 2 ? transformFormJson(formJson) : formJson.fields;
      let list: any[] = transformFieldList(fieldList);
      state.formFieldList = list;
      state[form].formOperates = initFormOperates(form, true, isSameForm);
      updateAllFormMap(id, list);
      // 更新所有没设置表单的节点的表单权限
      if (form === 'startForm') updateAllNodeFormOperates(isSameForm);
    });
  }
  /**
   * 更新全局属性中的allFormMap
   * @param id  id
   * @param list 数据
   */
  function updateAllFormMap(id, list) {
    const futureData: any = props.bpmn.get('futureData');
    const global = futureData.getValue('global');
    if (state.oldFormId && !getHasSameFormId(state.oldFormId)) delete global.allFormMap['form_' + state.oldFormId];
    if (id) global.allFormMap['form_' + id] = list;
    futureData.setValue('global', global);
    state.oldFormId = id;
  }
  /**
   * 判断其他节点是否跟当前节点旧表单同一表单
   * @param formId  表单id
   */
  function getHasSameFormId(formId) {
    if (!formId) return false;
    let hasSameFormId = false;
    const futureData: any = props.bpmn.get('futureData');
    for (const key in futureData.data) {
      const data = futureData.data[key];
      if ((data.type === 'approver' || data.type === 'start') && data.nodeId !== props.element?.id && data.formId === formId) {
        hasSameFormId = true;
        break;
      }
    }
    return hasSameFormId;
  }
  function transformFormJson(list) {
    const fieldList = list.map(o => ({
      __config__: {
        label: o.filedName,
        futureKey: o.futureKey || '',
        required: o.required || false,
      },
      __vModel__: o.filedId,
      multiple: o.multiple || false,
    }));
    return fieldList;
  }
  function transformFieldList(formFieldList) {
    let list: any[] = [];
    const loop = (data, parent?) => {
      if (!data) return;
      if (data.__vModel__) {
        const isTableChild = parent && parent.__config__ && parent.__config__.futureKey === 'table';
        list.push({
          id: isTableChild ? parent.__vModel__ + '-' + data.__vModel__ : data.__vModel__,
          fullName: isTableChild ? parent.__config__.label + '-' + data.__config__.label : data.__config__.label,
          ...omit(data, ['__config__', 'on', 'style', 'options', 'props', 'templateJson', 'columnOptions', 'addTableConf', 'tableConf']),
          __vModel__: isTableChild ? parent.__vModel__ + '-' + data.__vModel__ : data.__vModel__,
          __config__: {
            label: isTableChild ? parent.__config__.label + '-' + data.__config__.label : data.__config__.label,
            futureKey: data.__config__.futureKey,
            required: data.__config__.required,
            isSubTable: data.__config__.isSubTable,
          },
        });
      }
      if (Array.isArray(data)) data.forEach(d => loop(d, parent));
      if (data.__config__ && data.__config__.children && Array.isArray(data.__config__.children)) {
        loop(data.__config__.children, data);
      }
    };
    loop(formFieldList);
    return list;
  }
  function updateFormFieldList(data) {
    state.formFieldList = data;
    updateAllFormMap('', data);
  }
  function initFormOperates(form, isUpdate = false, isSameForm = false) {
    const formOperates = form.formOperates || [];
    let res: any[] = [];
    const getWriteById = id => {
      const arr = formOperates.filter(o => o.id === id);
      return arr.length ? arr[0].write : NodeUtils.isStartNode(state[form]);
    };
    const getReadById = id => {
      const arr = formOperates.filter(o => o.id === id);
      return arr.length ? arr[0].read : true;
    };
    const getRequiredById = id => {
      const arr = formOperates.filter(o => o.id === id);
      return arr.length ? arr[0].required : false;
    };
    if (!formOperates.length || isUpdate) {
      for (let i = 0; i < state.formFieldList.length; i++) {
        const data = state.formFieldList[i];
        res.push({
          id: data.id,
          name: data.fullName,
          required: !isSameForm ? data.__config__.required : data.__config__.required || getRequiredById(data.id),
          requiredDisabled: requiredDisabled(data.__config__.futureKey) || data.__config__.required,
          futureKey: data.__config__.futureKey,
          dataType: getDataType(data),
          read: !isSameForm ? true : getReadById(data.id),
          write: !isSameForm ? NodeUtils.isStartNode(state[form]) : getWriteById(data.id),
        });
      }
    } else {
      res = formOperates;
    }
    return res;
  }
  // 更新所有节点表单权限
  function updateAllNodeFormOperates(isSameForm = false, clearAll = false) {
    const futureData: any = props.bpmn.get('futureData');
    for (const key in futureData.data) {
      const data = futureData.data[key];
      if (data.type === 'approver' && !data.formId) {
        futureData.setValue(key, { formOperates: initFormOperates(data, true, isSameForm) });
      }
      //取消勾选允许审批节点独立配置表单对每个审批节点的表单数据做清空处理
      if (data.type === 'approver' && clearAll) {
        let formFieldList = [];
        const global = futureData.getValue('global');
        const formId = global.formId;
        state.oldFormId = data.formId;
        if (formId && global.allFormMap && global.allFormMap['form_' + formId]) {
          formFieldList = global.allFormMap['form_' + formId] || [];
        }
        updateFormFieldList(formFieldList);
        futureData.setValue(key, { formOperates: initFormOperates(data, true, isSameForm), formId: '', formName: '', assignList: [] });
      }
    }
  }
  function handleSetFutureData() {
    const formConf = getFormConf();
    const futureData: any = props.bpmn.get('futureData');
    if (formConf.nodeId) futureData.setValue(formConf.nodeId, formConf);
  }
  function getPrevNodeOptions() {
    const futureData: any = props.bpmn.get('futureData');
    const elementRegistry = props.bpmn.get('elementRegistry');
    state.prevNodeList = [];
    const getPrevNodeList = list => {
      for (let i = 0; i < list.length; i++) {
        const id = list[i].businessObject.sourceRef.id;
        const fullName = futureData.getValue(id, 'nodeName');
        const formId = futureData.getValue(id, 'formId');
        const type = futureData.getValue(id, 'type');
        if (['subFlow', 'gateway', 'confluence'].includes(type)) {
          const subFlowElement = elementRegistry.get(id);
          getPrevNodeList(subFlowElement?.incoming || []);
        } else {
          state.prevNodeList.push({ fullName, id, type, formId });
        }
      }
    };
    getPrevNodeList(toRaw(props.element)?.incoming || []);
  }
  function getBeforeNodeOptions() {
    const futureData: any = props.bpmn.get('futureData');
    const elementRegistry = props.bpmn.get('elementRegistry');
    const list: any[] = toRaw(props.element)?.incoming || [];
    let newList: any[] = [];
    let newLineList: any[] = [];
    const loop = data => {
      for (let i = 0; i < data.length; i++) {
        const id = data[i].businessObject.sourceRef.id;
        const fullName = futureData.getValue(id, 'nodeName');
        const formId = futureData.getValue(id, 'formId');
        const type = futureData.getValue(id, 'type');
        if (NodeUtils.isApproverNode({ type })) {
          newList.push({ fullName, id, type, formId });
          newLineList.push(data[i].id);
        }
        const element = elementRegistry.get(id);
        if (element?.incoming?.length) {
          for (let j = 0; j < element?.incoming.length; j++) {
            const item = element?.incoming[j];
            if (!newLineList.includes(item.id)) loop([item] || []);
          }
        }
      }
    };
    loop(list);
    let beforeNodeList: any[] = [];
    for (let i = 0; i < newList.length; i++) {
      if (newList[i].id === props.element.id) break;
      beforeNodeList.push(newList[i]);
    }
    state.beforeNodeOptions = beforeNodeList;
  }

  onMounted(() => {
    getPrintTplList();
    nextTick(() => initGlobalNodeData());
  });
</script>
