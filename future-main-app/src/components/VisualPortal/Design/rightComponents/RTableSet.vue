<template>
  <a-collapse-panel>
    <template #header>表格列表设置</template>
    <template v-if="showType == 'pc'">
      <a-form-item label="风格类型">
        <future-select v-model:value="activeData.option.styleType" :options="styleTypeOptions" placeholder="请选择" showSearch @change="renderKeyChange" />
      </a-form-item>
      <template v-if="activeData.option.styleType == 1">
        <a-form-item label="显示边框">
          <a-switch v-model:checked="activeData.option.border" />
        </a-form-item>
        <a-form-item>
          <template #label>溢出省略<BasicHelp :text="['启用：溢出省略号显示；', '禁用：显示全部信息，溢出换行显示']" /></template>
          <a-switch v-model:checked="activeData.option.showOverflow" />
        </a-form-item>
        <a-divider>表头设置</a-divider>
        <a-form-item label="显示表头">
          <a-switch v-model:checked="activeData.option.showHeader" @change="renderKeyChange" />
        </a-form-item>
        <template v-if="activeData.option.showHeader">
          <a-form-item label="字体大小">
            <a-input-number v-model:value="activeData.option.headerFontSize" placeholder="请输入" :min="12" :max="25" />
          </a-form-item>
          <a-form-item label="字体加粗">
            <a-switch v-model:checked="activeData.option.headerFontWeight" />
          </a-form-item>
          <a-form-item label="字体颜色">
            <future-color-picker v-model:value="activeData.option.headerFontColor" size="small" />
          </a-form-item>
          <a-form-item label="字体位置">
            <future-radio v-model:value="activeData.option.headerLeft" :options="alignList" optionType="button" button-style="solid" class="right-radio" />
          </a-form-item>
          <a-form-item label="背景色">
            <future-color-picker v-model:value="activeData.option.headerBgColor" size="small" />
          </a-form-item>
        </template>
        <a-divider>表格设置</a-divider>
        <a-form-item label="显示序号">
          <a-switch v-model:checked="activeData.option.tableIndex" />
        </a-form-item>
        <a-form-item label="字体大小">
          <a-input-number v-model:value="activeData.option.tableFontSize" placeholder="请输入" :min="12" :max="25" />
        </a-form-item>
        <a-form-item label="字体颜色">
          <future-color-picker v-model:value="activeData.option.tableFontColor" size="small" />
        </a-form-item>
      </template>
      <a-form-item label="显示描述" v-if="activeData.option.styleType == 3">
        <a-switch v-model:checked="activeData.option.describe" />
      </a-form-item>
      <a-form-item label="显示条数">
        <a-input-number v-model:value="activeData.option.tableCount" placeholder="请输入" :min="1" :max="50" @change="renderKeyChange" />
      </a-form-item>
      <a-form-item label="背景色">
        <future-color-picker v-model:value="activeData.option.tableBgColor" size="small" />
      </a-form-item>
      <a-form-item label="奇行颜色">
        <future-color-picker v-model:value="activeData.option.tableOddLineColor" size="small" />
      </a-form-item>
      <a-form-item label="偶行颜色">
        <future-color-picker v-model:value="activeData.option.tableEvenLineColor" size="small" />
      </a-form-item>
      <a-divider v-if="activeData.option.styleType == 1">列数据设置</a-divider>
      <a-form-item label="数据类型">
        <future-radio v-model:value="activeData.dataType" :options="dataTypeList" optionType="button" button-style="solid" @change="dataTypeChange" />
      </a-form-item>
      <a-form-item label="数据设置" v-if="activeData.dataType === 'static'">
        <a-button @click="showData(activeData.option.defaultValue)">设置</a-button>
      </a-form-item>
      <template v-if="activeData.dataType === 'dynamic'">
        <a-form-item label="数据接口">
          <interface-modal :value="activeData.propsApi" :title="activeData.propsName" popupTitle="数据接口" @change="onPropsApiChange" />
        </a-form-item>
        <a-form-item label="参数设置" v-if="activeData.templateJson?.length">
          <select-interface-btn :templateJson="activeData.templateJson" :showSystemFormId="false" :type="2" />
        </a-form-item>
        <Refresh v-if="activeData.propsApi" :refresh="activeData.refresh" />
      </template>
      <a-form-item :label="activeData.option.styleType == 1 ? '列数据' : '行数据'">
        <a-button
          @click="showColumnData(activeData.option.styleType == 1 ? activeData.option.columnData : activeData.option.rowData, activeData.option.styleType)">
          设置
        </a-button>
      </a-form-item>
    </template>
    <template v-else>
      <a-form-item label="显示名称">
        <a-switch v-model:checked="activeData.option.showName" />
      </a-form-item>
      <a-form-item label="数据类型">
        <future-radio v-model:value="activeData.dataType" :options="dataTypeList" optionType="button" button-style="solid" @change="dataTypeChange" />
      </a-form-item>
      <a-form-item label="数据设置" v-if="activeData.dataType === 'static'">
        <a-button @click="showData(activeData.option.defaultValue)">设置</a-button>
      </a-form-item>
      <template v-if="activeData.dataType === 'dynamic'">
        <a-form-item label="数据接口">
          <interface-modal :value="activeData.propsApi" :title="activeData.propsName" popupTitle="数据接口" @change="onPropsApiChange" />
        </a-form-item>
        <a-form-item label="参数设置" v-if="activeData.templateJson?.length">
          <select-interface-btn :templateJson="activeData.templateJson" :showSystemFormId="false" :type="2" />
        </a-form-item>
      </template>
      <refresh v-if="activeData.propsApi" :refresh="activeData.refresh" />
      <a-form-item label="行数据">
        <a-button @click="showColumnData(activeData.option.appColumnList)">设置</a-button>
      </a-form-item>
      <a-form-item label="显示条数">
        <a-input-number v-model:value="activeData.option.appCount" placeholder="请输入" :min="1" :max="50" />
      </a-form-item>
      <template v-if="activeData.option.showName">
        <a-form-item label="名称大小">
          <a-input-number v-model:value="activeData.option.nameFontSize" placeholder="请输入" :min="12" :max="25" />
        </a-form-item>
        <a-form-item label="名称加粗">
          <a-switch v-model:checked="activeData.option.nameFontWeight" />
        </a-form-item>
        <a-form-item label="名称颜色">
          <future-color-picker v-model:value="activeData.option.nameFontColor" size="small" />
        </a-form-item>
      </template>
      <a-form-item label="数据大小">
        <a-input-number v-model:value="activeData.option.dataFontSize" :min="12" :max="25" placeholder="请输入" />
      </a-form-item>
      <a-form-item label="数据加粗">
        <a-switch v-model:checked="activeData.option.dataFontWeight" />
      </a-form-item>
      <a-form-item label="数据颜色">
        <future-color-picker v-model:value="activeData.option.dataFontColor" size="small" />
      </a-form-item>
    </template>
    <json-modal @register="registerJson" @change="handleRefreshData" />
    <column-modal @register="registerColumn" @change="handleRefreshColumn" />
  </a-collapse-panel>
</template>
<script lang="ts" setup>
  import { alignList, dataTypeList } from '../helper/dataMap';
  import { InterfaceModal } from '@/components/CommonModal';
  import { useModal } from '@/components/Modal';
  import Refresh from './RRefresh.vue';
  import JsonModal from './RJsonModal.vue';
  import ColumnModal from './RColumnModal.vue';
  import { SelectInterfaceBtn } from '@/components/Interface';

  const props = defineProps(['activeData', 'showType', 'mapOptions']);
  const styleTypeOptions = [
    { fullName: '表格', id: 1 },
    { fullName: '列表（横向）', id: 2 },
    { fullName: '列表（纵向）', id: 3 },
  ];
  const [registerJson, { openModal: openJsonModal }] = useModal();
  const [registerColumn, { openModal: openColumnModal }] = useModal();

  function renderKeyChange() {
    props.activeData.renderKey = +new Date();
  }
  function dataTypeChange() {
    props.activeData.propsApi = '';
    props.activeData.propsName = '';
    props.activeData.option.defaultValue = [];
    props.activeData.templateJson = [];
    renderKeyChange();
  }
  function onPropsApiChange(val, item) {
    if (val) {
      props.activeData.propsApi = val;
      props.activeData.propsName = item.fullName;
      props.activeData.refresh.autoRefresh = false;
      props.activeData.templateJson = item.parameterJson ? JSON.parse(item.parameterJson).map(o => ({ ...o, relationField: '', sourceType: 2 })) : [];
    } else {
      props.activeData.propsApi = '';
      props.activeData.propsName = '';
      props.activeData.templateJson = [];
    }
    renderKeyChange();
  }
  function showData(val) {
    openJsonModal(true, { value: JSON.stringify(val) });
  }
  function showColumnData(val, type?) {
    openColumnModal(true, { data: val, type: type || '', showType: props.showType, interfaceId: props.activeData.propsApi });
  }
  function handleRefreshData(data) {
    props.activeData.option.defaultValue = data ? JSON.parse(data) : [];
    renderKeyChange();
  }
  function handleRefreshColumn(data) {
    if (!data) return;
    if (props.showType === 'app') {
      props.activeData.option.appColumnList = data;
    } else {
      if (props.activeData.option.styleType == 1) {
        props.activeData.option.columnData = data;
      } else {
        props.activeData.option.rowData = data;
      }
    }
    renderKeyChange();
  }
</script>
