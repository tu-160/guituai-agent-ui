<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="组件属性配置" @ok="handleSubmit" destroyOnClose class="extra-config-modal">
    <div class="extra-config-modal-body" :style="{ 'min-height': activeData.futureKey === 'select' ? '300px' : '150px' }">
      <a-form :colon="false" labelAlign="left" :labelCol="{ style: { width: '90px' } }" class="right-board-form">
        <template v-if="activeData.futureKey === 'select'">
          <a-form-item label="数据来源">
            <future-radio
              v-model:value="activeData.__config__.dataType"
              :options="dataTypeOptions"
              optionType="button"
              buttonStyle="solid"
              @change="onDataTypeChange" />
          </a-form-item>
          <div class="options-list" v-if="activeData.__config__.dataType === 'static'">
            <draggable v-model="activeData.options" :animation="300" group="selectItem" handle=".option-drag" itemKey="uuid">
              <template #item="{ element, index }">
                <div class="select-item">
                  <div class="select-line-icon option-drag">
                    <i class="icon-ym icon-ym-darg" />
                  </div>
                  <a-input v-model:value="element.fullName" placeholder="选项名" />
                  <a-input v-model:value="element.id" placeholder="选项值" />
                  <div class="close-btn select-line-icon" @click="activeData.options.splice(index, 1)">
                    <i class="icon-ym icon-ym-btn-clearn" />
                  </div>
                </div>
              </template>
            </draggable>
          </div>
          <div class="add-btn" v-if="activeData.__config__.dataType === 'static'">
            <a-button type="link" preIcon="icon-ym icon-ym-btn-add" @click="addSelectItem" class="!px-0">添加选项</a-button>
            <a-divider type="vertical"></a-divider>
            <a-button type="link" @click="openModal(true, { options: activeData.options })" class="!px-0">批量编辑</a-button>
          </div>
          <div v-if="activeData.__config__.dataType === 'dictionary'">
            <a-form-item label="数据字典">
              <future-tree-select
                :options="dicOptions"
                v-model:value="activeData.__config__.dictionaryType"
                placeholder="请选择"
                lastLevel
                allowClear
                @change="onDictionaryTypeChange" />
            </a-form-item>
            <a-form-item label="存储字段">
              <future-select v-model:value="activeData.props.value" placeholder="请选择" :options="valueOptions" />
            </a-form-item>
          </div>
          <div v-if="activeData.__config__.dataType === 'dynamic'">
            <a-form-item label="远端数据">
              <interface-modal
                :value="activeData.__config__.propsUrl"
                :title="activeData.__config__.propsName"
                popupTitle="远端数据"
                @change="onPropsUrlChange" />
            </a-form-item>
            <a-form-item label="存储字段">
              <a-auto-complete
                v-model:value="activeData.props.value"
                placeholder="请输入"
                :options="options"
                @focus="onFocus(activeData.props.value)"
                @search="debounceOnSearch(activeData.props.value)" />
            </a-form-item>
            <a-form-item label="显示字段">
              <a-auto-complete
                v-model:value="activeData.props.label"
                placeholder="请输入"
                :options="options"
                @focus="onFocus(activeData.props.label)"
                @search="debounceOnSearch(activeData.props.label)" />
            </a-form-item>
          </div>
        </template>
        <a-form-item label="日期类型" v-if="activeData.futureKey === 'datePicker'">
          <future-select v-model:value="activeData.format" placeholder="请选择" :options="dateFormatOptions" />
        </a-form-item>
        <a-form-item label="时间类型" v-if="activeData.futureKey === 'timePicker'">
          <future-select v-model:value="activeData.format" placeholder="请选择" :options="timeFormatOptions" />
        </a-form-item>
        <a-form-item label="" v-if="['organizeSelect', 'depSelect', 'userSelect'].includes(activeData.futureKey)">
          <a-checkbox v-model:checked="activeData.isIncludeSubordinate">
            查询当前{{ activeData.futureKey === 'organizeSelect' ? '组织及子组织' : activeData.futureKey === 'depSelect' ? '部门及子部门' : '用户及下属' }}
          </a-checkbox>
        </a-form-item>
      </a-form>
      <BatchOperate @register="registerBatchOperate" @confirm="onBatchOperateConfirm" />
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { getDictionaryTypeSelector } from '@/api/systemData/dictionary';
  import { getDataInterfaceInfo } from '@/api/systemData/dataInterface';
  import { reactive, toRefs } from 'vue';
  import { BasicModal, useModal, useModalInner } from '@/components/Modal';
  import { cloneDeep } from 'lodash-es';
  import draggable from 'vuedraggable';
  import { buildBitUUID } from '@/utils/uuid';
  import { InterfaceModal } from '@/components/CommonModal';
  import BatchOperate from '@/components/FormGenerator/src/rightComponents/components/BatchOperate.vue';
  import { useDebounceFn } from '@vueuse/core';

  interface State {
    activeData: any;
    dicOptions: any[];
    options: any[];
    allOptions: any[];
  }

  const emit = defineEmits(['register', 'confirm']);
  const dataTypeOptions = [
    { id: 'static', fullName: '静态数据' },
    { id: 'dictionary', fullName: '数据字典' },
    { id: 'dynamic', fullName: '远端数据' },
  ];
  const valueOptions = [
    { id: 'id', fullName: 'id' },
    { id: 'enCode', fullName: 'enCode' },
  ];
  const dateFormatOptions = [
    { id: 'yyyy', fullName: 'yyyy' },
    { id: 'yyyy-MM', fullName: 'yyyy-MM' },
    { id: 'yyyy-MM-dd', fullName: 'yyyy-MM-dd' },
    { id: 'yyyy-MM-dd HH:mm', fullName: 'yyyy-MM-dd HH:mm' },
    { id: 'yyyy-MM-dd HH:mm:ss', fullName: 'yyyy-MM-dd HH:mm:ss' },
  ];
  const timeFormatOptions = [
    { id: 'HH:mm:ss', fullName: 'HH:mm:ss' },
    { id: 'HH:mm', fullName: 'HH:mm' },
  ];
  const state = reactive<State>({
    activeData: {
      __config__: {},
    },
    dicOptions: [],
    options: [],
    allOptions: [],
  });
  const { activeData, dicOptions, options } = toRefs(state);
  const [registerModal, { closeModal }] = useModalInner(init);
  const [registerBatchOperate, { openModal }] = useModal();

  const onDataTypeChange = () => {
    state.activeData.options = [];
    state.activeData.props.value = 'id';
    state.activeData.props.label = 'fullName';
    if (Reflect.has(state.activeData.props, 'children')) state.activeData.props.children = 'children';
    state.activeData.__config__.dictionaryType = '';
    state.activeData.__config__.propsUrl = '';
    state.activeData.__config__.propsName = '';
    state.activeData.__config__.templateJson = [];
  };
  const onDictionaryTypeChange = () => {
    state.activeData.options = [];
  };
  const onPropsUrlChange = (val, row) => {
    state.activeData.options = [];
    if (!val) {
      state.activeData.__config__.propsUrl = '';
      state.activeData.__config__.propsName = '';
      state.activeData.__config__.templateJson = [];
      state.options = [];
      state.allOptions = [];
      return;
    }
    if (state.activeData.__config__.propsUrl === val) return;
    const list = row.parameterJson ? JSON.parse(row.parameterJson) : [];
    state.activeData.__config__.propsUrl = val;
    state.activeData.__config__.propsName = row.fullName;
    state.activeData.__config__.templateJson = list.map(o => ({ ...o, relationField: '' }));
    initFieldData();
  };
  const addSelectItem = () => {
    const uuid = buildBitUUID();
    state.activeData.options.push({
      fullName: '选项' + uuid,
      id: uuid,
    });
  };
  const onBatchOperateConfirm = options => {
    state.activeData.options = options;
  };
  const debounceOnSearch = useDebounceFn(onSearch, 300);

  function onSearch(searchText: string) {
    state.options = state.allOptions.filter(o => o.value.toLowerCase().indexOf(searchText.toLowerCase()) !== -1);
  }
  function onFocus(searchText) {
    onSearch(searchText);
  }
  function initFieldData() {
    if (state.activeData.__config__.dataType !== 'dynamic' || !state.activeData.__config__.propsUrl) return (state.allOptions = []);
    getDataInterfaceInfo(state.activeData.__config__.propsUrl).then(res => {
      const data = res.data;
      let list = data.fieldJson ? JSON.parse(data.fieldJson) : [];
      state.allOptions = list.map(o => ({ ...o, value: o.defaultValue }));
    });
  }
  function init(data) {
    state.activeData = cloneDeep(data);
    if (data.futureKey === 'select') {
      getDicOptions();
      initFieldData();
    }
  }
  function getDicOptions() {
    getDictionaryTypeSelector().then(res => {
      state.dicOptions = res.data.list;
    });
  }
  function handleSubmit() {
    emit('confirm', state.activeData);
    closeModal();
  }
</script>
<style lang="less" scoped>
  .extra-config-modal {
    .extra-config-modal-body {
      min-height: 150px;
      padding-bottom: 20px;

      .options-list {
        max-height: 200px;
        overflow-y: auto;
        margin-bottom: -10px;
        .scrollbar__wrap {
          margin-bottom: 0 !important;
        }
        .select-item {
          display: flex;
          border: 1px dashed @component-background;
          box-sizing: border-box;
          & .ant-input + .ant-input {
            margin-left: 4px;
          }
          .ant-select {
            width: 100%;
          }
          & + .select-item {
            margin-top: 4px;
          }
          &.sortable-chosen {
            border: 1px dashed @primary-color;
          }
          .select-line-icon {
            line-height: 31px;
            font-size: 22px;
            padding: 0 4px;
            color: #606266;
            .icon-ym-darg {
              font-size: 20px;
              line-height: 31px;
              display: inline-block;
            }
            .icon-ym-btn-clearn {
              font-size: 18px;
            }
          }
          .close-btn {
            cursor: pointer;
            color: @error-color;
            height: 32px;
            display: flex;
            align-items: center;
          }
          .option-drag {
            cursor: move;
          }
        }

        .future-tree__name {
          width: calc(100% - 60px);
        }
      }
      .add-btn {
        padding-left: 27px;
        margin-top: 10px;
      }
    }
  }
</style>
