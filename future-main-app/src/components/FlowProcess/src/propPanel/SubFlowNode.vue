<template>
  <HeaderContainer :formConf="formConf" @onNodeNameChange="onNodeNameChange" />
  <a-tabs v-model:activeKey="activeKey" size="small" class="pane-tabs">
    <a-tab-pane :key="1" tab="基础信息" />
    <a-tab-pane :key="2" tab="节点通知" />
  </a-tabs>
  <a-form :colon="false" :model="formConf" class="config-content" layout="vertical">
    <!-- 基础信息 -->
    <template v-if="activeKey === 1">
      <a-form-item label="子流程类型">
        <a-radio-group v-model:value="formConf.isAsync" class="common-radio">
          <a-radio :value="0">同步</a-radio>
          <a-radio :value="1">异步</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="子流程表单">
        <FlowModal :value="formConf.flowId" :title="formConf.flowName" @change="onSubFlowIdChange" />
      </a-form-item>
      <a-form-item label="子流程传递">
        <a-input :value="formConf.assignList.length ? '已设置' : ''" placeholder="请设置子流程传递规则" readonly class="hand" @click="openTransmitRuleBox">
          <template #suffix>
            <span class="ant-select-arrow"><down-outlined /></span>
          </template>
        </a-input>
      </a-form-item>
      <a-form-item label="发起设置">
        <div class="common-tip mb-10px">指定的成员作为子流程发起人，多人时，发起多个子流程</div>
        <a-button preIcon="icon-ym icon-ym-btn-add" @click="createMessage.error('请选择子流程表单')" v-if="!formConf.flowId">添加发起人</a-button>
        <template v-else>
          <initiator-user-select
            v-if="formConf.subFlowLaunchPermission == 2"
            v-model:value="formConf.approvers"
            buttonType="button"
            multiple
            :flowId="formConf.flowId"
            @change="onInitiatorChange" />
          <future-users-select v-else v-model:value="formConf.approvers" buttonType="button" modalTitle="添加发起人" multiple @labelChange="onLabelChange" />
        </template>
      </a-form-item>
      <a-form-item>
        <template #label>异常处理<BasicHelp text="子流程发起节点人员异常时遵循该规则" /></template>
        <future-select v-model:value="formConf.errorRule" :options="subFlowErrorRuleOptions" @change="formConf.errorRuleUser = []" />
        <future-user-select v-model:value="formConf.errorRuleUser" buttonType="button" multiple class="mt-10px" v-if="formConf.errorRule === 2" />
      </a-form-item>
      <a-form-item v-if="props.type != 1" label="分流规则">
        <future-select v-model:value="formConf.divideRule" :options="divideRuleOptions" />
      </a-form-item>
      <a-form-item>
        <template #label>子流程发起后自动提交<BasicHelp text="流程发起的下一节点设置候选人时无法自动发起审批" /></template>
        <a-radio-group v-model:value="formConf.autoSubmit" class="common-radio">
          <a-radio :value="0">否</a-radio>
          <a-radio :value="1">是</a-radio>
        </a-radio-group>
      </a-form-item>
    </template>
    <!-- 流程通知 -->
    <template v-if="activeKey === 2">
      <a-alert message="自定义通知以“消息中心-发送配置”为主，请移步设置；关闭：表示不提醒，默认：表示站内提醒" type="warning" showIcon class="!mb-10px" />
      <!-- 子流程发起 -->
      <NoticeConfig :noticeConfig="formConf.launchMsgConfig" :funcOptions="funcOptions" type="launch" />
    </template>
  </a-form>
  <AssignRuleModal @register="registerAssignRuleModal" v-bind="getAssignBindValue" />
</template>
<script lang="ts" setup>
  import { reactive, toRefs, watch, computed, inject, unref, onMounted } from 'vue';
  import { subFlowErrorRuleOptions, divideRuleOptions } from '../helper/define';
  import { getFlowFormInfo } from '@/api/workFlow/template';
  import { DownOutlined } from '@ant-design/icons-vue';
  import { useMessage } from '@/hooks/web/useMessage';
  import { cloneDeep } from 'lodash-es';
  import { useModal } from '@/components/Modal';
  import HeaderContainer from './components/HeaderContainer.vue';
  import NoticeConfig from './components/NoticeConfig.vue';
  import FlowModal from './components/FlowModal.vue';
  import AssignRuleModal from './components/AssignRuleModal.vue';
  import InitiatorUserSelect from './components/InitiatorUserSelect.vue';

  interface State {
    activeKey: number;
    childFieldOptions: any[];
  }
  const state = reactive<State>({
    activeKey: 1,
    childFieldOptions: [],
  });
  defineOptions({ inheritAttrs: false });
  const emit = defineEmits(['updateBpmn']);
  const { createMessage } = useMessage();
  const props = defineProps([
    'printTplOptions',
    'prevNodeList',
    'funcOptions',
    'formFieldsOptions',
    'formConf',
    'getFormFieldList',
    'updateFutureData',
    'transformFormJson',
    'transformFieldList',
    'nodeOptions',
    'type',
  ]);
  const { activeKey } = toRefs(state);
  const bpmn: (() => string | undefined) | undefined = inject('bpmn');
  const [registerAssignRuleModal, { openModal: openAssignRuleModal }] = useModal();

  const getBpmn = computed(() => (bpmn as () => any)());
  const getAssignBindValue = computed(() => ({
    formConf: props.formConf,
    formFieldsOptions: props.formFieldsOptions,
  }));

  watch(
    () => props.formConf,
    () => props.updateFutureData(),
    { deep: true, immediate: true },
  );

  function onSubFlowIdChange(id, item) {
    if (!id) {
      props.formConf.flowId = '';
      props.formConf.flowName = '';
      props.formConf.assignList = [];
      props.formConf.approvers = [];
      state.childFieldOptions = [];
      props.formConf.subFlowLaunchPermission = 1;
      return;
    }
    if (props.formConf.flowId === id) return;
    props.formConf.flowId = id;
    props.formConf.flowName = item.fullName;
    props.formConf.assignList = [];
    props.formConf.approvers = [];
    props.formConf.subFlowLaunchPermission = item.visibleType || 1;
    getSubFlowFormInfo();
  }
  function getSubFlowFormInfo() {
    if (!props.formConf.flowId) return;
    getFlowFormInfo(props.formConf.flowId).then(res => {
      let { type = 1, formData } = res.data;
      props.formConf.formId = res.data.id;
      let formJson: any = {},
        fieldList: any[] = [],
        fieldOptions: any[] = [];
      if (formData) formJson = JSON.parse(formData);
      fieldList = type == 2 ? props.transformFormJson(formJson) : formJson.fields;
      fieldOptions = props.transformFieldList(fieldList).filter(o => o.__config__.futureKey !== 'table');
      state.childFieldOptions = fieldOptions.map(o => ({ ...o, label: o.fullName ? o.id + '(' + o.fullName + ')' : o.id }));
    });
  }
  function onInitiatorChange(_val, selectedData) {
    const labels = selectedData.map(o => o.fullName).join();
    onLabelChange(labels);
  }
  function onLabelChange(labels) {
    props.formConf.content = labels;
    emit('updateBpmn', 'elementBodyName', labels);
  }
  function openTransmitRuleBox() {
    if (!props.formConf.flowId) return createMessage.error('请选择子流程表单');
    const assignList = getRealAssignList(props.formConf.assignList ? cloneDeep(props.formConf.assignList) : []);
    openAssignRuleModal(true, { assignList, childFieldOptions: state.childFieldOptions, isSubFlow: 1 });
  }
  function onNodeNameChange(nodeName) {
    emit('updateBpmn', 'nodeName', nodeName);
  }
  function getRealAssignList(assignList) {
    const futureData: any = unref(getBpmn).get('futureData');
    const global = futureData.getValue('global');
    let newAssignList = props.prevNodeList.map(o => {
      let formFieldList: any[] = [];
      const formId = o.formId || global.formId;
      if (formId && global.allFormMap && global.allFormMap['form_' + formId]) {
        formFieldList = global.allFormMap['form_' + formId] || [];
      }
      formFieldList = formFieldList.filter(o => o.__config__.futureKey !== 'table');
      return {
        nodeId: o.id,
        title: o.fullName,
        formFieldList,
        ruleList: [],
      };
    });
    if (!assignList.length) return newAssignList;
    let list: any[] = [];
    // 去掉被删掉的节点
    for (let i = 0; i < assignList.length; i++) {
      const e = assignList[i];
      inter: for (let j = 0; j < newAssignList.length; j++) {
        if (e.nodeId === newAssignList[j].nodeId) {
          const item = {
            nodeId: e.nodeId,
            title: newAssignList[j].title,
            formFieldList: newAssignList[j].formFieldList,
            ruleList: e.ruleList,
          };
          list.push(item);
          break inter;
        }
      }
    }
    const addList = newAssignList.filter(o => !assignList.some(item => item.nodeId === o.nodeId));
    return [...list, ...addList];
  }

  onMounted(() => {
    getSubFlowFormInfo();
  });
</script>
