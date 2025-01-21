<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="填充规则配置" :width="600" class="future-transfer-modal" @ok="handleSubmit" destroyOnClose>
    <div class="condition-main">
      <a-row :gutter="8">
        <a-col :span="9">{{ getTitle }}</a-col>
        <a-col :span="4"></a-col>
        <a-col :span="9">当前表单字段</a-col>
      </a-row>
      <a-row :gutter="8" v-for="(item, index) in transferList" :key="index" class="mt-10px">
        <a-col :span="9">
          <future-select
            v-if="state.type == 'relationForm'"
            v-model:value="item.targetField"
            :options="fieldOptions"
            placeholder="请选择"
            showSearch
            allowClear
            :disabled="item.required"
            :fieldNames="{ options: 'options1' }" />
          <a-auto-complete
            v-else
            v-model:value="item.targetField"
            placeholder="请输入"
            :options="fieldOptions"
            @focus="onFocus(item.targetField)"
            @search="debounceOnSearch(item.targetField)" />
        </a-col>
        <a-col :span="4" class="leading-32px">的值填充到</a-col>
        <a-col :span="9">
          <future-select
            v-model:value="item.sourceValue"
            :options="getTargetOptions(index)"
            placeholder="请选择"
            showSearch
            allowClear
            :fieldNames="{ options: 'options1' }" />
        </a-col>
        <a-col :span="1" class="text-center" v-if="!item.required">
          <i class="icon-ym icon-ym-btn-clearn" @click="delTransferItem(index)" />
        </a-col>
      </a-row>
      <span class="link-text my-10px inline-block" @click="addTransferItem()"><i class="icon-ym icon-ym-btn-add text-14px mr-4px"></i>添加字段</span>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { reactive, toRefs, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { cloneDeep } from 'lodash-es';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useDebounceFn } from '@vueuse/core';

  interface State {
    transferList: any[];
    fieldOptions: any[];
    formFieldsOptions: any[];
    type: string;
    allOptions: any[];
  }

  const state = reactive<State>({
    transferList: [],
    fieldOptions: [],
    formFieldsOptions: [],
    type: 'relationForm',
    allOptions: [],
  });
  const { transferList, fieldOptions } = toRefs(state);
  const emit = defineEmits(['register', 'change']);
  const { createMessage } = useMessage();
  const [registerModal, { closeModal }] = useModalInner(init);
  const debounceOnSearch = useDebounceFn(onSearch, 300);

  const getTitle = computed(() => (state.type == 'relationForm' ? '关联表单字段' : '远端数据字段'));

  function init(data) {
    state.transferList = cloneDeep(data.transferList || []);
    state.fieldOptions = cloneDeep(data.fieldOptions || []);
    state.formFieldsOptions = cloneDeep(data.formFieldsOptions || []).filter(o => ['input', 'textarea'].includes(o.__config__.futureKey));
    state.type = data.type || 'relationForm';
    if (!state.transferList.length) addTransferItem();
    if (state.type == 'popupSelect') state.allOptions = cloneDeep(data.fieldOptions || []);
  }
  function addTransferItem() {
    state.transferList.push({ targetField: '', sourceValue: '' });
  }
  function delTransferItem(index) {
    state.transferList.splice(index, 1);
  }
  function handleSubmit() {
    if (!formFieldListExist()) return;
    emit('change', state.transferList);
    closeModal();
  }
  function formFieldListExist() {
    const list = state.transferList;
    let isOk = true;
    for (let i = 0; i < list.length; i++) {
      const e = list[i];
      if (!e.targetField) {
        createMessage.warning(`第${i + 1}行${unref(getTitle)}不能为空`);
        isOk = false;
        break;
      }
      if (!e.sourceValue) {
        createMessage.warning(`第${i + 1}行当前表单字段不能为空`);
        isOk = false;
        break;
      }
    }
    return isOk;
  }
  function onSearch(searchText: string) {
    state.fieldOptions = state.allOptions.filter(o => o.value.toLowerCase().indexOf(searchText.toLowerCase()) !== -1);
  }
  function onFocus(searchText: string) {
    onSearch(searchText);
  }
  function getTargetOptions(index: number) {
    let ignoreOptions: any[] = [];
    for (let i = 0; i < state.transferList.length; i++) {
      const e = state.transferList[i];
      if (e.sourceValue && index !== i) ignoreOptions.push(e.sourceValue);
    }
    const list = state.formFieldsOptions.filter(o => !ignoreOptions.includes(o.id));
    return list;
  }
</script>
