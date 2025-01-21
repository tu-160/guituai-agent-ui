<template>
  <BasicModal v-bind="$attrs" width="1000px" class="future-modal-portal" @register="registerModal" title="选项设置" @ok="handleSubmit" destroyOnClose>
    <a-table :data-source="state.list" :columns="state.columns" size="small" :pagination="false" rowKey="id" class="carousel-table">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'drag'">
          <i class="drag-handler icon-ym icon-ym-darg" title="点击拖动" />
        </template>
        <template v-if="column.key === 'fullName'">
          <div class="flex">
            <future-i18n-input
              class="w-50%"
              v-model:value="record.fullName"
              v-model:i18n="record.fullNameI18nCode"
              placeholder="请输入"
              allowClear
              :disabled="showType == 'app' ? true : record.filedName === 'classify'" />
            <future-select
              class="w-50% !ml-5px"
              v-model:value="record.classify"
              :options="noticeTypeList"
              placeholder="请选择"
              multiple
              showSearch
              v-if="record.filedName == 'classify'" />
            <future-select
              class="w-50% !ml-5px"
              v-model:value="record.timeClassify"
              :options="timeOptions"
              placeholder="请选择"
              showSearch
              v-if="record.filedName == 'time'" />
            <future-select
              class="w-50% !ml-5px"
              v-model:value="record.userClassify"
              :options="userOptions"
              placeholder="请选择"
              showSearch
              v-if="record.filedName == 'user'" />
          </div>
        </template>
        <template v-if="column.key === 'show'">
          <a-switch v-model:checked="record.show" size="small" v-if="getShow(record.filedName)" />
        </template>
        <template v-if="column.key === 'sortable'">
          <a-checkbox v-model:check="record.sortable" />
        </template>
        <template v-if="column.key === 'fixed'">
          <future-select v-model:value="record.fixed" :options="fixedOptions" placeholder="请选择" showSearch v-if="record.filedName !== 'classify'" />
          <span v-else></span>
        </template>
        <template v-if="column.key === 'align'">
          <future-select v-model:value="record.align" :options="alignOptions" placeholder="请选择" showSearch v-if="record.filedName !== 'classify'" />
          <span v-else></span>
        </template>
        <template v-if="column.key === 'width'">
          <a-input-number v-model:value="record.width" :min="0" :max="9999" v-if="record.filedName !== 'classify'" placeholder="请输入" />
          <span v-else></span>
        </template>
        <template v-if="column.key === 'fontSize'">
          <a-input-number v-model:value="record.fontSize" :min="12" :max="25" v-if="record.filedName !== 'classify'" placeholder="请输入" />
          <span v-else></span>
        </template>
        <template v-if="column.key === 'fontWeight'">
          <a-switch v-model:checked="record.fontWeight" v-if="record.filedName !== 'classify'" size="small" />
          <span v-else></span>
        </template>
        <template v-if="column.key === 'fontColor'">
          <future-color-picker v-model:value="record.fontColor" size="small" v-if="record.filedName !== 'classify'" />
          <span v-else></span>
        </template>
      </template>
    </a-table>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { nextTick, reactive, toRefs } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import Sortablejs from 'sortablejs';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useBaseStore } from '@/store/modules/base';

  interface State {
    list: any[];
    showType: string;
    type: number;
    columns: any[];
    noticeTypeList: any[];
  }
  const state = reactive<State>({
    list: [],
    showType: '',
    type: 1,
    columns: [],
    noticeTypeList: [],
  });
  const { showType, noticeTypeList } = toRefs(state);
  const emit = defineEmits(['register', 'change']);
  const { createMessage } = useMessage();
  const baseStore = useBaseStore();
  const [registerModal, { closeModal }] = useModalInner(init);
  const baseColumns = [
    { title: '拖动', dataIndex: 'drag', key: 'drag', align: 'center', width: 50 },
    { title: '名称', dataIndex: 'fullName', key: 'fullName', width: 320 },
    { title: '是否显示', dataIndex: 'show', key: 'show', width: 80, align: 'center' },
    { title: '排序', dataIndex: 'sortable', key: 'sortable', width: 60, align: 'center' },
    { title: '冻结方式', dataIndex: 'fixed', key: 'fixed', width: 160 },
    { title: '对齐方式', dataIndex: 'align', key: 'align', width: 160 },
    { title: '宽度', dataIndex: 'width', key: 'width', width: 160 },
  ];
  const baseColumns_ = [
    { title: '名称', dataIndex: 'fullName', key: 'fullName', width: 320 },
    { title: '是否显示', dataIndex: 'show', key: 'show', width: 80, align: 'center' },
    { title: '大小', dataIndex: 'fontSize', key: 'fontSize', width: 150 },
    { title: '加粗', dataIndex: 'fontWeight', key: 'fontWeight', width: 80, align: 'center' },
    { title: '颜色', dataIndex: 'fontColor', key: 'fontColor', width: 80, align: 'center' },
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
  const timeOptions = [
    { id: 1, fullName: '创建时间' },
    { id: 2, fullName: '发布时间' },
  ];
  const userOptions = [
    { id: 1, fullName: '创建人' },
    { id: 2, fullName: '发布人' },
  ];

  async function init(data) {
    state.list = JSON.parse(JSON.stringify(data.data));
    state.showType = data.showType || 'pc';
    state.type = data.type || 1;
    state.columns = state.type == 1 && state.showType == 'pc' ? baseColumns : baseColumns_;
    state.noticeTypeList = (await baseStore.getDictionaryData('NoticeType')) as any[];
    state.noticeTypeList.map(o => {
      o.id = o.enCode;
      return o;
    });
    nextTick(() => initSort());
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
  function getShow(filedName) {
    if (state.showType == 'app' && filedName == 'classify') return true;
    if (state.showType == 'pc' && state.type === 1) return true;
    if (state.showType == 'pc' && (filedName == 'classify' || filedName == 'content')) return true;
    return false;
  }
</script>
