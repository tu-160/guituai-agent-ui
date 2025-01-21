<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="查看模板" :footer="null" :width="1000">
    <a-form class="!mx-20px" :colon="false" :model="dataForm" :labelCol="{ style: { width: '100px' } }">
      <a-row :gutter="20">
        <a-col :span="12">
          <a-form-item label="名称" name="fullName">
            <p>{{ dataForm.fullName }}</p>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="编码" name="enCode">
            <p>{{ dataForm.enCode }}</p>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="模板类型">
            <p>{{ dataForm.templateType == '0' ? '自定义模板' : '系统模板' }}</p>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="消息来源" name="messageSource">
            <p>{{ dataForm.messageSourceVal }}</p>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="消息类型" name="messageType">
            <p>{{ dataForm.messageTypeVal }}</p>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="状态" name="enabledMark">
            <a-switch v-model:checked="dataForm.enabledMark" :checkedValue="1" :unCheckedValue="0" disabled />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="排序" name="sortCode">
            <p>{{ dataForm.sortCode }}</p>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="说明" name="description">
            <p>{{ dataForm.description }}</p>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <div class="parameter-box">
            <div class="left-pane">
              <div class="left-pane-list">
                <div class="list">
                  <div class="header detail-header">
                    <span>参数名称</span>
                    <span>参数说明</span>
                  </div>
                  <div class="search-box">
                    <a-input-search class="search" v-model:value="keyword" placeholder="输入关键字" allowClear @input="handleSearch" />
                  </div>
                  <BasicTable @register="registerTable" :data-source="parameterList">
                    <template #bodyCell="{ column, record }">
                      <template v-if="column.key === 'field'">
                        <span class="cursor-pointer" :title="record.field">{{ record.field }}</span>
                      </template>
                      <template v-if="column.key === 'fieldName'">
                        <span class="cursor-pointer" :title="record.fieldName">
                          {{ record.fieldName }}
                        </span>
                      </template>
                    </template>
                  </BasicTable>
                </div>
              </div>
            </div>
            <div class="right-pane" v-if="dataForm.messageType != 3 && dataForm.messageType != 7">
              <a-form-item name="title">
                <template #label>消息标题<BasicHelp text="参数格式：{参数名}" /></template>
                <p>{{ dataForm.title }}</p>
              </a-form-item>
              <a-form-item name="content" v-if="dataForm.messageType == 2">
                <template #label>消息内容<BasicHelp text="参数格式：{参数名}" /></template>
                <p v-html="dataForm.content"></p>
              </a-form-item>
              <a-form-item name="content" v-else-if="dataForm.messageType != 1">
                <template #label>消息内容<BasicHelp text="参数格式：{参数名}" /></template>
                <p>{{ dataForm.content }}</p>
              </a-form-item>
            </div>
            <div class="right-pane" v-else>
              <a-row :gutter="20">
                <a-col :span="12">
                  <a-form-item name="templateCode">
                    <template #label>
                      模版编号
                      <BasicHelp
                        :text="
                          dataForm.messageType == 3
                            ? ['阿里云：请在【阿里云管理后台-模板管理】⻚⾯查看模板CODE', '腾讯云：请在【腾讯云管理后台-正⽂模板管理】⻚⾯查看模板ID']
                            : '在【微信公众号管理后台-广告与服务-模板消息】⻚⾯查看模板ID'
                        " />
                    </template>
                    <p>{{ dataForm.templateCode }}</p>
                  </a-form-item>
                </a-col>
                <a-col :span="12" offset="12"></a-col>
                <a-col :span="12" v-if="dataForm.messageType == 7">
                  <a-form-item label="跳转方式" name="wxSkip">
                    <p>{{ dataForm.wxSkip == 1 ? '小程序' : '页面' }}</p>
                  </a-form-item>
                </a-col>
                <a-col :span="12" v-if="dataForm.messageType == 7 && dataForm.wxSkip == 1">
                  <a-form-item name="xcxAppId">
                    <template #label>消息内容<BasicHelp text="请在【微信公众号管理后台-广告与服务-小程序管理】⻚⾯查看小程序ID" /></template>
                    <p>{{ dataForm.xcxAppId }}</p>
                  </a-form-item>
                </a-col>
              </a-row>
              <div class="msg-pane">
                <div class="list">
                  <a-table :data-source="smsList" :columns="getSmsParameterColumns" size="small" :pagination="false">
                    <template #headerCell="{ column }">
                      <template v-if="column.key === 'smsField'">
                        <span>{{ column.title }}</span>
                        <BasicHelp :text="column.helpMessage" />
                      </template>
                    </template>
                    <template #bodyCell="{ column, record }">
                      <template v-if="column.key === 'smsField'">
                        <p>{{ record.smsField }}</p>
                      </template>
                      <template v-if="column.key === 'field'">
                        <p>{{ record.field }}</p>
                      </template>
                      <template v-if="column.key === 'isTitle'">
                        <a-checkbox v-model:checked="record.isTitle" disabled />
                      </template>
                    </template>
                  </a-table>
                </div>
              </div>
            </div>
          </div>
        </a-col>
      </a-row>
    </a-form>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { reactive, toRefs, computed } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { getInfo } from '@/api/msgCenter/msgTemplate';
  import { BasicTable, useTable } from '@/components/Table';
  import { useBaseStore } from '@/store/modules/base';

  defineEmits(['register']);

  interface State {
    dataForm: any;
    parameterList: any[];
    allParameterList: any[];
    smsList: any[];
    messageTypeList: any[];
    messageSourceList: any[];
    keyword: string;
  }

  const state = reactive<State>({
    dataForm: {
      id: '',
      fullName: '',
      enCode: '',
      templateType: 0,
      messageType: '',
      messageSource: '',
      enabledMark: 1,
      sortCode: 0,
      description: '',
      title: '',
      content: '',
      templateCode: '',
      wxSkip: '1',
      xcxAppId: '',
    },
    parameterList: [],
    allParameterList: [],
    smsList: [],
    messageTypeList: [],
    messageSourceList: [],
    keyword: '',
  });
  const { dataForm, keyword, parameterList, smsList } = toRefs(state);
  const parameterColumns = [
    { title: '参数名称', dataIndex: 'field', key: 'field', width: 170 },
    { title: '参数说明', dataIndex: 'fieldName', key: 'fieldName', width: 170 },
  ];
  const [registerTable] = useTable({
    columns: parameterColumns,
    useSearchForm: false,
    showTableSetting: false,
    pagination: false,
    showHeader: false,
    showIndexColumn: false,
    scroll: { y: 230 },
  });

  const getSmsParameterColumns = computed(() => {
    const baseColumns: any[] = [
      { title: '序号', dataIndex: 'index', key: 'index', align: 'center', width: 50, customRender: ({ index }) => index + 1 },
      {
        title: '变量',
        dataIndex: 'smsField',
        key: 'smsField',
        helpMessage: ['阿里云：在【阿里云管理后台-模板管理】维护模板变量参数', '腾讯云：在【腾讯云管理后台-正⽂模板管理】维护模板变量参数'],
      },
      { title: '参数', dataIndex: 'field', key: 'field', width: 200 },
      { title: '标题', dataIndex: 'isTitle', key: 'isTitle', width: 70, align: 'center' },
    ];
    let list: any[] = [];
    if (state.dataForm.messageType == 3) {
      list = baseColumns.filter(o => o.key != 'isTitle');
    } else {
      list = baseColumns;
      list[1].helpMessage = '在【微信公众号管理后台-广告与服务-模板消息】维护模板参数';
    }
    return list;
  });
  const baseStore = useBaseStore();
  const [registerModal, { changeLoading }] = useModalInner(init);

  async function init(data) {
    resetForm();
    state.dataForm.id = data.id || '';
    if (state.dataForm.id) {
      initData();
      changeLoading(true);
      state.messageSourceList = (await baseStore.getDictionaryData('msgSourceType')) as any[];
      state.messageSourceList.map(o => (o.id = o.enCode));
      getInfo(state.dataForm.id)
        .then(res => {
          changeLoading(false);
          res.data.smsFieldList.map(o => {
            o.isTitle = !!o.isTitle;
          });
          state.dataForm = res.data;
          state.parameterList = res.data.templateParamList;
          state.allParameterList = state.parameterList;
          state.smsList = res.data.smsFieldList;
          const sourceItem = state.messageSourceList.find(item => {
            return item.enCode == state.dataForm.messageSource;
          });
          const typeItem = state.messageTypeList.find(item => {
            return item.enCode == state.dataForm.messageType;
          });
          if (sourceItem) state.dataForm.messageSourceVal = sourceItem.fullName;
          if (typeItem) state.dataForm.messageTypeVal = typeItem.fullName;
        })
        .catch(() => {
          changeLoading(false);
        });
    }
  }
  async function initData() {
    state.messageTypeList = (await baseStore.getDictionaryData('msgSendType')) as any[];
    state.messageTypeList.map(o => (o.id = o.enCode));
  }
  function handleSearch() {
    state.parameterList = state.allParameterList.filter(item => {
      if (item.field.toLowerCase().includes(state.keyword.toLowerCase()) || item.fieldName.toLowerCase().includes(state.keyword.toLowerCase())) {
        return item;
      }
    });
  }
  function resetForm() {
    state.dataForm = {
      id: '',
      fullName: '',
      enCode: '',
      templateType: 0,
      messageType: '',
      messageSource: '',
      enabledMark: 1,
      sortCode: 0,
      description: '',
      title: '',
      content: '',
      templateCode: '',
      wxSkip: 1,
      xcxAppId: '',
    };
    state.smsList = [];
  }
</script>
<style lang="less" scoped>
  .left-pane {
    height: 323px;
  }
</style>
