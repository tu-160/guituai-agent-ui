<template>
  <BasicModal v-bind="$attrs" width="800px" class="future-flow-parameter-modal" @register="registerModal" title="变量设置" @ok="handleSubmit" destroyOnClose>
    <a-alert message="可通过节点属性给全局变量赋值" type="warning" show-icon />
    <a-table :data-source="parameterList" :columns="getParameterColumns" size="small" :pagination="false" class="mt-10px">
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'dataType'">
          <future-select v-model:value="record.dataType" :options="dataTypeOptions" />
        </template>
        <template v-if="column.key === 'fieldName'">
          <a-input v-model:value="record.fieldName" placeholder="请输入" :maxlength="50" />
        </template>
        <template v-if="column.key === 'defaultValue'">
          <future-input-number v-if="['int', 'decimal'].includes(record.dataType)" v-model:value="record.defaultValue" placeholder="请输入" />
          <future-date-picker v-else-if="record.dataType === 'datetime'" v-model:value="record.defaultValue" class="w-full" placeholder="请选择" />
          <future-input v-else v-model:value="record.defaultValue" placeholder="请输入" />
        </template>
        <template v-if="column.key === 'action'">
          <a-button type="link" danger @click="handleDel(index)"><i class="icon-ym icon-ym-app-delete"></i></a-button>
        </template>
      </template>
    </a-table>
    <span class="link-text inline-block mt-10px" @click="handleAdd()"><i class="icon-ym icon-ym-btn-add text-14px mr-4px"></i>新增变量</span>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { buildUUID } from '@/utils/uuid';
  import { useMessage } from '@/hooks/web/useMessage';
  import { cloneDeep } from 'lodash-es';

  const parameterList = ref<any[]>([]);
  const emit = defineEmits(['register', 'confirm']);
  const { createMessage } = useMessage();
  const [registerModal, { closeModal }] = useModalInner(init);
  const columns = [
    { title: '变量类型', dataIndex: 'dataType', key: 'dataType', width: 140 },
    { title: '变量名称', dataIndex: 'fieldName', key: 'fieldName', width: 180 },
    { title: '默认值', dataIndex: 'defaultValue', key: 'defaultValue', width: 180 },
    { title: '操作', dataIndex: 'action', key: 'action', width: 50, align: 'center' },
  ];
  const dataTypeOptions = [
    { fullName: '字符串', id: 'varchar' },
    { fullName: '整型', id: 'int' },
    { fullName: '日期时间', id: 'datetime' },
    { fullName: '浮点', id: 'decimal' },
  ];

  const getParameterColumns = computed(() => columns.map(o => ({ ...o, customCell: () => ({ class: 'align-top' }) })));

  function init(data) {
    parameterList.value = cloneDeep(data.parameterList) || [];
  }
  function handleAdd() {
    parameterList.value.push({ dataType: 'varchar', fieldName: getFieldName(), id: buildUUID() });
  }
  function handleDel(index) {
    parameterList.value.splice(index, 1);
  }
  // 生成参数名称
  function getFieldName() {
    if (!parameterList.value.length) return 'flow_var1';
    let maxNumber = -1;
    const regex = /flow_var(\d+)/;
    parameterList.value.map(o => {
      const match = o.fieldName.match(regex);
      if (match) {
        const number = parseInt(match[1]);
        if (number > maxNumber) maxNumber = number;
      }
    });
    return 'flow_var' + ++maxNumber;
  }
  async function handleSubmit() {
    if (!parameterList.value.length) return createMessage.warning('请填写流程变量');
    for (let i = 0; i < parameterList.value.length; i++) {
      if (!parameterList.value[i].fieldName) return createMessage.warning('变量名称不能为空');
      if (parameterList.value[i].fieldName == parameterList.value[i + 1]?.fieldName) return createMessage.warning('变量名称不能重复');
    }
    emit('confirm', parameterList.value);
    closeModal();
  }
</script>
<style lang="less">
  .future-flow-parameter-modal {
    .ant-modal-body > .scrollbar {
      padding: 20px;
      height: 50vh;
    }
  }
</style>
