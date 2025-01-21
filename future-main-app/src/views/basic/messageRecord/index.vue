<template>
  <div class="future-content-wrapper message-record-wrapper">
    <div class="future-content-wrapper-center">
      <div class="future-content-wrapper-search-box">
        <BasicForm class="search-form" @register="registerForm" @submit="handleSubmit" @reset="handleReset" />
      </div>
      <div class="future-content-wrapper-content bg-white">
        <a-tabs v-model:activeKey="activeKey" class="future-content-wrapper-tabs" destroyInactiveTabPane>
          <a-tab-pane v-for="item in messageType" :key="item.enCode" :tab="item.fullName"></a-tab-pane>
        </a-tabs>
        <BasicTable @register="registerTable" :columns="columns" :searchInfo="getSearchInfo">
          <template #tableTitle>
            <a-button type="error" preIcon="icon-ym icon-ym-btn-clearn" @click="handleDelete">{{ t('common.delText') }}</a-button>
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'title'">
              <a :title="record.name" @click="handleView(record)">{{ record.title }}</a>
            </template>
            <template v-if="column.key === 'type'">
              {{ getTypeName(record.type) }}
            </template>
            <template v-if="column.key === 'isRead'">
              <a-tag :color="record.isRead == 1 ? 'success' : ''">{{ record.isRead == 1 ? '已读' : '未读' }}</a-tag>
            </template>
          </template>
        </BasicTable>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { reactive, toRefs, watch, computed, nextTick, onMounted } from 'vue';
  // import { getMessageList, readInfo, delMsgRecord } from '@/api/system/message';
  import { BasicForm, useForm } from '@/components/Form';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useI18n } from '@/hooks/web/useI18n';
  import { BasicTable, useTable, BasicColumn } from '@/components/Table';
  import { useModal } from '@/components/Modal';
  import { useRouter } from 'vue-router';
  import { encryptByBase64 } from '@/utils/cipher';
  import { useBaseStore } from '@/store/modules/base';
  // import { getScheduleDetail } from '@/api/workFlow/schedule';

  defineOptions({ name: 'messageRecord' });

  interface State {
    activeKey: string;
    keyword: string;
    messageType: any[];
  }

  const router = useRouter();
  const { createMessage, createConfirm } = useMessage();
  const { t } = useI18n();
  const state = reactive<State>({
    activeKey: '0',
    keyword: '',
    messageType: [],
  });
  const { activeKey, messageType } = toRefs(state);
  const baseStore = useBaseStore();
  const getSearchInfo = computed(() => ({ keyword: state.keyword, type: state.activeKey == '0' ? '' : state.activeKey }));

  const [registerForm, { resetFields }] = useForm({
    baseColProps: { span: 6 },
    showActionButtonGroup: true,
    showAdvancedButton: true,
    compact: true,
    schemas: [
      {
        field: 'keyword',
        label: t('common.keyword'),
        component: 'Input',
        componentProps: {
          placeholder: t('common.enterKeyword'),
          submitOnPressEnter: true,
        },
      },
    ],
  });
  const columns: BasicColumn[] = [
    { title: '消息标题', dataIndex: 'title' },
    { title: '消息类型', dataIndex: 'type', width: 120 },
    { title: '发送人员', dataIndex: 'releaseUser', width: 120 },
    { title: '发送时间', dataIndex: 'releaseTime', width: 150, format: 'date|YYYY-MM-DD HH:mm:ss' },
    { title: '状态', dataIndex: 'isRead', width: 70 },
  ];
  const [registerTable, { reload, getSelectRows, clearSelectedRowKeys }] = useTable({
    api: undefined,
    rowSelection: { type: 'checkbox' },
    clickToRowSelect: false,
    immediate: false,
  });
  const [registerDetail, { openModal: openDetailModal }] = useModal();
  const [registerScheduleDetail, { openModal: openScheduleDetailModal }] = useModal();

  watch(
    () => state.activeKey,
    () => {
      resetFields();
    },
  );

  async function initMessageType() {
    const all = { id: '', fullName: '全部', enCode: '' };
    const list = ((await baseStore.getDictionaryData('msgSourceType')) as any[]) || [];
    state.messageType = [all, ...list];
  }
  function handleSubmit(values) {
    state.keyword = values?.keyword || '';
    handleSearch();
  }
  function handleReset() {
    state.keyword = '';
    handleSearch();
  }
  function handleSearch() {
    nextTick(() => {
      reload({ page: 1 });
    });
  }
  function handleDelete() {
    const list: any[] = getSelectRows();
    if (!list.length) return createMessage.error(t('common.selectDataTip'));
    const query = { ids: list.map(item => item.id).join(',') };
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.batchDelTip'),
      onOk: () => {
        // delMsgRecord(query).then(res => {
        //   createMessage.success(res.msg);
        //   clearSelectedRowKeys();
        //   reload();
        // });
      },
    });
  }
  function handleView(item) {
    // readInfo(item.id).then(res => {
    //   if (item.isRead == '0') item.isRead = '1';
    //   if (item.type == 4) {
    //     let bodyText = res.data.bodyText ? JSON.parse(res.data.bodyText) : {};
    //     if (bodyText.type == 3) return;
    //     // getScheduleDetail(bodyText.groupId, bodyText.id).then(() => {
    //     //   openScheduleDetailModal(true, { id: bodyText.id, groupId: bodyText.groupId });
    //     // });
    //   } else if (item.type == 2 && item.flowType == 2) {
    //     const bodyText = JSON.parse(res.data.bodyText);
    //     router.push('/workFlow/entrust?config=' + bodyText.type);
    //   } else {
    //     if (item.type == 1 || item.type == 3) {
    //       openDetailModal(true, { id: item.id, type: 1 });
    //     } else {
    //       if (!res.data.bodyText) return;
    //       router.push('/workFlowDetail?config=' + encodeURIComponent(encryptByBase64(res.data.bodyText)));
    //     }
    //   }
    // });
  }
  function getTypeName(type?) {
    const list = state.messageType.filter(o => o.enCode == type) || [];
    return list.length ? list[0].fullName : '公告';
  }

  onMounted(() => {
    initMessageType();
    state.activeKey = '';
  });
</script>
