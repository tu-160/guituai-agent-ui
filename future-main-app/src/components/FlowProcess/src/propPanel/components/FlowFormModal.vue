<template>
  <div class="common-container">
    <a-select v-model:value="innerValue" v-bind="getSelectBindValue" :options="options" @change="onChange" @click="openSelectModal" />
    <a-modal
      v-model:open="visible"
      title="表单选择"
      :width="800"
      class="common-container-modal"
      @ok="handleSubmit"
      @cancel="handleCancel"
      :maskClosable="false">
      <template #closeIcon>
        <ModalClose :canFullscreen="false" @cancel="handleCancel" />
      </template>
      <div class="future-content-wrapper">
        <div class="future-content-wrapper-center">
          <div class="future-content-wrapper-content">
            <BasicTable @register="registerTable" :searchInfo="getSearchInfo" class="future-sub-table" />
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { getVisualDevFormList } from '@/api/onlineDev/visualDev';
  import { Form, Modal as AModal } from 'ant-design-vue';
  import { ref, watch, computed, nextTick } from 'vue';
  import ModalClose from '@/components/Modal/src/components/ModalClose.vue';
  import { BasicTable, useTable, BasicColumn } from '@/components/Table';
  import { useI18n } from '@/hooks/web/useI18n';
  import { pick } from 'lodash-es';

  defineOptions({ inheritAttrs: false });
  const props = defineProps({
    value: { default: '' },
    title: { type: String, default: '' },
    placeholder: { type: String, default: '请选择' },
    disabled: { type: Boolean, default: false },
    allowClear: { type: Boolean, default: true },
    size: { type: String, default: 'default' },
    isStartForm: { type: Number, default: 0 },
  });
  const emit = defineEmits(['update:value', 'change']);
  const formItemContext = Form.useInjectFormItemContext();
  const { t } = useI18n();
  const innerValue = ref(undefined);
  const visible = ref(false);
  const options = ref<any[]>([]);
  const columns = computed(() => {
    let list: BasicColumn[] = [
      { title: '表单名称', dataIndex: 'fullName' },
      { title: '表单编码', dataIndex: 'enCode' },
      {
        title: '表单类型',
        dataIndex: 'type',
        width: 100,
        customRender: ({ record }) => (record.type == 1 ? '在线开发' : '系统导入'),
      },
    ];
    return list;
  });
  const [registerTable, { getForm, getSelectRows, setSelectedRowKeys, getSelectRowKeys }] = useTable({
    api: getVisualDevFormList,
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
    tableSetting: { size: false, setting: false },
    isCanResizeParent: true,
    resizeHeightOffset: -74,
    rowSelection: {
      type: 'radio',
      getCheckboxProps: record => {
        return {
          disabled: !!record.isQuote,
        };
      },
    },
  });

  const getSearchInfo = computed(() => ({
    isRelease: '1,2',
    webType: 2,
    flowStart: !!props.isStartForm,
  }));
  const getSelectBindValue = computed(() => {
    return {
      ...pick(props, ['disabled', 'size', 'allowClear', 'placeholder']),
      fieldNames: { label: 'fullName', value: 'id' },
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
    nextTick(() => {
      getForm().resetFields();
      setSelectedRowKeys(innerValue.value ? [innerValue.value] : []);
    });
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
