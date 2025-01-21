<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="设置条件" :width="800" @ok="handleSubmit" destroyOnClose class="future-condition-modal">
    <div class="condition-main">
      <div class="mb-10px" v-if="conditions?.length">
        <future-radio v-model:value="matchLogic" :options="logicOptions" optionType="button" button-style="solid" />
      </div>
      <div class="condition-item" v-for="(item, index) in conditions" :key="index">
        <div class="condition-item-title">
          <div>条件组</div>
          <i class="icon-ym icon-ym-nav-close" @click="delGroup(index)"></i>
        </div>
        <div class="condition-item-content">
          <div class="condition-item-cap">
            以下条件全部执行：
            <future-radio v-model:value="item.logic" :options="logicOptions" optionType="button" button-style="solid" size="small" />
          </div>
          <a-row :gutter="8" v-for="(child, childIndex) in item.groups" :key="index + childIndex" class="mb-10px">
            <a-col :span="3" class="!flex items-center">
              <future-select v-model:value="child.fieldType" :options="conditionTypeOptions" @change="onFieldTypeChange(child)" />
            </a-col>
            <a-col :span="5" class="!flex items-center">
              <future-select
                v-model:value="child.field"
                :options="usedFormItems"
                allowClear
                showSearch
                :fieldNames="{ options: 'options1' }"
                class="!flex-1"
                @change="(val, data) => onFieldChange(child, val, data, index, childIndex)"
                v-if="child.fieldType === 1" />
              <a-button @click="editFormula(child, index, childIndex)" class="!flex-1" v-if="child.fieldType === 3">公式编辑</a-button>
            </a-col>
            <a-col :span="4">
              <future-select class="w-full" v-model:value="child.symbol" :options="symbolOptions" @change="(val, data) => onSymbolChange(child, val, data)" />
            </a-col>
            <a-col :span="4">
              <future-select v-model:value="child.fieldValueType" :options="conditionTypeOptions1" @change="onFieldValueTypeChange(child)" />
            </a-col>
            <a-col :span="7" class="!flex items-center">
              <future-select
                v-model:value="child.fieldValue"
                :options="usedFormItems"
                allowClear
                showSearch
                :fieldNames="{ options: 'options1' }"
                class="flex-1"
                @change="(val, data) => onFieldValueChange(child, val, data)"
                v-if="child.fieldValueType === 1" />
              <div class="flex-1 w-150px" v-if="child.fieldValueType === 2">
                <template v-if="child.futureKey === 'inputNumber'">
                  <a-input-number v-model:value="child.fieldValue" placeholder="请输入" :precision="child.precision" />
                </template>
                <template v-else-if="child.futureKey === 'calculate'">
                  <a-input-number v-model:value="child.fieldValue" placeholder="请输入" :precision="2" />
                </template>
                <template v-else-if="['rate', 'slider'].includes(child.futureKey)">
                  <a-input-number v-model:value="child.fieldValue" placeholder="请输入" />
                </template>
                <template v-else-if="child.futureKey === 'switch'">
                  <future-switch v-model:value="child.fieldValue" />
                </template>
                <template v-else-if="child.futureKey === 'timePicker'">
                  <future-time-picker v-model:value="child.fieldValue" :format="child.format || 'HH:mm:ss'" allowClear />
                </template>
                <template v-else-if="['datePicker', 'createTime', 'modifyTime'].includes(child.futureKey)">
                  <future-date-picker
                    v-model:value="child.fieldValue"
                    :format="child.format || 'YYYY-MM-DD HH:mm:ss'"
                    allowClear
                    @change="onConditionDateChange($event, child)" />
                </template>
                <template v-else-if="['organizeSelect', 'currOrganize'].includes(child.futureKey)">
                  <future-organize-select v-model:value="child.fieldValue" allowClear @change="(val, data) => onConditionOrganizeChange(child, val, data)" />
                </template>
                <template v-else-if="['depSelect'].includes(child.futureKey)">
                  <future-dep-select v-model:value="child.fieldValue" allowClear @change="(val, data) => onConditionObjChange(child, val, data)" />
                </template>
                <template v-else-if="child.futureKey === 'roleSelect'">
                  <future-role-select v-model:value="child.fieldValue" allowClear @change="(val, data) => onConditionObjChange(child, val, data)" />
                </template>
                <template v-else-if="child.futureKey === 'groupSelect'">
                  <future-group-select v-model:value="child.fieldValue" allowClear @change="(val, data) => onConditionObjChange(child, val, data)" />
                </template>
                <template v-else-if="['posSelect', 'currPosition'].includes(child.futureKey)">
                  <future-pos-select v-model:value="child.fieldValue" allowClear @change="(val, data) => onConditionObjChange(child, val, data)" />
                </template>
                <template v-else-if="['userSelect', 'createUser', 'modifyUser'].includes(child.futureKey)">
                  <future-user-select v-model:value="child.fieldValue" hasSys allowClear @change="(val, data) => onConditionObjChange(child, val, data)" />
                </template>
                <template v-else-if="['usersSelect'].includes(child.futureKey)">
                  <future-users-select v-model:value="child.fieldValue" allowClear @change="(val, data) => onConditionObjChange(child, val, data)" />
                </template>
                <template v-else-if="child.futureKey === 'areaSelect'">
                  <future-area-select
                    v-model:value="child.fieldValue"
                    :level="child.level"
                    allowClear
                    @change="(val, data) => onConditionListChange(child, val, data)" />
                </template>
                <template v-else>
                  <a-input v-model:value="child.fieldValue" placeholder="请输入" allowClear />
                </template>
              </div>
              <future-select
                v-model:value="child.fieldValue"
                :options="getSystemFieldOptions"
                :fieldNames="{ label: 'label', options: 'options1' }"
                allowClear
                class="!w-204px"
                v-else-if="child.fieldValueType === 3" />
              <future-select
                v-model:value="child.fieldValue"
                :options="getParameterList"
                :fieldNames="{ label: 'fieldName', value: 'fieldName', options: 'options1' }"
                allowClear
                @change="(val, data) => onConfigurationChange(child, val, data)"
                v-else-if="child.fieldValueType === 4" />
            </a-col>
            <a-col :span="1" class="text-center">
              <i class="icon-ym icon-ym-btn-clearn" @click="delItem(index, childIndex)" />
            </a-col>
          </a-row>
          <span class="link-text inline-block" @click="addItem(index)"><i class="icon-ym icon-ym-btn-add text-14px mr-4px"></i>添加条件</span>
        </div>
      </div>
      <span class="link-text inline-block" @click="addGroup()"><i class="icon-ym icon-ym-btn-add text-14px mr-4px"></i>添加条件组</span>
    </div>
  </BasicModal>
  <FormulaModal @register="registerFormulaModal" @confirm="updateFormula" />
</template>
<script lang="ts" setup>
  import { reactive, computed, toRefs, inject, unref } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { systemFieldOptions, conditionTypeOptions, conditionTypeOptions1, symbolOptions, logicOptions } from '../../helper/define';
  import { cloneDeep } from 'lodash-es';
  import { useModal } from '@/components/Modal';
  import { formatToDateTime } from '@/utils/dateUtil';
  import { useMessage } from '@/hooks/web/useMessage';
  import { isEmpty } from '@/utils/is';
  import FormulaModal from './FormulaModal.vue';

  defineOptions({ inheritAttrs: false });

  interface State {
    conditions: any[];
    formFieldsOptions: any[];
    usedFormItems: any[];
    matchLogic: string;
    activeIndex: number;
    activeChildIndex: number;
  }

  const state = reactive<State>({
    conditions: [],
    formFieldsOptions: [],
    usedFormItems: [],
    matchLogic: 'and',
    activeIndex: 0,
    activeChildIndex: 0,
  });
  const { conditions, usedFormItems, matchLogic } = toRefs(state);
  const emptyChildItem = {
    fieldName: '',
    symbolName: '',
    fieldValue: undefined,
    fieldType: 1,
    fieldValueType: 2,
    fieldLabel: '',
    fieldValueFutureKey: '',
    logicName: '并且',
    field: '',
    symbol: '',
    logic: '&&',
    futureKey: '',
    cellKey: +new Date(),
  };
  const emptyItem = { logic: 'and', groups: [emptyChildItem] };
  const emit = defineEmits(['register', 'confirm']);
  const { createMessage } = useMessage();
  const bpmn: (() => string | undefined) | undefined = inject('bpmn');
  const [registerModal, { closeModal }] = useModalInner(init);
  const [registerFormulaModal, { openModal: openFormulaModal }] = useModal();

  const getBpmn = computed(() => (bpmn as () => any)());
  const getFutureGlobalData = computed(() => {
    const futureData: any = unref(getBpmn).get('futureData');
    return futureData?.getValue('global') || {};
  });
  const getSystemFieldOptions = computed(() => systemFieldOptions.map(o => ({ ...o, label: o.fullName ? o.id + '(' + o.fullName + ')' : o.id })));
  const getParameterList = computed(() => unref(getFutureGlobalData).globalParameterList || []);

  function init(data) {
    state.usedFormItems = data.usedFormItems || [];
    state.formFieldsOptions = data.formFieldsOptions || [];
    state.matchLogic = cloneDeep(data.matchLogic) || 'and';
    state.conditions = cloneDeep(data.conditions) || [];
    if (!state.conditions.length) addGroup();
  }
  function addItem(index) {
    state.conditions[index].groups.push(cloneDeep(emptyChildItem));
  }
  function delItem(index, childIndex) {
    state.conditions[index].groups.splice(childIndex, 1);
    if (!state.conditions[index].groups.length) delGroup(index);
  }
  function addGroup() {
    state.conditions.push(cloneDeep(emptyItem));
  }
  function delGroup(index) {
    state.conditions.splice(index, 1);
  }
  function editFormula(item, index, childIndex) {
    state.activeIndex = index;
    state.activeChildIndex = childIndex;
    openFormulaModal(true, { value: item.field, fieldsOptions: state.formFieldsOptions });
  }
  function updateFormula(formula) {
    state.conditions[state.activeIndex].groups[state.activeChildIndex].field = formula;
    state.conditions[state.activeIndex].groups[state.activeChildIndex].fieldName = formula;
  }
  function onFieldTypeChange(item) {
    item.field = '';
    handleNull(item);
  }
  function onFieldChange(item, val, data, index, childIndex) {
    if (!val) return handleNull(item);
    item.fieldName = data.__config__.label;
    item.futureKey = data.__config__.futureKey;
    const newItem = cloneDeep(emptyChildItem);
    for (let key of Object.keys(newItem)) {
      newItem[key] = item[key];
    }
    item = { ...newItem, ...data };
    if (item.fieldValueType == 2) {
      item.fieldValue = undefined;
      item.fieldLabel = '';
      item.fieldValueFutureKey = '';
    }
    state.conditions[index].groups[childIndex] = item;
  }
  function handleNull(item) {
    item.fieldName = '';
    item.futureKey = '';
    if (item.fieldValueType == 2) {
      item.fieldValue = undefined;
      item.fieldLabel = '';
      item.fieldValueFutureKey = '';
    }
  }
  function onSymbolChange(item, val, data) {
    item.symbolName = val ? data.fullName : '';
  }
  function onFieldValueChange(item, val, data) {
    item.fieldLabel = val ? data.fullName : '';
    item.fieldValueFutureKey = val ? data.__config__.futureKey : '';
  }
  function onFieldValueTypeChange(item) {
    item.fieldValue = '';
    item.fieldLabel = '';
    item.fieldValueFutureKey = '';
  }
  function onConditionDateChange(val, item) {
    if (!val) return (item.fieldLabel = '');
    const format = item.format || 'YYYY-MM-DD HH:mm:ss';
    item.fieldLabel = formatToDateTime(val, format);
  }
  function onConditionListChange(item, val, data) {
    if (!val) return (item.fieldLabel = '');
    const labelList = data.map(o => o.fullName);
    item.fieldLabel = labelList.join('/');
  }
  function onConditionOrganizeChange(item, val, data) {
    if (!val) return (item.fieldLabel = '');
    item.fieldLabel = data.organize || '';
  }
  function onConditionObjChange(item, val, data) {
    if (!val) return (item.fieldLabel = '');
    item.fieldLabel = data.fullName || '';
  }
  function onConfigurationChange(item, val, data) {
    if (!val) return (item.fieldLabel = '');
    item.fieldLabel = data.fieldName || '';
  }
  function exist() {
    let isOk = true;
    for (let i = 0; i < state.conditions.length; i++) {
      const e = state.conditions[i];
      for (let j = 0; j < e.groups.length; j++) {
        const child = e.groups[j];
        if (!child.field) {
          createMessage.warning(child.fieldType == 1 ? '条件字段不能为空' : '条件公式不能为空');
          isOk = false;
          return;
        }
        if (!child.symbol) {
          createMessage.warning('条件符号不能为空');
          isOk = false;
          return;
        }
        if (!['null', 'notNull'].includes(child.symbol) && ((!child.fieldValue && child.fieldValue !== 0) || isEmpty(child.fieldValue))) {
          createMessage.warning('数据值不能为空');
          isOk = false;
          return;
        }
      }
    }
    return isOk;
  }
  function handleSubmit() {
    if (!state.conditions.length) return createMessage.warning('请设置条件组');
    if (!exist()) return false;
    const values = {
      matchLogic: state.matchLogic,
      conditions: cloneDeep(state.conditions),
    };
    emit('confirm', values);
    closeModal();
  }
</script>
