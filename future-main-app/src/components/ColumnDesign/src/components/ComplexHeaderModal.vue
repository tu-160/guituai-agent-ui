<template>
  <BasicModal v-bind="$attrs" width="1000px" class="FUTURE-complex-header-Modal" @register="registerModal" title="复杂表头配置" @ok="handleSubmit" destroyOnClose>
    <a-table size="small" rowKey="id" class="complex-header-table" :data-source="list" :columns="columns" :pagination="false">
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'fullName'">
          <future-i18n-input v-model:value="record.fullName" v-model:i18n="record.fullNameI18nCode" placeholder="请输入" allowClear :maxlength="50" />
        </template>
        <template v-if="column.key === 'childColumns'">
          <FutureSelect
            v-model:value="record.childColumns"
            :fieldNames="{ options: 'options1' }"
            placeholder="请选择"
            multiple
            showSearch
            allowClear
            :options="getChildColumnsList(index)" />
        </template>
        <template v-if="column.key === 'align'">
          <FutureSelect v-model:value="record.align" placeholder="请选择" :options="alignList" />
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
  import { buildBitUUID } from '@/utils/uuid';
  import { cloneDeep } from 'lodash-es';

  interface State {
    list: any[];
    childColumnsList: any[];
  }

  const state = reactive<State>({
    list: [],
    childColumnsList: [],
  });
  const { list } = toRefs(state);
  const alignList = [
    { fullName: '左对齐', id: 'left' },
    { fullName: '居中对齐', id: 'center' },
    { fullName: '右对齐', id: 'right' },
  ];
  const emit = defineEmits(['register', 'confirm']);
  const [registerModal, { closeModal }] = useModalInner(init);
  const columns = [
    { title: '表头列名', dataIndex: 'fullName', key: 'fullName', width: 200 },
    { title: '子列', dataIndex: 'childColumns', key: 'childColumns', width: 330 },
    { title: '对齐方式', dataIndex: 'align', key: 'align', width: 150 },
    { title: '操作', dataIndex: 'action', key: 'action', width: 50 },
  ];

  function init(data) {
    state.list = cloneDeep(data.list);
    state.childColumnsList = cloneDeep(data.columnOptions).map(o => ({ ...o, disabled: false }));
  }
  function handleAdd() {
    const id = 'complex' + buildBitUUID();
    const item = { fullName: '表头列名' + id, fullNameI18nCode: '', childColumns: [], align: 'center', id };
    state.list.push(item);
  }
  function handleDel(index) {
    state.list.splice(index, 1);
  }
  function getChildColumnsList(index) {
    let options: any[] = [];
    for (let i = 0; i < state.list.length; i++) {
      const e = state.list[i];
      if (e.childColumns?.length && index !== i) options.push(...e.childColumns);
    }
    let list: any[] = state.childColumnsList.filter(o => !options.includes(o.id));
    if (list.length) list = list.map(o => ({ ...o, align: 'left' }));
    return list;
  }
  function handleSubmit() {
    emit('confirm', state.list);
    nextTick(() => closeModal());
  }
</script>
<style lang="less">
  .FUTURE-complex-header-Modal {
    .ant-modal-body {
      height: 60vh;
      & > .scrollbar {
        padding: 0;
        .scrollbar__view {
          .table-add-action {
            margin-bottom: 10px;
          }
        }
      }
    }
  }
</style>
