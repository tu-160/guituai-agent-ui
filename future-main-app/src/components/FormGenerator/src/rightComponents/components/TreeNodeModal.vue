<template>
  <a-modal v-model:open="visible" :title="title" centered :maskClosable="false" :keyboard="false" :width="600" @ok="handleSubmit" class="tree-node-modal">
    <template #closeIcon>
      <ModalClose :canFullscreen="false" @cancel="handleCancel" />
    </template>
    <a-form ref="formRef" :model="formState" name="tree-node" :rules="rules" autocomplete="off" :label-col="{ style: { width: '60px' } }" :colon="false">
      <a-form-item label="选项名" name="fullName">
        <a-input v-model:value="formState.fullName" placeholder="请输入" />
      </a-form-item>
      <a-form-item label="选项值" name="id">
        <a-input v-model:value="formState.id" placeholder="请输入" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script lang="ts" setup>
  import { Modal as AModal } from 'ant-design-vue';
  import ModalClose from '@/components/Modal/src/components/ModalClose.vue';
  import { ref, reactive } from 'vue';
  import type { FormInstance } from 'ant-design-vue';

  const emit = defineEmits(['confirm']);
  defineExpose({ openModal });
  const visible = ref(false);
  const isEdit = ref(false);
  const title = ref('添加选项');
  const formState = reactive({
    fullName: '',
    id: '',
  });
  const rules = {
    fullName: [{ required: true, message: '必填' }],
    id: [{ required: true, message: '必填' }],
  };
  const formRef = ref<FormInstance>();

  function openModal(data) {
    visible.value = true;
    isEdit.value = !!data;
    title.value = data ? '编辑选项' : '添加选项';
    formRef.value?.resetFields();
    formState.id = '';
    formState.fullName = '';
    if (!data) return;
    formState.id = data.id || '';
    formState.fullName = data.fullName || '';
  }
  function handleCancel() {
    visible.value = false;
  }
  async function handleSubmit() {
    try {
      const values = await formRef.value?.validate();
      visible.value = false;
      emit('confirm', values, isEdit.value);
    } catch (_) {}
  }
</script>
<style lang="less">
  .tree-node-modal {
    .ant-modal-body {
      padding: 20px 50px 0 !important;
    }
  }
</style>
