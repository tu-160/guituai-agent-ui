<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    defaultFullscreen
    :footer="null"
    :closable="false"
    :keyboard="false"
    class="future-full-modal full-modal designer-modal dataSet-modal">
    <template #title>
      <div class="future-full-modal-header">
        <div class="header-title">数据集名称：<a-input v-model:value="dataForm.fullName" placeholder="请输入" class="!w-200px"></a-input></div>
        <a-space class="options" :size="10">
          <a-button type="primary" @click="handleSubmit()" :disabled="btnLoading">{{ t('common.okText') }}</a-button>
          <a-button @click="closeModal()" :disabled="btnLoading">{{ t('common.cancelText') }}</a-button>
        </a-space>
      </div>
    </template>
    <div class="dataSet-modal-main">
      <div class="left-pane">
        <future-select
          class="!w-full"
          v-model:value="dataForm.dbLinkId"
          showSearch
          :options="dbOptions"
          placeholder="选择数据库"
          @change="onDbLinkChange"
          :fieldNames="{ options: 'children' }" />
        <div class="left-pane-box">
          <InputSearch class="search-box" :placeholder="t('common.enterKeyword')" allowClear v-model:value="keyword" @search="handleSearchTable" />
          <BasicTree class="tree-box remove-active-tree" ref="leftTreeRef" v-bind="getTreeBindValue" />
        </div>
      </div>
      <div class="middle-pane">
        <div class="title-box">
          <span>SQL语句<BasicHelp :text="getSqlTip" /></span>
          <a-dropdown>
            <span class="cursor-pointer">系统变量<DownOutlined class="ml-4px" /></span>
            <template #overlay>
              <a-menu>
                <a-menu-item disabled>当前系统变量仅支持内部接口引用</a-menu-item>
                <a-menu-divider />
                <a-menu-item v-for="(item, index) in getSysVariableList" :key="index" @click="handleSysNodeClick(item.value)">
                  <span>{{ item.value }}</span>
                  <span style="float: right; color: #8492a6; padding-left: 10px">{{ item.tips }}</span>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
        <MonacoEditor class="h-full" ref="sqlEditorRef" language="sql" v-model="dataForm.dataConfigJson" />
      </div>
      <!-- <div class="right-pane">
        <FieldTable :list="parameterJson" @item-click="handleItemClick" />
      </div> -->
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { getDataSourceSelector } from '@/api/systemData/dataSource';
  import { getDataModelListAll, getDataModelFieldList } from '@/api/systemData/dataModel';
  import { getFields } from '@/api/system/dataSet';
  import { reactive, toRefs, ref, unref, computed } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useI18n } from '@/hooks/web/useI18n';
  import { cloneDeep } from 'lodash-es';
  import { BasicTree } from '@/components/Tree';
  import { MonacoEditor } from '@/components/CodeEditor';
  import { DownOutlined } from '@ant-design/icons-vue';
  import { InputSearch } from 'ant-design-vue';
  import FieldTable from '@/views/systemData/dataInterface/components/Field/Field.vue';
  import { buildUUID } from '@/utils/uuid';

  interface State {
    dataForm: any;
    dataSetList: any[];
    parameterJson: any[];
    fieldJson: any[];
    dbOptions: any[];
    treeLoading: boolean;
    btnLoading: boolean;
    keyword: string;
    treeData: any[];
    isEdit: boolean;
  }

  const props = defineProps({
    type: { type: String, default: '' },
  });

  const defaultDataForm = {
    futureId: '',
    id: '',
    fullName: '',
    dbLinkId: '0',
    dataConfigJson: '',
    parameterJson: '',
    fieldJson: '',
    objectType: props.type === 'print' ? 'printVersion' : '',
  };
  const state = reactive<State>({
    dataForm: {
      futureId: '',
      id: '',
      fullName: '',
      dbLinkId: '',
      dataConfigJson: '',
      parameterJson: '',
      fieldJson: '',
      objectType: '',
    },
    dataSetList: [],
    parameterJson: [],
    fieldJson: [],
    dbOptions: [],
    treeLoading: true,
    btnLoading: false,
    keyword: '',
    treeData: [],
    isEdit: false,
  });
  const { dataForm, parameterJson, dbOptions, keyword, treeData, btnLoading } = toRefs(state);
  const { t } = useI18n();
  const { createMessage } = useMessage();
  const emit = defineEmits(['register', 'confirm']);
  const sqlEditorRef = ref(null);
  const leftTreeRef = ref(null);
  const [registerModal, { closeModal, changeLoading }] = useModalInner(init);

  const getSqlTip = computed(() =>
    props.type === 'print' ? '支持SQL语句&存储过程语句，默认打印的时候必须传业务主键@formId给SQL语句里面作为Where查询条件' : '支持SQL语句&存储过程语句',
  );
  const getSysVariableList = computed(() => {
    const list = [
      { value: '@lotSnowID', tips: '批量生成不同雪花ID' },
      { value: '@snowFlakeID', tips: '系统生成雪花ID' },
      { value: '@currentUser', tips: '当前用户' },
      { value: '@currentUsersAndSubordinates', tips: '当前用户及下属' },
      { value: '@organization', tips: '当前组织' },
      { value: '@currentOrganizationAndSuborganization', tips: '当前组织及子组织' },
      { value: '@chargeorganization', tips: '当前分管组织' },
    ];
    if (props.type === 'print') list.unshift({ value: '@formId', tips: '业务主键' });
    return list;
  });
  const getTreeBindValue = computed(() => {
    const key = +new Date();
    const data: any = {
      defaultExpandAll: false,
      treeData: state.treeData,
      loading: state.treeLoading,
      loadData: onLoadData,
      onSelect: handleTreeSelect,
      key,
    };
    return data;
  });

  function init(data) {
    state.btnLoading = false;
    state.keyword = '';
    state.isEdit = !!data.data;
    state.dataSetList = cloneDeep(data.list);
    const dataForm = data.data ? cloneDeep(data.data) : cloneDeep(defaultDataForm);
    state.dataForm = dataForm;
    if (!state.isEdit) state.dataForm.futureId = buildUUID();
    state.parameterJson = dataForm.parameterJson ? JSON.parse(dataForm.parameterJson) : [];
    state.fieldJson = dataForm.fieldJson ? JSON.parse(dataForm.fieldJson) : [];
    changeLoading(true);
    getDataSourceSelector().then(res => {
      let list = res.data.list || [];
      list = list.filter(o => o.children && o.children.length);
      if (list[0]?.children?.length) list[0] = list[0].children[0];
      delete list[0].children;
      state.dbOptions = list;
      changeLoading(false);
      getTableList();
    });
  }
  function onDbLinkChange() {
    getTableList();
  }
  function getTableList() {
    state.treeLoading = true;
    const query = {
      linkId: state.dataForm.dbLinkId,
      keyword: state.keyword,
      pageSize: 1000000,
    };
    getDataModelListAll(query)
      .then(res => {
        state.treeLoading = false;
        state.treeData = res.data.list.map(o => ({
          ...o,
          fullName: o.tableName ? o.table + '(' + o.tableName + ')' : o.table,
          isLeaf: false,
          id: o.table,
          icon: o.type == 1 ? 'icon-ym icon-ym-view' : 'icon-ym icon-ym-generator-tableGrid',
        }));
      })
      .catch(() => {
        state.treeLoading = false;
        state.treeData = [];
      });
  }
  function onLoadData(node) {
    return new Promise((resolve: (value?: unknown) => void) => {
      getDataModelFieldList(state.dataForm.dbLinkId, node.dataRef.table).then(res => {
        const data = res.data.list.map(o => ({
          ...o,
          isLeaf: true,
          fullName: o.fieldName ? o.field + '(' + o.fieldName + ')' : o.field,
          id: node.dataRef.table + '-' + o.field,
        }));
        getTree().updateNodeByKey(node.eventKey, { children: data, isLeaf: !data.length });
        resolve();
      });
    });
  }
  function handleSearchTable() {
    treeData.value = [];
    getTableList();
  }
  function handleSysNodeClick(data) {
    (sqlEditorRef.value as any)?.insert(data);
  }
  function handleItemClick(item) {
    item.field && (sqlEditorRef.value as any)?.insert('{' + item.field + '}');
  }
  function handleTreeSelect(keys) {
    const selectedNode: any = getTree()?.getSelectedNode(keys[0]);
    const content = selectedNode.isLeaf ? selectedNode.field : selectedNode.table;
    (sqlEditorRef.value as any)?.insert(content);
  }
  function getTree() {
    const tree = unref(leftTreeRef);
    if (!tree) {
      throw new Error('tree is null!');
    }
    return tree as any;
  }
  // 更新字段
  function updateFieldList(data) {
    state.btnLoading = true;
    changeLoading(true);
    getFields(data)
      .then(res => {
        data.children = res.data.map(o => ({ ...o, futureId: data.fullName + '.' + o.id }));
        changeLoading(false);
        state.btnLoading = false;
        updateDataSetList(data);
      })
      .catch(() => {
        changeLoading(false);
        state.btnLoading = false;
      });
  }
  // 更新数据集列表
  function updateDataSetList(data) {
    if (!state.isEdit) {
      state.dataSetList.push(data);
    } else {
      for (let i = 0; i < state.dataSetList.length; i++) {
        if (state.dataSetList[i].futureId === data.futureId) {
          state.dataSetList[i] = data;
          break;
        }
      }
    }
    emit('confirm', state.dataSetList);
    closeModal();
  }
  function handleSubmit() {
    if (!state.dataForm.fullName) {
      createMessage.error('请输入数据集名称');
      return;
    }
    const reg = /(^_([A-Za-z0-9]_?)*$)|(^[A-Za-z](_?[A-Za-z0-9])*_?$)/;
    if (!reg.test(state.dataForm.fullName)) {
      createMessage.error('数据集名称只能包含字母、数字、下划线，并且以字母开头');
      return;
    }
    let boo = false;
    for (let i = 0; i < state.dataSetList.length; i++) {
      if (state.dataForm.futureId !== state.dataSetList[i].futureId && state.dataForm.fullName === state.dataSetList[i].fullName) {
        boo = true;
        break;
      }
    }
    if (boo) {
      createMessage.error('数据集名称已存在');
      return;
    }
    if (!state.dataForm.dataConfigJson) {
      createMessage.error('请输入SQL语句');
      return;
    }
    const data = {
      ...state.dataForm,
      parameterJson: state.parameterJson.length ? JSON.stringify(state.parameterJson) : '',
      fieldJson: state.fieldJson.length ? JSON.stringify(state.fieldJson) : '',
    };
    updateFieldList(data);
  }
</script>
<style lang="less">
  .dataSet-modal {
    .dataSet-modal-main {
      height: 100%;
      overflow: hidden;
      display: flex;
      justify-content: space-between;
      overflow: hidden;
      .left-pane {
        flex-shrink: 0;
        width: 350px;
        margin-right: 10px;
        .left-pane-box {
          margin-top: 8px;
          border-radius: 4px;
          height: calc(100% - 40px);
          border: 1px solid @border-color-base;
          background-color: @component-background;
          overflow: hidden;
          .search-box {
            padding: 10px;
          }
          .tree-box {
            height: calc(100% - 52px);
            overflow: auto;
            overflow-x: hidden;
          }
        }
      }
      .middle-pane {
        background-color: @component-background;
        border: 1px solid @border-color-base;
        border-radius: 4px;
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        .title {
          border-top: 1px solid @border-color-base;
        }
        .title-box {
          height: 36px;
          line-height: 36px;
          display: flex;
          justify-content: space-between;
          color: @text-color-label;
          font-size: 14px;
          padding: 0 10px;
          flex-shrink: 0;
          border-bottom: 1px solid @border-color-base;
        }
        .tabs-box {
          overflow: unset;
          :deep(.ant-tabs-tab:first-child) {
            margin-left: 20px;
          }
        }
        .table-actions {
          flex-shrink: 0;
          border-top: 1px dashed @border-color-base;
          text-align: center;
        }
        .top-box {
          display: flex;
          .main-box {
            flex: 1;
            margin-right: 18px;
          }
        }
      }
      .right-pane {
        width: 350px;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        height: calc(100% + 9px);
        overflow: hidden;
        margin-left: 10px;
        .right-pane-btn {
          flex-shrink: 0;
        }
        .field-table-box {
          background-color: @component-background;
        }
      }
    }
  }
</style>
