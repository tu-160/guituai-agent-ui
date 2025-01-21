<template>
  <a-form-item label="格式">
    <future-select v-model:value="activeData.format" placeholder="请选择" :options="formatOptions" @change="onFormatChange" />
  </a-form-item>
  <a-form-item label="默认值">
    <future-date-picker
      v-model:value="activeData.__config__.defaultValue"
      placeholder="请选择"
      :format="activeData.format"
      :startTime="activeData.startTime"
      :endTime="activeData.endTime"
      :disabled="activeData.__config__.defaultCurrent" />
    <a-checkbox v-model:checked="activeData.__config__.defaultCurrent" class="!mt-10px" @change="resetValue">默认为当前系统时间</a-checkbox>
  </a-form-item>
  <a-divider>规则</a-divider>
  <a-form-item>
    <template #label>
      开始时间<BasicHelp :text="['系统会限制填写者填写此字段的当天起始日期范围（包含该日期）。', '该功能不做有效性验证，请自行保证。']" />
    </template>
    <a-switch v-model:checked="activeData.__config__.startTimeRule" @change="onStartTimeRuleChange" />
  </a-form-item>
  <template v-if="activeData.__config__.startTimeRule">
    <a-form-item label="类型">
      <future-select v-model:value="activeData.__config__.startTimeType" placeholder="请选择" :options="typeOptions" @change="onStartTimeTypeChange" />
      <div class="mt-10px">
        <template v-if="activeData.__config__.startTimeType == 1">
          <future-date-picker
            v-model:value="activeData.__config__.startTimeValue"
            placeholder="请选择"
            :format="activeData.format"
            @change="onStartTimeValueChange" />
        </template>
        <template v-else-if="activeData.__config__.startTimeType == 2">
          <future-select v-model:value="activeData.__config__.startRelationField" placeholder="请选择" :options="formFieldsOptions" />
        </template>
        <template v-else-if="activeData.__config__.startTimeType == 4 || activeData.__config__.startTimeType == 5">
          <a-input-number v-model:value="activeData.__config__.startTimeValue" :min="1" :precision="0" @change="onStartValueChange">
            <template #addonAfter>
              <future-select v-model:value="activeData.__config__.startTimeTarget" :options="getUnitOptions" class="!w-60px" />
            </template>
          </a-input-number>
        </template>
      </div>
    </a-form-item>
  </template>
  <a-form-item>
    <template #label>
      结束时间<BasicHelp :text="['系统会限制填写者填写此字段的当天起始日期范围（包含该日期）。', '该功能不做有效性验证，请自行保证。']" />
    </template>
    <a-switch v-model:checked="activeData.__config__.endTimeRule" @change="onEndTimeRuleChange" />
  </a-form-item>
  <template v-if="activeData.__config__.endTimeRule">
    <a-form-item label="类型">
      <future-select v-model:value="activeData.__config__.endTimeType" placeholder="请选择" :options="typeOptions" @change="onEndTimeTypeChange" />
      <div class="mt-10px">
        <template v-if="activeData.__config__.endTimeType == 1">
          <future-date-picker
            v-model:value="activeData.__config__.endTimeValue"
            placeholder="请选择"
            :format="activeData.format"
            @change="onEndTimeValueChange" />
        </template>
        <template v-else-if="activeData.__config__.endTimeType == 2">
          <future-select v-model:value="activeData.__config__.endRelationField" placeholder="请选择" :options="formFieldsOptions" />
        </template>
        <template v-else-if="activeData.__config__.endTimeType == 4 || activeData.__config__.endTimeType == 5">
          <a-input-number v-model:value="activeData.__config__.endTimeValue" :min="1" :precision="0" @change="onEndValueChange">
            <template #addonAfter>
              <future-select v-model:value="activeData.__config__.endTimeTarget" :options="getUnitOptions" class="!w-60px" />
            </template>
          </a-input-number>
        </template>
      </div>
    </a-form-item>
  </template>
  <a-form-item label="能否清空">
    <a-switch v-model:checked="activeData.clearable" />
  </a-form-item>
</template>
<script lang="ts" setup>
  import { computed, unref } from 'vue';

  defineOptions({ inheritAttrs: false });
  const props = defineProps(['activeData', 'drawingList']);
  const formatOptions = [
    { id: 'yyyy', fullName: 'yyyy' },
    { id: 'yyyy-MM', fullName: 'yyyy-MM' },
    { id: 'yyyy-MM-dd', fullName: 'yyyy-MM-dd' },
    { id: 'yyyy-MM-dd HH:mm', fullName: 'yyyy-MM-dd HH:mm' },
    { id: 'yyyy-MM-dd HH:mm:ss', fullName: 'yyyy-MM-dd HH:mm:ss' },
  ];
  const typeOptions = [
    { id: 1, fullName: '特定时间' },
    { id: 2, fullName: '表单字段' },
    { id: 3, fullName: '填写当前时间' },
    { id: 4, fullName: '当前时间前' },
    { id: 5, fullName: '当前时间后' },
  ];

  const getUnitOptions = computed(() => {
    if (props.activeData.format === 'YYYY') return [{ id: 1, fullName: '年' }];
    if (props.activeData.format === 'YYYY-MM') {
      return [
        { id: 1, fullName: '年' },
        { id: 2, fullName: '月' },
      ];
    }
    return [
      { id: 1, fullName: '年' },
      { id: 2, fullName: '月' },
      { id: 3, fullName: '日' },
    ];
  });
  const formFieldsOptions = computed(() => {
    let list: any[] = [];
    const loop = (data, parent?) => {
      if (!data) return;
      if (data.__config__ && isIncludesTable(data) && data.__config__.children && Array.isArray(data.__config__.children)) {
        loop(data.__config__.children, data);
      }
      if (Array.isArray(data)) data.forEach(d => loop(d, parent));
      if (data.__vModel__ && data.__config__.futureKey === 'datePicker' && data.__vModel__ !== props.activeData.__vModel__) {
        const isTableChild = parent && parent.__config__ && parent.__config__.futureKey === 'table';
        list.push({
          id: isTableChild ? parent.__vModel__ + '-' + data.__vModel__ : data.__vModel__,
          fullName: isTableChild ? parent.__config__.label + '-' + data.__config__.label : data.__config__.label,
          ...data,
        });
      }
    };
    loop(props.drawingList);
    return list;
  });

  function isIncludesTable(data) {
    if ((!data.__config__.layout || data.__config__.layout === 'rowFormItem') && data.__config__.futureKey !== 'table') return true;
    if (props.activeData.__config__.isSubTable) return props.activeData.__config__.parentVModel === data.__vModel__;
    return data.__config__.futureKey !== 'table';
  }
  function onFormatChange() {
    resetValue();
    const startBoo = unref(getUnitOptions).some(o => o.id === props.activeData.__config__.startTimeTarget);
    if (!startBoo) props.activeData.__config__.startTimeTarget = 1;
    const endBoo = unref(getUnitOptions).some(o => o.id === props.activeData.__config__.endTimeTarget);
    if (!endBoo) props.activeData.__config__.endTimeTarget = 1;
  }
  function resetValue() {
    props.activeData.__config__.defaultValue = null;
  }
  function onStartTimeRuleChange() {
    props.activeData.startTime = null;
    props.activeData.__config__.startTimeType = 1;
    props.activeData.__config__.startTimeTarget = 1;
    props.activeData.__config__.startTimeValue = null;
    props.activeData.__config__.startRelationField = '';
  }
  function onStartTimeTypeChange(val) {
    props.activeData.startTime = null;
    props.activeData.__config__.startTimeTarget = 1;
    props.activeData.__config__.startTimeValue = val == 4 || val == 5 ? 1 : null;
    props.activeData.__config__.startRelationField = '';
  }
  function onStartTimeValueChange(val) {
    props.activeData.startTime = val;
  }
  function onEndTimeRuleChange() {
    props.activeData.endTime = null;
    props.activeData.__config__.endTimeType = 1;
    props.activeData.__config__.endTimeTarget = 1;
    props.activeData.__config__.endTimeValue = null;
    props.activeData.__config__.endRelationField = '';
  }
  function onEndTimeTypeChange(val) {
    props.activeData.startTime = null;
    props.activeData.__config__.endTimeTarget = 1;
    props.activeData.__config__.endTimeValue = val == 4 || val == 5 ? 1 : null;
    props.activeData.__config__.endRelationField = '';
  }
  function onEndTimeValueChange(val) {
    props.activeData.endTime = val;
  }
  function onStartValueChange(val) {
    if (!val) props.activeData.__config__.startTimeValue = 1;
  }
  function onEndValueChange(val) {
    if (!val) props.activeData.__config__.endTimeValue = 1;
  }
</script>
