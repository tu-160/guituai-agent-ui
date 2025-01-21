<template>
  <HeaderContainer :formConf="formConf" @onNodeNameChange="onNodeNameChange" />
  <a-tabs v-model:activeKey="activeKey" size="small" class="pane-tabs approver-pane-tabs">
    <a-tab-pane :key="1" tab="基础信息" />
    <a-tab-pane :key="2" tab="高级设置" />
    <a-tab-pane :key="3" tab="表单权限" />
    <a-tab-pane :key="4" tab="流程通知" />
    <a-tab-pane :key="5" tab="超时设置" />
  </a-tabs>
  <template v-if="activeKey !== 3">
    <a-form :colon="false" :model="formConf" class="config-content" layout="vertical">
      <template v-if="activeKey === 1">
        <template v-if="getFutureGlobalData?.hasAloneConfigureForms">
          <a-form-item>
            <template #label>表单设置<BasicHelp text="审批节点不设置表单，默认引用发起节点表单" /></template>
            <FlowFormModal :value="formConf.formId" :title="formConf.formName" @change="onFormIdChange" placeholder="请选择" :disabled="flowState != 0" />
          </a-form-item>
          <a-form-item v-if="true">
            <template #label>
              数据传递
              <BasicHelp :text="['不设置传递规则时字段名称相同自动赋值', '设置传递规则时相同名称字段会自动赋值字段后再按传递规则赋值']" />
            </template>
            <a-input :value="getHasAssign ? '已设置' : ''" placeholder="请设置数据传递规则" readonly class="hand" @click="openTransmitRuleBox">
              <template #suffix>
                <span class="ant-select-arrow"><down-outlined /></span>
              </template>
            </a-input>
          </a-form-item>
        </template>
        <a-form-item label="审批设置">
          <future-radio v-model:value="formConf.assigneeType" :options="typeOptions" class="type-radio" @change="onAssigneeTypeChange" />
          <div :class="{ 'mb-10px': formConf.assigneeType !== 2 && formConf.assigneeType !== 3, 'mt-10px': true }">
            <div v-if="formConf.assigneeType === 1" class="common-tip">发起者主管将作为审批人处理审批单</div>
            <div v-if="formConf.assigneeType === 2" class="common-tip">发起者的部门主管将作为审批人处理审批单</div>
            <div v-if="formConf.assigneeType === 3" class="common-tip">发起者自己将作为审批人处理审批单</div>
            <div v-if="formConf.assigneeType === 4" class="common-tip">选择流程表单字段的值作为审批人</div>
            <div v-if="formConf.assigneeType === 5" class="common-tip">设置审批人为审批流程中某个环节的审批人</div>
            <div v-if="formConf.assigneeType === 6" class="common-tip">指定审批人处理审批单</div>
            <div v-if="formConf.assigneeType === 7" class="common-tip">默认所有人，需要设置请指定候选人范围处理审批单</div>
            <div v-if="formConf.assigneeType === 9" class="common-tip">从目标服务中获取审批人</div>
          </div>
          <a-form-item label="发起者的" class="!mb-0" v-if="formConf.assigneeType === 1">
            <a-select v-model:value="formConf.managerLevel" placeholder="请选择">
              <a-select-option v-for="item in 10" :key="item" :value="item">{{ item === 1 ? '直属主管' : '第' + item + '级主管' }}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="表单字段" class="!mb-0" v-if="formConf.assigneeType === 4">
            <a-input-group compact>
              <future-select v-model:value="formConf.formFieldType" :options="formFieldTypeOptions" class="!w-100px" />
              <future-select
                v-model:value="formConf.formField"
                :options="usedFormItems"
                :fieldNames="{ options: 'options1' }"
                showSearch
                style="width: calc(100% - 100px)" />
            </a-input-group>
          </a-form-item>
          <a-form-item label="审批节点" class="!mb-0" v-if="formConf.assigneeType === 5">
            <future-select v-model:value="formConf.approverNodeId" showSearch :options="nodeOptions" />
          </a-form-item>
          <a-form-item class="!mb-0" v-if="formConf.assigneeType === 9">
            <div class="ant-form-item-label">
              <label class="ant-form-item-no-colon">请求路径</label>
              <BasicHelp text='请求自带参数：taskId、taskNodeId，返回结构：JSON对象{"handleId":"id1,id2"}' />
            </div>
            <interface-modal :value="formConf.interfaceConfig.interfaceId" :title="formConf.interfaceConfig.interfaceName" @change="onInterfaceChange" />
            <template v-if="formConf.interfaceConfig.templateJson?.length">
              <div class="ant-form-item-label !mt-12px"><label class="ant-form-item-no-colon">参数设置</label></div>
              <select-interface-btn
                :templateJson="formConf.interfaceConfig.templateJson"
                :fieldOptions="funcOptions"
                isFlow
                showFieldFullLabel
                showSystemFullLabel
                @fieldChange="onRelationFieldChange" />
            </template>
          </a-form-item>
          <div v-if="formConf.assigneeType === 6 || formConf.assigneeType === 7">
            <future-users-select
              v-model:value="formConf.approvers"
              buttonType="button"
              :modalTitle="formConf.assigneeType === 6 ? '添加审批人' : '添加候选人'"
              multiple
              @Change="onApproversChange"
              @labelChange="onLabelChange" />
          </div>
          <a-form-item class="!mb-0 !mt-10px" v-if="formConf.assigneeType === 6">
            <template #label>审批人范围<BasicHelp text="指定成员增加人员选择范围附加条件" /></template>
            <future-select v-model:value="formConf.extraRule" :options="extraRuleOptions" />
          </a-form-item>
        </a-form-item>
        <a-form-item label="审批方式">
          <future-radio v-model:value="formConf.counterSign" :options="counterSignOptions" class="counterSign-radio" />
        </a-form-item>
        <a-form-item label="设置会签流转规则" v-if="formConf.counterSign == 1">
          <div class="countersign-cell mb-10px">
            <span class="w-42px inline-block">同意</span>
            <future-select v-model:value="formConf.counterSignConfig.auditType" :options="auditTypeOptions" class="!w-100px !mx-10px" />
            <a-select v-model:value="formConf.counterSignConfig.auditRatio" class="!w-80px !mr-10px" v-if="formConf.counterSignConfig.auditType === 1">
              <a-select-option v-for="item in 10" :key="item" :value="item * 10">{{ item * 10 + '%' }}</a-select-option>
            </a-select>
            <a-input-number
              class="!w-80px !mr-10px"
              v-model:value="formConf.counterSignConfig.auditNum"
              placeholder="请输入"
              :precision="0"
              :min="1"
              @change="onSignNumberChange($event, 'auditNum')"
              v-if="formConf.counterSignConfig.auditType === 2" />
            <span>进入下一节点</span>
          </div>
          <div class="countersign-cell">
            <span class="w-42px inline-block">不同意</span>
            <future-select v-model:value="formConf.counterSignConfig.rejectType" :options="rejectTypeOptions" class="!w-100px !mx-10px" />
            <a-select v-model:value="formConf.counterSignConfig.rejectRatio" class="!w-80px !mr-10px" v-if="formConf.counterSignConfig.rejectType === 1">
              <a-select-option v-for="item in 10" :key="item" :value="item * 10">{{ item * 10 + '%' }}</a-select-option>
            </a-select>
            <a-input-number
              class="!w-80px !mr-10px"
              v-model:value="formConf.counterSignConfig.rejectNum"
              placeholder="请输入"
              :precision="0"
              :min="1"
              @change="onSignNumberChange($event, 'rejectNum')"
              v-if="formConf.counterSignConfig.rejectType === 2" />
            <span v-if="formConf.counterSignConfig.rejectType">时拒绝</span>
          </div>
        </a-form-item>
        <a-form-item label="设置依次审批顺序" v-if="getCanSetApproversSort">
          <a-button preIcon="icon-ym icon-ym-btn-add" @click="openApproversSortListModal">设置审批顺序</a-button>
        </a-form-item>
        <a-form-item label="审批规则">
          <a-checkbox class="leading-32px" v-model:checked="formConf.hasAutoApprover">
            系统审批
            <BasicHelp text="开启后由系统根据条件执行审批动作，当条件都不满足时，转人工审批。" />
          </a-checkbox>
          <template v-if="formConf.hasAutoApprover">
            <div class="ant-form-item-no-colon">当条件都不满足时转人工审批</div>
            <div class="approver-rule-content">
              <div class="approver-content">
                <span>同意</span>
                <i class="icon-ym icon-ym-app-rename" @click="handleAutoApproverRule('audit')"></i>
              </div>
              <div v-if="formConf.autoAuditRule?.conditions?.length" class="approver-text">{{ getAuditConditionsContent }}</div>
            </div>
            <div class="approver-rule-content">
              <div class="approver-content">
                <span>拒绝</span>
                <i class="icon-ym icon-ym-app-rename" @click="handleAutoApproverRule('reject')"></i>
              </div>
              <div v-if="formConf.autoRejectRule?.conditions?.length" class="approver-text">{{ getRejectConditionsContent }}</div>
            </div>
          </template>
        </a-form-item>
        <a-form-item label="审批意见">
          <a-checkbox v-model:checked="formConf.hasSign">启用签名</a-checkbox>
          <div class="mt-10px">
            <a-checkbox v-model:checked="formConf.hasFile">启用附件</a-checkbox>
          </div>
        </a-form-item>
        <a-form-item label="抄送设置">
          <future-users-select v-model:value="formConf.circulateUser" buttonType="button" modalTitle="添加抄送人" multiple />
          <a-form-item class="!pt-10px">
            <template #label>抄送人范围<BasicHelp text="抄送人员增加人员选择范围附加条件" /></template>
            <future-select v-model:value="formConf.extraCopyRule" :options="extraCopyRuleOptions" />
          </a-form-item>
          <a-checkbox v-model:checked="formConf.isCustomCopy">允许自选抄送人</a-checkbox>
          <div class="mt-10px">
            <a-checkbox v-model:checked="formConf.isInitiatorCopy">抄送给流程发起人</a-checkbox>
          </div>
          <div class="mt-10px">
            <a-checkbox v-model:checked="formConf.isFormFieldCopy">抄送给表单变量</a-checkbox>
          </div>
          <div v-if="formConf.isFormFieldCopy" class="common-tip my-10px">选择流程表单字段的值作为抄送人</div>
          <a-form-item class="!mb-0" v-if="formConf.isFormFieldCopy">
            <a-input-group compact>
              <future-select v-model:value="formConf.copyFormFieldType" :options="formFieldTypeOptions" class="!w-100px" />
              <future-select
                v-model:value="formConf.copyFormField"
                :options="usedFormItems"
                :fieldNames="{ options: 'options1' }"
                showSearch
                style="width: calc(100% - 100px)" />
            </a-input-group>
          </a-form-item>
        </a-form-item>
      </template>
      <template v-if="activeKey === 2">
        <a-form-item label="处置操作">
          <div class="btn-cell">
            <a-checkbox v-model:checked="formConf.hasAuditBtn">同意</a-checkbox>
            <a-input v-model:value="formConf.auditBtnText" placeholder="请输入" />
          </div>
          <div class="btn-cell">
            <a-checkbox v-model:checked="formConf.hasRejectBtn">拒绝</a-checkbox>
            <a-input v-model:value="formConf.rejectBtnText" placeholder="请输入" />
          </div>
          <div class="btn-cell">
            <a-checkbox v-model:checked="formConf.hasBackBtn">退回</a-checkbox>
            <a-input v-model:value="formConf.backBtnText" placeholder="请输入" />
          </div>
          <div class="btn-cell">
            <a-checkbox v-model:checked="formConf.hasFreeApproverBtn">加签</a-checkbox>
            <a-input v-model:value="formConf.freeApproverBtnText" placeholder="请输入" />
          </div>
          <div class="btn-cell">
            <a-checkbox v-model:checked="formConf.hasReduceApproverBtn">减签</a-checkbox>
            <a-input v-model:value="formConf.reduceApproverBtnText" placeholder="请输入" />
          </div>
          <div class="btn-cell">
            <a-checkbox v-model:checked="formConf.hasTransferBtn">转审</a-checkbox>
            <a-input v-model:value="formConf.transferBtnText" placeholder="请输入" />
          </div>
          <div class="btn-cell">
            <a-checkbox v-model:checked="formConf.hasAssistBtn">协办</a-checkbox>
            <a-input v-model:value="formConf.assistBtnText" placeholder="请输入" />
          </div>
          <div class="btn-cell">
            <a-checkbox v-model:checked="formConf.hasSaveAuditBtn">暂存</a-checkbox>
            <a-input v-model:value="formConf.saveAuditBtnText" placeholder="请输入" />
          </div>
        </a-form-item>
        <a-form-item v-if="formConf.hasBackBtn">
          <template #label>退回设置<BasicHelp text="纯表单流程设置退回到发起节点无效" /></template>
          <div class="form-item-content"></div>
          <a-form-item label="被退回的节点重新提交时">
            <a-radio-group v-model:value="formConf.backType" class="counterSign-radio" @change="onBackTypeChange">
              <a-radio :value="1">重新审批<BasicHelp text="若流程为A->B->C，C退回至A，则C->A->B->C" /></a-radio>
              <a-radio :value="2">从当前节点审批<BasicHelp text="若流程为A->B->C，C退回至A，则C->A->C" /></a-radio>
              <a-radio :value="3">自定义审批<BasicHelp text="由用户选择重新审批或从当前节点审批" /></a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="设置退回到的节点" class="!mb-0px">
            <future-select v-model:value="formConf.backNodeCode" :options="backNodeCodeOptions" showSearch />
          </a-form-item>
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
        <a-form-item label="节点参数">
          <div class="parameter-content">
            <span>参数设置</span>
            <i class="icon-ym icon-ym-btn-add" @click="handleAddParameter"></i>
          </div>
          <a-row :gutter="8" class="condition-main mt-10px" v-for="(item, index) in formConf.parameterList" :key="index">
            <a-col :span="12" class="overflow-auto">
              <future-select
                v-model:value="item.field"
                :options="getParameterList"
                :fieldNames="{ label: 'fieldName', value: 'fieldName', options: 'options1' }" />
            </a-col>
            <a-col :span="12">
              <future-select v-model:value="item.fieldValueType" :options="conditionTypeOptions" @change="onFieldValueTypeChange(item)" />
            </a-col>
            <a-col :span="22" class="mt-10px">
              <future-select
                v-model:value="item.fieldValue"
                :options="usedFormItems"
                allowClear
                showSearch
                :fieldNames="{ options: 'options1' }"
                class="w-100%"
                @change="(val, data) => onFieldValueChange(item, val, data)"
                v-if="item.fieldValueType === 1" />
              <div class="w-100%" v-if="item.fieldValueType === 2">
                <template v-if="item.futureKey === 'inputNumber'">
                  <a-input-number v-model:value="item.fieldValue" placeholder="请输入" :precision="item.precision" />
                </template>
                <template v-else-if="item.futureKey === 'calculate'">
                  <a-input-number v-model:value="item.fieldValue" placeholder="请输入" :precision="2" />
                </template>
                <template v-else-if="['rate', 'slider'].includes(item.futureKey)">
                  <a-input-number v-model:value="item.fieldValue" placeholder="请输入" />
                </template>
                <template v-else-if="item.futureKey === 'switch'">
                  <future-switch v-model:value="item.fieldValue" />
                </template>
                <template v-else-if="item.futureKey === 'timePicker'">
                  <future-time-picker v-model:value="item.fieldValue" :format="item.format || 'HH:mm:ss'" allowClear />
                </template>
                <template v-else-if="['datePicker', 'createTime', 'modifyTime'].includes(item.futureKey)">
                  <future-date-picker v-model:value="item.fieldValue" :format="item.format" allowClear @change="onConditionDateChange($event, item)" />
                </template>
                <template v-else-if="['organizeSelect', 'currOrganize'].includes(item.futureKey)">
                  <future-organize-select v-model:value="item.fieldValue" allowClear @change="(val, data) => onConditionOrganizeChange(item, val, data)" />
                </template>
                <template v-else-if="['depSelect'].includes(item.futureKey)">
                  <future-dep-select v-model:value="item.fieldValue" allowClear @change="(val, data) => onConditionObjChange(item, val, data)" />
                </template>
                <template v-else-if="item.futureKey === 'roleSelect'">
                  <future-role-select v-model:value="item.fieldValue" allowClear @change="(val, data) => onConditionObjChange(item, val, data)" />
                </template>
                <template v-else-if="item.futureKey === 'groupSelect'">
                  <future-group-select v-model:value="item.fieldValue" allowClear @change="(val, data) => onConditionObjChange(item, val, data)" />
                </template>
                <template v-else-if="['posSelect', 'currPosition'].includes(item.futureKey)">
                  <future-pos-select v-model:value="item.fieldValue" allowClear @change="(val, data) => onConditionObjChange(item, val, data)" />
                </template>
                <template v-else-if="['userSelect', 'createUser', 'modifyUser'].includes(item.futureKey)">
                  <future-user-select v-model:value="item.fieldValue" hasSys allowClear @change="(val, data) => onConditionObjChange(item, val, data)" />
                </template>
                <template v-else-if="['usersSelect'].includes(item.futureKey)">
                  <future-users-select v-model:value="item.fieldValue" allowClear @change="(val, data) => onConditionObjChange(item, val, data)" />
                </template>
                <template v-else-if="item.futureKey === 'areaSelect'">
                  <future-area-select
                    v-model:value="item.fieldValue"
                    :level="item.level"
                    allowClear
                    @change="(val, data) => onConditionListChange(item, val, data)" />
                </template>
                <template v-else>
                  <a-input v-model:value="item.fieldValue" placeholder="请输入" allowClear />
                </template>
              </div>
              <future-select
                v-model:value="item.fieldValue"
                :options="getSystemFieldOptions"
                :fieldNames="{ label: 'label', options: 'options1' }"
                allowClear
                class="w-100%"
                v-else-if="item.fieldValueType === 3" />
            </a-col>
            <a-col :span="1" class="text-center mt-10px">
              <i class="icon-ym icon-ym-btn-clearn" @click="handleDelItem(index)" />
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item v-if="props.type != 1" label="分流规则">
          <future-select v-model:value="formConf.divideRule" :options="divideRuleOptions" />
        </a-form-item>
      </template>
      <template v-if="activeKey === 4">
        <a-alert message="自定义通知以“消息中心-发送配置”为主，请移步设置；关闭：表示不提醒，默认：表示站内提醒" type="warning" showIcon class="!mb-10px" />
        <!-- 节点同意 -->
        <NoticeConfig :noticeConfig="formConf.approveMsgConfig" type="approve" v-bind="getBindValue" />
        <!-- 节点同意 -->
        <NoticeConfig :noticeConfig="formConf.rejectMsgConfig" type="reject" v-bind="getBindValue" />
        <!-- 节点退回 -->
        <NoticeConfig :noticeConfig="formConf.backMsgConfig" type="back" v-bind="getBindValue" />
        <!-- 节点抄送 -->
        <NoticeConfig :noticeConfig="formConf.copyMsgConfig" type="copy" v-bind="getBindValue" />
        <!-- 节点超时 -->
        <NoticeConfig :noticeConfig="formConf.overTimeMsgConfig" type="overTime" v-bind="getBindValue" />
        <!-- 节点提醒 -->
        <NoticeConfig :noticeConfig="formConf.noticeMsgConfig" type="notice" v-bind="getBindValue" />
      </template>
      <template v-if="activeKey === 5">
        <a-form-item label="限时设置">
          <future-select v-model:value="formConf.timeLimitConfig.on" :options="nodeOverTimeMsgOptions" @change="onTimeLimitChange" />
          <template v-if="formConf.timeLimitConfig.on === 1">
            <a-form-item class="!mt-12px" label="节点处理截止时间">
              <div class="flex items-center">
                <future-select v-model:value="formConf.timeLimitConfig.nodeLimit" :options="overTimeOptions" />
                <span class="!ml-10px flex-shrink-0">开始</span>
              </div>
              <div class="mt-10px" v-if="formConf.timeLimitConfig.nodeLimit === 2">
                <future-select class="!w-332px" v-model:value="formConf.timeLimitConfig.formField" :options="usedFormItems" showSearch allowClear />
              </div>
              <div class="countersign-cell mt-12px">
                <span class="w-85px inline-block">流程到达节点</span>
                <a-input-number v-model:value="formConf.timeLimitConfig.duringDeal" :min="1" :precision="0" class="!w-90px !mx-8px" />
                <span>小时后，视为超时</span>
              </div>
            </a-form-item>
            <a-form-item label="限时提醒规则" class="!mt-12px">
              <future-select v-model:value="formConf.noticeConfig.on" :options="nodeOverTimeMsgOptions" />
            </a-form-item>
            <a-form-item v-if="formConf.noticeConfig.on === 1">
              <div class="countersign-cell">
                <span class="w-85px inline-block">流程到达节点</span>
                <a-input-number v-model:value="formConf.noticeConfig.firstOver" :min="1" :precision="0" class="!w-90px !mx-8px" />
                <span>小时，开始提醒通知</span>
              </div>
              <div class="countersign-cell mt-12px">
                <span class="w-85px inline-block">每间隔</span>
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
                <span class="w-85px inline-block">在提醒通知第</span>
                <a-input-number v-model:value="formConf.noticeConfig.overEventTime" :min="1" :precision="0" class="!w-90px !mx-8px" />
                <span>次时，执行提醒事件</span>
              </div>
            </a-form-item>
          </template>
        </a-form-item>
        <a-form-item label="超时设置">
          <future-select v-model:value="formConf.overTimeConfig.on" :options="nodeOverTimeMsgOptions" :disabled="formConf.timeLimitConfig.on == 0" />
        </a-form-item>
        <a-form-item v-if="formConf.overTimeConfig.on === 1">
          <div class="countersign-cell">
            <span class="w-85px inline-block">超时</span>
            <a-input-number v-model:value="formConf.overTimeConfig.firstOver" :min="0" :precision="0" class="!w-90px !mx-8px" />
            <span>小时，开始超时通知</span>
          </div>
          <div class="countersign-cell mt-12px">
            <span class="w-85px inline-block">每间隔</span>
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
            <span class="w-85px inline-block">在超时通知</span>
            <a-input-number v-model:value="formConf.overTimeConfig.overEventTime" :min="1" :precision="0" class="!w-90px !mx-5px" />
            <span>次时，执行超时事件</span>
          </div>
          <a-row class="leading-32px block">
            <a-checkbox v-model:checked="formConf.overTimeConfig.overAutoApprove">
              超时自动审批
              <BasicHelp text="当前审批节点表单必填字段为空工单流转时不做校验，下一审批节点设置候选人员、选择分支、异常节点时当前审批节点规则失效" />
            </a-checkbox>
          </a-row>
          <div class="countersign-cell" v-if="formConf.overTimeConfig.overAutoApprove">
            <span class="w-85px inline-block">在超时通知</span>
            <a-input-number v-model:value="formConf.overTimeConfig.overAutoApproveTime" :min="1" :precision="0" class="!w-90px !mx-5px" />
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
  <AssignRuleModal @register="registerAssignRuleModal" v-bind="getAssignBindValue" />
  <ConditionModal @register="registerConditionModal" @confirm="updatePrintConfig" />
  <ApproversSortModal @register="registerApproversSortModal" @confirm="updateApproversSortList" />
</template>
<script lang="ts" setup>
  import { reactive, toRefs, inject, computed, unref, watch } from 'vue';
  import { cloneDeep } from 'lodash-es';
  import { useModal } from '@/components/Modal';
  import { DownOutlined } from '@ant-design/icons-vue';
  import {
    typeOptions,
    defaultStep,
    formFieldTypeOptions,
    nodeOverTimeMsgOptions,
    overTimeOptions,
    printConditionTypeOptions,
    divideRuleOptions,
    systemFieldOptions,
  } from '../helper/define';
  import { SelectInterfaceBtn } from '@/components/Interface';
  import { InterfaceModal } from '@/components/CommonModal';
  import { TreeSelect } from 'ant-design-vue';
  import { NodeUtils } from '../bpmn/utils/nodeUtil';
  import { formatToDateTime } from '@/utils/dateUtil';
  import HeaderContainer from './components/HeaderContainer.vue';
  import FlowFormModal from './components/FlowFormModal.vue';
  import NoticeConfig from './components/NoticeConfig.vue';
  import AssignRuleModal from './components/AssignRuleModal.vue';
  import ConditionModal from './components/ConditionModal.vue';
  import ApproversSortModal from './ApproversSortModal.vue';

  interface State {
    activeKey: number;
    assignList: any[];
    userLabel: string;
    readAllChecked: boolean;
    writeAllChecked: boolean;
    requiredAllChecked: boolean;
    isReadIndeterminate: boolean;
    isWriteIndeterminate: boolean;
    isRequiredIndeterminate: boolean;
    conditionType: string;
  }

  const state = reactive<State>({
    activeKey: 1,
    assignList: [],
    userLabel: '',
    readAllChecked: false,
    writeAllChecked: false,
    requiredAllChecked: false,
    isReadIndeterminate: false,
    isWriteIndeterminate: false,
    isRequiredIndeterminate: false,
    conditionType: '',
  });
  defineOptions({ inheritAttrs: false });
  defineExpose({ getContent, updateCheckStatus });
  const { activeKey, readAllChecked, writeAllChecked, requiredAllChecked, isReadIndeterminate, isWriteIndeterminate, isRequiredIndeterminate } = toRefs(state);
  const emit = defineEmits(['updateBpmn', 'updateFormFieldList']);
  const props = defineProps([
    'formConf',
    'printTplOptions',
    'prevNodeList',
    'beforeNodeOptions',
    'funcOptions',
    'formFieldsOptions',
    'usedFormItems',
    'getFormFieldList',
    'initFormOperates',
    'updateFutureData',
    'nodeOptions',
    'flowState',
    'type',
  ]);
  const [registerAssignRuleModal, { openModal: openAssignRuleModal }] = useModal();
  const [registerConditionModal, { openModal: openConditionModal }] = useModal();
  const [registerApproversSortModal, { openModal: openApproversSortModal }] = useModal();
  const bpmn: (() => string | undefined) | undefined = inject('bpmn');
  const extraRuleOptions = [
    { id: 1, fullName: '无审批人范围' },
    { id: 6, fullName: '同一公司' },
    { id: 2, fullName: '同一部门' },
    { id: 3, fullName: '同一岗位' },
    { id: 4, fullName: '发起人上级' },
    { id: 5, fullName: '发起人下属' },
  ];
  const extraCopyRuleOptions = extraRuleOptions.map(o => (o.id === 1 ? { id: 1, fullName: '无抄送人范围' } : o));
  const counterSignOptions = [
    { id: 0, fullName: '或签（一名审批人同意或退回即可）' },
    { id: 1, fullName: '会签（无序会签，审批达到会签比例，审批通过）' },
    { id: 2, fullName: '依次审批（按顺序依次审批）' },
  ];
  const auditTypeOptions = [
    { id: 1, fullName: '按百分比' },
    { id: 2, fullName: '按人数' },
  ];
  const rejectTypeOptions = [{ id: 0, fullName: '无' }, ...auditTypeOptions];
  const formOperatesColumns = [
    { title: '表单字段', dataIndex: 'name', key: 'name' },
    { title: '操作', dataIndex: 'write', key: 'write', align: 'center', width: 250 },
  ];
  const conditionTypeOptions = [
    { id: 1, fullName: '字段' },
    { id: 2, fullName: '自定义' },
    { id: 3, fullName: '系统参数' },
  ];

  const getBpmn = computed(() => (bpmn as () => any)());
  const getFutureGlobalData = computed(() => {
    const futureData: any = unref(getBpmn).get('futureData');
    return futureData?.getValue('global') || {};
  });
  const getBindValue = computed(() => ({
    funcOptions: props.funcOptions,
    isApprover: true,
  }));
  const getAssignBindValue = computed(() => ({
    formConf: props.formConf,
    formFieldsOptions: props.formFieldsOptions,
  }));
  const backNodeCodeOptions = computed(() => {
    let options = [...defaultStep, ...props.beforeNodeOptions];
    if (props.formConf.backType == 2) options = options.filter(o => o.id != 1);
    return options;
  });
  const getPrintConditionsContent = computed(() =>
    NodeUtils.getConditionsContent(props.formConf.printConfig.conditions, props.formConf.printConfig.matchLogic),
  );
  const getAuditConditionsContent = computed(() =>
    NodeUtils.getConditionsContent(props.formConf.autoAuditRule.conditions, props.formConf.autoAuditRule.matchLogic),
  );
  const getRejectConditionsContent = computed(() =>
    NodeUtils.getConditionsContent(props.formConf.autoRejectRule.conditions, props.formConf.autoRejectRule.matchLogic),
  );
  const getSystemFieldOptions = computed(() => systemFieldOptions.map(o => ({ ...o, label: o.fullName ? o.id + '(' + o.fullName + ')' : o.id })));
  const getParameterList = computed(() => unref(getFutureGlobalData).globalParameterList || []);
  const getCanSetApproversSort = computed(() => {
    return (
      props.formConf.assigneeType === 6 &&
      props.formConf.approvers.length &&
      props.formConf.approvers.every(o => o.indexOf('--user') !== -1) &&
      props.formConf.counterSign == 2
    );
  });
  const getHasAssign = computed(() => props.formConf.assignList.length && props.formConf.assignList.some(o => o.ruleList?.length));

  watch(
    () => props.formConf,
    () => props.updateFutureData(props.formConf),
    { deep: true, immediate: true },
  );
  watch(
    () => state.activeKey,
    val => {
      val == 3 && updateCheckStatus();
    },
  );

  function onFormIdChange(id, item) {
    if (!id) return handleNull();
    const isSameForm = props.formConf.formId === id;
    props.formConf.formName = item.fullName;
    props.formConf.formId = id;
    props.formConf.assignList = [];
    props.getFormFieldList(id, 'approverForm', isSameForm);
  }
  function handleNull() {
    props.formConf.formName = '';
    props.formConf.formId = '';
    let formFieldList = [];
    const futureData: any = unref(getBpmn).get('futureData');
    const global = futureData.getValue('global');
    const formId = global.formId;
    if (formId && global.allFormMap && global.allFormMap['form_' + formId]) {
      formFieldList = global.allFormMap['form_' + formId] || [];
    }
    emit('updateFormFieldList', formFieldList);
    props.formConf.formOperates = props.initFormOperates(props.formConf, true);
  }
  function onBackTypeChange(e) {
    if (e?.target?.value == 2 && props.formConf.backNodeCode == 1) props.formConf.backNodeCode = 0;
  }
  function openTransmitRuleBox() {
    const assignList = getRealAssignList(props.formConf.assignList ? cloneDeep(props.formConf.assignList) : []);
    openAssignRuleModal(true, { assignList });
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
  function onNodeNameChange(nodeName) {
    emit('updateBpmn', 'nodeName', nodeName);
  }
  function onAssigneeTypeChange() {
    props.formConf.approvers = [];
    props.formConf.approversSortList = [];
    emit('updateBpmn', 'elementBodyName', getContent());
  }
  function onApproversChange(val) {
    if (props.formConf.assigneeType != 6 || !val || !val.length || !val.every(o => o.indexOf('--user') !== -1)) return (props.formConf.approversSortList = []);
    if (!props.formConf.approversSortList.length) return (props.formConf.approversSortList = val);
    const arr = props.formConf.approversSortList.filter(o => val.indexOf(o) !== -1);
    const updated = val.filter(o => props.formConf.approversSortList.indexOf(o) === -1);
    props.formConf.approversSortList = [...arr, ...updated];
  }
  function onLabelChange(val) {
    state.userLabel = val;
    emit('updateBpmn', 'elementBodyName', getContent());
  }
  function getContent() {
    let content = '';
    if (props.formConf.assigneeType != 6) {
      content = typeOptions.find(o => o.id === props.formConf.assigneeType)?.fullName || '';
    } else {
      content = state.userLabel;
    }
    props.formConf.content = content;
    return content;
  }
  function onInterfaceChange(val, row) {
    if (!val) {
      props.formConf.interfaceConfig.interfaceId = '';
      props.formConf.interfaceConfig.interfaceName = '';
      props.formConf.interfaceConfig.templateJson = [];
      return;
    }
    if (props.formConf.interfaceConfig.interfaceId === val) return;
    props.formConf.interfaceConfig.interfaceId = val;
    props.formConf.interfaceConfig.interfaceName = row.fullName;
    props.formConf.interfaceConfig.templateJson = row.templateJson.map(o => ({ ...o, sourceType: 1 })) || [];
  }
  function onRelationFieldChange(val, row) {
    if (!val) return;
    let list = props.funcOptions.filter(o => o.id === val);
    if (!list.length) return;
    let item = list[0];
    row.isSubTable = item.__config__ && item.__config__.isSubTable ? item.__config__.isSubTable : false;
  }
  function onSignNumberChange(val, key) {
    if (val) return;
    props.formConf.counterSignConfig[key] = 1;
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
      if (item.required && !item.requiredDisabled) requiredCount++;
    });
    state.readAllChecked = !!formOperatesLen ? formOperatesLen === readCount : false;
    state.writeAllChecked = !!formOperatesLen ? formOperatesLen === writeCount : false;
    state.requiredAllChecked = !!formOperatesLen ? requiredDisabledCount === requiredCount : false;
    state.isReadIndeterminate = !!readCount && readCount < formOperatesLen;
    state.isWriteIndeterminate = !!writeCount && writeCount < formOperatesLen;
    state.isRequiredIndeterminate = !!requiredCount && requiredCount < requiredDisabledCount;
  }
  function handlePrintConfig() {
    state.conditionType = 'print';
    openConditionModal(true, { usedFormItems: props.usedFormItems, formFieldsOptions: props.formFieldsOptions, ...props.formConf.printConfig });
  }
  function updatePrintConfig(data) {
    const form = state.conditionType == 'print' ? 'printConfig' : state.conditionType == 'audit' ? 'autoAuditRule' : 'autoRejectRule';
    props.formConf[form] = { ...props.formConf[form], ...data };
  }
  function handlePrintConfigRemove() {
    props.formConf.printConfig.matchLogic = 'and';
    props.formConf.printConfig.conditions = [];
  }
  function handleAutoApproverRule(type) {
    state.conditionType = type;
    const rule = type == 'audit' ? 'autoAuditRule' : 'autoRejectRule';
    openConditionModal(true, { usedFormItems: props.usedFormItems, formFieldsOptions: props.formFieldsOptions, ...props.formConf[rule] });
  }
  function handleAddParameter() {
    props.formConf.parameterList.push({
      field: '',
      fieldValueType: 2,
      fieldValue: '',
    });
  }
  function onFieldValueChange(item, val, data) {
    item.fieldLabel = val ? data.fullName : '';
    item.fieldValueFutureKey = val ? data.__config__.futureKey : '';
  }
  function onConditionDateChange(val, item) {
    if (!val) return (item.fieldLabel = '');
    const format = item.format || 'YYYY-MM-DD HH:mm:ss';
    item.fieldLabel = formatToDateTime(val, format);
  }
  function onConditionListChange(item, val, data) {
    if (!val) return (item.fieldLabel = '');
    const labelList = data.map(o => o.fullName);
    item.fieldLabel = labelList.join('/');
  }
  function onConditionOrganizeChange(item, val, data) {
    if (!val) return (item.fieldLabel = '');
    item.fieldLabel = data.organize || '';
  }
  function onConditionObjChange(item, val, data) {
    if (!val) return (item.fieldLabel = '');
    item.fieldLabel = data.fullName || '';
  }
  function handleDelItem(index) {
    props.formConf.parameterList.splice(index, 1);
  }
  function onFieldValueTypeChange(item) {
    item.fieldValue = '';
    item.fieldLabel = '';
  }
  function openApproversSortListModal() {
    openApproversSortModal(true, { ids: props.formConf.approversSortList });
  }
  function updateApproversSortList(data) {
    props.formConf.approversSortList = data;
  }
  function onTimeLimitChange(val) {
    if (val == 0) props.formConf.overTimeConfig.on = 0;
  }
</script>
