<template>
  <div class="common-container">
    <a-select v-model:value="innerValue" v-bind="getSelectBindValue" :options="options" @change="onChange" @click="openSelectModal" />
    <a-modal
      v-model:open="visible"
      :title="popupTitle"
      :width="1000"
      class="common-container-modal"
      @ok="handleSubmit"
      @cancel="handleCancel"
      :maskClosable="false">
      <template #closeIcon>
        <ModalClose :canFullscreen="false" @cancel="handleCancel" />
      </template>
      <div class="future-content-wrapper">
        <div class="future-content-wrapper-left">
          <BasicLeftTree ref="leftTreeRef" :showSearch="false" :treeData="treeData" :loading="treeLoading" @select="handleTreeSelect" />
        </div>
        <div class="future-content-wrapper-center">
          <div class="future-content-wrapper-content">
            <BasicTable @register="registerTable" :searchInfo="searchInfo" class="future-sub-table">
              <template #expandedRowRender="{ record }">
                <BasicTable @register="registerSubTable" :data-source="record.templateJson">
                  <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'field'">
                      <span class="required-sign">{{ record.required ? '*' : '' }}</span>
                      {{ record.field }}{{ record.fieldName ? '(' + record.fieldName + ')' : '' }}
                    </template>
                    <template v-if="column.key === 'dataType'">
                      {{ getTypeText(record.dataType) }}
                    </template>
                  </template>
                </BasicTable>
              </template>
            </BasicTable>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { getDataInterfaceSelectorList } from '@/api/systemData/dataInterface';
  import { Form, Modal as AModal } from 'ant-design-vue';
  import { reactive, ref, unref, watch, computed } from 'vue';
  import ModalClose from '@/components/Modal/src/components/ModalClose.vue';
  import { BasicLeftTree, TreeActionType } from '@/components/Tree';
  import { BasicTable, useTable, BasicColumn } from '@/components/Table';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useBaseStore } from '@/store/modules/base';
  import { pick } from 'lodash-es';

  defineOptions({ inheritAttrs: false });
  const props = defineProps({
    value: { default: '' },
    title: { type: String, default: '' },
    popupTitle: { type: String, default: '接口模板' },
    dataType: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    allowClear: { type: Boolean, default: true },
    size: { type: String, default: 'default' },
    /**
     * sourceType
     * 1 - 过滤掉：鉴权、真分页、SQL的增加、修改、删除类型
     * 2 - 过滤掉：鉴权、SQL的增加、修改、删除类型
     * 3 - 过滤掉：鉴权、真分页、SQL的查询类型
     */
    sourceType: { type: Number, default: 1 },
  });
  const emit = defineEmits(['update:value', 'change']);
  const formItemContext = Form.useInjectFormItemContext();
  const { t } = useI18n();
  const baseStore = useBaseStore();
  const innerValue = ref(undefined);
  const visible = ref(false);
  const options = ref<any[]>([]);

  const columns: BasicColumn[] = [
    { title: '名称', dataIndex: 'fullName' },
    { title: '编码', dataIndex: 'enCode' },
    { title: '类型', dataIndex: 'type', width: 100 },
  ];
  const searchInfo = reactive({
    category: '',
    sourceType: props.sourceType,
  });
  const leftTreeRef = ref<Nullable<TreeActionType>>(null);
  const treeLoading = ref(false);
  const treeData = ref<any[]>([]);
  const [registerTable, { getForm, getSelectRows, setSelectedRowKeys, getSelectRowKeys }] = useTable({
    api: getDataInterfaceSelectorList,
    columns,
    immediate: false,
    useSearchForm: true,
    formConfig: {
      baseColProps: { span: 8 },
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
          field: 'type',
          label: '类型',
          component: 'Select',
          componentProps: {
            options: [
              { id: '2', fullName: '静态数据' },
              { id: '1', fullName: 'SQL操作' },
              { id: '3', fullName: 'API操作' },
            ],
          },
        },
      ],
    },
    tableSetting: { size: false, setting: false },
    isCanResizeParent: true,
    resizeHeightOffset: -74,
    rowSelection: { type: 'radio' },
    afterFetch: data => {
      const list = data.map(o => {
        let templateJson = o.parameterJson ? JSON.parse(o.parameterJson) : [];
        if (!templateJson) templateJson = [];
        return {
          ...o,
          templateJson,
        };
      });
      return list;
    },
  });
  const [registerSubTable] = useTable({
    columns: [
      { title: '参数名称', dataIndex: 'field', key: 'field' },
      { title: '参数类型', dataIndex: 'dataType', key: 'dataType' },
      { title: '默认值', dataIndex: 'defaultValue', key: 'defaultValue', ellipsis: false },
    ],
    pagination: false,
    showTableSetting: false,
    canResize: false,
    scroll: { x: undefined },
  });

  const typeOptions: any[] = [
    { fullName: '字符串', id: 'varchar' },
    { fullName: '整型', id: 'int' },
    { fullName: '日期时间', id: 'datetime' },
    { fullName: '浮点', id: 'decimal' },
    { fullName: '长整型', id: 'bigint' },
    { fullName: '文本', id: 'text' },
  ];

  const getSelectBindValue = computed(() => {
    return {
      ...pick(props, ['disabled', 'size', 'allowClear']),
      fieldNames: { label: 'fullName', value: 'id' },
      placeholder: '请选择',
      open: false,
      showSearch: false,
      showArrow: true,
    };
  });

  watch(
    () => props.value,
    val => {
      setValue(val);
    },
    { immediate: true },
  );
  watch(
    () => props.title,
    () => {
      setValue(props.value);
    },
  );

  function getTypeText(type) {
    let item = typeOptions.filter(o => o.id == type)[0];
    return item && item.fullName ? item.fullName : '';
  }
  function setValue(value) {
    innerValue.value = value || undefined;
    options.value = [{ id: innerValue.value, fullName: props.title }];
  }
  function onChange() {
    options.value = [];
    emit('change', '', {});
  }
  async function openSelectModal() {
    if (props.disabled) return;
    visible.value = true;
    treeLoading.value = true;
    treeData.value = (await baseStore.getDictionaryData('DataInterfaceType')) as any[];
    if (!treeData.value.length) return (treeLoading.value = false);
    searchInfo.category = treeData.value[0].id;
    const leftTree = unref(leftTreeRef);
    leftTree?.setSelectedKeys([searchInfo.category]);
    treeLoading.value = false;
    getForm().resetFields();
    setSelectedRowKeys(innerValue.value ? [innerValue.value] : []);
  }
  function handleTreeSelect(id) {
    if (!id || searchInfo.category === id) return;
    searchInfo.category = id;
    searchInfo.sourceType = props.sourceType;
    getForm().resetFields();
  }
  function handleCancel() {
    visible.value = false;
  }
  function handleSubmit() {
    if (!getSelectRowKeys().length && !getSelectRows().length) return;
    if (!getSelectRows().length) {
      emit('update:value', innerValue.value);
      emit('change', innerValue.value, options.value[0]);
      formItemContext.onFieldChange();
      handleCancel();
      return;
    }
    const selectRow = getSelectRows()[0];
    options.value = getSelectRows();
    innerValue.value = selectRow.id;
    emit('update:value', selectRow.id);
    emit('change', selectRow.id, selectRow);
    formItemContext.onFieldChange();
    handleCancel();
  }
</script>
