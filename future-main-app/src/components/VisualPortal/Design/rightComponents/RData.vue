<template>
  <a-collapse-panel>
    <template #header>数据设置</template>
    <a-form-item label="数据类型">
      <future-radio v-model:value="activeData.dataType" :options="dataTypeOptions" optionType="button" buttonStyle="solid" @change="onDataTypeChange" />
    </a-form-item>
    <a-form-item label="数据设置" v-if="activeData.dataType === 'static'">
      <a-button @click="showData(activeData.option.defaultValue)">查看</a-button>
    </a-form-item>
    <a-form-item label="数据接口" v-if="activeData.dataType === 'dynamic'">
      <interface-modal :value="activeData.propsApi" :title="activeData.propsName" popupTitle="数据接口" @change="onPropsApiChange" />
    </a-form-item>
    <a-form-item label="参数设置" v-if="activeData.dataType === 'dynamic' && activeData.templateJson?.length">
      <select-interface-btn :templateJson="activeData.templateJson" :showSystemFormId="false" :type="2" />
    </a-form-item>
    <template v-if="activeData.dataType === 'dynamic' && activeData.propsApi && activeData.futureKey != 'rankList'">
      <a-form-item label="映射关系" />
      <a-form-item>
        <a-table :data-source="activeData.mappingConfig" :columns="mappingColumns" size="small" :pagination="false">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'field'"> {{ record[column.key] }} </template>
            <template v-if="column.key === 'value'">
              <a-auto-complete
                class="text-left"
                v-model:value="record[column.key]"
                placeholder="请输入"
                :options="state.options"
                allowClear
                @focus="onFocus(record[column.key])"
                @search="debounceOnSearch(record[column.key])" />
            </template>
          </template>
        </a-table>
      </a-form-item>
    </template>
    <template v-if="activeData.futureKey == 'rankList'">
      <a-divider>列表字段</a-divider>
      <div class="options-list">
        <draggable v-model="activeData.option.columnOptions" :animation="300" group="selectItem" handle=".option-drag" itemKey="id">
          <template #item="{ element, index }">
            <div class="select-item">
              <div class="select-line-icon option-drag">
                <i class="icon-ym icon-ym-darg" />
              </div>
              <future-i18n-input v-model:value="element.label" v-model:i18n="element.labelI18nCode" placeholder="列名" />
              <a-auto-complete
                v-model:value="element.value"
                placeholder="字段"
                :options="state.options"
                allowClear
                @focus="onFocus(element.value)"
                @search="debounceOnSearch(element.value)" />
              <div class="close-btn select-line-icon" :class="{ 'opacity-50': activeData.option.columnOptions.length == 1 }" @click="handleDel(index)">
                <i class="icon-ym icon-ym-btn-clearn" />
              </div>
            </div>
          </template>
        </draggable>
        <div class="add-btn">
          <a-button type="link" preIcon="icon-ym icon-ym-btn-add" @click="addSelectItem">添加字段</a-button>
        </div>
      </div>
    </template>
    <div v-if="activeData.option.styleType == 7 && activeData.futureKey == 'barChart'" class="my-20px">
      <a-table :data-source="activeData.option.barType" :columns="columns" size="small" :pagination="false">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'title'"> {{ record[column.key] }} </template>
          <template v-if="column.key === 'type'">
            <future-select v-model:value="record[column.key]" placeholder="请选择" :options="barTypeList" showSearch />
          </template>
        </template>
      </a-table>
    </div>
    <Refresh v-if="activeData.dataType === 'dynamic' && activeData.propsApi" :refresh="activeData.refresh" />
    <json-modal ref="JSONArea" @register="registerJson" @change="handleRefreshData" />
  </a-collapse-panel>
</template>
<script lang="ts" setup>
  import Refresh from './RRefresh.vue';
  import draggable from 'vuedraggable';
  import { InterfaceModal } from '@/components/CommonModal';
  import { useModal } from '@/components/Modal';
  import JsonModal from './RJsonModal.vue';
  import { SelectInterfaceBtn } from '@/components/Interface';
  import { useDebounceFn } from '@vueuse/core';
  import { reactive, onMounted, toRefs } from 'vue';
  import { getDataInterfaceInfo } from '@/api/systemData/dataInterface';

  interface State {
    allOptions: any[];
    options: any[];
  }
  const state = reactive<State>({
    allOptions: [],
    options: [],
  });
  const { allOptions } = toRefs(state);
  const props = defineProps(['activeData', 'showType']);
  const [registerJson, { openModal: openJsonModal }] = useModal();
  const debounceOnSearch = useDebounceFn(onSearch, 300);
  const barTypeList = [
    { fullName: '柱体', id: 'bar' },
    { fullName: '折线', id: 'line' },
  ];
  const dataTypeOptions = [
    { id: 'static', fullName: '静态数据' },
    { id: 'dynamic', fullName: '远端数据' },
  ];
  const columns = [
    { title: '系列', key: 'title', ellipsis: true },
    { title: '类型', key: 'type' },
  ];
  const mappingColumns = [
    { title: '字段', dataIndex: 'field', key: 'field', width: 50 },
    { title: '映射', dataIndex: 'value', key: 'value', width: 120, align: 'center' },
  ];
  const mappingList = [
    { id: 1, field: '系列', value: '' },
    { id: 2, field: '维度', value: '' },
    { id: 3, field: '数值', value: '' },
    { id: 4, field: '最大值', value: '' },
    { id: 5, field: '时间戳', value: '' },
    { id: 6, field: '经度', value: '' },
    { id: 7, field: '纬度', value: '' },
  ];

  function onDataTypeChange() {
    props.activeData.propsApi = '';
    props.activeData.propsName = '';
    props.activeData.templateJson = [];
  }
  function showData(val) {
    openJsonModal(true, { value: JSON.stringify(val) });
  }
  function onPropsApiChange(val, item) {
    if (val) {
      props.activeData.propsApi = val;
      props.activeData.propsName = item.fullName;
      props.activeData.refresh.autoRefresh = false;
      props.activeData.templateJson = item.parameterJson ? JSON.parse(item.parameterJson).map(o => ({ ...o, relationField: '', sourceType: 2 })) : [];
      state.allOptions = item.fieldJson ? JSON.parse(item.fieldJson).map(o => ({ ...o, value: o.defaultValue })) : [];
    } else {
      props.activeData.propsApi = '';
      props.activeData.propsName = '';
      props.activeData.templateJson = [];
      state.allOptions = [];
    }
  }
  function addSelectItem() {
    props.activeData.option.columnOptions.push({ value: '', label: '' });
  }
  function handleDel(index) {
    if (props.activeData.option.columnOptions.length > 1) props.activeData.option.columnOptions.splice(index, 1);
  }
  function handleRefreshData(data) {
    props.activeData.option.defaultValue = data ? JSON.parse(data) : [];
  }
  function onSearch(searchText: string) {
    state.options = state.allOptions.filter(o => o.value.toLowerCase().indexOf(searchText.toLowerCase()) !== -1);
  }
  function onFocus(searchText) {
    onSearch(searchText);
  }
  function initFieldData() {
    if (!props.activeData.propsApi || props.activeData.dataType === 'static') return (state.allOptions = []);
    getDataInterfaceInfo(props.activeData.propsApi).then(res => {
      const data = res.data;
      let list = data.fieldJson ? JSON.parse(data.fieldJson) : [];
      state.allOptions = list.map(o => ({ ...o, value: o.defaultValue }));
    });
  }
  function initMappingConfig() {
    if (props.activeData?.mappingConfig && props.activeData?.mappingConfig?.length) return props.activeData.mappingConfig;
    if (['barChart', 'pieChart', 'lineChart'].includes(props.activeData.futureKey)) return mappingList.filter(o => [1, 2, 3].includes(o.id));
    if (['radarChart'].includes(props.activeData.futureKey)) return mappingList.filter(o => [1, 2, 3, 4].includes(o.id));
    if (['timeAxis'].includes(props.activeData.futureKey)) return mappingList.filter(o => [2, 5].includes(o.id));
    if (['mapChart'].includes(props.activeData.futureKey)) return mappingList.filter(o => [2, 3, 6, 7].includes(o.id));
  }

  onMounted(() => {
    props.activeData.mappingConfig = initMappingConfig();
    initFieldData();
  });
</script>
