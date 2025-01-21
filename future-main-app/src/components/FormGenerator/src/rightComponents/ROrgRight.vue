<template>
  <a-form-item label="可选范围">
    <future-select v-model:value="activeData.selectType" :options="futureKey === 'userSelect' ? userSelectTypeOptions : selectTypeOptions" @change="onTypeChange" />
    <template v-if="activeData.selectType === 'custom'">
      <template v-if="futureKey === 'organizeSelect'">
        <FutureOrganizeSelect v-model:value="activeData.ableIds" modalTitle="添加组织" buttonType="button" multiple hasSys class="!mt-10px" @change="onChange" />
      </template>
      <template v-if="futureKey === 'depSelect'">
        <FutureDepSelect v-model:value="activeData.ableIds" modalTitle="添加部门" buttonType="button" multiple hasSys class="!mt-10px" @change="onChange" />
      </template>
      <template v-if="futureKey === 'posSelect'">
        <FuturePosSelect v-model:value="activeData.ableIds" modalTitle="添加岗位" buttonType="button" multiple hasSys class="!mt-10px" @change="onChange" />
      </template>
      <template v-if="futureKey === 'roleSelect'">
        <FutureRoleSelect v-model:value="activeData.ableIds" modalTitle="添加角色" buttonType="button" multiple hasSys class="!mt-10px" @change="onChange" />
      </template>
      <template v-if="futureKey === 'groupSelect'">
        <FutureGroupSelect v-model:value="activeData.ableIds" modalTitle="添加分组" buttonType="button" multiple hasSys class="!mt-10px" @change="onChange" />
      </template>
      <template v-if="['usersSelect', 'userSelect'].includes(futureKey)">
        <FutureUsersSelect v-model:value="activeData.ableIds" modalTitle="添加用户" buttonType="button" multiple hasSys class="!mt-10px" @change="onChange" />
      </template>
    </template>
    <template v-if="futureKey === 'userSelect' && ['dep', 'pos', 'role', 'group'].includes(activeData.selectType)">
      <future-radio v-model:value="activeData.relationField" :options="formFieldsOptions" class="relation-radio" />
    </template>
  </a-form-item>
  <a-form-item label="默认值">
    <component
      :is="activeData.__config__.tag"
      v-model:value="activeData.__config__.defaultValue"
      :multiple="activeData.multiple"
      :selectType="activeData.selectType"
      :ableIds="activeData.ableIds"
      :disabled="activeData.__config__.defaultCurrent" />
    <a-checkbox v-model:checked="activeData.__config__.defaultCurrent" class="!mt-8px" :disabled="activeData.selectType !== 'all'" @change="onChange">
      默认为当前登录{{ getLabel(activeData.__config__.futureKey) }}
    </a-checkbox>
  </a-form-item>
  <a-form-item label="能否清空">
    <a-switch v-model:checked="activeData.clearable" />
  </a-form-item>
  <a-form-item label="能否多选">
    <a-switch v-model:checked="activeData.multiple" @change="onChange" />
  </a-form-item>
</template>
<script lang="ts" setup>
  import { computed, unref } from 'vue';

  defineOptions({ inheritAttrs: false });
  const props = defineProps(['activeData', 'drawingList']);

  const selectTypeOptions = [
    { id: 'all', fullName: '全部' },
    { id: 'custom', fullName: '自定义' },
  ];
  const userSelectTypeOptions = [
    ...selectTypeOptions,
    { id: 'dep', fullName: '部门组件联动' },
    { id: 'pos', fullName: '岗位组件联动' },
    { id: 'role', fullName: '角色组件联动' },
    { id: 'group', fullName: '分组组件联动' },
  ];

  const futureKey = computed(() => unref(props.activeData).__config__?.futureKey);
  const formFieldsOptions = computed(() => {
    if (props.activeData.selectType === 'all' || props.activeData.selectType === 'custom') return [];
    let list: any[] = [];
    const loop = (data, parent?) => {
      if (!data) return;
      if (data.__config__ && isIncludesTable(data) && data.__config__.children && Array.isArray(data.__config__.children)) {
        loop(data.__config__.children, data);
      }
      if (Array.isArray(data)) data.forEach(d => loop(d, parent));
      if (data.__vModel__ && data.__config__.futureKey === `${props.activeData.selectType}Select` && data.__vModel__ !== props.activeData.__vModel__) {
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
  function onTypeChange() {
    onChange();
    props.activeData.ableIds = [];
    props.activeData.__config__.defaultCurrent = false;
    if (props.activeData.__config__.futureKey === 'userSelect') props.activeData.relationField = '';
  }
  function onChange() {
    props.activeData.__config__.defaultValue = props.activeData.multiple || unref(futureKey) === 'organizeSelect' ? [] : '';
  }
  function getLabel(key) {
    if (key === 'organizeSelect') return '组织';
    if (key === 'depSelect') return '部门';
    if (key === 'posSelect') return '岗位';
    if (key === 'roleSelect') return '角色';
    if (key === 'groupSelect') return '分组';
    return '用户';
  }
</script>
<style lang="less" scoped>
  .relation-radio {
    margin-top: 10px;
    :deep(.ant-radio-wrapper) {
      display: block;
    }
  }
</style>
