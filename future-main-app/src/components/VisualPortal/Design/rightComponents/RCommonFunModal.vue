<template>
  <BasicModal v-bind="$attrs" width="1000px" class="future-modal-portal" @register="registerModal" title="选项设置" @ok="handleSubmit" destroyOnClose>
    <a-table :data-source="state.list" :columns="columns" size="small" :pagination="false" rowKey="id" class="carousel-table">
      <template #headerCell="{ column }">
        <template v-if="column.key === 'linkType'">链接类型<BasicHelp text="地址以http://或https://开头" /></template>
      </template>
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'drag'">
          <i class="drag-handler icon-ym icon-ym-darg" title="点击拖动" />
        </template>
        <template v-if="column.key === 'fullName'">
          <future-i18n-input v-model:value="record.fullName" v-model:i18n="record.fullNameI18nCode" placeholder="请输入" allowClear :maxlength="50" />
        </template>
        <template v-if="column.key === 'icon'">
          <FutureIconPicker v-model:value="record.icon" />
        </template>
        <template v-if="column.key === 'iconBgColor'">
          <future-color-picker v-model:value="record.iconBgColor" size="small" />
        </template>
        <template v-if="column.key === 'linkType'">
          <div class="flex items-center">
            <future-select class="!w-160px !mr-10px" v-model:value="record[column.key]" :options="linkTypeList" placeholder="请选择" showSearch allowClear />
            <div class="flex-1">
              <future-tree-select
                v-if="record.linkType == 1"
                v-model:value="record.moduleId"
                placeholder="请选择"
                lastLevel
                allowClear
                showSearch
                :options="state.showType == 'pc' ? state.menuList : state.appMenuList"
                @change="(val, data) => getSelectVal(val, data, index)" />
              <a-input v-if="record.linkType == 2" v-model:value="record.urlAddress" placeholder="请输入">
                <template #addonAfter v-if="state.showType == 'pc'">
                  <future-select v-model:value="record.linkTarget" :options="typeList" placeholder="请选择" class="!w-90px" />
                </template>
              </a-input>
            </div>
          </div>
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
  import { nextTick, reactive } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { linkTypeList, typeList } from '../helper/dataMap';
  import Sortablejs from 'sortablejs';
  import { buildBitUUID } from '@/utils/uuid';
  import { useMessage } from '@/hooks/web/useMessage';
  import { isUrl } from '@/utils/is';

  interface State {
    list: any[];
    menuList: any[];
    appMenuList: any[];
    showType: string;
  }
  const state = reactive<State>({
    list: [],
    menuList: [],
    appMenuList: [],
    showType: '',
  });
  const emit = defineEmits(['register', 'change']);
  const { createMessage } = useMessage();
  const [registerModal, { closeModal }] = useModalInner(init);
  const columns = [
    { title: '拖动', dataIndex: 'drag', key: 'drag', align: 'center', width: 50 },
    { title: '名称', dataIndex: 'fullName', key: 'fullName', width: 200 },
    { title: '图标', dataIndex: 'icon', key: 'icon', width: 280 },
    { title: '图标颜色', dataIndex: 'iconBgColor', key: 'iconBgColor', width: 80 },
    { title: '链接类型', dataIndex: 'linkType', key: 'linkType', width: 360 },
    { title: '操作', dataIndex: 'action', key: 'action', width: 50, fixed: 'right' },
  ];

  function init(data) {
    state.list = JSON.parse(JSON.stringify(data.data));
    state.menuList = data.menuList || [];
    state.appMenuList = data.appMenuList || [];
    state.showType = data.showType || 'pc';
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
  function getSelectVal(_val, item, index) {
    state.list[index].type = item.type;
    state.list[index].urlAddress = item.urlAddress;
    if (item.linkTarget) state.list[index].linkTarget = item.linkTarget;
    if (item.propertyJson) state.list[index].propertyJson = item.propertyJson;
  }
  function handleAdd() {
    const item = {
      fullName: '',
      moduleId: '',
      linkType: '',
      urlAddress: '',
      linkTarget: '_self',
      icon: 'icon-ym icon-ym-webDesign',
      iconBgColor: '#1890FF',
      type: 2,
      id: buildBitUUID(),
    };
    state.list.push(item);
  }
  function handleDel(index) {
    state.list.splice(index, 1);
  }
  function handleSubmit() {
    for (let i = 0; i < state.list.length; i++) {
      const element = state.list[i];
      if (!element.fullName) return createMessage.warning('名称不能为空');
      if (!element.icon) return createMessage.warning('请选择图标');
      if (!element.iconBgColor) return createMessage.warning('请选择图标颜色');
      if (element.linkType == 1 && !element.urlAddress && !element.moduleId) return createMessage.warning('请选择菜单');
      if (element.linkType == 2 && !element.urlAddress) return createMessage.warning('链接地址不能为空');
      if (element.linkType == 2 && !isUrl(element.urlAddress)) return createMessage.warning('请输入正确的链接地址');
    }
    emit('change', state.list);
    nextTick(() => closeModal());
  }
</script>
