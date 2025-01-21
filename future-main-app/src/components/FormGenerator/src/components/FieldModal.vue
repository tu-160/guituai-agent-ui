<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="字段设置" :width="1000" @ok="handleSubmit" class="field-modal">
    <a-table :data-source="fieldList" :columns="columns" size="small" :pagination="false" :scroll="{ y: 'calc(70vh - 93px)' }">
      <template #bodyCell="{ column, record, index }">
        <template v-if="record.disabled">
          <a-checkbox :checked="record[column.key]" v-if="['primaryKey', 'allowNull'].includes(column.key)" />
          <template v-if="column.key === 'dataType'">{{ getDataTypeText(record[column.key]) }}</template>
        </template>
        <template v-else>
          <template v-if="column.key === 'field'">
            <a-input v-model:value="record.field" placeholder="请输入" :maxlength="50" />
          </template>
          <template v-if="column.key === 'dataLength'">
            <a-input-number v-model:value="record.dataLength" placeholder="请输入" :disabled="record.dataType !== 'varchar' && record.dataType !== 'decimal'" />
          </template>
          <template v-if="column.key === 'dataType'">
            <future-select v-model:value="record.dataType" placeholder="请选择" :options="options" />
          </template>
          <template v-if="column.key === 'allowNull'">
            <a-checkbox v-model:checked="record.allowNull" />
          </template>
          <template v-if="column.key === 'fieldName'">
            <a-input v-model:value="record.fieldName" placeholder="请输入" :maxlength="50" />
          </template>
        </template>
        <template v-if="column.key === 'action'">
          <a-button class="action-btn" type="link" color="error" @click="handleDelItem(index)" size="small" v-if="!record.disabled">删除</a-button>
        </template>
      </template>
    </a-table>
    <div class="table-add-action" @click="handleAdd()">
      <a-button type="link" preIcon="icon-ym icon-ym-btn-add">新增一行</a-button>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { getDataModelInfo as getInfo, addTableFields } from '@/api/systemData/dataModel';
  import { ref, unref } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { useMessage } from '@/hooks/web/useMessage';
  import { getDataTypeText } from '@/utils/future';

  const options = [
    { fullName: '字符串', id: 'varchar' },
    { fullName: '整型', id: 'int' },
    { fullName: '日期时间', id: 'datetime' },
    { fullName: '浮点', id: 'decimal' },
    { fullName: '长整型', id: 'bigint' },
    { fullName: '文本', id: 'text' },
  ];

  const emit = defineEmits(['register', 'updateOptions']);
  const [registerModal, { changeLoading, changeOkLoading, closeModal }] = useModalInner(init);
  const { createMessage } = useMessage();
  const linkId = ref('');
  const dataForm = ref({});
  const fieldList = ref<any[]>([]);
  const columns: any[] = [
    { width: 50, title: '序号', align: 'center', customRender: ({ index }) => index + 1 },
    { title: '列名', dataIndex: 'field', key: 'field' },
    { title: '类型', dataIndex: 'dataType', key: 'dataType' },
    { title: '长度', dataIndex: 'dataLength', key: 'dataLength' },
    { title: '允许空', dataIndex: 'allowNull', key: 'allowNull', align: 'center', width: 80 },
    { title: '说明', dataIndex: 'fieldName', key: 'fieldName' },
    { title: '操作', dataIndex: 'action', key: 'action', width: 50 },
  ];

  function init(data) {
    linkId.value = data.linkId;
    changeLoading(true);
    getInfo(data.linkId, data.tableName).then(res => {
      dataForm.value = { ...res.data.tableInfo, newTable: res.data.tableInfo.table };
      let tableFieldList = res.data.tableFieldList.map((o, i) => ({ ...o, index: i, primaryKey: !!o.primaryKey, allowNull: !!o.allowNull, disabled: true }));
      fieldList.value = tableFieldList;
      changeLoading(false);
    });
  }
  function handleDelItem(index) {
    fieldList.value.splice(index, 1);
  }
  function handleAdd(row: undefined | Recordable = undefined) {
    const index = fieldList.value.length;
    let item = {};
    if (!row) {
      item = {
        field: '',
        dataType: 'varchar',
        dataLength: 50,
        allowNull: true,
        primaryKey: false,
        fieldName: '',
        index,
      };
    } else {
      item = {
        field: row.field,
        dataType: row.dataType,
        dataLength: row.dataLength,
        allowNull: !!row.allowNull,
        fieldName: row.fieldName,
        primaryKey: false,
        index,
      };
    }
    fieldList.value.push(item);
  }
  function exist() {
    let isOk = true;
    for (let i = 0; i < fieldList.value.length; i++) {
      const e = fieldList.value[i];
      if (e.disabled) continue;
      if (!e.field) {
        createMessage.error(`第${i + 1}行列名不能为空`);
        isOk = false;
        break;
      }
      let reg = /(^_([a-zA-Z0-9]_?)*$)|(^[a-zA-Z](_?[a-zA-Z0-9])*_?$)/;
      if (!reg.test(e.field)) {
        createMessage.error(`第${i + 1}行列名格式错误，请重新输入`);
        isOk = false;
        break;
      }
      let num = fieldList.value.filter(o => o.field == e.field);
      if (num.length > 1) {
        createMessage.error(`第${i + 1}行列名'${e.field}'已重复`);
        isOk = false;
        break;
      }
      if (!e.fieldName) {
        createMessage.error(`第${i + 1}行说明不能为空`);
        isOk = false;
        break;
      }
    }
    return isOk;
  }

  async function handleSubmit() {
    const tableFieldList = fieldList.value.filter(o => !o.disabled);
    if (!tableFieldList.length) return createMessage.error('请至少新增一个字段');
    if (!exist()) return;
    changeOkLoading(true);
    const query = {
      tableFieldList: tableFieldList.map(o => ({ ...o, primaryKey: o.primaryKey ? 1 : 0, allowNull: o.allowNull ? 1 : 0 })),
      tableInfo: dataForm.value,
    };
    addTableFields(unref(linkId), query)
      .then(res => {
        createMessage.success(res.msg);
        changeOkLoading(false);
        closeModal();
        emit('updateOptions', fieldList.value);
      })
      .catch(() => {
        changeOkLoading(false);
      });
  }
</script>
<style lang="less">
  .field-modal {
    .ant-modal-body {
      height: 70vh;
      & > .scrollbar {
        padding: 0;
        .scrollbar__view {
          .table-add-action {
            margin-bottom: 10px;
          }
        }
      }
    }
  }
</style>
