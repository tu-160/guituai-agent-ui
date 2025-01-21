<template>
  <BasicModal v-bind="$attrs" width="800px" @register="registerModal" title="文本内容" @ok="handleSubmit" destroyOnClose>
    <div class="mb-20px">
      <FutureEditor v-model:value="value" height="500px" />
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, nextTick } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';

  const emit = defineEmits(['register', 'change']);
  const [registerModal, { closeModal }] = useModalInner(init);
  const value = ref();

  function init(data) {
    value.value = data.value;
  }
  function handleSubmit() {
    emit('change', value.value);
    nextTick(() => closeModal());
  }
</script>
