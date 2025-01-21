<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="数据设置" @ok="handleSubmit" destroyOnClose class="json-modal">
    <CodeEditor ref="editorRef" v-model:value="value" :mode="modeValue" class="json-editor" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { CodeEditor, MODE } from '@/components/CodeEditor';

  const emit = defineEmits(['register', 'change']);
  const [registerModal, { closeModal }] = useModalInner(init);
  const editorRef = ref(null);
  const value = ref();
  const modeValue = ref<MODE>(MODE.JSON);

  function init(data) {
    value.value = data.value;
  }
  function handleSubmit() {
    emit('change', value.value);
    setTimeout(() => {
      closeModal();
    }, 200);
  }
</script>
