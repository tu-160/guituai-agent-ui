<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="模板设置" :width="600" @ok="handleSubmit" destroyOnClose class="export-modal">
    <a-form :colon="false" labelAlign="left" :labelCol="{ style: { width: '90px' } }">
      <a-form-item label="导入模式">
        <a-radio-group v-model:value="dataType">
          <a-radio value="1">仅新增数据<BasicHelp text="导入数据只能进行新增，同一条数据无法重复导入" /></a-radio>
          <a-radio value="2">更新和新增数据<BasicHelp text="允许新增数据的同时支持导入数据更新" /></a-radio>
        </a-radio-group>
      </a-form-item>
      <div class="export-line">
        <p class="export-label">表单数据<span>请选择要导入的字段</span></p>
      </div>
      <a-checkbox :indeterminate="isIndeterminate" v-model:checked="checkAll" @change="handleCheckAllChange">全选</a-checkbox>
      <a-checkbox-group v-model:value="checkedList" class="options-list" @change="handleCheckedChange">
        <a-checkbox v-for="item in columnList" :key="item.id" :value="item.id" :disabled="item.disabled" class="options-item">
          {{ item.fullName }}
        </a-checkbox>
      </a-checkbox-group>
    </a-form>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { systemComponentsList, noUploadList } from '../helper/config';
  import { useMessage } from '@/hooks/web/useMessage';

  const emit = defineEmits(['register', 'confirm']);
  const [registerModal, { closeModal }] = useModalInner(init);
  const { createMessage } = useMessage();
  const dataType = ref('1');
  const isIndeterminate = ref(false);
  const checkAll = ref(false);
  const columnList = ref<any[]>([]);
  const checkedList = ref<string[]>([]);
  const defaultCheckedList = ref<string[]>([]);

  function init(data) {
    dataType.value = data.dataType || '1';
    columnList.value = [];
    checkedList.value = [];
    isIndeterminate.value = false;
    checkAll.value = false;
    defaultCheckedList.value = [];
    for (let i = 0; i < data.fieldsOptions.length; i++) {
      const e = data.fieldsOptions[i];
      const required = e.__config__.required;
      const futureKey = e.__config__.futureKey;
      if (![...noUploadList, ...systemComponentsList].includes(futureKey)) {
        columnList.value.push({ id: e.id, fullName: e.fullName, disabled: required });
        if (required) {
          checkedList.value.push(e.id);
          defaultCheckedList.value.push(e.id);
        }
      }
    }
    if (data.selectKey?.length) {
      checkedList.value = [...checkedList.value, ...data.selectKey];
      checkedList.value = Array.from(new Set(checkedList.value));
    }
    if (!checkedList.value.length) return;
    handleCheckedChange(checkedList.value);
  }
  function handleCheckAllChange(e) {
    const val = e.target.checked;
    checkedList.value = val ? columnList.value.map(o => o.id) : defaultCheckedList.value;
    isIndeterminate.value = val ? false : !!defaultCheckedList.value.length;
  }
  function handleCheckedChange(val) {
    const checkedCount = val.length;
    checkAll.value = checkedCount === columnList.value.length;
    isIndeterminate.value = !!checkedCount && checkedCount < columnList.value.length;
  }
  function handleSubmit() {
    if (!checkedList.value.length) return createMessage.warning('请至少选择一个导入字段');
    emit('confirm', { dataType: dataType.value, selectKey: checkedList.value });
    closeModal();
  }
</script>
