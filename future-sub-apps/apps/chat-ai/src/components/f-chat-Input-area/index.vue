<script setup lang="ts">
import { onDeactivated, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { Button, Label, Textarea, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@future-core/shadcn-ui';

import { infoCheck } from '@/api';
import { useUserStore } from '@/store/modules/useUserStore';
import { CornerDownLeft, Mic, Paperclip } from 'lucide-vue-next';

const props = defineProps<{
  modelValue?: string;
}>();

const emit = defineEmits<{
  (e: 'send', message?: string): void;
  (e: 'update:modelValue', message: string): void;
}>();

const { t } = useI18n();

function useLogic() {
  // const state = ref({
  //   message: computed({
  //     get() {
  //       return props.modelValue;
  //     },
  //     set(value: string) {
  //       return emit('update:modelValue', value);
  //     },
  //   }),
  // });
  const state = ref({
    message: props.modelValue || '', // 直接使用 ref
  });

  const handleTextareaChange = (e: Event) => {
    e.preventDefault(); // 阻止浏览器默认行为
    const target = e.target as HTMLTextAreaElement;
    target.style.height = 'auto';
    let scrollHeight = target.scrollHeight;
    if (scrollHeight >= 180) {
      scrollHeight = 180;
    }
    target.style.height = `${scrollHeight}px`;
  };

  const sendMsg = async (e: Event) => {
    const userStore = useUserStore();
    await infoCheck({})
      .then(() => {
        userStore.startPolling();
        e.preventDefault(); // 阻止浏览器默认行为
        if (['', '', null, undefined].includes(state.value.message)) return;
        emit('send', state.value.message);
        state.value.message = '';
        // 重置高度
        handleTextareaChange(e);
      })
      .catch(() => {
        userStore.stopPolling();
        userStore.resetState();
        userStore.openLoginModal();
      });
  };

  return {
    state,
    sendMsg,
    handleTextareaChange,
  };
}

onDeactivated(() => {
  console.log('onDeactivated');
});

onUnmounted(() => {
  console.log('onUnmounted');
});
const { state, sendMsg, handleTextareaChange } = useLogic();
</script>

<template>
  <form class="bg-background focus-within:ring-ring relative overflow-hidden rounded-lg border focus-within:ring-1">
    <Label class="sr-only" for="message"> Message </Label>
    <Textarea
      id="message"
      v-model="state.message"
      :placeholder="t('chat_index.enterQuestion')"
      class="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
      @input="handleTextareaChange"
      @keyup.enter.prevent="sendMsg"
    />
    <div class="flex items-center p-3 pt-0">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button size="icon" variant="ghost">
              <Paperclip class="size-4" />
              <span class="sr-only">Attach file</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top"> Attach File </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button size="icon" variant="ghost">
              <Mic class="size-4" />
              <span class="sr-only">Use Microphone</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top"> Use Microphone </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Button :disabled="['', null, undefined].includes(state.message)" class="ml-auto gap-1.5" size="default" type="button" @click="sendMsg">
        {{ t('chat.send') }}
        <CornerDownLeft class="size-3.5" />
      </Button>
    </div>
  </form>
</template>
