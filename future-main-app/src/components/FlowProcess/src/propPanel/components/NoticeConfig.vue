<template>
  <a-form-item>
    <template #label>{{ getTitleAndHelp.title }}<BasicHelp :text="getTitleAndHelp.help" /></template>
    <future-select v-model:value="noticeConfig.on" :options="isApprover ? nodeNoticeOptions : noticeOptions" />
  </a-form-item>
  <a-form-item v-if="noticeConfig.on === 1">
    <div class="ant-form-item-label"><label class="ant-form-item-no-colon">发送配置</label></div>
    <msg-modal :value="noticeConfig.msgId" :title="noticeConfig.msgName" @change="onMsgChange" />
    <div class="ant-form-item-label mt-12px"><label class="ant-form-item-no-colon">参数设置</label></div>
    <a-table :data-source="noticeConfig.templateJson" :columns="msgTemplateJsonColumns" size="small" :pagination="false">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'msgTemplateName'">
          <p class="link-text" :title="record.msgTemplateName" @click="goMsgDetail(record.templateId)">{{ record.msgTemplateName }}</p>
        </template>
        <template v-if="column.key === 'paramJson'">
          <div class="parameter-box" :title="item.field + '(' + item.fieldName + ')'" v-for="(item, index) in record.paramJson" :key="index">
            {{ item.field }}({{ item.fieldName }})
          </div>
        </template>
        <template v-if="column.key === 'field'">
          <future-select
            v-model:value="item.relationField"
            :options="funcOptions"
            allowClear
            showSearch
            :fieldNames="{ label: 'label', options: 'options1' }"
            optionLabelProp="label"
            class="!w-150px"
            :class="{ '!mt-8px': index > 0 }"
            @change="onRelationFieldChange($event, item)"
            v-for="(item, index) in record.paramJson"
            :key="index" />
        </template>
      </template>
      <template #emptyText>
        <p class="leading-60px">暂无数据</p>
      </template>
    </a-table>
  </a-form-item>
  <MsgTemplateDetail @register="registerDetail" />
</template>
<script lang="ts" setup>
  import { computed } from 'vue';
  import { noticeOptions, nodeNoticeOptions } from '../../helper/define';
  import { useModal } from '@/components/Modal';
  import MsgTemplateDetail from './MsgTemplateDetail.vue';
  import MsgModal from './MsgModal.vue';

  const props = defineProps(['noticeConfig', 'funcOptions', 'type', 'isApprover']);
  const msgTemplateJsonColumns = [
    { title: '模板名称', dataIndex: 'msgTemplateName', key: 'msgTemplateName', width: 170 },
    { title: '参数名称', dataIndex: 'paramJson', key: 'paramJson', width: 150 },
    { title: '表单字段', dataIndex: 'field', key: 'field', width: 150 },
  ];
  const [registerDetail, { openModal: openDetailModal }] = useModal();

  const getTitleAndHelp = computed(() => {
    let item = {
      title: '流程待办',
      help: '流程处于等待的时候',
    };
    const preText = props.isApprover ? '当前' : '所有';
    if (props.type == 'end') {
      item.title = '流程结束';
      item.help = '流程结束的时候';
    }
    if (props.type == 'comment') {
      item.title = '流程评论';
      item.help = '流程评论发送通知方式';
    }
    if (props.type == 'approve') {
      item.title = '节点同意';
      item.help = preText + '节点审核人同意的时候';
    }
    if (props.type == 'reject') {
      item.title = '节点拒绝';
      item.help = preText + '节点审核人拒绝的时候';
    }
    if (props.type == 'back') {
      item.title = '节点退回';
      item.help = preText + '节点审核人退回的时候';
    }
    if (props.type == 'copy') {
      item.title = '节点抄送';
      item.help = preText + '节点抄送的时候';
    }
    if (props.type == 'overTime') {
      item.title = '节点超时';
      item.help = preText + '节点超时的时候';
    }
    if (props.type == 'notice') {
      item.title = '节点提醒';
      item.help = preText + '节点提醒的时候';
    }
    if (props.type == 'launch') {
      item.title = '节点提醒';
      item.help = preText + '节点提醒的时候';
    }
    return item;
  });

  function onMsgChange(val, row) {
    if (!val) {
      props.noticeConfig.msgId = '';
      props.noticeConfig.msgName = '';
      props.noticeConfig.templateJson = [];
      return;
    }
    if (props.noticeConfig.msgId === val) return;
    props.noticeConfig.msgId = val;
    props.noticeConfig.msgName = row.fullName;
    props.noticeConfig.templateJson = row.templateJson || [];
  }
  function goMsgDetail(id) {
    openDetailModal(true, { id });
  }
  function onRelationFieldChange(val, row) {
    if (!val) return;
    let list = props.funcOptions.filter(o => o.id === val);
    if (!list.length) return;
    let item = list[0];
    row.isSubTable = item.__config__ && item.__config__.isSubTable ? item.__config__.isSubTable : false;
  }
</script>
