<template>
  <a-form-item label="弹窗标题" v-if="futureKey === 'popupSelect'">
    <a-input v-model:value="activeData.popupTitle" placeholder="请输入" />
  </a-form-item>
  <a-form-item label="弹窗类型" v-if="futureKey === 'popupSelect' && showType === 'pc'">
    <future-select v-model:value="activeData.popupType" placeholder="请选择" :options="popupTypeOptions" />
  </a-form-item>
  <a-form-item label="弹窗宽度" v-if="futureKey === 'popupSelect' && showType === 'pc'">
    <a-select v-model:value="activeData.popupWidth" placeholder="请选择">
      <a-select-option v-for="item in popupWidthOptions" :key="item" :value="item">{{ item }}</a-select-option>
    </a-select>
  </a-form-item>
  <a-form-item label="远端数据">
    <interface-modal :value="activeData.interfaceId" :title="activeData.interfaceName" :sourceType="2" popupTitle="远端数据" @change="onInterfaceIdChange" />
  </a-form-item>
  <a-form-item label="存储字段">
    <a-auto-complete
      v-model:value="activeData.propsValue"
      placeholder="请输入"
      :options="options"
      @focus="onFocus(activeData.propsValue)"
      @search="debounceOnSearch(activeData.propsValue)" />
  </a-form-item>
  <a-form-item label="显示字段">
    <a-auto-complete
      v-model:value="activeData.relationField"
      placeholder="请输入"
      :options="options"
      @focus="onFocus(activeData.relationField)"
      @search="debounceOnSearch(activeData.relationField)" />
  </a-form-item>
  <a-form-item v-if="futureKey === 'popupSelect'">
    <template #label>填充字段<BasicHelp text="选择数据后，将远端数据的字段值填充到当前表单字段，不支持代码生成。" /></template>
    <a-button block @click="handleTransferRules()">{{ activeData.__config__.transferList?.length ? '编辑填充规则' : '填充规则配置' }}</a-button>
  </a-form-item>
  <a-form-item label="参数设置" v-if="activeData.templateJson?.length">
    <select-interface-btn :templateJson="activeData.templateJson" :fieldOptions="formFieldsOptions" :type="3" @fieldChange="onRelationFieldChange" />
  </a-form-item>
  <a-divider>列表字段</a-divider>
  <div class="options-list">
    <draggable v-model="activeData.columnOptions" :animation="300" group="selectItem" handle=".option-drag" itemKey="uuid">
      <template #item="{ element, index }">
        <div class="select-item">
          <div class="select-line-icon option-drag">
            <i class="icon-ym icon-ym-darg" />
          </div>
          <a-input v-model:value="element.label" placeholder="列名" />
          <a-auto-complete
            v-model:value="element.value"
            placeholder="字段"
            :options="options"
            @focus="onFocus(element.value)"
            @search="debounceOnSearch(element.value)" />
          <div class="close-btn select-line-icon" @click="activeData.columnOptions.splice(index, 1)">
            <i class="icon-ym icon-ym-btn-clearn" />
          </div>
        </div>
      </template>
    </draggable>
    <div class="add-btn">
      <a-button type="link" preIcon="icon-ym icon-ym-btn-add" @click="addSelectItem">添加字段</a-button>
    </div>
  </div>
  <a-divider>列表分页</a-divider>
  <a-form-item label="分页设置">
    <a-switch v-model:checked="activeData.hasPage" :disabled="!!activeData.interfaceHasPage && activeData.hasPage" />
  </a-form-item>
  <a-form-item label="分页条数" v-if="activeData.hasPage">
    <future-radio v-model:value="activeData.pageSize" :options="pageSizeOptions" optionType="button" button-style="solid" class="right-radio" />
  </a-form-item>
  <a-divider></a-divider>
  <a-form-item label="能否清空">
    <a-switch v-model:checked="activeData.clearable" />
  </a-form-item>
  <a-form-item label="能否多选" v-if="futureKey === 'popupTableSelect'">
    <a-switch v-model:checked="activeData.multiple" @change="onMultipleChange" />
  </a-form-item>
  <RuleModal @register="registerModal" @change="onRuleChange" />
</template>
<script lang="ts" setup>
  import { computed, unref } from 'vue';
  import draggable from 'vuedraggable';
  import { useDynamic } from '../hooks/useDynamic';
  import { useField } from '../hooks/useField';
  import { InterfaceModal } from '@/components/CommonModal';
  import { onMounted } from 'vue';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useModal } from '@/components/Modal';
  import RuleModal from './RRelationForm/RuleModal.vue';
  import { SelectInterfaceBtn } from '@/components/Interface';

  defineOptions({ inheritAttrs: false });
  const { createMessage } = useMessage();
  const [registerModal, { openModal }] = useModal();
  const props = defineProps(['activeData', 'dicOptions']);
  const futureKey = computed(() => unref(props.activeData).__config__?.futureKey);
  const { options, allOptions, debounceOnSearch, onFocus, initFieldData } = useField(props.activeData);
  const { showType, formFieldsOptions, formFieldsSelectOptions, onRelationFieldChange, onMultipleChange } = useDynamic(props.activeData);

  const popupTypeOptions = [
    { id: 'dialog', fullName: '居中弹窗' },
    { id: 'drawer', fullName: '右侧弹窗' },
  ];
  const popupWidthOptions = ['600px', '800px', '1000px', '40%', '50%', '60%', '70%', '80%'];
  const pageSizeOptions = [
    { id: 20, fullName: '20条' },
    { id: 50, fullName: '50条' },
    { id: 80, fullName: '80条' },
    { id: 100, fullName: '100条' },
  ];

  function onInterfaceIdChange(val, row) {
    props.activeData.__config__.transferList = [];
    props.activeData.columnOptions = [];
    if (!val) {
      props.activeData.interfaceId = '';
      props.activeData.interfaceName = '';
      props.activeData.templateJson = [];
      props.activeData.interfaceHasPage = 0;
      props.activeData.__config__.defaultValue = '';
      initFieldData();
      return;
    }
    if (props.activeData.interfaceId === val) return;
    props.activeData.interfaceId = val;
    props.activeData.interfaceName = row.fullName;
    props.activeData.templateJson = row.parameterJson ? JSON.parse(row.parameterJson).map(o => ({ ...o, relationField: '', sourceType: 1 })) : [];
    props.activeData.__config__.defaultValue = '';
    props.activeData.interfaceHasPage = row.hasPage;
    if (row.hasPage) props.activeData.hasPage = true;
    initFieldData();
  }
  function addSelectItem() {
    props.activeData.columnOptions.push({
      value: '',
      label: '',
    });
  }
  function handleTransferRules() {
    if (!props.activeData.interfaceId) return createMessage.warning('请先选择远端数据');
    openModal(true, {
      transferList: props.activeData.__config__.transferList,
      fieldOptions: allOptions,
      formFieldsOptions: unref(formFieldsSelectOptions).filter(o => isSameSource(o)),
      type: 'popupSelect',
    });
  }
  function isSameSource(data) {
    const isSubTable = props.activeData.__config__.isSubTable;
    if (isSubTable) return data.__config__.isSubTable && props.activeData.__config__.parentVModel === data.__config__.parentVModel;
    return !data.__config__.isSubTable;
  }
  function onRuleChange(data) {
    props.activeData.__config__.transferList = data;
  }

  onMounted(() => initFieldData());
</script>
