<template>
  <BasicModal v-bind="$attrs" width="1000px" class="future-modal-portal" @register="registerModal" title="选项设置" @ok="handleSubmit" destroyOnClose>
    <a-table :data-source="state.list" :columns="state.columns" size="small" :pagination="false" rowKey="id" class="carousel-table">
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'drag'">
          <i class="drag-handler icon-ym icon-ym-darg" title="点击拖动" />
        </template>
        <template v-if="column.key === 'fullName'">
          <future-i18n-input v-model:value="record.fullName" v-model:i18n="record.fullNameI18nCode" placeholder="请输入" allowClear v-if="state.type === 1" />
          <span v-else>{{ record.fullName }}</span>
        </template>
        <template v-if="column.key === 'filedName'">
          <a-auto-complete
            v-model:value="record.filedName"
            placeholder="请输入"
            :options="state.options"
            allowClear
            @focus="onFocus(record.filedName)"
            @search="debounceOnSearch(record.filedName)" />
        </template>
        <template v-if="column.key === 'sortable'">
          <a-checkbox v-model:checked="record.sortable" />
        </template>
        <template v-if="column.key === 'fixed'">
          <future-select v-model:value="record.fixed" :options="fixedOptions" placeholder="请选择" showSearch />
        </template>
        <template v-if="column.key === 'align'">
          <future-select v-model:value="record.align" :options="alignOptions" placeholder="请选择" showSearch />
        </template>
        <template v-if="column.key === 'width'">
          <a-input-number v-model:value="record.width" placeholder="请输入" :min="0" :max="9999" />
        </template>
        <template v-if="column.key === 'fontSize'">
          <a-input-number v-model:value="record.fontSize" placeholder="请输入" :min="0" :max="9999" />
        </template>
        <template v-if="column.key === 'fontWeight'">
          <a-switch v-model:checked="record.fontWeight" size="small" />
        </template>
        <template v-if="column.key === 'fontColor'">
          <future-color-picker v-model:value="record.fontColor" size="small" />
        </template>
        <template v-if="column.key === 'action'">
          <a-button class="action-btn" type="link" color="error" @click="handleDel(index)" size="small">删除</a-button>
        </template>
      </template>
    </a-table>
    <div class="table-add-action" @click="handleAdd()" v-if="state.type == 1">
      <a-button type="link" preIcon="icon-ym icon-ym-btn-add">添加</a-button>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { nextTick, reactive } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import Sortablejs from 'sortablejs';
  import { buildBitUUID } from '@/utils/uuid';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useDebounceFn } from '@vueuse/core';
  import { getDataInterfaceInfo } from '@/api/systemData/dataInterface';

  interface State {
    list: any[];
    showType: string;
    type: number;
    columns: any[];
    allOptions: any[];
    options: any[];
    interfaceId: string;
  }
  const state = reactive<State>({
    list: [],
    showType: '',
    type: 1,
    columns: [],
    allOptions: [],
    options: [],
    interfaceId: '',
  });
  const emit = defineEmits(['register', 'change']);
  const { createMessage } = useMessage();
  const [registerModal, { closeModal }] = useModalInner(init);
  const baseColumns = [
    { title: '拖动', dataIndex: 'drag', key: 'drag', align: 'center', width: 50 },
    { title: '名称', dataIndex: 'fullName', key: 'fullName', width: 160 },
    { title: '字段', dataIndex: 'filedName', key: 'filedName', width: 160 },
    { title: '排序', dataIndex: 'sortable', key: 'sortable', width: 60, align: 'center' },
    { title: '冻结方式', dataIndex: 'fixed', key: 'fixed', width: 160 },
    { title: '对齐方式', dataIndex: 'align', key: 'align', width: 160 },
    { title: '宽度', dataIndex: 'width', key: 'width', width: 160 },
    { title: '操作', dataIndex: 'action', key: 'action', width: 50 },
  ];
  const appColumns = [
    { title: '拖动', dataIndex: 'drag', key: 'drag', align: 'center', width: 50 },
    { title: '名称', dataIndex: 'fullName', key: 'fullName', width: 300 },
    { title: '字段', dataIndex: 'filedName', key: 'filedName', width: 300 },
    { title: '操作', dataIndex: 'action', key: 'action', width: 50 },
  ];
  const baseColumns_ = [
    { title: '拖动', dataIndex: 'drag', key: 'drag', align: 'center', width: 50 },
    { title: '名称', dataIndex: 'fullName', key: 'fullName', width: 120 },
    { title: '字段', dataIndex: 'filedName', key: 'filedName', width: 250 },
    { title: '大小', dataIndex: 'fontSize', key: 'fontSize', width: 250 },
    { title: '加粗', dataIndex: 'fontWeight', key: 'fontWeight', width: 80 },
    { title: '颜色', dataIndex: 'fontColor', key: 'fontColor', width: 80 },
  ];
  const fixedOptions = [
    { id: 'none', fullName: '无' },
    { id: 'left', fullName: '左冻结' },
    { id: 'right', fullName: '右冻结' },
  ];
  const alignOptions = [
    { id: 'left', fullName: '左对齐' },
    { id: 'center', fullName: '居中对齐' },
    { id: 'right', fullName: '右对齐' },
  ];
  const debounceOnSearch = useDebounceFn(onSearch, 300);

  function init(data) {
    state.list = JSON.parse(JSON.stringify(data.data));
    state.showType = data.showType || 'pc';
    state.type = data.type || 1;
    state.interfaceId = data.interfaceId || '';
    state.columns = state.type == 1 ? (state.showType == 'pc' ? baseColumns : appColumns) : baseColumns_;
    nextTick(() => {
      initSort();
      initFieldData();
    });
  }
  function initSort() {
    const searchTable: any = document.querySelector(`.carousel-table .ant-table-tbody`);
    Sortablejs.create(searchTable, {
      handle: '.drag-handler',
      animation: 150,
      easing: 'cubic-bezier(1, 0, 0, 1)',
      onStart: () => {},
      onEnd: ({ newIndex, oldIndex }: any) => {
        const currRow = state.list.splice(oldIndex, 1)[0];
        state.list.splice(newIndex, 0, currRow);
      },
    });
  }
  function handleDel(index) {
    state.list.splice(index, 1);
  }
  function handleAdd() {
    let item = {};
    if (state.showType === 'app') {
      item = { fullName: '', filedName: '', id: buildBitUUID() };
    } else {
      item = { fullName: '', filedName: '', sortable: false, fixed: 'none', align: 'center', width: 0, id: buildBitUUID() };
    }
    state.list.push(item);
  }
  function handleSubmit() {
    if (!state.list.length) return createMessage.warning('数据不能为空');
    for (let i = 0; i < state.list.length; i++) {
      const element = state.list[i];
      if (!element.fullName) return createMessage.warning('名称不能为空');
      if (!element.filedName) return createMessage.warning('名称字段不能为空');
    }
    emit('change', state.list);
    nextTick(() => closeModal());
  }
  function initFieldData() {
    if (!state.interfaceId) return (state.allOptions = []);
    getDataInterfaceInfo(state.interfaceId).then(res => {
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
</script>
