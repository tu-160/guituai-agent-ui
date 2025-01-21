<template>
  <a-collapse-panel>
    <template #header>自定义设置</template>
    <template v-if="showType === 'pc'">
      <a-form-item label="数据类型">
        <future-radio v-model:value="activeData.dataType" :options="dataTypeList" optionType="button" button-style="solid" @change="dataTypeChange" />
      </a-form-item>
      <a-form-item label="数据设置" v-if="activeData.dataType === 'static'">
        <a-button @click="showData(activeData.option)">设置</a-button>
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
    </template>
    <template v-else>
      <a-form-item label="数据类型">
        <future-radio v-model:value="activeData.appDataType" :options="dataTypeList" optionType="button" button-style="solid" @change="appDataTypeChange" />
      </a-form-item>
      <a-form-item label="数据设置" v-if="activeData.appDataType === 'static'">
        <a-button @click="showData(activeData.appOption)">设置</a-button>
      </a-form-item>
      <template v-if="activeData.appDataType === 'dynamic'">
        <a-form-item label="数据接口">
          <interface-modal :value="activeData.appPropsApi" :title="activeData.appPropsName" popupTitle="数据接口" @change="onAppPropsApiChange" />
        </a-form-item>
        <a-form-item label="参数设置" v-if="activeData.appTemplateJson?.length">
          <select-interface-btn :templateJson="activeData.appTemplateJson" :showSystemFormId="false" :type="2" />
        </a-form-item>
        <Refresh v-if="activeData.appPropsApi" :refresh="activeData.appRefresh" />
      </template>
    </template>
    <json-modal @register="registerJson" @change="handleRefreshData" />
  </a-collapse-panel>
</template>
<script lang="ts" setup>
  import { dataTypeList } from '../helper/dataMap';
  import { InterfaceModal } from '@/components/CommonModal';
  import { useModal } from '@/components/Modal';
  import { SelectInterfaceBtn } from '@/components/Interface';
  import Refresh from './RRefresh.vue';
  import JsonModal from './RJsonModal.vue';

  const props = defineProps(['activeData', 'showType', 'mapOptions']);
  const [registerJson, { openModal: openJsonModal }] = useModal();

  function renderKeyChange() {
    props.activeData.renderKey = +new Date();
  }
  function dataTypeChange() {
    props.activeData.propsApi = '';
    props.activeData.propsName = '';
    props.activeData.templateJson = [];
    renderKeyChange();
  }
  function appDataTypeChange() {
    props.activeData.appPropsApi = '';
    props.activeData.appPropsName = '';
    props.activeData.appTemplateJson = [];
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
  function onAppPropsApiChange(val, item) {
    if (val) {
      props.activeData.appPropsApi = val;
      props.activeData.appPropsName = item.fullName;
      props.activeData.appRefresh.autoRefresh = false;
      props.activeData.appTemplateJson = item.parameterJson ? JSON.parse(item.parameterJson).map(o => ({ ...o, relationField: '', sourceType: 2 })) : [];
    } else {
      props.activeData.appPropsApi = '';
      props.activeData.appPropsName = '';
      props.activeData.appTemplateJson = [];
    }
    renderKeyChange();
  }
  function showData(val) {
    openJsonModal(true, { value: JSON.stringify(val) });
  }
  function handleRefreshData(data) {
    props.activeData.option = data ? JSON.parse(data) : [];
    renderKeyChange();
  }
</script>
