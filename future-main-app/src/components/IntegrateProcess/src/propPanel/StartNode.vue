<template>
  <section class="common-pane">
    <a-tabs v-model:activeKey="activeKey" size="small" class="pane-tabs">
      <a-tab-pane key="1" :tab="integrateType == 1 ? '表单配置' : integrateType == 2 ? '触发配置' : 'webhook配置'"></a-tab-pane>
      <a-tab-pane key="2" tab="通知配置"></a-tab-pane>
    </a-tabs>
    <ScrollContainer class="config-content">
      <a-form :colon="false" layout="vertical" :model="formConf" class="config-form" v-show="activeKey === '1'">
        <template v-if="integrateType == 1">
          <a-form-item>
            <template #label>触发表单</template>
            <FormListModal
              :value="formConf.formId"
              :title="formConf.formName"
              enableFlow="0"
              :allowClear="false"
              @change="onFormIdChange"
              placeholder="请选择" />
          </a-form-item>
          <a-form-item label="触发事件">
            <future-radio v-model:value="formConf.triggerEvent" :options="triggerEventOptions" />
          </a-form-item>
          <a-form-item>
            <template #label>触发条件<BasicHelp text="满足以下条件，触发执行动作。" /></template>
            <ConditionMain ref="conditionMainRef" bordered />
          </a-form-item>
        </template>
        <template v-if="integrateType == 2">
          <a-form-item label="触发开始时间">
            <future-date-picker v-model:value="formConf.startTime" format="YYYY-MM-DD HH:mm:ss" placeholder="选择开始时间" />
          </a-form-item>
          <a-form-item label="触发规则">
            <a-form-item>
              <div class="ant-form-item-label"><label class="ant-form-item-no-colon">Cron表达式</label></div>
              <future-cron v-model:value="formConf.cron" />
            </a-form-item>
          </a-form-item>
          <a-form-item label="触发结束时间">
            <future-select v-model:value="formConf.endTimeType" :options="endTimeTypeOptions" class="mb-10px" />
            <a-input-number
              v-model:value="formConf.endLimit"
              placeholder="次数"
              :min="1"
              :precision="0"
              addonAfter="次后结束"
              @change="oneEndLimitChange"
              v-if="formConf.endTimeType === 1" />
            <future-date-picker v-model:value="formConf.endTime" format="YYYY-MM-DD HH:mm:ss" placeholder="选择结束时间" v-if="formConf.endTimeType === 2" />
          </a-form-item>
        </template>
        <template v-if="integrateType == 3">
          <a-form-item label="webhook URL">
            <p class="common-tip mb-10px">系统生成的URL，用来接收请求字段！</p>
            <a-input :value="getSysConfig.futureDomain + formConf.webhookUrl" readonly>
              <template #addonAfter>
                <span class="cursor-pointer" @click="handleCopy(getSysConfig.futureDomain + formConf.webhookUrl)">复制链接</span>
              </template>
            </a-input>
          </a-form-item>
          <a-form-item label="添加接口字段">
            <div class="mb-10px">
              <span class="link-text mr-20px inline-block" @click="addItem"><i class="icon-ym icon-ym-btn-add text-14px mr-4px"></i>自定义添加</span>
              <span class="link-text mr-20px inline-block" @click="openBatchModal(true, {})">
                <i class="icon-ym icon-ym-btn-add text-14px mr-4px"></i>从JSON格式添加
              </span>
              <span
                class="link-text mr-20px inline-block"
                @click="openWebhookRequestModal(true, { url: formConf.webhookGetFieldsUrl, randomStr: formConf.webhookRandomStr, id: formInfo.id })">
                <i class="icon-ym icon-ym-btn-add text-14px mr-4px"></i>从请求接口添加
              </span>
            </div>
            <div class="condition-main">
              <div class="condition-list">
                <a-row :gutter="8" v-for="(item, index) in formConf.formFieldList" :key="index" class="mt-10px">
                  <a-col :span="10">
                    <a-input v-model:value="item.id" placeholder="字段" @change="onItemChange(item)" />
                  </a-col>
                  <a-col :span="13">
                    <a-input v-model:value="item.fullName" placeholder="字段说明" @change="onItemChange(item)" />
                  </a-col>
                  <a-col :span="1" class="text-center">
                    <i class="icon-ym icon-ym-btn-clearn" @click="delItem(index)" />
                  </a-col>
                </a-row>
              </div>
            </div>
          </a-form-item>
        </template>
      </a-form>
      <div v-show="activeKey === '2'">
        <a-form :colon="false" :model="formConf" layout="vertical" class="config-form">
          <a-form-item label="通知人">
            <future-select v-model:value="formConf.msgUserType" :options="msgUserOptions" multiple />
          </a-form-item>
          <a-form-item v-if="formConf.msgUserType.includes(3)">
            <div class="ant-form-item-label"><label class="ant-form-item-no-colon">选择用户</label></div>
            <future-users-select v-model:value="formConf.msgUserIds" multiple />
          </a-form-item>
          <a-form-item>
            <template #label>执行失败<BasicHelp text="执行失败时发送通知！" /></template>
            <future-select v-model:value="formConf.failMsgConfig.on" :options="noticeOptions" />
          </a-form-item>
          <a-form-item v-if="formConf.failMsgConfig.on === 1">
            <div class="ant-form-item-label"><label class="ant-form-item-no-colon">发送配置</label></div>
            <msg-modal
              :value="formConf.failMsgConfig.msgId"
              :title="formConf.failMsgConfig.msgName"
              messageSource="3"
              @change="(val, data) => onMsgChange(keyMap.failMsgConfig, val, data)" />
          </a-form-item>
          <a-form-item>
            <template #label>开始执行<BasicHelp text="开始执行时发送通知！" /></template>
            <future-select v-model:value="formConf.startMsgConfig.on" :options="noticeOptions" />
          </a-form-item>
          <a-form-item v-if="formConf.startMsgConfig.on === 1">
            <div class="ant-form-item-label"><label class="ant-form-item-no-colon">发送配置</label></div>
            <msg-modal
              :value="formConf.startMsgConfig.msgId"
              :title="formConf.startMsgConfig.msgName"
              messageSource="3"
              @change="(val, data) => onMsgChange(keyMap.startMsgConfig, val, data)" />
          </a-form-item>
        </a-form>
      </div>
    </ScrollContainer>
    <BatchModal @register="registerBatchModal" @confirm="addItemForOther" />
    <WebhookRequestModal @register="registerWebhookRequestModal" @confirm="addItemForOther" />
  </section>
</template>
<script lang="ts" setup>
  import { reactive, toRefs, computed, ref, unref } from 'vue';
  import { ScrollContainer } from '@/components/Container';
  import FormListModal from './modal/FormListModal.vue';
  import MsgModal from '@/components/FlowProcess/src/propPanel/components/MsgModal.vue';
  import { noticeOptions, msgUserOptions } from '../helper/define';
  import ConditionMain from '@/components/ColumnDesign/src/components/ConditionMain.vue';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useCopyToClipboard } from '@/hooks/web/useCopyToClipboard';
  import { useModal } from '@/components/Modal';
  import BatchModal from './modal/BatchModal.vue';
  import WebhookRequestModal from './modal/WebhookRequestModal.vue';
  import { useAppStore } from '@/store/modules/app';

  interface State {
    activeKey: string;
  }

  defineOptions({ name: 'startNode', inheritAttrs: false });
  defineExpose({ initCondition, submitCondition });
  const props = defineProps(['formConf', 'integrateType', 'formFieldsOptions', 'getFormFieldList', 'formInfo']);
  const { createMessage } = useMessage();
  const appStore = useAppStore();
  const conditionMainRef = ref();
  const triggerEventOptions = [
    { id: 1, fullName: '新增数据' },
    { id: 2, fullName: '修改数据' },
    { id: 3, fullName: '删除数据' },
  ];
  const endTimeTypeOptions = [
    { id: 1, fullName: '触发次数' },
    { id: 2, fullName: '指定时间' },
    { id: 3, fullName: '不结束' },
  ];
  const keyMap = {
    failMsgConfig: 'failMsgConfig',
    startMsgConfig: 'startMsgConfig',
  };
  const state = reactive<State>({
    activeKey: '1',
  });
  const { activeKey } = toRefs(state);
  const [registerBatchModal, { openModal: openBatchModal }] = useModal();
  const [registerWebhookRequestModal, { openModal: openWebhookRequestModal }] = useModal();

  const getSysConfig = computed(() => appStore.getSysConfigInfo);
  const getRuleOptions = computed(() => props.formConf.formFieldList.filter(o => o.id.indexOf('-') < 0));

  function onFormIdChange(id, item) {
    if (id && props.formConf.formId === id) return;
    if (!id) return handleNull();
    props.getFormFieldList(id, 'start');
    props.formConf.formName = item.fullName;
    props.formConf.formId = id;
    props.formConf.ruleList = [];
  }
  function handleNull() {
    props.formConf.formName = '';
    props.formConf.formId = '';
    props.formConf.formFieldList = [];
  }
  function onMsgChange(key, val, row) {
    if (!val) {
      props.formConf[key].msgId = '';
      props.formConf[key].msgName = '';
      props.formConf[key].templateJson = [];
      return;
    }
    if (props.formConf[key].msgId === val) return;
    props.formConf[key].msgId = val;
    props.formConf[key].msgName = row.fullName;
    props.formConf[key].templateJson = row.templateJson || [];
  }
  function initCondition() {
    if (props.integrateType != 1) return;
    conditionMainRef.value?.init({
      conditionList: props.formConf.ruleList || [],
      matchLogic: props.formConf.ruleMatchLogic,
      fieldOptions: unref(getRuleOptions),
    });
  }
  function submitCondition() {
    const values = conditionMainRef.value?.confirm();
    if (!values) return false;
    return values;
  }
  function oneEndLimitChange(val) {
    if (!val) props.formConf.endLimit = 1;
  }
  function handleCopy(text) {
    const { isSuccessRef } = useCopyToClipboard(text);
    unref(isSuccessRef) && createMessage.success('复制成功');
  }
  function delItem(index) {
    props.formConf.formFieldList.splice(index, 1);
  }
  function addItem() {
    props.formConf.formFieldList.push({ id: '', fullName: '', label: '' });
  }
  function addItemForOther(data) {
    const list: any[] = data.map(o => ({ ...o, label: o.fullName ? o.id + '(' + o.fullName + ')' : o.id }));
    if (!props.formConf.formFieldList.length) return (props.formConf.formFieldList = list);
    for (let i = 0; i < list.length; i++) {
      const e = list[i];
      if (!e.id) {
        props.formConf.formFieldList.push(e);
      } else {
        const findIndex = props.formConf.formFieldList.findIndex(o => o.id === e.id);
        findIndex < 0 ? props.formConf.formFieldList.push(e) : (props.formConf.formFieldList[findIndex] = e);
      }
    }
  }
  function onItemChange(item) {
    item.label = item.fullName ? item.id + '(' + item.fullName + ')' : item.id;
  }
</script>
