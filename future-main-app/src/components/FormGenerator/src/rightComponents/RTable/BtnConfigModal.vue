<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="操作按钮" :width="600" @ok="handleSubmit" class="add-config-modal" destroyOnClose>
    <a-form
      :colon="false"
      labelAlign="right"
      ref="formElRef"
      :model="dataForm"
      :rules="!['copy', 'remove'].includes(dataForm.value) ? formRules : {}"
      :labelCol="{ style: { width: '80px' } }">
      <a-form-item label="按钮名称" name="label">
        <future-i18n-input
          v-model:value="dataForm.label"
          v-model:i18n="dataForm.labelI18nCode"
          placeholder="请输入"
          :disabled="['copy', 'remove'].includes(dataForm.value)"
          :maxlength="10" />
      </a-form-item>
      <a-form-item label="是否显示">
        <a-switch v-model:checked="dataForm.show" />
      </a-form-item>
      <template v-if="!['copy', 'remove'].includes(dataForm.value)">
        <a-form-item label="按钮类型">
          <a-select v-model:value="dataForm.btnType" placeholder="请选择">
            <a-select-option value="">默认按钮</a-select-option>
            <a-select-option value="primary">主要按钮</a-select-option>
            <a-select-option value="success">成功按钮</a-select-option>
            <a-select-option value="info">信息按钮</a-select-option>
            <a-select-option value="warning">警告按钮</a-select-option>
            <a-select-option value="danger">危险按钮</a-select-option>
            <a-select-option value="text">文字按钮</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="按钮图标">
          <future-icon-picker v-model:value="dataForm.btnIcon" placeholder="请选择" />
        </a-form-item>
      </template>
      <a-form-item label="删除确认" v-if="['remove', 'batchRemove'].includes(dataForm.value)">
        <a-switch v-model:checked="dataForm.showConfirm" />
      </a-form-item>
      <template v-if="!['copy', 'remove', 'add', 'batchRemove'].includes(dataForm.value)">
        <future-group-title content="动作设置" :bordered="false" />
        <a-form-item label="弹窗标题">
          <a-input v-model:value="actionConfig.popupTitle" placeholder="请输入" />
        </a-form-item>
        <a-form-item label="弹窗类型">
          <future-radio v-model:value="actionConfig.popupType" :options="popupTypeOptions" optionType="button" button-style="solid" class="right-radio" />
        </a-form-item>
        <a-form-item label="弹窗宽度">
          <a-select v-model:value="actionConfig.popupWidth">
            <a-select-option v-for="item in popupWidthOptions" :key="item" :value="item">{{ item }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="数据来源">
          <future-radio
            v-model:value="actionConfig.dataSource"
            :options="dataSourceOptions"
            optionType="button"
            button-style="solid"
            class="right-radio"
            @change="onDataSourceChange" />
        </a-form-item>
        <template v-if="actionConfig.dataSource == 'dynamic'">
          <a-form-item label="远端数据">
            <interface-modal :value="actionConfig.interfaceId" :title="actionConfig.interfaceName" :sourceType="2" @change="onInterfaceChange" />
          </a-form-item>
          <a-form-item label="参数设置" style="margin-bottom: 0"></a-form-item>
          <a-table :data-source="actionConfig.templateJson" :columns="templateJsonColumns" size="small" :pagination="false">
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'field'">
                <span class="required-sign">{{ record.required ? '*' : '' }}</span>
                {{ record.field }}{{ record.fieldName ? '(' + record.fieldName + ')' : '' }}
              </template>
              <template v-if="column.key === 'sourceType'">
                <future-select
                  v-model:value="record.sourceType"
                  :options="getSourceTypeOptions(record.required)"
                  class="!w-100px"
                  @change="record.relationField = ''" />
              </template>
              <template v-if="column.key === 'relationField'">
                <future-select
                  v-model:value="record.relationField"
                  placeholder="请选择"
                  :options="formFieldsOptions"
                  allowClear
                  showSearch
                  :fieldNames="{ options: 'options1' }"
                  class="!w-204px"
                  @change="onRelationFieldChange($event, record)"
                  v-if="record.sourceType === 1" />
                <template v-else-if="record.sourceType == 2">
                  <future-input-number v-if="['int', 'decimal'].includes(record.dataType)" v-model:value="record.relationField" placeholder="请输入" clearable />
                  <future-date-picker
                    v-else-if="record.dataType == 'datetime'"
                    class="!w-full"
                    v-model:value="record.relationField"
                    placeholder="请选择"
                    format="YYYY-MM-DD HH:mm:ss"
                    clearable />
                  <a-input v-else v-model:value="record.relationField" placeholder="请输入" clearable />
                </template>
              </template>
            </template>
            <template #emptyText>
              <p class="leading-60px">暂无数据</p>
            </template>
          </a-table>
        </template>
        <a-form-item label="表单数据" v-else>
          <FutureTreeSelect v-model:value="actionConfig.modelId" :options="treeData" placeholder="请选择" lastLevel allowClear @change="onModeIdChange" />
        </a-form-item>
        <a-form-item label="设置列表字段" style="margin-bottom: 0" :labelCol="{ style: { width: '100px' } }"></a-form-item>
        <a-table :data-source="actionConfig.columnOptions" :columns="getColumnOptionsColumns" size="small" :pagination="false">
          <template #headerCell="{ column }">
            <template v-if="column.key === 'width'">{{ column.title }}<BasicHelp text="移动端不支持宽度设置" /></template>
          </template>
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.key === 'label'">
              <a-input v-model:value="record.label" placeholder="请输入" />
            </template>
            <template v-if="column.key === 'value'">
              <a-auto-complete
                v-if="actionConfig.dataSource == 'dynamic'"
                v-model:value="record.value"
                placeholder="请输入"
                :options="options"
                @focus="onFocus(record.value)"
                @search="debounceOnSearch(record.value)" />
              <future-select v-else v-model:value="record.value" placeholder="请选择" :options="fieldOptions" showSearch @change="onChange($event, record)" />
            </template>
            <template v-if="column.key === 'width'">
              <a-input-number v-model:value="record.width" placeholder="请输入" :min="0" :precision="0" />
            </template>
            <template v-if="column.key === 'ifShow'">
              <a-checkbox v-model:checked="record.ifShow" />
            </template>
            <template v-if="column.key === 'action'">
              <a-button class="action-btn" type="link" color="error" @click="handleDelItem(index, 'columnOptions')" size="small">删除</a-button>
            </template>
          </template>
          <template #emptyText>
            <p class="leading-60px">暂无数据</p>
          </template>
        </a-table>
        <div class="table-add-action" @click="handleAddColumnOption()">
          <a-button type="link" preIcon="icon-ym icon-ym-btn-add">新增</a-button>
        </div>
        <a-form-item label="设置关联字段" style="margin-bottom: 0" :labelCol="{ style: { width: '100px' } }"></a-form-item>
        <a-table :data-source="actionConfig.relationOptions" :columns="relationOptionsColumns" size="small" :pagination="false">
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.key === 'field'">
              <future-select v-model:value="record.field" placeholder="请选择" :options="childList" showSearch class="!w-134px" />
            </template>
            <template v-if="column.key === 'type'">
              <future-select v-model:value="record.type" placeholder="请选择" :options="typeOptions" @change="onTypeChange(record)" />
            </template>
            <template v-if="column.key === 'value'">
              <template v-if="record.type == 1">
                <a-auto-complete
                  v-if="actionConfig.dataSource == 'dynamic'"
                  v-model:value="record.value"
                  placeholder="请输入"
                  :options="options"
                  @focus="onFocus(record.value)"
                  @search="debounceOnSearch(record.value)" />
                <future-select v-else v-model:value="record.value" placeholder="请选择" :options="fieldOptions" showSearch />
              </template>
              <a-input v-model:value="record.value" placeholder="请输入" allowClear v-else />
            </template>
            <template v-if="column.key === 'action'">
              <a-button class="action-btn" type="link" color="error" @click="handleDelItem(index, 'relationOptions')" size="small">删除</a-button>
            </template>
          </template>
          <template #emptyText>
            <p class="leading-60px">暂无数据</p>
          </template>
        </a-table>
        <div class="pb-20px">
          <div class="table-add-action" @click="handleAddRelationOption()">
            <a-button type="link" preIcon="icon-ym icon-ym-btn-add">新增</a-button>
          </div>
        </div>
      </template>
    </a-form>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, unref, computed, reactive, toRefs, inject } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { InterfaceModal } from '@/components/CommonModal';
  import { useDebounceFn } from '@vueuse/core';
  import { getDataInterfaceInfo } from '@/api/systemData/dataInterface';
  import { cloneDeep } from 'lodash-es';
  import { getVisualDevSelector } from '@/api/onlineDev/visualDev';
  import { getFormDataFields } from '@/api/onlineDev/visualDev';
  import type { FormInstance } from 'ant-design-vue';
  import { noAllowSelectList } from '@/components/FormGenerator/src/helper/config';
  import { sourceTypeOptions, templateJsonColumns } from '@/components/FlowProcess/src/helper/define';
  import { useMessage } from '@/hooks/web/useMessage';

  interface State {
    options: any[];
    allOptions: any[];
    dataForm: any;
    actionConfig: any;
    treeData: any[];
    fieldOptions: any[];
  }

  const state = reactive<State>({
    options: [],
    allOptions: [],
    dataForm: {},
    actionConfig: {},
    treeData: [],
    fieldOptions: [],
  });
  const { options, dataForm, treeData, actionConfig, fieldOptions } = toRefs(state);
  const popupTypeOptions = [
    { id: 'dialog', fullName: '居中弹窗' },
    { id: 'drawer', fullName: '右侧弹窗' },
  ];
  const dataSourceOptions = [
    { id: 'dynamic', fullName: '远端数据' },
    { id: 'relationForm', fullName: '表单数据' },
  ];
  const typeOptions = [
    { id: 1, fullName: '字段' },
    { id: 2, fullName: '自定义' },
  ];
  const formRules = {
    label: [{ required: true, message: '必填', trigger: 'blur' }],
  };
  const relationOptionsColumns = [
    { width: 50, title: '序号', align: 'center', customRender: ({ index }) => index + 1 },
    { title: '目标表单字段', dataIndex: 'field', key: 'field', width: 150 },
    { title: '映射来源', dataIndex: 'type', key: 'type', width: 120 },
    { title: '数据来源字段/值', dataIndex: 'value', key: 'value', width: 130 },
    { title: '操作', dataIndex: 'action', key: 'action', width: 50 },
  ];

  const { createMessage } = useMessage();
  const getDrawingList: (() => any[]) | undefined = inject('getDrawingList');
  const drawingList = computed(() => (getDrawingList as () => any[])());
  const emit = defineEmits(['register', 'confirm']);
  const [registerModal, { closeModal }] = useModalInner(init);
  const childList = ref<any[]>([]);
  const formElRef = ref<FormInstance>();
  const popupWidthOptions = ['600px', '800px', '1000px', '40%', '50%', '60%', '70%', '80%'];
  const debounceOnSearch = useDebounceFn(onSearch, 300);

  const formFieldsOptions = computed(() => {
    const noAllowList = ['table', 'uploadImg', 'uploadFile', 'modifyUser', 'modifyTime'];
    let list: any[] = [];
    const loop = (data, parent?) => {
      if (!data) return;
      if (data.__config__ && data.__config__.futureKey !== 'table' && data.__config__.children && Array.isArray(data.__config__.children)) {
        loop(data.__config__.children, data);
      }
      if (Array.isArray(data)) data.forEach(d => loop(d, parent));
      if (data.__vModel__ && !noAllowList.includes(data.__config__.futureKey))
        list.push({
          id: data.__vModel__,
          fullName: data.__config__.label ? data.__vModel__ + '(' + data.__config__.label + ')' : data.__vModel__,
          ...data,
          disabled: false,
        });
    };
    loop(unref(drawingList));
    return list;
  });
  const getColumnOptionsColumns = computed(() => {
    const list = [
      { width: 50, title: '序号', align: 'center', customRender: ({ index }) => index + 1 },
      { title: '列名', dataIndex: 'label', key: 'label', width: 150 },
      { title: '字段', dataIndex: 'value', key: 'value' },
      { title: '宽度', dataIndex: 'width', key: 'width', width: 100 },
      { title: '显示', dataIndex: 'ifShow', key: 'ifShow', width: 50, align: 'center' },
      { title: '操作', dataIndex: 'action', key: 'action', width: 50 },
    ];
    return state.actionConfig.dataSource == 'dynamic' ? list : list.filter(o => o.key !== 'label');
  });

  function init(data) {
    state.dataForm = cloneDeep(data.config);
    state.actionConfig = state.dataForm.actionConfig || {};
    childList.value = cloneDeep(data.children)
      .filter(o => o.__vModel__ && !noAllowSelectList.includes(o.__config__.futureKey))
      .map(o => ({
        id: o.__vModel__,
        fullName: o.__config__.label,
      }));
    if (!['copy', 'remove', 'add', 'batchRemove'].includes(state.dataForm.value)) {
      initFieldData();
      getFeatureList();
      getFieldOptions();
    }
  }
  function handleDelItem(index, key) {
    state.actionConfig[key].splice(index, 1);
  }
  function handleAddColumnOption() {
    (state.actionConfig.columnOptions as any).push({
      value: '',
      label: '',
      width: null,
      ifShow: true,
    });
  }
  function handleAddRelationOption() {
    (state.actionConfig.relationOptions as any).push({
      value: '',
      field: '',
      type: 1,
    });
  }
  function onTypeChange(record) {
    record.value = '';
  }
  function onInterfaceChange(id, row) {
    clearField();
    if (!id) {
      state.actionConfig.interfaceId = '';
      state.actionConfig.interfaceName = '';
      state.actionConfig.templateJson = [];
      initFieldData();
      return;
    }
    if (state.actionConfig.interfaceId === id) return;
    state.actionConfig.interfaceId = id;
    state.actionConfig.interfaceName = row.fullName;
    state.actionConfig.templateJson = row.templateJson ? row.templateJson.map(o => ({ ...o, relationField: '', sourceType: 1 })) : [];
    initFieldData();
  }
  function onRelationFieldChange(val, row) {
    if (!val) return (row.futureKey = '');
    let list = unref(formFieldsOptions).filter(o => o.__vModel__ === val);
    if (!list.length) return (row.futureKey = '');
    let item = list[0];
    row.futureKey = item.__config__.futureKey;
  }
  async function handleSubmit() {
    try {
      const values = await formElRef.value?.validate();
      if (!values) return;
      if (!exist()) return;
      emit('confirm', state.dataForm);
      closeModal();
    } catch (_) {}
  }
  function exist() {
    let isOk = true;
    for (let i = 0; i < state.actionConfig.columnOptions?.length; i++) {
      const e = state.actionConfig.columnOptions[i];
      if (!e.value) {
        createMessage.error('列表字段中字段不能为空');
        isOk = false;
        break;
      }
    }
    return isOk;
  }
  function initFieldData() {
    if (!state.actionConfig.interfaceId) return (state.allOptions = []);
    getDataInterfaceInfo(state.actionConfig.interfaceId).then(res => {
      const data = res.data;
      let list = data.fieldJson ? JSON.parse(data.fieldJson) : [];
      state.allOptions = list.map(o => ({ ...o, value: o.defaultValue }));
    });
  }
  function onSearch(searchText: string) {
    state.options = state.allOptions.filter(o => o.value.toLowerCase().indexOf(searchText.toLowerCase()) !== -1);
  }
  function onFocus(searchText) {
    onSearch(searchText);
  }
  function onDataSourceChange() {
    state.actionConfig.interfaceId = '';
    state.actionConfig.modelId = '';
    state.actionConfig.templateJson = [];
    clearField();
    state.actionConfig.dataSource == 'dynamic' ? initFieldData() : getFeatureList();
  }
  function getFeatureList() {
    getVisualDevSelector({ type: 1, webType: '2', isRelease: 1 }).then(res => {
      state.treeData = res.data.list;
    });
  }
  function onModeIdChange() {
    clearField();
    getFieldOptions();
  }
  function getFieldOptions() {
    state.fieldOptions = [];
    if (!state.actionConfig.modelId) return;
    getFormDataFields(state.actionConfig.modelId, 1).then(res => {
      state.fieldOptions = res.data.list.map(o => ({
        ...o,
        id: o.vmodel,
        fullName: o.label,
      }));
    });
  }
  function clearField() {
    state.actionConfig.columnOptions = [];
    let relationOptions = state.actionConfig?.relationOptions || [];
    if (relationOptions?.length) state.actionConfig.relationOptions = relationOptions.map(o => ({ ...o, value: '' }));
  }
  function onChange(val, item) {
    const list = state.fieldOptions.filter(o => o.vmodel === val) || [];
    if (list.length) item.label = list[0].label;
  }
  function getSourceTypeOptions(isRequired) {
    return isRequired ? sourceTypeOptions.filter(o => o.id != 3 && o.id != 4) : sourceTypeOptions.filter(o => o.id != 4);
  }
</script>
