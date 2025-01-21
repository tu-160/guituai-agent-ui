<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="流程归档设置" @ok="handleSubmit" destroyOnClose>
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { reactive } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '@/components/Form';
  import { cloneDeep } from 'lodash-es';
  import { getPrintDevSelector } from '@/api/system/printDev';

  interface State {
    fileConfig: any;
  }

  const state = reactive<State>({
    fileConfig: {},
  });
  const emit = defineEmits(['register', 'confirm']);
  const permissionTypeOptions = [
    { fullName: '当前流程所有人', id: 1 },
    { fullName: '流程发起人', id: 2 },
    { fullName: '最后节点审批人', id: 3 },
  ];
  const schemas: FormSchema[] = [
    {
      field: '',
      label: '',
      component: 'Alert',
      componentProps: { message: '归档后在文档中心查看(APP端及批量审批操作不支持自动归档)', type: 'warning', showIcon: true },
    },
    {
      field: 'permissionType',
      label: '查看权限',
      component: 'Radio',
      componentProps: { options: permissionTypeOptions },
    },
    {
      field: 'templateId',
      label: '归档模板',
      component: 'TreeSelect',
      componentProps: { options: [], lastLevel: true },
      rules: [{ required: true, trigger: 'change', message: '必填' }],
    },
  ];
  const [registerModal, { closeModal }] = useModalInner(init);
  const [registerForm, { setFieldsValue, validate, clearValidate, updateSchema }] = useForm({ labelWidth: 80, schemas: schemas });

  function init(data) {
    state.fileConfig = cloneDeep(data.fileConfig) || {};
    setFieldsValue(state.fileConfig);
    clearValidate();
    getPrintTplList();
  }
  function getPrintTplList() {
    getPrintDevSelector().then(res => {
      const options = (res.data.list || []).filter(o => o.children && o.children.length).map(o => ({ ...o, hasChildren: true }));
      updateSchema({ field: 'templateId', componentProps: { options } });
    });
  }
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    closeModal();
    emit('confirm', values);
  }
</script>
