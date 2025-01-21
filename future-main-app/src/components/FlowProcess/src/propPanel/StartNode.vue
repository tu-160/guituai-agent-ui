<template>
  <HeaderContainer :formConf="formConf" @onNodeNameChange="onNodeNameChange" />
  <a-tabs v-model:activeKey="activeKey" size="small" class="pane-tabs">
    <a-tab-pane :key="1" tab="基础信息" />
    <a-tab-pane :key="2" tab="表单权限" />
    <a-tab-pane :key="3" tab="流程通知" />
    <a-tab-pane :key="4" tab="超时设置" />
  </a-tabs>
  <template v-if="activeKey !== 2">
    <a-form :colon="false" :model="formConf" class="config-content" layout="vertical">
      <!-- 基础信息 -->
      <template v-if="activeKey === 1">
        <a-form-item label="流程表单">
          <FlowFormModal
            :value="formConf.formId"
            :title="formConf.formName"
            :isStartForm="1"
            @change="onFormIdChange"
            placeholder="请选择表单"
            :disabled="flowState != 0 || versionList.length > 1" />
        </a-form-item>
        <a-form-item v-if="props.type != 1" label="分流规则">
          <future-select v-model:value="formConf.divideRule" :options="divideRuleOptions" />
        </a-form-item>
        <a-form-item label="节点打印">
          <a-checkbox class="leading-32px" v-model:checked="formConf.printConfig.on">节点打印</a-checkbox>
          <template v-if="formConf.printConfig.on">
            <a-form-item label="请选择打印模版" class="!mt-12px">
              <future-tree-select
                v-model:value="formConf.printConfig.printIds"
                :options="printTplOptions"
                multiple
                lastLevel
                :showCheckedStrategy="TreeSelect.SHOW_CHILD" />
            </a-form-item>
            <a-form-item label="打印条件">
              <future-select v-model:value="formConf.printConfig.conditionType" :options="printConditionTypeOptions" />
            </a-form-item>
            <template v-if="formConf.printConfig.conditionType == 4">
              <a-button @click="handlePrintConfig">设置打印条件</a-button>
              <div class="conditions-content" v-if="formConf.printConfig.conditions.length">
                <span @click="handlePrintConfig"> {{ getPrintConditionsContent }}</span>
                <i class="icon-ym icon-ym-delete" @click="handlePrintConfigRemove"></i>
              </div>
            </template>
          </template>
        </a-form-item>
      </template>
      <!-- 流程通知 -->
      <template v-if="activeKey === 3">
        <a-alert message="自定义通知以“消息中心-发送配置”为主，请移步设置；关闭：表示不提醒，默认：表示站内提醒" type="warning" showIcon class="!mb-10px" />
        <!-- 流程待办 -->
        <NoticeConfig :noticeConfig="formConf.waitMsgConfig" :funcOptions="funcOptions" type="wait" />
        <!-- 流程结束 -->
        <NoticeConfig :noticeConfig="formConf.endMsgConfig" :funcOptions="funcOptions" type="end" />
        <!-- 流程评论 -->
        <NoticeConfig :noticeConfig="formConf.commentMsgConfig" :funcOptions="funcOptions" type="comment" />
        <!-- 节点同意 -->
        <NoticeConfig :noticeConfig="formConf.approveMsgConfig" :funcOptions="funcOptions" type="approve" />
        <!-- 节点拒绝 -->
        <NoticeConfig :noticeConfig="formConf.rejectMsgConfig" :funcOptions="funcOptions" type="reject" />
        <!-- 节点退回 -->
        <NoticeConfig :noticeConfig="formConf.backMsgConfig" :funcOptions="funcOptions" type="back" />
        <!-- 节点抄送 -->
        <NoticeConfig :noticeConfig="formConf.copyMsgConfig" :funcOptions="funcOptions" type="copy" />
        <!-- 节点超时 -->
        <NoticeConfig :noticeConfig="formConf.overTimeMsgConfig" :funcOptions="funcOptions" type="overTime" />
        <!-- 节点提醒 -->
        <NoticeConfig :noticeConfig="formConf.noticeMsgConfig" :funcOptions="funcOptions" type="notice" />
      </template>
      <!-- 超时设置 -->
      <template v-if="activeKey === 4">
        <a-form-item label="限时设置">
          <future-select v-model:value="formConf.timeLimitConfig.on" :options="overTimeMsgOptions" @change="onTimeLimitChange" />
          <template v-if="formConf.timeLimitConfig.on === 1">
            <a-form-item class="!mt-12px" label="节点处理截止时间">
              <div class="flex items-center">
                <future-select v-model:value="formConf.timeLimitConfig.nodeLimit" :options="overTimeOptions" disabled />
                <span class="!ml-10px flex-shrink-0">开始</span>
              </div>
              <div class="countersign-cell mt-12px">
                <span class="w-90px inline-block">流程到达节点</span>
                <a-input-number v-model:value="formConf.timeLimitConfig.duringDeal" :min="1" :precision="0" class="!w-90px !mx-8px" />
                <span>小时后，视为超时</span>
              </div>
            </a-form-item>
            <a-form-item label="限时提醒规则" class="!mt-12px">
              <future-select v-model:value="formConf.noticeConfig.on" :options="overTimeMsgOptions" />
            </a-form-item>
            <a-form-item v-if="formConf.noticeConfig.on === 1">
              <div class="countersign-cell">
                <span class="w-90px inline-block">流程到达节点</span>
                <a-input-number v-model:value="formConf.noticeConfig.firstOver" :min="1" :precision="0" class="!w-90px !mx-8px" />
                <span>小时，开始提醒通知</span>
              </div>
              <div class="countersign-cell mt-12px">
                <span class="w-90px inline-block">每间隔</span>
                <a-input-number v-model:value="formConf.noticeConfig.overTimeDuring" :min="1" :precision="0" class="!w-90px !mx-8px" />
                <span>小时，提醒通知一次</span>
              </div>
              <div class="ant-form-item-label !mt-12px"><label class="ant-form-item-no-colon">提醒事务</label></div>
              <a-row class="leading-32px block">
                <a-checkbox v-model:checked="formConf.noticeConfig.overNotice">
                  提醒通知<BasicHelp text="勾选后才能进行提醒消息发送（站内信系统默认发送，第三方超时消息需在节点通知内配置）" />
                </a-checkbox>
              </a-row>
              <a-row class="leading-32px block" v-if="false">
                <a-checkbox v-model:checked="formConf.noticeConfig.overEvent">提醒事件<BasicHelp text="请在节点事件内配置提醒事件" /></a-checkbox>
              </a-row>
              <div class="countersign-cell mt-12px" v-if="formConf.noticeConfig.overEvent">
                <span class="w-90px inline-block">在提醒通知第</span>
                <a-input-number v-model:value="formConf.noticeConfig.overEventTime" :min="1" :precision="0" class="!w-90px !mx-8px" />
                <span>次时，执行提醒事件</span>
              </div>
            </a-form-item>
          </template>
        </a-form-item>
        <a-form-item label="超时设置">
          <future-select v-model:value="formConf.overTimeConfig.on" :options="overTimeMsgOptions" :disabled="formConf.timeLimitConfig.on == 0" />
        </a-form-item>
        <a-form-item v-if="formConf.overTimeConfig.on === 1">
          <div class="countersign-cell">
            <span class="w-90px inline-block">超时</span>
            <a-input-number v-model:value="formConf.overTimeConfig.firstOver" :min="0" :precision="0" class="!w-90px !mx-8px" />
            <span>小时，开始超时通知</span>
          </div>
          <div class="countersign-cell mt-12px">
            <span class="w-90px inline-block">每间隔</span>
            <a-input-number v-model:value="formConf.overTimeConfig.overTimeDuring" :min="1" :precision="0" class="!w-90px !mx-8px" />
            <span>小时，超时通知一次</span>
          </div>
          <div class="ant-form-item-label !mt-12px"><label class="ant-form-item-no-colon">超时事务</label></div>
          <a-row class="leading-32px block">
            <a-checkbox v-model:checked="formConf.overTimeConfig.overNotice">
              超时通知<BasicHelp text="勾选后才能进行提醒消息发送（站内信系统默认发送，第三方超时消息需在节点通知内配置）" />
            </a-checkbox>
          </a-row>
          <a-row class="leading-32px block" v-if="false">
            <a-checkbox v-model:checked="formConf.overTimeConfig.overEvent">超时事件<BasicHelp text="请在节点事件内配置提醒事件" /></a-checkbox>
          </a-row>
          <div class="countersign-cell" v-if="formConf.overTimeConfig.overEvent">
            <span class="w-90px inline-block">在超时通知</span>
            <a-input-number v-model:value="formConf.overTimeConfig.overEventTime" :min="1" :precision="0" class="!w-90px !mx-8px" />
            <span>次时，执行超时事件</span>
          </div>
          <a-row class="leading-32px block">
            <a-checkbox v-model:checked="formConf.overTimeConfig.overAutoApprove">
              超时自动审批
              <BasicHelp text="当前审批节点表单必填字段为空工单流转时不做校验，下一审批节点设置候选人员、选择分支、异常节点时当前审批节点规则失效" />
            </a-checkbox>
          </a-row>
          <div class="countersign-cell" v-if="formConf.overTimeConfig.overAutoApprove">
            <span class="w-90px inline-block">在超时通知</span>
            <a-input-number v-model:value="formConf.overTimeConfig.overAutoApproveTime" :min="1" :precision="0" class="!w-90px !mx-8px" />
            <span>次，执行超时自动审批</span>
          </div>
        </a-form-item>
      </template>
    </a-form>
  </template>
  <!-- 表单权限 -->
  <template v-else>
    <a-table :data-source="formConf.formOperates" :columns="formOperatesColumns" size="small" :pagination="false" :scroll="{ y: 'calc(100vh - 197px)' }">
      <template #headerCell="{ column }">
        <template v-if="column.key === 'write'">
          <a-checkbox v-model:checked="readAllChecked" :indeterminate="isReadIndeterminate" @change="handleCheckAllChange($event, 1)">查看</a-checkbox>
          <a-checkbox v-model:checked="writeAllChecked" :indeterminate="isWriteIndeterminate" @change="handleCheckAllChange($event, 2)">编辑</a-checkbox>
          <a-checkbox v-model:checked="requiredAllChecked" :indeterminate="isRequiredIndeterminate" @change="handleCheckAllChange($event, 3)">
            必填
          </a-checkbox>
        </template>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'write'">
          <a-checkbox v-model:checked="record.read" @change="handleCheckedChange">查看</a-checkbox>
          <a-checkbox v-model:checked="record.write" @change="handleCheckedChange">编辑</a-checkbox>
          <a-checkbox v-model:checked="record.required" :disabled="record.requiredDisabled" @change="handleCheckedChange">必填</a-checkbox>
        </template>
      </template>
    </a-table>
  </template>
  <ConditionModal @register="registerConditionModal" @confirm="updatePrintConfig" />
</template>
<script lang="ts" setup>
  import { reactive, toRefs, watch, computed } from 'vue';
  import { TreeSelect } from 'ant-design-vue';
  import { overTimeMsgOptions, overTimeOptions, printConditionTypeOptions, divideRuleOptions } from '../helper/define';
  import { useModal } from '@/components/Modal';
  import HeaderContainer from './components/HeaderContainer.vue';
  import NoticeConfig from './components/NoticeConfig.vue';
  import FlowFormModal from './components/FlowFormModal.vue';
  import ConditionModal from './components/ConditionModal.vue';
  import { NodeUtils } from '../bpmn/utils/nodeUtil';

  interface State {
    activeKey: number;
    readAllChecked: boolean;
    writeAllChecked: boolean;
    requiredAllChecked: boolean;
    isReadIndeterminate: boolean;
    isWriteIndeterminate: boolean;
    isRequiredIndeterminate: boolean;
  }
  const state = reactive<State>({
    activeKey: 1,
    readAllChecked: false,
    writeAllChecked: false,
    requiredAllChecked: false,
    isReadIndeterminate: false,
    isWriteIndeterminate: false,
    isRequiredIndeterminate: false,
  });
  defineOptions({ inheritAttrs: false });
  defineExpose({ updateCheckStatus });
  const emit = defineEmits(['updateBpmn', 'updateGlobalFormId', 'updateFormFieldList']);
  const props = defineProps([
    'printTplOptions',
    'funcOptions',
    'formConf',
    'getFormFieldList',
    'updateFutureData',
    'initFormOperates',
    'updateAllNodeFormOperates',
    'usedFormItems',
    'formFieldsOptions',
    'flowState',
    'versionList',
    'type',
  ]);
  const { activeKey, readAllChecked, writeAllChecked, requiredAllChecked, isReadIndeterminate, isWriteIndeterminate, isRequiredIndeterminate } = toRefs(state);
  const [registerConditionModal, { openModal: openConditionModal }] = useModal();
  const formOperatesColumns = [
    { title: '表单字段', dataIndex: 'name', key: 'name' },
    { title: '操作', dataIndex: 'write', key: 'write', align: 'center', width: 250 },
  ];

  const getPrintConditionsContent = computed(() =>
    NodeUtils.getConditionsContent(props.formConf.printConfig.conditions, props.formConf.printConfig.matchLogic),
  );

  watch(
    () => state.activeKey,
    val => {
      if (val === 2) updateCheckStatus();
    },
  );
  watch(
    () => props.formConf,
    () => props.updateFutureData(),
    { deep: true, immediate: true },
  );

  function onFormIdChange(id, item) {
    emit('updateBpmn', 'elementBodyName', item.fullName);
    emit('updateGlobalFormId', id);
    if (!id) return handleNull();
    const isSameForm = props.formConf.formId === id;
    props.formConf.formId = id;
    props.formConf.formName = item.fullName;
    props.getFormFieldList(id, 'startForm', isSameForm);
  }
  function handleNull() {
    props.formConf.formId = '';
    props.formConf.formName = '';
    emit('updateFormFieldList', []);
    props.formConf.formOperates = props.initFormOperates(props.formConf, true);
    props.updateAllNodeFormOperates();
  }
  function handleCheckAllChange(e, type) {
    const val = e.target.checked;
    if (type == 1) state.isReadIndeterminate = false;
    if (type == 2) state.isWriteIndeterminate = false;
    if (type == 3) state.isRequiredIndeterminate = false;
    props.formConf.formOperates.forEach(item => {
      if (type == 1) item.read = val;
      if (type == 2) item.write = val;
      if (type == 3 && !item.requiredDisabled) item.required = val;
    });
  }
  function handleCheckedChange() {
    updateCheckStatus();
  }
  function updateCheckStatus() {
    const formOperatesLen = props.formConf.formOperates.length;
    const requiredDisabledCount = props.formConf.formOperates.filter(o => !o.requiredDisabled).length;
    let readCount = 0;
    let writeCount = 0;
    let requiredCount = 0;
    props.formConf.formOperates.forEach(item => {
      if (item.read) readCount++;
      if (item.write) writeCount++;
      if (item.required) requiredCount++;
    });
    state.readAllChecked = !!formOperatesLen ? formOperatesLen === readCount : false;
    state.writeAllChecked = !!formOperatesLen ? formOperatesLen === writeCount : false;
    state.requiredAllChecked = !!formOperatesLen ? requiredDisabledCount === requiredCount : false;
    state.isReadIndeterminate = !!readCount && readCount < formOperatesLen;
    state.isWriteIndeterminate = !!writeCount && writeCount < formOperatesLen;
    state.isRequiredIndeterminate = !!requiredCount && requiredCount < requiredDisabledCount;
  }
  function onNodeNameChange(nodeName) {
    emit('updateBpmn', 'nodeName', nodeName);
  }
  function handlePrintConfig() {
    openConditionModal(true, { usedFormItems: props.usedFormItems, formFieldsOptions: props.formFieldsOptions, ...props.formConf.printConfig });
  }
  function updatePrintConfig(data) {
    props.formConf.printConfig = { ...props.formConf.printConfig, ...data };
  }
  function handlePrintConfigRemove() {
    props.formConf.printConfig.matchLogic = 'and';
    props.formConf.printConfig.conditions = [];
  }
  function onTimeLimitChange(val) {
    if (val == 0) props.formConf.overTimeConfig.on = 0;
  }
</script>
