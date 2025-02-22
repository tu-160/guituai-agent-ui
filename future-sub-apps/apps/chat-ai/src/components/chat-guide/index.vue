<script setup lang="ts">
import { reactive, watchEffect } from 'vue';

// import { Icon } from '@future-core/icons';
import { Avatar, Skeleton } from '@future-core/shadcn-ui';

import { C0013 } from '@/api';
import { getTimeState } from '@/utils/index';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const props = defineProps<{
  desc?: string;
  dialogId?: string;
  dialogList?: any[];
  icon?: string;
  loading?: boolean;
  modelValue?: boolean;
  questions?: any[];
  recommend?: any[];
}>();
const emit = defineEmits(['selectQuestion', 'selectDialog', 'add']);
const modelRef = reactive({
  questions: [],
});
watchEffect(async () => {
  await C0013({ dialog_id: props.dialogId }).then((res) => {
    debugger
    modelRef.questions = res.data.filter((item: string) => item.trim() !== '');
  });
});
</script>

<template>
  <div className="block h-full w-full">
    <template v-if="loading">
      <div class="flex items-center justify-center gap-4 p-2 text-3xl font-bold">
        <Skeleton class="h-12 w-[300px]" />
      </div>
      <div class="tips">
        <Skeleton class="mx-auto h-8 w-[500px]" />
      </div>
      <div class="tips">
        <Skeleton class="mx-auto h-8 w-[500px]" />
      </div>
    </template>

    <template v-else>
      <div class="flex items-center justify-center gap-4 p-2 text-3xl font-bold">
        {{ getTimeState() }}
      </div>
      <div class="tips">
        {{ desc }}
      </div>
      <div class="tips">{{t('chat_index.createAgentDesc1')}} <span class="cursor-pointer" @click="emit('add')"> + </span> {{t('chat_index.createAgent')}}</div>
      <div v-if="recommend" class="guide-title mt-4">{{t('chat_index.recommendation')}}</div>
      <div v-if="recommend" class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div v-for="(item, i) in recommend" :key="i" class="agent-cart group justify-self-center hover:drop-shadow-xl" @click="emit('selectDialog', item)">
          <Avatar class="h-14 w-14 text-xs">
            <!-- <Icon :icon="item.icon" class="size-8" /> -->
            <a-avatar :size="48" :src="item.icon" />
          </Avatar>
          <div class="flex flex-col">
            <span class="mb-2 pl-2 text-left text-base">{{ item.name }}</span>
            <span class="mb-2 line-clamp-2 pl-2 text-left text-xs text-gray-500/80">
              {{ item.description }}
            </span>
          </div>
        </div>
      </div>
      <div v-if="modelRef.questions.length > 0" class="guide-title mt-4">{{t('chat_index.tryEntering')}}</div>
      <div v-if="modelRef.questions.length > 0" class="mt-4 flex flex-row flex-wrap justify-center gap-2">
        <template v-for="(item, i) in modelRef.questions" :key="i">
          <div class="query-item" @click="emit('selectQuestion', item)">{{ item }}</div>
        </template>
      </div>
    </template>
  </div>
</template>

<style lang="scss">
.tips {
  @apply whitespace-pre-wrap p-1 text-base tracking-wide text-gray-500;
}

.guide-title {
  @apply mr-auto flex text-base;
}

.agent-cart {
  @apply flex h-28 w-full max-w-96 cursor-pointer items-start gap-2 rounded-lg border bg-white p-4 hover:shadow-md;
}

.query-item {
  @apply max-w-[364px] cursor-pointer truncate rounded border border-solid p-4 text-left text-gray-500/80 hover:shadow-md;
}
</style>
