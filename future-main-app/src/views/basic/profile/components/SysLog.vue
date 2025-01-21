<template>
  <div class="future-content-wrapper bg-white sysLog mt-10px">
    <div class="future-content-wrapper-center">
      <div class="future-content-wrapper-search-box">
        <BasicForm class="search-form" @register="registerForm" @submit="handleSubmit" @reset="handleReset" />
      </div>
      <div class="future-content-wrapper-content bg-white">
        <BasicTable @register="registerLoginTable" :columns="loginTableColumns" :searchInfo="getSearchInfo">
          <template #tableTitle>
            <a-button type="error" preIcon="icon-ym icon-ym-btn-clearn" @click="handleDelete">{{ t('common.delText') }}</a-button>
            <a-button type="link" danger @click="handleDelAll">一键清空</a-button>
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'loginType'">
              <div class="login-type-box">
                <span class="circle-box" :class="record.loginType == 0 ? 'circle-box-primary' : 'circle-box-error'" />
                {{ record.loginType == 0 ? '登录' : '退出' }}
              </div>
            </template>
            <template v-if="column.key === 'loginMark'">
              <a-tag :color="record.loginMark == 1 ? 'success' : 'error'">{{ record.loginMark == 1 ? '成功' : '失败' }}</a-tag>
            </template>
          </template>
        </BasicTable>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { reactive, onMounted, computed, nextTick } from 'vue';
  // import { getLogList } from '@/api/permission/userSetting';
  // import { delLog, batchDelLoginLog } from '@/api/system/log';
  import { BasicForm, useForm } from '@/components/Form';
  import { useI18n } from '@/hooks/web/useI18n';
  import { BasicTable, useTable, BasicColumn } from '@/components/Table';
  import dayjs from 'dayjs';
  import { useMessage } from '@/hooks/web/useMessage';

  interface State {
    searchInfo: any;
  }
  const state = reactive<State>({
    searchInfo: {},
  });
  const { t } = useI18n();
  const { createMessage, createConfirm } = useMessage();

  const getSearchInfo = computed(() => ({ category: 1, ...state.searchInfo }));

  const [registerForm] = useForm({
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
      {
        field: 'loginType',
        label: '类型',
        component: 'Select',
        componentProps: {
          options: [
            { fullName: '登录', id: 0 },
            { fullName: '退出', id: 1 },
          ],
        },
      },
      {
        field: 'loginMark',
        label: '状态',
        component: 'Select',
        componentProps: {
          placeholder: '请选择',
          options: [
            { fullName: '成功', id: 1 },
            { fullName: '失败', id: 0 },
          ],
        },
      },
      {
        field: 'pickerVal',
        label: '时间',
        component: 'DateRange',
        componentProps: {
          format: 'YYYY-MM-DD HH:mm:ss',
          showTime: { defaultValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')] },
          placeholder: ['开始时间', '结束时间'],
        },
      },
    ],
    fieldMapToTime: [['pickerVal', ['startTime', 'endTime']]],
  });
  const loginTableColumns: BasicColumn[] = [
    { title: '类型', dataIndex: 'loginType', width: 100 },
    { title: '时间', dataIndex: 'creatorTime', width: 150, format: 'date|YYYY-MM-DD HH:mm:ss' },
    { title: '用户', dataIndex: 'userName', width: 120 },
    { title: 'IP地址', dataIndex: 'ipAddress', width: 120 },
    { title: '地点', dataIndex: 'ipAddressName', width: 120 },
    { title: '浏览器', dataIndex: 'browser', width: 120 },
    { title: '操作系统', dataIndex: 'platForm', width: 120 },
    { title: '耗时(毫秒)', dataIndex: 'requestDuration', width: 90, align: 'center' },
    { title: '状态', dataIndex: 'loginMark', width: 70, align: 'center' },
    { title: '操作说明', dataIndex: 'abstracts', width: 120 },
  ];
  const [registerLoginTable, { reload, getSelectRows }] = useTable({
    api: undefined,
    rowSelection: { type: 'checkbox' },
    immediate: false,
    clickToRowSelect: false,
    clearSelectOnPageChange: true,
    showTableSetting: false,
  });

  function handleSubmit(data) {
    let obj = {};
    for (let [key, value] of Object.entries(data)) {
      if (value || value == 0) {
        if (Array.isArray(value)) {
          if (value.length) obj[key] = value;
        } else {
          obj[key] = value;
        }
      }
    }
    state.searchInfo = obj;
    nextTick(() => reload());
  }
  function handleReset() {
    state.searchInfo = {};
    nextTick(() => reload());
  }
  function handleDelete() {
    const list: any[] = getSelectRows() || [];
    if (!list.length) return createMessage.error(t('common.selectDataTip'));
    const query = {
      ids: list.map(item => item.id),
    };
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.batchDelTip'),
      onOk: () => {
        // delLog(query).then(res => {
        //   createMessage.success(res.msg);
        //   reload();
        // });
      },
    });
  }
  function handleDelAll() {
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: '此操作会将所有日志删除，是否继续?',
      onOk: () => {
        // batchDelLoginLog().then(res => {
        //   createMessage.success(res.msg);
        //   reload();
        // });
      },
    });
  }

  onMounted(() => {
    reload();
  });
</script>
