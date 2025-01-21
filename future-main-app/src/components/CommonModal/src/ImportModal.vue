<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    title="批量导入"
    :width="1000"
    :show-cancel-btn="false"
    :show-ok-btn="false"
    destroyOnClose
    class="future-import-modal">
    <div class="header-steps">
      <a-steps v-model:current="activeStep" type="navigation" size="small">
        <a-step title="上传文件" disabled />
        <a-step title="数据预览" disabled />
        <a-step title="导入数据" disabled />
      </a-steps>
    </div>
    <div class="import-main" v-show="activeStep == 0">
      <div class="upload">
        <div class="up_left">
          <img src="../../../assets/images/upload.png" />
        </div>
        <div class="up_right">
          <p class="title">上传填好的数据表</p>
          <p class="tip">文件后缀名必须是xls或xlsx，文件大小不超过500KB，最多支持导入1000条数据</p>
          <a-upload
            v-model:file-list="fileList"
            class="upload-area"
            accept=".xls,.xlsx"
            :max-count="1"
            :action="getAction"
            :headers="getHeaders"
            :before-upload="beforeUpload"
            @remove="handleFileRemove"
            @change="handleFileChange">
            <a-button type="link">上传文件</a-button>
          </a-upload>
        </div>
      </div>
      <div class="upload">
        <div class="up_left">
          <img src="../../../assets/images/import.png" />
        </div>
        <div class="up_right">
          <p class="title">填写导入数据信息</p>
          <p class="tip">请按照数据模板的格式准备导入数据，模板中的表头名称不可更改，表头行不能删除</p>
          <a-button type="link" @click="handleTemplateDownload()">下载模板</a-button>
        </div>
      </div>
    </div>
    <div class="import-main" v-show="activeStep == 1">
      <a-table
        :data-source="list"
        :columns="columns"
        size="small"
        bordered
        :pagination="false"
        :scroll="{ x: 'max-content', y: '420px' }"
        class="import-preview-table">
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.dataIndex === 'index'">{{ index + 1 }}</template>
          <template v-else-if="column.dataIndex === 'action'">
            <a-button class="action-btn" type="link" color="error" @click="handleDelItem(index)" size="small">删除</a-button>
          </template>
          <template v-else-if="column.isChild">
            <template v-for="item in state.columnsChildList">
              <template v-if="item.children && item.children[0] && column.dataIndex === item.children[0]?.dataIndex && column.isChild">
                <div class="child-table-column">
                  <tr v-for="(cItem, cIndex) in record[item.dataIndex]" class="child-table__row" :key="cIndex">
                    <td v-for="(headItem, i) in item.children" :key="i" :style="{ width: `${headItem.width}px` }">
                      <div class="cell" v-if="headItem.dataIndex === 'delete'">
                        <a-button class="action-btn" type="link" color="error" @click="handleDelChildItem(record[item.dataIndex], cIndex)" size="small">
                          删除
                        </a-button>
                      </div>
                      <div class="cell" v-else>
                        <a-input v-model:value="cItem[headItem.dataIndex]" />
                      </div>
                    </td>
                  </tr>
                </div>
              </template>
            </template>
          </template>
          <template v-else>
            <a-input v-model:value="record[column.dataIndex]" />
          </template>
        </template>
      </a-table>
    </div>
    <div class="import-main" v-show="activeStep == 2">
      <div class="success" v-if="!result.resultType">
        <img src="../../../assets/images/success.png" />
        <p class="success-title">批量导入成功</p>
        <p class="success-tip">您已成功导入{{ result.snum }}条数据</p>
      </div>
      <div class="unsuccess" v-if="result.resultType">
        <div class="upload error-show">
          <div class="up_left">
            <img src="../../../assets/images/tip.png" />
          </div>
          <div class="up_right">
            <p class="tip success-tip">
              正常数据条数：<span>{{ result.snum }}条</span>
            </p>
            <p class="tip error-tip">
              异常数据条数：<span>{{ result.fnum }}条</span>
            </p>
          </div>
        </div>
        <div class="conTips">
          <p>以下文件数据为导入异常数据</p>
          <a-button type="link" preIcon="icon-ym icon-ym-btn-download" @click="handleExportExceptionData()">导出异常数据</a-button>
        </div>
        <a-table :data-source="resultList" :columns="resultColumns" size="small" bordered :pagination="false" :scroll="{ x: 'max-content', y: '205px' }">
          <template #bodyCell="{ column, record }">
            <template v-for="item in state.resultColumnsChildList">
              <template v-if="item.children && item.children[0] && column.dataIndex === item.children[0]?.dataIndex && column.isChild">
                <div class="child-table-column">
                  <tr v-for="(cItem, cIndex) in record[item.dataIndex]" class="child-table__row" :key="cIndex">
                    <td v-for="(headItem, i) in item.children" :key="i" :style="{ width: `${headItem.width}px` }">
                      <div class="cell" :title="cItem[headItem.dataIndex]">{{ cItem[headItem.dataIndex] }}</div>
                    </td>
                  </tr>
                </div>
              </template>
            </template>
          </template>
        </a-table>
      </div>
    </div>
    <template #insertFooter>
      <a-button @click="handleClose()" v-if="activeStep == 0">{{ t('common.cancelText') }}</a-button>
      <a-button @click="handlePrev" v-if="activeStep === 1">{{ t('common.prev') }}</a-button>
      <a-button type="primary" @click="handleNext" :loading="btnLoading" v-if="activeStep < 2" :disabled="activeStep === 0 && !fileName">
        {{ t('common.next') }}
      </a-button>
      <a-button type="primary" @click="handleClose(true)" v-else>关闭</a-button>
    </template>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { reactive, toRefs, computed } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { getTemplateDownload, getImportPreview, importData, getImportExceptionData } from '@/api/basic/common';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useI18n } from '@/hooks/web/useI18n';
  import { downloadByUrl } from '@/utils/file/download';
  import { useGlobSetting } from '@/hooks/setting';
  import { getToken } from '@/utils/auth';
  import { Upload as AUpload } from 'ant-design-vue';
  import type { UploadChangeParam, UploadFile } from 'ant-design-vue';
  import { cloneDeep } from 'lodash-es';

  interface State {
    activeStep: number;
    fileName: string;
    fileList: UploadFile[];
    btnLoading: boolean;
    list: any[];
    result: any;
    resultList: any[];
    actionUrl: string;
    apiUrl: string;
    columns: any[];
    resultColumns: any[];
    columnsChildList: any[];
    resultColumnsChildList: any[];
    flowId: string;
    menuId: string;
  }
  const emit = defineEmits(['register', 'reload']);
  const [registerModal, { closeModal }] = useModalInner(init);
  const { createMessage, createConfirm } = useMessage();
  const { t } = useI18n();
  const noColumn = { title: '序号', dataIndex: 'index', align: 'center', width: 50, customRender: ({ index }) => index + 1 };
  const actionColumn = { title: '操作', dataIndex: 'action', align: 'center', width: 50, fixed: 'right' };
  const errorColumn = { title: '异常原因', dataIndex: 'errorsInfo', width: 150, fixed: 'right' };

  const globSetting = useGlobSetting();
  const state = reactive<State>({
    activeStep: 0,
    fileName: '',
    fileList: [],
    btnLoading: false,
    list: [],
    result: {},
    resultList: [],
    actionUrl: '',
    apiUrl: '',
    columns: [],
    resultColumns: [],
    columnsChildList: [],
    resultColumnsChildList: [],
    flowId: '',
    menuId: '',
  });
  const { activeStep, fileName, fileList, btnLoading, list, result, resultList, columns, resultColumns } = toRefs(state);

  const getAction = computed(() => globSetting.apiUrl + state.actionUrl);
  const getHeaders = computed(() => ({ Authorization: getToken() as string }));

  function init(data) {
    state.actionUrl = `/api/${data.url || 'visualdev/OnlineDev'}/Uploader`;
    state.apiUrl = data.url || `visualdev/OnlineDev/${data.modelId}`;
    state.menuId = data.menuId;
    state.flowId = data.flowId || '';
    state.activeStep = 0;
    state.fileName = '';
    state.fileList = [];
    state.btnLoading = false;
  }
  function handlePrev() {
    if (state.activeStep == 0) return;
    state.activeStep -= 1;
  }
  function handleNext() {
    if (state.activeStep == 0) {
      if (!state.fileList.length || !state.fileName) return createMessage.warning('请先上传文件');
      state.btnLoading = true;
      getImportPreview(state.apiUrl, { fileName: state.fileName })
        .then(res => {
          state.list = res.data.dataRow || [];
          const headerList = res.data.headerRow || [];
          const loop = list => {
            for (let i = 0; i < list.length; i++) {
              list[i] = {
                ...list[i],
                title: list[i].fullName,
                dataIndex: list[i].id,
                width: 150,
              };
              if (list[i].children?.length) loop(list[i].children);
            }
          };
          loop(headerList);
          state.resultColumns = [noColumn, ...headerList, errorColumn];
          getMergeList(state.resultColumns);
          state.resultColumnsChildList = state.resultColumns.filter(o => o.futureKey === 'table' && o.children && o.children.length);
          const preHeaderList = cloneDeep(headerList);
          for (let i = 0; i < preHeaderList.length; i++) {
            if (preHeaderList[i].children?.length && preHeaderList[i]?.futureKey == 'table') {
              preHeaderList[i].children.push({
                title: '操作',
                dataIndex: 'delete',
                width: 50,
                isChild: true,
              });
            }
          }
          state.columns = [noColumn, ...preHeaderList, actionColumn];
          getMergeList(state.columns);
          state.columnsChildList = state.columns.filter(o => o.futureKey === 'table' && o.children && o.children.length);
          state.btnLoading = false;
          state.activeStep += 1;
        })
        .catch(() => {
          state.btnLoading = false;
        });
      return;
    }
    if (state.activeStep == 1) {
      if (!state.list.length) return createMessage.warning('导入数据为空');
      handleSubmit();
    }
  }
  function handleSubmit() {
    state.btnLoading = true;
    const query: any = { list: state.list };
    if (state.flowId) query.flowId = state.flowId;
    importData(state.apiUrl, query)
      .then(res => {
        state.result = res.data;
        state.resultList = res.data.failResult;
        state.btnLoading = false;
        state.activeStep += 1;
      })
      .catch(() => {
        state.btnLoading = false;
      });
  }
  function getMergeList(list) {
    list.forEach(item => {
      if (item.children && item.children.length && item?.futureKey == 'table') {
        item.children.forEach((child, index) => {
          child.isChild = true;
          if (index == 0) {
            child.customCell = () => ({
              rowspan: 1,
              colspan: item.children.length,
              class: 'child-table-box',
            });
          } else {
            child.customCell = () => ({
              rowspan: 0,
              colspan: 0,
            });
          }
        });
      }
    });
  }
  function handleFileChange({ file }: UploadChangeParam) {
    if (file.status === 'error') {
      createMessage.error('上传失败');
      return;
    }
    if (file.status === 'done') {
      if (file.response.code === 200) {
        state.fileName = file.response.data.name;
      } else {
        createMessage.error(file.response.msg);
      }
    }
  }
  function beforeUpload(file) {
    const fileType = file.name.replace(/.+\./, '');
    const isAccept = ['xls', 'xlsx'].indexOf(fileType.toLowerCase()) !== -1;
    if (!isAccept) {
      createMessage.error('文件格式不正确');
      return AUpload.LIST_IGNORE;
    }
    const isRightSize = file.size / 1024 < 500;
    if (!isRightSize) {
      createMessage.error('文件大小超过500KB');
      return AUpload.LIST_IGNORE;
    }
    return true;
  }
  function handleFileRemove(file) {
    return new Promise<void>((resolve, reject) => {
      createConfirm({
        iconType: 'warning',
        title: t('common.tipTitle'),
        content: `确定移除${file.name}?`,
        onOk: () => {
          state.fileName = '';
          resolve();
        },
        onCancel: () => {
          reject();
        },
      });
    });
  }
  function handleTemplateDownload() {
    getTemplateDownload(state.apiUrl, { menuId: state.menuId }).then(res => {
      downloadByUrl({ url: res.data?.url });
    });
  }
  function handleExportExceptionData() {
    getImportExceptionData(state.apiUrl, { list: state.resultList, menuId: state.menuId }).then(res => {
      downloadByUrl({ url: res.data?.url });
    });
  }
  function handleDelItem(index) {
    state.list.splice(index, 1);
  }
  function handleDelChildItem(data, index) {
    data.splice(index, 1);
  }
  function handleClose(reload = false) {
    closeModal();
    if (reload) emit('reload');
  }
</script>
