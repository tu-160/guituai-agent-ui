<template>
  <BasicModal v-bind="$attrs" width="600px" class="convert-modal" @register="registerModal" title="数据转换配置" @ok="handleSubmit" destroyOnClose>
    <a-table size="small" rowKey="id" class="complex-header-table" :data-source="list" :columns="columns" :pagination="false">
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'field'">
          <FutureTreeSelect v-model:value="record.field" placeholder="请选择" showSearch allowClear :options="fieldOptions" class="!w-334px" />
        </template>
        <template v-if="column.key === 'type'">
          <FutureSelect v-model:value="record.type" placeholder="请选择" :options="typeList" class="!w-160px" />
          <template v-if="canSetAttrs.includes(record.type)">
            <i class="icon-ym icon-ym-shezhi cursor-pointer ml-8px leading-30px" title="转换设置" @click="openExtraConfig(record, index)" />
          </template>
        </template>
        <template v-if="column.key === 'action'">
          <a-button class="action-btn" type="link" color="error" @click="handleDel(index)" size="small">删除</a-button>
        </template>
      </template>
    </a-table>
    <div class="table-add-action" @click="handleAdd()">
      <a-button type="link" preIcon="icon-ym icon-ym-btn-add">添加</a-button>
    </div>
    <ExtraConfigModal @register="registerExtraConfigModal" @confirm="updateRow" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { nextTick, reactive, toRefs } from 'vue';
  import { BasicModal, useModal, useModalInner } from '@/components/Modal';
  import { cloneDeep } from 'lodash-es';
  import ExtraConfigModal from './ExtraConfigModal.vue';

  interface State {
    list: any[];
    fieldOptions: any[];
    activeIndex: number;
  }

  const state = reactive<State>({
    list: [],
    fieldOptions: [],
    activeIndex: 0,
  });
  const { list, fieldOptions } = toRefs(state);
  const typeList = [
    { fullName: '枚举', id: 'select' },
    { fullName: '日期', id: 'date' },
    { fullName: '数字', id: 'number' },
    { fullName: '地址', id: 'address' },
    { fullName: '定位', id: 'location' },
    { fullName: '单图', id: 'singleImg' },
    { fullName: '组织', id: 'organize' },
    { fullName: '部门', id: 'department' },
    { fullName: '岗位', id: 'position' },
    { fullName: '用户', id: 'user' },
    { fullName: '角色', id: 'role' },
    { fullName: '分组', id: 'group' },
    { fullName: '用户组件', id: 'users' },
  ];
  const emit = defineEmits(['register', 'confirm']);
  const [registerModal, { closeModal }] = useModalInner(init);
  const [registerExtraConfigModal, { openModal: openExtraConfigModal }] = useModal();
  const columns = [
    { title: '字段', dataIndex: 'field', key: 'field', width: 350 },
    { title: '转换类型', dataIndex: 'type', key: 'type', width: 200 },
    { title: '操作', dataIndex: 'action', key: 'action', width: 50 },
  ];
  const canSetAttrs = ['select', 'date', 'number'];
  const emptyItem: any = {
    field: '',
    type: '',
    config: { dataType: 'static', options: [], dictionaryType: '', propsValue: 'id', format: 'yyyy-MM-dd', precision: 0, thousands: false },
  };

  function init(data) {
    state.list = cloneDeep(data.list);
    state.fieldOptions = cloneDeep(data.fieldOptions);
  }
  function handleAdd() {
    state.list.push(cloneDeep(emptyItem));
  }
  function handleDel(index) {
    state.list.splice(index, 1);
  }
  function openExtraConfig(record, index) {
    state.activeIndex = index;
    openExtraConfigModal(true, { ...record });
  }
  function updateRow(data) {
    state.list[state.activeIndex] = data;
  }
  function handleSubmit() {
    emit('confirm', state.list);
    nextTick(() => closeModal());
  }
</script>
<style lang="less">
  .convert-modal {
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
