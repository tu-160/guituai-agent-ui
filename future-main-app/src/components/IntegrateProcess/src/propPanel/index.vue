<template>
  <BasicDrawer
    class="full-drawer propPanel-drawer"
    @register="registerDrawer"
    :width="620"
    @openChange="onDrawerOpenChange"
    :title="properties.title"
    showFooter
    :maskClosable="false"
    @ok="handleOk">
    <!-- 发起节点配置 -->
    <StartNode ref="startNodeRef" v-bind="getBindValue" :formConf="startForm" :formInfo="formInfo" v-if="value && isStartNode()" />
    <!-- 新增数据节点配置 -->
    <AddDataNode v-bind="getBindValue" :formConf="state.addDataForm" v-if="value && isAddDataNode()" />
    <!-- 更新数据节点配置 -->
    <UpdateDataNode ref="updateDataNodeRef" v-bind="getBindValue" :formConf="state.updateDataForm" v-if="value && isUpdateDataNode()" />
    <!-- 删除数据节点配置 -->
    <DeleteDataNode ref="deleteDataNodeRef" v-bind="getBindValue" :formConf="state.deleteDataForm" v-if="value && isDeleteDataNode()" />
    <!-- 数据接口节点配置 -->
    <DataInterfaceNode v-bind="getBindValue" :formConf="state.dataInterfaceForm" v-if="value && isDataInterfaceNode()" />
    <!-- 消息通知节点节点配置 -->
    <MessageNode v-bind="getBindValue" :formConf="state.messageForm" v-if="value && isMessageNode()" />
    <!-- 获取数据节点节点配置 -->
    <GetDataNode ref="getDataNodeRef" v-bind="getBindValue" :formConf="state.getDataForm" v-if="value && isGetDataNode()" />
    <!-- 发起审批节点节点配置 -->
    <LaunchFlowNode v-bind="getBindValue" :formConf="state.launchFlowForm" v-if="value && isLaunchFlowNode()" />
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { computed, reactive, toRefs, watch, unref, ref, nextTick } from 'vue';
  import { NodeUtils } from '../helper/util';
  import nodeConfig from '../helper/config';
  import { cloneDeep } from 'lodash-es';
  import { useMessage } from '@/hooks/web/useMessage';
  import { BasicDrawer, useDrawer } from '@/components/Drawer';
  import StartNode from './StartNode.vue';
  import AddDataNode from './AddDataNode.vue';
  import UpdateDataNode from './UpdateDataNode.vue';
  import DeleteDataNode from './DeleteDataNode.vue';
  import DataInterfaceNode from './DataInterfaceNode.vue';
  import MessageNode from './MessageNode.vue';
  import GetDataNode from './GetDataNode.vue';
  import LaunchFlowNode from './LaunchFlowNode.vue';
  import { getConfigData } from '@/api/onlineDev/visualDev';
  import { isEmpty } from '@/utils/is';
  import { dyOptionsList } from '@/components/FormGenerator/src/helper/config';
  import { getWebhookUrl } from '@/api/onlineDev/integrate';
  import { getFlowFormInfo } from '@/api/workFlow/template';

  interface State {
    properties: any;
    activeKey: string;
    startForm: any;
    addDataForm: any;
    updateDataForm: any;
    deleteDataForm: any;
    dataInterfaceForm: any;
    messageForm: any;
    getDataForm: any;
    launchFlowForm: any;
  }

  const props = defineProps([/* 当前节点数据 */ 'value', /* 整个节点数据 */ 'processData', 'formInfo']);
  const emit = defineEmits(['cancel', 'confirm']);
  const { createMessage } = useMessage();
  const [registerDrawer, { openDrawer, closeDrawer }] = useDrawer();
  const state = reactive<State>({
    properties: {}, // 当前节点数据
    activeKey: '1',
    startForm: cloneDeep(nodeConfig.defaultStartForm),
    addDataForm: {},
    updateDataForm: {},
    deleteDataForm: {},
    dataInterfaceForm: {},
    messageForm: {},
    getDataForm: {},
    launchFlowForm: {},
  });
  const { properties, startForm } = toRefs(state);
  const startNodeRef = ref();
  const getDataNodeRef = ref();
  const updateDataNodeRef = ref();
  const deleteDataNodeRef = ref();

  const integrateType = computed(() => props.formInfo?.type || 1);
  // 所有表单字段
  const formFieldsOptions = computed(() => {
    const formFieldsList: any[] = cloneDeep(
      unref(integrateType) != 2 ? props.processData.properties.formFieldList || [] : props.processData.childNode.properties.formFieldList || [],
    );
    if (!isDataInterfaceNode() && !isGetDataNode()) {
      const boo = formFieldsList.some(o => o.id === '@formId');
      if (!boo) formFieldsList.unshift({ fullName: '@表单ID', id: '@formId', label: '@formId(@表单ID)' });
    }
    return formFieldsList;
  });
  // 不包含子表的表单字段(更新条件/删除条件用到)
  const usedFormItems = computed(() => unref(formFieldsOptions).filter(o => o.id.indexOf('-') < 0));
  const getBindValue = computed(() => ({
    ...props,
    integrateType: unref(integrateType),
    formFieldsOptions: unref(formFieldsOptions),
    usedFormItems: unref(usedFormItems),
    getFormFieldList,
    getFlowFormFieldList,
  }));

  watch(
    () => props.value,
    val => {
      if (val && val.properties) {
        state.properties = cloneDeep(val.properties);
        openDrawer();
      }
    },
  );

  // 初始化通用节点数据
  function initCommonNodeData(key) {
    if (key !== 'start') state[key + 'Form'] = {};
    let properties = cloneDeep(props.value.properties);
    Object.assign(state[key + 'Form'], properties);
    nextTick(async () => {
      if (key === 'getData' || (['start', 'updateData', 'deleteData'].includes(key) && unref(integrateType) == 1)) {
        unref(eval(key + 'NodeRef'))?.initCondition();
      }
      if (unref(integrateType) == 2 && ['addData', 'updateData', 'deleteData'].includes(key) && !state[key + 'Form'].ruleList.length) {
        const emptyChildItem = { field: '', symbol: '==', fieldValueType: 1, fieldValue: undefined, futureKey: '', fieldValueFutureKey: '', cellKey: +new Date() };
        const emptyItem = { logic: 'and', groups: [emptyChildItem] };
        state[key + 'Form'].ruleList.push(cloneDeep(emptyItem));
      }
      if (unref(integrateType) == 3 && key === 'start' && !state[key + 'Form'].webhookUrl) {
        const res = await getWebhookUrl(props.formInfo.id);
        if (!res) return;
        state[key + 'Form'].webhookUrl = res.data.webhookUrl;
        state[key + 'Form'].webhookGetFieldsUrl = res.data.requestUrl;
        state[key + 'Form'].webhookRandomStr = res.data.randomStr;
      }
    });
  }
  // 发起人节点确认保存
  function startNodeConfirm() {
    if (unref(integrateType) == 1) {
      if (!state.startForm.formId) return createMessage.error('请选择触发表单');
      const res = startNodeRef.value?.submitCondition();
      if (!res) return;
      if (state.startForm.failMsgConfig.on === 1 && !state.startForm.failMsgConfig.msgId) return createMessage.error('请选择执行失败发送配置');
      if (state.startForm.startMsgConfig.on === 1 && !state.startForm.startMsgConfig.msgId) return createMessage.error('请选择开始执行发送配置');
      state.startForm.ruleList = res.conditionList || [];
      state.startForm.ruleMatchLogic = res.matchLogic;
      Object.assign(state.properties, state.startForm);
      const eventName = state.startForm.triggerEvent == 1 ? '新增数据' : state.startForm.triggerEvent == 2 ? '修改数据' : '删除数据';
      const content = `当[${state.startForm.formName}]表单[${eventName}]成功时`;
      emit('confirm', state.properties, content);
    } else if (unref(integrateType) == 2) {
      if (!state.startForm.startTime) return createMessage.error('请选择触发开始时间');
      if (!state.startForm.cron) return createMessage.error('请设置Cron表达式');
      if (state.startForm.endTimeType == 2 && !state.startForm.endTime) return createMessage.error('请选择触发结束时间');
      if (state.startForm.failMsgConfig.on === 1 && !state.startForm.failMsgConfig.msgId) return createMessage.error('请选择执行失败发送配置');
      if (state.startForm.startMsgConfig.on === 1 && !state.startForm.startMsgConfig.msgId) return createMessage.error('请选择开始执行发送配置');
      Object.assign(state.properties, state.startForm);
      emit('confirm', state.properties, state.startForm.cron);
    } else {
      if (!state.startForm.formFieldList.length) return createMessage.error('请设置接口字段');
      if (!formFieldListExist()) return;
      if (state.startForm.failMsgConfig.on === 1 && !state.startForm.failMsgConfig.msgId) return createMessage.error('请选择执行失败发送配置');
      if (state.startForm.startMsgConfig.on === 1 && !state.startForm.startMsgConfig.msgId) return createMessage.error('请选择开始执行发送配置');
      Object.assign(state.properties, state.startForm);
      emit('confirm', state.properties, '已设置');
    }
    closeDrawer();
  }
  // 新增数据节点确认保存
  function addDataNodeConfirm() {
    if (!state.addDataForm.formId) return createMessage.error('请选择目标表单');
    if (state.addDataForm.enableFlow && !state.addDataForm.flowId) return createMessage.error('请选择流程');
    if (!transferExist('addData')) return;
    if (unref(integrateType) != 1 && !conditionExist('addData')) return;
    Object.assign(state.properties, state.addDataForm);
    const content = `在[${state.addDataForm.formName}]表单中新增数据`;
    emit('confirm', state.properties, content);
    closeDrawer();
  }
  // 更新数据节点确认保存
  function updateDataNodeConfirm() {
    if (!state.updateDataForm.formId) return createMessage.error('请选择目标表单');
    if (state.updateDataForm.enableFlow && !state.updateDataForm.flowId) return createMessage.error('请选择流程');
    if (!transferExist('updateData')) return;
    if (unref(integrateType) == 1) {
      const res = updateDataNodeRef.value?.submitCondition();
      if (!res) return;
      state.updateDataForm.ruleList = res.conditionList || [];
      state.updateDataForm.ruleMatchLogic = res.matchLogic;
    } else {
      if (!conditionExist('updateData')) return;
    }
    Object.assign(state.properties, state.updateDataForm);
    const content = `在[${state.updateDataForm.formName}]表单中更新数据`;
    emit('confirm', state.properties, content);
    closeDrawer();
  }
  // 删除数据节点确认保存
  function deleteDataNodeConfirm() {
    if (!state.deleteDataForm.formId) return createMessage.error('请选择目标表单');
    if (unref(integrateType) == 1) {
      const res = deleteDataNodeRef.value?.submitCondition();
      if (!res) return;
      state.deleteDataForm.ruleList = res.conditionList || [];
      state.deleteDataForm.ruleMatchLogic = res.matchLogic;
    } else {
      if (!conditionExist('deleteData')) return;
    }
    Object.assign(state.properties, state.deleteDataForm);
    const content = `在[${state.deleteDataForm.formName}]表单中删除数据`;
    emit('confirm', state.properties, content);
    closeDrawer();
  }
  // 数据接口节点确认保存
  function dataInterfaceNodeConfirm() {
    if (!state.dataInterfaceForm.formId) return createMessage.error('请选择执行数据接口');
    Object.assign(state.properties, state.dataInterfaceForm);
    const content = `执行[${state.dataInterfaceForm.formName}]数据接口`;
    emit('confirm', state.properties, content);
    closeDrawer();
  }
  // 消息通知节点确认保存
  function messageNodeConfirm() {
    if (!state.messageForm.msgUserIds.length) return createMessage.error('请选择接收人');
    if (!state.messageForm.msgId) return createMessage.error('请选择发送配置');
    Object.assign(state.properties, state.messageForm);
    const content = `执行[${state.messageForm.msgName}]的消息通知`;
    emit('confirm', state.properties, content);
    closeDrawer();
  }
  // 获取数据节点确认保存
  function getDataNodeConfirm() {
    const msg = state.getDataForm.formType == 3 ? '请选择数据接口' : '请选择表单';
    if (!state.getDataForm.formId) return createMessage.error(msg);
    if (state.getDataForm.formType != 3) {
      const res = getDataNodeRef.value?.submitCondition();
      if (!res) return;
      state.getDataForm.ruleList = res.conditionList || [];
      state.getDataForm.ruleMatchLogic = res.matchLogic;
    }
    Object.assign(state.properties, state.getDataForm);
    const content = `从[${state.getDataForm.formName}]中获取数据`;
    emit('confirm', state.properties, content);
    closeDrawer();
  }
  // 发起审批节点确认保存
  function launchFlowNodeConfirm() {
    if (!state.launchFlowForm.flowId) return createMessage.error('请选择流程');
    if (!state.launchFlowForm.initiator.length) return createMessage.error('请选择发起人');
    if (!transferExist('launchFlow')) return;
    Object.assign(state.properties, state.launchFlowForm);
    const content = `发起[${state.launchFlowForm.flowName}]流程`;
    emit('confirm', state.properties, content);
    closeDrawer();
  }
  // 获取目标表单字段
  function getFormFieldList(id, form) {
    getConfigData(id).then(res => {
      const { formData } = res.data;
      let formJson: any = {},
        fieldList: any = [];
      if (formData) formJson = JSON.parse(formData);
      fieldList = formJson.fields || [];
      let list: any[] = transformFieldList(fieldList);
      state[form + 'Form'].formFieldList = list.map(o => ({ ...o, label: o.fullName ? o.id + '(' + o.fullName + ')' : o.id }));
      if (form === 'addData') updateTransferList(form);
      if (form === 'getData' || (['start', 'updateData', 'deleteData'].includes(form) && unref(integrateType) == 1)) {
        unref(eval(form + 'NodeRef'))?.initCondition();
      }
    });
  }
  // 获取流程表单字段
  function getFlowFormFieldList(id, form) {
    getFlowFormInfo(id).then(res => {
      let { type = 1, formData } = res.data;
      let formJson: any = {},
        fieldList: any[] = [];
      if (formData) formJson = JSON.parse(formData);
      fieldList = type == 2 ? transformFormJson(formJson) : formJson.fields;
      let list: any[] = transformFieldList(fieldList);
      state[form + 'Form'].formFieldList = list.map(o => ({ ...o, label: o.fullName ? o.id + '(' + o.fullName + ')' : o.id }));
      if (form === 'launchFlow') updateTransferList(form);
    });
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
      if (data.__vModel__ && data.__config__.futureKey !== 'table') {
        const isTableChild = parent && parent.__config__ && parent.__config__.futureKey === 'table';
        const item = {
          id: isTableChild ? parent.__vModel__ + '-' + data.__vModel__ : data.__vModel__,
          fullName: isTableChild ? parent.__config__.label + '-' + data.__config__.label : data.__config__.label,
          ...data,
          disabled: false,
        };
        const config = item.__config__;
        if (dyOptionsList.includes(config.futureKey) && config.dataType !== 'static') delete item.options;
        list.push(item);
      }
      if (Array.isArray(data)) data.forEach(d => loop(d, parent));
      if (data.__config__ && data.__config__.children && Array.isArray(data.__config__.children)) {
        loop(data.__config__.children, data);
      }
    };
    loop(formFieldList);
    return list;
  }
  function updateTransferList(form) {
    const formFieldList = state[form + 'Form'].formFieldList;
    let list: any = [];
    for (let i = 0; i < formFieldList.length; i++) {
      if (formFieldList[i].__config__?.required) {
        list.push({ targetField: formFieldList[i].id, targetFieldLabel: formFieldList[i].fullName, sourceType: 1, sourceValue: '', required: true });
      }
    }
    state[form + 'Form'].transferList = list;
  }
  // 字段设置验证
  function transferExist(form) {
    const list = state[form + 'Form'].transferList;
    let isOk = true;
    for (let i = 0; i < list.length; i++) {
      const e = list[i];
      if (e.required) {
        if (!e.sourceValue) {
          createMessage.warning(`${e.targetFieldLabel}的值不能为空`);
          isOk = false;
          break;
        }
      } else {
        if (!e.targetField) {
          createMessage.warning(`目标表单字段不能为空`);
          isOk = false;
          break;
        }
      }
    }
    return isOk;
  }
  // 更新/删除条件/唯一性验证验证
  function conditionExist(form) {
    const list = state[form + 'Form'].ruleList;
    let isOk = true;
    outer: for (let i = 0; i < list.length; i++) {
      const e = list[i];
      let label = '';
      if (unref(integrateType) == 1) {
        if (form === 'updateData') label = '更新条件';
        if (form === 'deleteData') label = '删除条件';
      }
      if (unref(integrateType) == 2) {
        label = '目标表单';
      }
      for (let j = 0; j < e.groups.length; j++) {
        const child = e.groups[j];
        if (!child.field) {
          createMessage.warning(`${label}字段不能为空`);
          isOk = false;
          break outer;
        }
        if (
          !['null', 'notNull'].includes(child.symbol) &&
          (!child.fieldValue || isEmpty(child.fieldValue)) &&
          (!['inputNumber', 'calculate'].includes(child.futureKey) || (['inputNumber', 'calculate'].includes(child.futureKey) && child.fieldValue !== 0))
        ) {
          createMessage.warning(`${child.fullName}的值不能为空`);
          isOk = false;
          break outer;
        }
      }
    }
    return isOk;
  }
  // webhook接口字段验证
  function formFieldListExist() {
    const list = state.startForm.formFieldList;
    let isOk = true;
    for (let i = 0; i < list.length; i++) {
      const e = list[i];
      if (!e.id) {
        createMessage.warning(`第${i + 1}行字段不能为空`);
        isOk = false;
        break;
      }
      if (!e.fullName) {
        createMessage.warning(`第${i + 1}行字段说明不能为空`);
        isOk = false;
        break;
      }
    }
    return isOk;
  }
  // 判断是否是发起节点
  function isStartNode() {
    return props.value ? NodeUtils.isStartNode(props.value) : false;
  }
  // 判断是否是新增数据节点
  function isAddDataNode() {
    return props.value ? NodeUtils.isAddDataNode(props.value) : false;
  }
  // 判断是否是更新数据节点
  function isUpdateDataNode() {
    return props.value ? NodeUtils.isUpdateDataNode(props.value) : false;
  }
  // 判断是否是删除数据节点
  function isDeleteDataNode() {
    return props.value ? NodeUtils.isDeleteDataNode(props.value) : false;
  }
  // 判断是否是数据接口节点
  function isDataInterfaceNode() {
    return props.value ? NodeUtils.isDataInterfaceNode(props.value) : false;
  }
  // 判断是否是消息通知节点
  function isMessageNode() {
    return props.value ? NodeUtils.isMessageNode(props.value) : false;
  }
  // 判断是否是获取数据节点
  function isGetDataNode() {
    return props.value ? NodeUtils.isGetDataNode(props.value) : false;
  }
  // 判断是否是发起审批节点
  function isLaunchFlowNode() {
    return props.value ? NodeUtils.isLaunchFlowNode(props.value) : false;
  }
  function onDrawerOpenChange(val) {
    if (!val) {
      // 重置数据为默认状态
      state.startForm = cloneDeep(nodeConfig.defaultStartForm);
      emit('cancel');
      return;
    }
    isStartNode() && initCommonNodeData('start');
    isAddDataNode() && initCommonNodeData('addData');
    isUpdateDataNode() && initCommonNodeData('updateData');
    isDeleteDataNode() && initCommonNodeData('deleteData');
    isDataInterfaceNode() && initCommonNodeData('dataInterface');
    isMessageNode() && initCommonNodeData('message');
    isGetDataNode() && initCommonNodeData('getData');
    isLaunchFlowNode() && initCommonNodeData('launchFlow');
  }
  function handleOk() {
    isStartNode() && startNodeConfirm();
    isAddDataNode() && addDataNodeConfirm();
    isUpdateDataNode() && updateDataNodeConfirm();
    isDeleteDataNode() && deleteDataNodeConfirm();
    isDataInterfaceNode() && dataInterfaceNodeConfirm();
    isMessageNode() && messageNodeConfirm();
    isGetDataNode() && getDataNodeConfirm();
    isLaunchFlowNode() && launchFlowNodeConfirm();
  }
</script>
