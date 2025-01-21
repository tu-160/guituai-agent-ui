<template>
  <a-button class="!w-full" @click="openSelectModal">设置</a-button>
  <a-modal
    class="interface-template-json-modal"
    v-model:open="visible"
    title="参数设置"
    :width="600"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
    centered>
    <template #closeIcon>
      <ModalClose :canFullscreen="false" @cancel="handleCancel" />
    </template>
    <div class="future-content-wrapper">
      <a-table
        class="w-full"
        :data-source="templateJson"
        :columns="templateJsonColumns"
        size="small"
        :pagination="false"
        :scroll="{ x: 'max-content', y: 'calc(40vh - 39px)' }">
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
              :options="fieldOptions"
              allowClear
              showSearch
              :fieldNames="{ label: showFieldFullLabel ? 'label' : 'fullName', options: 'options1' }"
              :optionLabelProp="showFieldFullLabel ? 'label' : 'fullName'"
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
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
  import { Modal as AModal } from 'ant-design-vue';
  import { ref, computed, unref } from 'vue';
  import ModalClose from '@/components/Modal/src/components/ModalClose.vue';
  import { interfaceSystemOptions, templateJsonColumns, sourceTypeOptions } from '@/components/FlowProcess/src/helper/define';

  defineOptions({ inheritAttrs: false });
  const props = defineProps({
    // 参数json
    templateJson: { type: Array, default: [] },
    // 字段options
    fieldOptions: { type: Array, default: [] },
    // 参数来源类型 1：全部参数来源  2：参数来源不显示字段  3:参数来源不显示系统变量
    type: { type: Number, default: 1 },
    // 系统字段显示表单id
    showSystemFormId: { type: Boolean, default: true },
    // 系统字段显示完整名称
    showSystemFullLabel: { type: Boolean, default: false },
    showFieldFullLabel: { type: Boolean, default: false },
  });
  const emit = defineEmits(['update:value', 'change', 'fieldChange']);
  const visible = ref(false);

  const getSystemFieldOptions = computed(() => {
    const option = interfaceSystemOptions.map(o => ({ ...o, label: o.fullName ? o.id + '(' + o.fullName + ')' : o.id }));
    return props.showSystemFormId ? option : option.filter(o => o.id != '@formId');
  });
  const getSourceTypeOptions = computed(() => {
    return props.type == 2 ? sourceTypeOptions.filter(o => o.id != 1) : props.type == 3 ? sourceTypeOptions.filter(o => o.id != 4) : sourceTypeOptions;
  });
  const getNotNullSourceTypeOptions = computed(() => unref(getSourceTypeOptions).filter(o => o.id != 3));

  function openSelectModal() {
    visible.value = true;
  }
  function handleCancel() {
    visible.value = false;
  }
  function onFieldChange(e, row) {
    emit('fieldChange', e, row);
  }
  function handleSubmit() {
    handleCancel();
  }
  function onSourceTypeChange(record) {
    record.relationField = record.sourceType == 4 ? unref(getSystemFieldOptions)[0]?.id : '';
  }
</script>
