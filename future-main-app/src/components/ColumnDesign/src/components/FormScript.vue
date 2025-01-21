<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="title"
    helpMessage="小程序不支持在线JS脚本"
    :width="1000"
    @ok="handleSubmit"
    destroyOnClose
    class="form-script-modal">
    <div class="form-script-modal-body">
      <div class="main-board">
        <div class="main-board-editor">
          <MonacoEditor ref="editorRef" v-model="text" />
        </div>
        <div class="main-board-tips">
          <p>支持JavaScript的脚本，<ScriptDemo :type="funcName" /></p>
        </div>
      </div>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { MonacoEditor } from '@/components/CodeEditor';
  import ScriptDemo from '@/components/FormGenerator/src/components/ScriptDemo.vue';

  const emit = defineEmits(['register', 'confirm']);
  const [registerModal, { closeModal }] = useModalInner(init);
  const editorRef = ref(null);
  const text = ref('');
  const funcName = ref('');
  const title = ref('');
  function init(data) {
    text.value = data.text;
    funcName.value = data.funcName;
    title.value = getFuncText(data.funcName);
  }
  function getFuncText(key) {
    let text = '';
    switch (key) {
      case 'afterOnload':
        text = '表格事件';
        break;
      case 'rowStyle':
        text = '表格行样式';
        break;
      case 'cellStyle':
        text = '单元格样式';
        break;
      case 'btnEnableRule':
        text = '启用规则配置';
        break;
      default:
        text = '';
        break;
    }
    return text;
  }
  function handleSubmit() {
    emit('confirm', text.value, funcName.value);
    closeModal();
  }
</script>
