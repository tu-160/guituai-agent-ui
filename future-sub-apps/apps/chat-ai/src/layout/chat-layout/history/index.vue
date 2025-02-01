<!-- 会话历史 -->
<script setup lang="ts">
import { ref } from 'vue';
import { i18n } from "@/locales/i18n";
const t = i18n.global.t;

import { Skeleton } from '@future-core/shadcn-ui';

import { Trash2, X } from 'lucide-vue-next';

interface IHistorySession {
  id: string;
  name: string;
  create_date: number;
  active?: boolean;
}

defineProps<{
  historySessionList?: IHistorySession[];
  loading?: boolean;
  modelValue?: boolean;
}>();
const emit = defineEmits(['close', 'toSession', 'del']);

function useBaseLogic() {
  const state = ref({
    activeId: '',
  });

  return {
    state,
  };
}

const { state } = useBaseLogic();
</script>

<template>
  <div class="flex w-[190px] flex-col">
    <header
      class="flex h-[--chat-nav-height] w-full shrink-0 items-center gap-2 border-b border-solid transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
    >
      <div class="flex w-full items-center gap-2 px-4"><span class="mr-auto">{{t('chat_index.historical')}}</span> <X @click="emit('close', 1)" /></div>
    </header>

    <div class="flex flex-1 flex-col gap-4">
      <div v-if="!loading" class="flex flex-col">
        <a
          v-for="(item, i) in historySessionList"
          :key="i"
          :data-state="state.activeId === item.id ? 'open' : 'closed'"
          class="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent group relative flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0"
          href="#"
          @click.stop="
            () => {
              state.activeId = item.id;
              emit('toSession', item);
            }
          "
        >
          <div class="w-full items-center gap-2 overflow-x-hidden text-ellipsis">
            <span>{{ item.name }}</span>
          </div>
          <span class="line-clamp-2 w-[260px] whitespace-break-spaces text-xs">{{
            new Date(item.create_date).toISOString().replace('T', ' ').slice(0, 19)
          }}</span>
          <div class="absolute right-0 top-[7%] block h-5/6 w-4" @click.stop="emit('del', item)">
            <Trash2 class="hidden h-full w-full group-hover:block" />
          </div>
        </a>
      </div>
      <div v-if="loading" class="flex flex-col gap-2 px-2 pt-2">
        <a
          v-for="i in 5"
          :key="i"
          class="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0"
          href="#"
        >
          <div class="w-full items-center gap-2 overflow-x-hidden text-ellipsis">
            <Skeleton class="h-6 w-1/2" />
          </div>
          <span class="line-clamp-2 w-full whitespace-break-spaces text-xs">
            <Skeleton class="h-4 w-full" />
          </span>
        </a>
      </div>
    </div>
  </div>
</template>
