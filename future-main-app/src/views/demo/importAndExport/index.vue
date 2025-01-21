<template>
  <div class="future-content-wrapper">
    <div class="future-content-wrapper-center">
      <div class="future-content-wrapper-content">
        <BasicTable @register="registerTable">
          <template #tableTitle>
            <a-button type="primary" @click="handleExport"><i class="icon-ym icon-ym-btn-download button-preIcon"></i>{{ t('common.exportText') }}</a-button>
            <a-button type="link" @click="handleImport"><i class="icon-ym icon-ym-btn-upload button-preIcon"></i>{{ t('common.importText') }}</a-button>
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
              <TableAction :actions="getTableActions(record)" />
            </template>
          </template>
        </BasicTable>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { BasicTable, useTable, TableAction, BasicColumn, FormProps, ActionItem } from '@/components/Table';
import { useMessage } from '@/hooks/web/useMessage';
import { useI18n } from '@/hooks/web/useI18n';
import { useModal } from '@/components/Modal';
import { useOrganizeStore } from '@/store/modules/organize';

defineOptions({ name: 'extend-importAndExport' });

const { createMessage } = useMessage();
const { t } = useI18n();
const organizeStore = useOrganizeStore();
const [registerExportModal, { openModal: openExportModal }] = useModal();
const [registerImportModal, { openModal: openImportModal }] = useModal();

const columns: BasicColumn[] = [
  { title: '工号', dataIndex: 'enCode', width: 100, fixed: 'left' },
  { title: '姓名', dataIndex: 'fullName', width: 100, fixed: 'left' },
  { title: '性别', dataIndex: 'gender', width: 80, fixed: 'left' },
  { title: '部门', dataIndex: 'departmentName', width: 120 },
  { title: '岗位', dataIndex: 'positionName', width: 120 },
  { title: '用工性质', dataIndex: 'workingNature', width: 100 },
  { title: '身份证号', dataIndex: 'idNumber', width: 160 },
  { title: '联系电话', dataIndex: 'telephone', width: 100 },
  { title: '出生年月', dataIndex: 'birthday', width: 120, format: 'date|YYYY-MM-DD' },
  { title: '参加工作', dataIndex: 'attendWorkTime', width: 120, format: 'date|YYYY-MM-DD' },
  { title: '最高学历', dataIndex: 'education', width: 100 },
  { title: '所学专业', dataIndex: 'major', width: 120 },
  { title: '毕业院校', dataIndex: 'graduationAcademy', width: 150 },
  { title: '毕业时间', dataIndex: 'graduationTime', width: 120, format: 'date|YYYY-MM-DD' },
  { title: '创建时间', dataIndex: 'creatorTime', width: 150, format: 'date|YYYY-MM-DD HH:mm:ss' },
];
const [registerTable, { reload, getFetchParams }] = useTable({
  api: () => ([]),
  columns,
  useSearchForm: true,
  formConfig: getFormConfig(),
  actionColumn: {
    width: 50,
    title: '操作',
    dataIndex: 'action',
  },
  afterFetch: data => {
    const list = data.map(o => {
      o.birthday = o.birthday || null;
      o.attendWorkTime = o.attendWorkTime || null;
      o.graduationTime = o.graduationTime || null;
      return o;
    });
    return list;
  },
});

function getFormConfig(): Partial<FormProps> {
  return {
    schemas: [
      {
        field: 'condition',
        label: '查询字段',
        component: 'Select',
        defaultValue: 'EnCode',
        componentProps: {
          options: [
            { id: 'EnCode', fullName: '工号' },
            { id: 'FullName', fullName: '姓名' },
            { id: 'Telephone', fullName: '电话' },
            { id: 'DepartmentName', fullName: '部门' },
            { id: 'PositionName', fullName: '岗位' },
          ],
        },
      },
      {
        field: 'keyword',
        label: t('common.keyword'),
        component: 'Input',
        componentProps: {
          placeholder: t('common.enterKeyword'),
          submitOnPressEnter: true,
        },
      },
    ],
  };
}
function getTableActions(record): ActionItem[] {
  return [
    {
      label: t('common.delText'),
      color: 'error',
      modelConfirm: {
        onOk: handleDelete.bind(null, record.id),
      },
    },
  ];
}
function handleDelete(id) {
  reload();
}
function handleExport() {
  const listQuery = {
    ...getFetchParams(),
    condition: getFetchParams().condition || '',
    keyword: getFetchParams().keyword || '',
  };
  openExportModal(true, { listQuery });
}
function handleImport() {
  openImportModal(true, {});
}
</script>
