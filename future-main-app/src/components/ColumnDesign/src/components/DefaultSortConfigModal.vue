<template>
  <BasicModal v-bind="$attrs" class="FUTURE-complex-header-Modal" @register="registerModal" title="默认排序配置" @ok="handleSubmit" destroyOnClose>
    <a-table size="small" rowKey="id" class="sort-table" :data-source="list" :columns="columns" :pagination="false">
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'drag'">
          <i class="drag-handler icon-ym icon-ym-darg" title="点击拖动" />
        </template>
        <template v-if="column.key === 'field'">
          <FutureSelect
            v-model:value="record.field"
            :fieldNames="{ options: 'options1' }"
            placeholder="请选择"
            showSearch
            allowClear
            :options="getOptions(index)" />
        </template>
        <template v-if="column.key === 'sort'">
          <FutureRadio v-model:value="record.sort" :options="sortTypeOptions" />
        </template>
        <template v-if="column.key === 'action'">
          <a-button class="action-btn" type="link" color="error" @click="handleDel(index)" size="small">删除</a-button>
        </template>
      </template>
    </a-table>
    <div class="table-add-action" @click="handleAdd()">
      <a-button type="link" preIcon="icon-ym icon-ym-btn-add">添加</a-button>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { nextTick, reactive, toRefs } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import Sortablejs from 'sortablejs';
  import { buildBitUUID } from '@/utils/uuid';
  import { cloneDeep } from 'lodash-es';
  import { useMessage } from '@/hooks/web/useMessage';

  interface State {
    list: any[];
    columnOptions: any[];
  }

  const { createMessage } = useMessage();
  const state = reactive<State>({
    list: [],
    columnOptions: [],
  });
  const { list } = toRefs(state);
  const sortTypeOptions = [
    { id: 'asc', fullName: '升序' },
    { id: 'desc', fullName: '降序' },
  ];
  const emit = defineEmits(['register', 'confirm']);
  const [registerModal, { closeModal }] = useModalInner(init);
  const columns = [
    { title: '拖动', dataIndex: 'drag', key: 'drag', align: 'center', width: 50 },
    { title: '字段', dataIndex: 'field', key: 'field', width: 300 },
    { title: '类型', dataIndex: 'sort', key: 'sort', width: 200 },
    { title: '操作', dataIndex: 'action', key: 'action', width: 50 },
  ];

  function init(data) {
    state.list = cloneDeep(data.list);
    state.columnOptions = cloneDeep(data.columnOptions).map(o => ({ ...o, disabled: false }));
    nextTick(() => initSort());
  }
  function initSort() {
    const searchTable: any = document.querySelector(`.sort-table .ant-table-tbody`);
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
  function handleAdd() {
    const id = 'sort' + buildBitUUID();
    const item = { field: '', sort: 'desc', id };
    state.list.push(item);
  }
  function handleDel(index) {
    state.list.splice(index, 1);
  }
  function handleSubmit() {
    let isOk = true;
    for (let i = 0; i < state.list.length; i++) {
      if (!state.list[i].field) {
        createMessage.warning(`字段不能为空`);
        isOk = false;
        break;
      }
    }
    if (!isOk) return;
    emit('confirm', state.list);
    nextTick(() => closeModal());
  }
  function getOptions(index) {
    let options: any[] = state.columnOptions;
    for (let i = 0; i < state.list.length; i++) {
      const e = state.list[i];
      if (e.field && index !== i) options = options.filter(o => o.id !== e.field);
    }
    return options;
  }
</script>
