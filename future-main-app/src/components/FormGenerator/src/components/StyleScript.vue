<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="表单样式" :width="1000" @ok="handleSubmit" destroyOnClose class="form-script-modal">
    <div class="form-script-modal-body">
      <div class="main-board">
        <div class="main-board-editor">
          <MonacoEditor ref="editorRef" v-model="text" language="css" />
        </div>
        <div class="main-board-tips">
          <p>示例：</p>
          <p>.text {</p>
          <p style="text-indent: 2em">background-color: #fff;</p>
          <p style="text-indent: 2em">font-size: 18px;</p>
          <p>}</p>
        </div>
      </div>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { MonacoEditor } from '@/components/CodeEditor';

  const emit = defineEmits(['register', 'confirm']);
  const [registerModal, { closeModal }] = useModalInner(init);
  const editorRef = ref(null);
  const text = ref('');

  function init(data) {
    text.value = data.text;
  }
  function handleSubmit() {
    emit('confirm', text.value);
    closeModal();
  }
</script>
<style lang="less"></style>
