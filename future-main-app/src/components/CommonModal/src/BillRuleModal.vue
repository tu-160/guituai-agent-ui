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
            <BasicTable @register="registerTable" :searchInfo="searchInfo" class="future-sub-table"></BasicTable>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { getBillRuleSelector } from '@/api/system/billRule';
  import { Form, Modal as AModal } from 'ant-design-vue';
  import { reactive, ref, unref, watch, computed, nextTick } from 'vue';
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
    popupTitle: { type: String, default: '模板' },
    disabled: { type: Boolean, default: false },
    allowClear: { type: Boolean, default: true },
    size: { type: String, default: 'default' },
  });
  const emit = defineEmits(['update:value', 'change']);
  const formItemContext = Form.useInjectFormItemContext();
  const { t } = useI18n();
  const baseStore = useBaseStore();
  const innerValue = ref(undefined);
  const visible = ref(false);
  const options = ref<any[]>([]);

  const columns: BasicColumn[] = [
    { title: '业务名称', dataIndex: 'fullName' },
    { title: '业务编码', dataIndex: 'enCode' },
  ];
  const searchInfo = reactive({
    categoryId: '',
  });
  const leftTreeRef = ref<Nullable<TreeActionType>>(null);
  const treeLoading = ref(false);
  const treeData = ref<any[]>([]);
  const [registerTable, { getForm, getSelectRows, setSelectedRowKeys, getSelectRowKeys }] = useTable({
    api: getBillRuleSelector,
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
      ],
    },
    rowKey: 'enCode',
    tableSetting: { size: false, setting: false },
    isCanResizeParent: true,
    resizeHeightOffset: -74,
    rowSelection: { type: 'radio' },
  });

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
    const res = (await baseStore.getDictionaryData('businessType')) as any[];
    treeData.value = [{ id: '0', fullName: '业务分类', children: res }];
    searchInfo.categoryId = '';
    nextTick(() => {
      const leftTree = unref(leftTreeRef);
      leftTree?.setSelectedKeys(['0']);
      treeLoading.value = false;
      getForm().resetFields();
      setSelectedRowKeys(innerValue.value ? [innerValue.value] : []);
    });
  }
  function handleTreeSelect(id) {
    if (!id || searchInfo.categoryId === id) return;
    searchInfo.categoryId = id === '0' ? '' : id;
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
    innerValue.value = selectRow.enCode;
    emit('update:value', selectRow.enCode);
    emit('change', selectRow.enCode, selectRow);
    formItemContext.onFieldChange();
    handleCancel();
  }
</script>
