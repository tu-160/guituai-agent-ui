<template>
  <BasicModal v-bind="$attrs" width="1000px" class="future-modal-portal" @register="registerModal" title="选项设置" @ok="handleSubmit" destroyOnClose>
    <a-table :data-source="state.list" :columns="columns" size="small" :pagination="false" rowKey="id" class="carousel-table">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'drag'">
          <i class="drag-handler icon-ym icon-ym-darg" title="点击拖动" />
        </template>
        <template v-if="column.key === 'fullName'">
          <future-i18n-input v-model:value="record.fullName" v-model:i18n="record.fullNameI18nCode" placeholder="请输入名称" allowClear :maxlength="50" />
        </template>
        <template v-if="column.key === 'category'">
          <future-select v-model:value="record[column.key]" :options="state.categoryList" placeholder="请选择分类" multiple showSearch allowClear />
        </template>
        <template v-if="column.key === 'noShow'">
          <a-switch v-model:checked="record.noShow" />
        </template>
        <template v-if="column.key === 'icon'">
          <FutureIconPicker v-model:value="record.icon" />
        </template>
        <template v-if="column.key === 'iconBgColor'">
          <future-color-picker v-model:value="record.iconBgColor" size="small" />
        </template>
      </template>
    </a-table>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { nextTick, reactive } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useBaseStore } from '@/store/modules/base';
  import Sortablejs from 'sortablejs';

  interface State {
    list: any[];
    menuList: any[];
    appMenuList: any[];
    categoryList: any[];
    showType: string;
  }
  const state = reactive<State>({
    list: [],
    menuList: [],
    appMenuList: [],
    categoryList: [],
    showType: '',
  });
  const emit = defineEmits(['register', 'change']);
  const { createMessage } = useMessage();
  const baseStore = useBaseStore();
  const [registerModal, { closeModal }] = useModalInner(init);
  const columns = [
    { title: '拖动', dataIndex: 'drag', key: 'drag', align: 'center', width: 50 },
    { title: '名称', dataIndex: 'fullName', key: 'fullName', width: 250 },
    { title: '分类', dataIndex: 'category', key: 'category', width: 250 },
    { title: '隐藏', dataIndex: 'noShow', key: 'noShow', width: 70 },
    { title: '图标', dataIndex: 'icon', key: 'icon', width: 280 },
    { title: '图标背景色', dataIndex: 'iconBgColor', key: 'iconBgColor', width: 90 },
  ];

  function init(data) {
    state.list = JSON.parse(JSON.stringify(data.data));
    state.menuList = data.menuList || [];
    state.appMenuList = data.appMenuList || [];
    state.menuList = data.showType || 'pc';
    getDictionaryData();
    nextTick(() => initSort());
  }
  async function getDictionaryData() {
    state.categoryList = (await baseStore.getDictionaryData('businessType')) as any[];
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
    for (let i = 0; i < state.list.length; i++) {
      const element = state.list[i];
      if (!element.fullName) return createMessage.warning('名称不能为空');
      if (!element.icon) return createMessage.warning('请选择图标');
      if (!element.iconBgColor) return createMessage.warning('请选择图标背景色');
    }
    emit('change', state.list);
    nextTick(() => closeModal());
  }
</script>
