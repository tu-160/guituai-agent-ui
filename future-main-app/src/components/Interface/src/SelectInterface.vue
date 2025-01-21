<template>
  <interface-modal :value="value" :title="title" v-bind="$attrs" @change="onInterfaceChange" />
  <div class="ant-form-item-label mt-12px"><label class="ant-form-item-no-colon">参数设置:</label></div>
  <a-table :data-source="templateJson" :columns="templateJsonColumns" size="small" :pagination="false">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'field'">
        <span class="required-sign">{{ record.required ? '*' : '' }}</span>
        {{ record.field }}{{ record.fieldName ? '(' + record.fieldName + ')' : '' }}
      </template>
      <template v-if="column.key === 'sourceType'">
        <future-select
          v-if="record.required"
          v-model:value="record.sourceType"
          :options="getNotNullSourceTypeOptions"
          class="!w-100px"
          @change="onSourceTypeChange(record)" />
        <future-select v-else v-model:value="record.sourceType" :options="getSourceTypeOptions" class="!w-100px" @change="onSourceTypeChange(record)" />
      </template>
      <template v-if="column.key === 'relationField'">
        <future-select
          v-model:value="record.relationField"
          :options="record.required && isFlow ? requiredFieldOptions : fieldOptions"
          allowClear
          showSearch
          :fieldNames="{ label: 'label', options: 'options1' }"
          optionLabelProp="label"
          class="!w-204px"
          @change="onFieldChange($event, record)"
          v-if="record.sourceType === 1" />
        <template v-else-if="record.sourceType === 2">
          <future-input-number v-if="['int', 'decimal'].includes(record.dataType)" v-model:value="record.relationField" placeholder="请输入" clearable />
          <future-date-picker
            v-else-if="record.dataType == 'datetime'"
            class="!w-full"
            v-model:value="record.relationField"
            placeholder="请选择"
            format="YYYY-MM-DD HH:mm:ss"
            clearable />
          <a-input v-else v-model:value="record.relationField" placeholder="请输入" clearable />
        </template>
        <future-select
          v-model:value="record.relationField"
          :options="getSystemFieldOptions"
          :fieldNames="{ label: showSystemFullLabel ? 'label' : 'fullName', options: 'options1' }"
          :optionLabelProp="showSystemFullLabel ? 'label' : 'fullName'"
          allowClear
          class="!w-204px"
          v-else-if="record.sourceType === 4" />
      </template>
    </template>
    <template #emptyText>
      <p class="leading-60px">暂无数据</p>
    </template>
  </a-table>
</template>
<script lang="ts" setup>
  import { computed, unref } from 'vue';
  import { InterfaceModal } from '@/components/CommonModal';
  import { interfaceSystemOptions, templateJsonColumns, sourceTypeOptions } from '@/components/FlowProcess/src/helper/define';

  const props = defineProps({
    value: { type: String, default: '' },
    title: { type: String, default: '' },
    // 参数json
    templateJson: { type: Array, default: [] },
    // 字段options
    fieldOptions: { type: Array, default: [] },
    // 参数来源类型 1：全部参数来源  2：参数来源不显示字段  3:参数来源不显示系统变量
    type: { type: Number, default: 1 },
    // 是否流程
    isFlow: { type: Boolean, default: false },
    // 系统字段显示表单id
    showSystemFormId: { type: Boolean, default: true },
    // 系统字段显示完整名称
    showSystemFullLabel: { type: Boolean, default: false },
  });
  const emit = defineEmits(['update:value', 'change', 'fieldChange']);

  const getSourceTypeOptions = computed(() => {
    return props.type == 2 ? sourceTypeOptions.filter(o => o.id != 1) : props.type == 3 ? sourceTypeOptions.filter(o => o.id != 4) : sourceTypeOptions;
  });
  const getNotNullSourceTypeOptions = computed(() => unref(getSourceTypeOptions).filter(o => o.id != 3));
  const getSystemFieldOptions = computed(() => {
    const systemFieldOptions_ = [
      { id: '@flowId', fullName: '流程ID', label: '@flowId(流程ID)' },
      { id: '@taskId', fullName: '任务ID', label: '@taskId(任务ID)' },
      { id: '@taskNodeId', fullName: '节点ID', label: '@taskNodeId(节点ID)' },
      { id: '@flowFullName', fullName: '流程名称', label: '@flowFullName(流程名称)' },
      { id: '@taskFullName', fullName: '任务标题', label: '@taskFullName(任务标题)' },
      { id: '@launchUserId', fullName: '发起用户ID', label: '@launchUserId(发起用户ID)' },
      { id: '@launchUserName', fullName: '发起用户名', label: '@launchUserName(发起用户名)' },
      { id: '@flowOperatorUserId', fullName: '当前操作用户ID', label: '@flowOperatorUserId(当前操作用户ID)' },
      { id: '@flowOperatorUserName', fullName: '当前操作用户名', label: '@flowOperatorUserName(当前操作用户名)' },
    ];
    if (props.isFlow) return systemFieldOptions_;
    let systemFieldOptions = interfaceSystemOptions;
    return props.showSystemFormId ? systemFieldOptions : systemFieldOptions.filter(o => o.id != '@formId');
  });
  // 必填字段
  const requiredFieldOptions = computed(() => {
    const options: any[] = (props.fieldOptions as any[]).filter(o => o.__config__ && o.__config__.required);
    return options.map(o => ({ ...o, label: o.fullName ? o.id + '(' + o.fullName + ')' : o.id }));
  });

  function onInterfaceChange(selectId, selectRow) {
    emit('update:value', selectId);
    emit('change', selectId, selectRow);
  }
  function onFieldChange(e, row) {
    emit('fieldChange', e, row);
  }
  function onSourceTypeChange(record) {
    record.relationField = record.sourceType == 4 ? unref(getSystemFieldOptions)[0]?.id : '';
  }
</script>
