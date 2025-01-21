<template>
  <div>
    <slot name="insertFooter"></slot>
    <a-button
      :type="continueType"
      @click="handleContinue"
      :loading="continueLoading"
      :disabled="confirmLoading"
      v-bind="continueButtonProps"
      v-if="showContinueBtn">
      {{ continueText }}
    </a-button>
    <a-button v-bind="cancelButtonProps" @click="handleCancel" v-if="showCancelBtn">
      {{ cancelText }}
    </a-button>
    <slot name="centerFooter"></slot>
    <a-button
      :type="okType"
      @click="handleOk"
      :loading="confirmLoading"
      v-bind="okButtonProps"
      :disabled="okButtonProps?.disabled || continueLoading"
      v-if="showOkBtn">
      {{ okText }}
    </a-button>
    <slot name="appendFooter"></slot>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';

  import { basicProps } from '../props';
  export default defineComponent({
    name: 'BasicModalFooter',
    props: basicProps,
    emits: ['ok', 'continue', 'cancel'],
    setup(_, { emit }) {
      function handleOk(e: Event) {
        emit('ok', e);
      }
      function handleContinue(e: Event) {
        emit('continue', e);
      }
      function handleCancel(e: Event) {
        emit('cancel', e);
      }

      return { handleOk, handleContinue, handleCancel };
    },
  });
</script>
