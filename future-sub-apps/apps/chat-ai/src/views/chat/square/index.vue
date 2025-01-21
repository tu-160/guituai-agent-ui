<script setup lang="ts">
import { createVNode, ref } from 'vue';
import { type LocationQueryRaw, type RouteParamsGeneric, useRouter } from 'vue-router';

import { Icon } from '@future-core/icons';
import { Avatar, ScrollArea } from '@future-core/shadcn-ui';

import { D0003, D0004 } from '@/api';
import { type IDialog, useDialogAsideStore } from '@/store/modules/useDialogAsideStore';
import { useUserStore } from '@/store/modules/useUserStore';
import { message, Modal } from 'ant-design-vue';
import { Plus } from 'lucide-vue-next';
import { i18n } from "@/locales/i18n";
const t = i18n.global.t;

defineProps<{
  modelValue?: boolean;
}>();

const dialogAsideStore = useDialogAsideStore();

function useBaseLogic() {
  const state = ref({
    privateList: [] as any[],
    publicList: [] as any[],
  });

  const delDialog = async (dialog: IDialog) => {
    Modal.confirm({
      title: t('message.hint'),
      content: createVNode('div', {}, t('chat_index.deleteAgentMessageTip', {'name': dialog.name})),
      okText: t('common.ok'),
      cancelText: t('common.cancel'),
      async onOk() {
        // 调用接口删除智能体
        await D0003({ dialog_id: dialog.id });
        state.value.privateList = state.value.privateList.filter((item) => item.id !== dialog.id);
        // 移除最近使用智能体列表中的智能体, 如果正在使用中, 要将当前智能体置为空, 历史会话消息置为空,对话详情置为空
        dialogAsideStore.removeRecentDialog(dialog, false);
        message.success(t('message.deleted'));
      },
    });
  };

  const init = async () => {
    const userStore = useUserStore();
    const storedTime: null | string = localStorage.getItem('TIMESTAMP') || null;
    const res = await D0004({});
    state.value.privateList = res.data.private_data;
    state.value.publicList = res.data.public_data;
  };

  init();
  return {
    state,
    delDialog,
  };
}

const { state, delDialog } = useBaseLogic();

/**
 * 页面跳转处理
 */
function useToPage() {
  const router = useRouter();

  // 当前窗口跳转
  const toPage = (name?: string, params?: RouteParamsGeneric, query?: LocationQueryRaw) => {
    if (!name) return;
    router.push({ name, params: params || {}, query: query || {} });
  };

  // 打开窗口
  const openPage = (name: string, params?: RouteParamsGeneric, query?: LocationQueryRaw) => {
    console.log('query', query);
    const href = router.resolve({ name, params: params || {}, query: query || {} });
    window.open(href.href, '_blank');
  };

  // 智能体对话跳转
  const toDialogPage = (dialog: IDialog) => {
    dialog.url = 'Chat';
    dialogAsideStore.setCurrentDialog(dialog);
    toPage(dialog.url, { id: dialog.id });
  };

  return {
    toPage,
    toDialogPage,
    openPage,
  };
}

const { toDialogPage, openPage } = useToPage();
</script>

<template>
  <ScrollArea class="2xl:px-40">
    <div class="square-container">
      <div class="square-title mt-4">{{ t('chat_index.myagent') }}</div>
      <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3 2xl:grid-cols-4">
        <div class="square-card group !border-2 border-dashed hover:border-blue-500" @click="openPage('Createbot')">
          <Avatar class="h-14 w-14 text-xs">
            <Plus :size="36" class="group-hover:text-blue-500" />
          </Avatar>
          <span class="pl-2 group-hover:text-blue-500">{{ t('chat_index.createAgent') }}</span>
        </div>

        <div v-for="item in state.privateList" :key="item.id" class="square-card group" @click="toDialogPage(item)">
          <Avatar class="h-14 w-14 text-xs">
            <!-- <Codesandbox :size="36" /> -->
            <a-avatar :size="48" :src="item.icon" />
          </Avatar>
          <span class="pl-2">{{ item.name }}</span>

          <div class="absolute right-2 top-1/2 -mt-4 flex h-8 w-14 items-center gap-2">
            <Icon
              class="hidden size-8 rounded-sm p-1 hover:bg-slate-100 group-hover:block"
              icon="lucide:edit-3"
              @click.stop="() => openPage('Createbot', { dialog_id: item.id }, { dialog_id: item.id })"
            />
            <Icon class="hidden size-8 rounded-sm p-1 hover:bg-slate-100 group-hover:block" icon="lucide:trash-2" @click.stop="delDialog(item)" />
          </div>
        </div>
      </div>
      <div class="square-title mt-4">{{ t('chat_index.more') }}</div>
      <div v-if="false" class="category mt-4 flex flex-row flex-wrap gap-2">
        <div v-for="i in 12" :key="i" class="category-item">{{ t('chat_index.recently') }}</div>
      </div>
      <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3 2xl:grid-cols-4">
        <div v-for="item in state.publicList" :key="item.id" class="agent-cart group" @click="toDialogPage(item)">
          <Avatar class="h-14 w-14 text-xs">
            <!-- <Codesandbox :size="36" /> -->
            <a-avatar :size="48" :src="item.icon" />
          </Avatar>
          <div class="flex flex-col">
            <span class="mb-2 pl-2 text-base">{{ item.name }}</span>
            <span class="mb-2 line-clamp-2 pl-2 text-xs text-gray-500/80">
              {{ item.description }}
            </span>
          </div>
        </div>
      </div>
      <div class="h-8"></div>
    </div>
  </ScrollArea>
</template>

<style lang="scss">
.square-container {
  @apply p-2;
}

.square-title {
  @apply mt-2 text-lg font-bold text-gray-700;
}

.square-card {
  @apply flex h-20 w-full max-w-96 cursor-pointer items-center gap-2 rounded-lg border bg-white p-4 hover:shadow-md;
  @apply relative;
}

.category-item {
  @apply flex h-10 w-auto cursor-pointer items-center justify-center rounded-lg bg-gray-50 p-4 text-gray-700 shadow-sm;
  @apply hover:bg-sky-100 active:bg-sky-500;
}

.agent-cart {
  @apply flex h-32 w-full max-w-96 cursor-pointer items-start gap-2 rounded-lg border bg-white p-4 hover:shadow-md;
}
</style>
