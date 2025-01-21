<template>
  <div class="common-container">
    <template v-if="config.popupType === 'dialog'">
      <a-modal
        v-model:open="visible"
        :title="config.popupTitle"
        :width="config.popupWidth"
        class="common-container-modal"
        @ok="handleSubmit"
        @cancel="handleCancel"
        :maskClosable="false">
        <template #closeIcon>
          <ModalClose :canFullscreen="false" @cancel="handleCancel" />
        </template>
        <div class="future-common-search-box future-common-search-box-modal">
          <a-form :colon="false" labelAlign="right" :model="listQuery" ref="formElRef" :class="getFormClass">
            <a-row :gutter="10">
              <a-col :span="8">
                <a-form-item :label="t('common.keyword')" name="keyword">
                  <a-input v-model:value="listQuery.keyword" :placeholder="t('common.enterKeyword')" allowClear @pressEnter="handleSearch" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label=" ">
                  <a-button type="primary" class="mr-2" @click="handleSearch">{{ t('common.queryText') }}</a-button>
                  <a-button @click="handleReset">{{ t('common.resetText') }}</a-button>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
          <div class="future-common-search-box-right">
            <a-tooltip placement="top">
              <template #title>
                <span>{{ t('common.redo') }}</span>
              </template>
              <RedoOutlined class="future-common-search-box-right-icon" @click="initData" />
            </a-tooltip>
          </div>
        </div>
        <a-table :data-source="list" v-bind="getTableBindValues" @change="handleTableChange" ref="tableElRef">
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex !== 'index'">{{ record[column.dataIndex] }}</template>
          </template>
        </a-table>
      </a-modal>
    </template>
    <template v-if="config.popupType === 'drawer'">
      <a-drawer :title="config.popupTitle" :width="config.popupWidth" v-model:open="visible" :class="drawerPrefixCls + ' common-container-drawer'">
        <div class="common-container-drawer-body">
          <div class="future-common-search-box future-common-search-box-modal">
            <a-form :colon="false" labelAlign="right" :model="listQuery" ref="formElRef" :class="getFormClass">
              <a-row :gutter="10">
                <a-col :span="8">
                  <a-form-item :label="t('common.keyword')" name="keyword">
                    <a-input v-model:value="listQuery.keyword" :placeholder="t('common.enterKeyword')" allowClear @pressEnter="handleSearch" />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label=" ">
                    <a-button type="primary" class="mr-2" @click="handleSearch">{{ t('common.queryText') }}</a-button>
                    <a-button @click="handleReset">{{ t('common.resetText') }}</a-button>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
            <div class="future-common-search-box-right">
              <a-tooltip placement="top">
                <template #title>
                  <span>{{ t('common.redo') }}</span>
                </template>
                <RedoOutlined class="future-common-search-box-right-icon" @click="initData" />
              </a-tooltip>
            </div>
          </div>
          <a-table :data-source="list" v-bind="getTableBindValues" @change="handleTableChange" ref="tableElRef">
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex !== 'index'">{{ record[column.dataIndex] }}</template>
            </template>
          </a-table>
        </div>
        <DrawerFooter showFooter @close="handleCancel" @ok="handleSubmit"></DrawerFooter>
      </a-drawer>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { getDataInterfaceDataSelect } from '@/api/systemData/dataInterface';
  import { getFieldDataSelect } from '@/api/onlineDev/visualDev';
  import { Modal as AModal, Drawer as ADrawer } from 'ant-design-vue';
  import { ref, unref, computed, nextTick, reactive, toRefs } from 'vue';
  import ModalClose from '@/components/Modal/src/components/ModalClose.vue';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useDesign } from '@/hooks/web/useDesign';
  import DrawerFooter from '@/components/Drawer/src/components/DrawerFooter.vue';
  import { RedoOutlined } from '@ant-design/icons-vue';
  import type { FormInstance } from 'ant-design-vue';
  import { useUserStore } from '@/store/modules/user';

  interface State {
    list: any[];
    listQuery: any;
    loading: boolean;
    total: number;
    selectedRowKeys: any[];
    selectedRows: any[];
  }

  defineOptions({ name: 'SelectModal', inheritAttrs: false });
  const props = defineProps({
    config: {
      type: Object,
      default: () => {},
    },
    formData: Object,
  });
  const emit = defineEmits(['select']);
  const { t } = useI18n();
  const { prefixCls: drawerPrefixCls } = useDesign('basic-drawer');
  const { prefixCls: formPrefixCls } = useDesign('basic-form');
  const { prefixCls: tablePrefixCls } = useDesign('basic-table');

  const selectRow = ref<any>(null);
  const visible = ref(false);
  const userStore = useUserStore();
  const formElRef = ref<FormInstance>();
  const tableElRef = ref<any>(null);
  const indexColumn = { width: 50, title: '序号', dataIndex: 'index', key: 'index', align: 'center', customRender: ({ index }) => index + 1 };
  const state = reactive<State>({
    list: [],
    listQuery: {
      keyword: '',
      currentPage: 1,
      pageSize: 20,
    },
    loading: false,
    total: 0,
    selectedRowKeys: [],
    selectedRows: [],
  });
  const { listQuery, list } = toRefs(state);

  const getUserInfo = computed(() => userStore.getUserInfo || {});
  const getIsDynamic = computed(() => props.config.dataSource == 'dynamic');
  const getFormClass = computed(() => {
    return [formPrefixCls, `${formPrefixCls}--compact`, 'search-form'];
  });
  const getColumns = computed<any[]>(() => {
    const columns = (props.config.columnOptions as any)
      .filter(o => o.ifShow || o.ifShow === undefined)
      .map(o => ({ title: o.label, dataIndex: o.value, ellipsis: true, width: o.width || 100 }));
    return [indexColumn, ...columns];
  });
  const searchInfo = computed(() => {
    const paramList = getParamList();
    const columnOptions = (props.config.columnOptions as any).map(o => o.value).join(',');
    const info: any = {
      interfaceId: props.config.interfaceId,
      columnOptions,
      paramList,
    };
    const data = {
      modelId: props.config.modelId,
      relationField: props.config.relationField,
      columnOptions,
    };
    return unref(getIsDynamic) ? info : data;
  });
  const getPagination = computed<any>(() => {
    return {
      current: state.listQuery.currentPage,
      pageSize: state.listQuery.pageSize,
      size: 'small',
      defaultPageSize: 20,
      showTotal: total => t('component.table.total', { total }),
      showSizeChanger: true,
      pageSizeOptions: ['20', '50', '80', '100'],
      showQuickJumper: true,
      total: state.total,
    };
  });
  const getRowSelection = computed<any>(() => ({
    type: 'checkbox',
    onChange: setSelectedRowKeys,
  }));
  const getScrollY = computed(() => {
    let height = props.config.popupType === 'drawer' ? window.innerHeight - 120 - 52 - 38 : window.innerHeight * 0.7 - 52 - 38;
    height -= 44;
    return height;
  });
  const getTableBindValues = computed(() => {
    return {
      columns: unref(getColumns),
      pagination: unref(getPagination),
      rowSelection: unref(getRowSelection),
      size: 'small',
      loading: state.loading,
      rowKey: record => record,
      scroll: {
        y: unref(getScrollY),
      },
      class: unref(tablePrefixCls),
    };
  });

  defineExpose({ openSelectModal });

  function getForm() {
    const form = unref(formElRef);
    if (!form) {
      throw new Error('form is null!');
    }
    return form;
  }
  function openSelectModal() {
    visible.value = true;
    setTimeout(() => {
      nextTick(() => {
        handleReset();
        state.selectedRowKeys = [];
        state.selectedRows = [];
        state.list = [];
        state.total = 0;
        const tableEl = tableElRef.value?.$el;
        let bodyEl = tableEl.querySelector('.ant-table-body');
        bodyEl!.style.height = `${unref(getScrollY)}px`;
      });
    }, 50);
  }
  function handleCancel() {
    visible.value = false;
  }
  function handleSubmit() {
    if (!state.selectedRowKeys.length && !state.selectedRows.length) return;
    selectRow.value = state.selectedRows;
    let checked: any[] = [];
    for (let i = 0; i < unref(selectRow).length; i++) {
      const e = unref(selectRow)[i];
      let item = {};
      for (let j = 0; j < props.config.relationOptions.length; j++) {
        const row = props.config.relationOptions[j];
        item[row.field] = row.type === 1 ? e[!unref(getIsDynamic) ? row.value + '_futureId' : row.value] : row.value;
      }
      checked.push(item);
    }
    emit('select', checked);
    handleCancel();
  }
  function getParamList() {
    let templateJson: any[] = props.config.templateJson;
    if (!props.formData) return templateJson;
    for (let i = 0; i < templateJson.length; i++) {
      const e = templateJson[i];
      const data = props.formData;
      if (e.sourceType == 1) {
        e.defaultValue = data[e.relationField] || data[e.relationField] == 0 || data[e.relationField] == false ? data[e.relationField] : '';
      }
      if (e.futureKey === 'createUser') e.defaultValue = unref(getUserInfo).userId;
      if (e.futureKey === 'createTime') e.defaultValue = new Date().getTime();
      if (e.futureKey === 'currOrganize') e.defaultValue = unref(getUserInfo).organizeId;
      if (e.futureKey === 'currPosition' && unref(getUserInfo).positionIds?.length) e.defaultValue = unref(getUserInfo).positionIds[0].id;
    }
    return templateJson;
  }
  function handleSearch() {
    state.listQuery.currentPage = 1;
    state.listQuery.pageSize = 20;
    initData();
  }
  function handleReset() {
    getForm().resetFields();
    state.listQuery.keyword = '';
    handleSearch();
  }
  function initData() {
    if (unref(getIsDynamic) && !props.config.interfaceId) return;
    if (!unref(getIsDynamic) && !props.config.modelId) return;
    state.loading = true;
    const query = {
      ...state.listQuery,
      ...unref(searchInfo),
    };
    const method = unref(getIsDynamic) ? getDataInterfaceDataSelect : getFieldDataSelect;
    method(query)
      .then(res => {
        state.list = res.data.list;
        state.total = res.data.pagination.total;
        state.loading = false;
      })
      .catch(() => {
        state.loading = false;
      });
  }
  function handleTableChange(pagination) {
    state.listQuery.currentPage = pagination.current;
    state.listQuery.pageSize = pagination.pageSize;
    initData();
  }
  function setSelectedRowKeys(_selectedRowKeys, selectedRows) {
    state.selectedRows = selectedRows;
  }
</script>
